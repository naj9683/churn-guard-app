"""
Convert churnguard logo1.png:
- Remove light gray background (→ transparent)
- Recolor black text pixels → #8B5CF6 (purple)
- Keep blue icon pixels unchanged
- Crop tight bounding box with 8% padding
- Output: public/logo-purple.png
"""
from PIL import Image
import numpy as np

SRC = r"C:\Users\najwa\OneDrive\Desktop\ChurnGuard Project\churnguard logo1.png"
DST = r"C:\Users\najwa\churn-guard\churn-guard-app\public\logo-purple.png"

PURPLE = (139, 92, 246)   # #8B5CF6

img = Image.open(SRC).convert("RGBA")
data = np.array(img, dtype=np.int32)

R, G, B, A = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# Sample background from top-left corner
bg_r, bg_g, bg_b = int(R[0,0]), int(G[0,0]), int(B[0,0])
print(f"Background: ({bg_r}, {bg_g}, {bg_b})")

# Detect background
is_bg = (
    (np.abs(R - bg_r) < 18) &
    (np.abs(G - bg_g) < 18) &
    (np.abs(B - bg_b) < 18)
)

# Detect blue icon (B much higher than R and G)
is_blue = (
    (B.astype(int) - R.astype(int) > 80) &
    (B.astype(int) - G.astype(int) > 80) &
    (B > 100)
)

# Detect dark text (dark but not blue)
is_dark = (R < 140) & (G < 140) & (B < 140) & (~is_blue)

out = data.copy().astype(np.uint8)

# Transparent background
out[is_bg, 3] = 0

# Recolor dark text → purple, fully opaque
out[is_dark, 0] = PURPLE[0]
out[is_dark, 1] = PURPLE[1]
out[is_dark, 2] = PURPLE[2]
out[is_dark, 3] = 255

# Blue pixels fully opaque, color unchanged
out[is_blue, 3] = 255

# Handle anti-aliasing pixels (between bg and text, or between bg and blue)
# These have mid-gray values mixed with background
is_antialias_text = (~is_bg) & (~is_blue) & (~is_dark) & (R < 220) & (G < 220) & (B < 220)
# Determine if they're closer to blue or text by checking B dominance
is_aa_blue = is_antialias_text & ((B.astype(int) - R.astype(int)) > 20)
is_aa_text = is_antialias_text & ~is_aa_blue

# Anti-alias text pixels: purple with proportional alpha
if is_aa_text.sum() > 0:
    darkness = 1.0 - (R[is_aa_text].astype(float) / float(bg_r))
    darkness = np.clip(darkness, 0, 1)
    out[is_aa_text, 0] = PURPLE[0]
    out[is_aa_text, 1] = PURPLE[1]
    out[is_aa_text, 2] = PURPLE[2]
    out[is_aa_text, 3] = np.clip((darkness * 255).astype(np.uint8), 0, 255)

# Anti-alias blue pixels: keep original color with proportional alpha
if is_aa_blue.sum() > 0:
    saturation = (B[is_aa_blue].astype(float) - R[is_aa_blue].astype(float)) / 255.0
    out[is_aa_blue, 3] = np.clip((saturation * 255 * 2).astype(np.uint8), 0, 255)

result_full = Image.fromarray(out, "RGBA")

# Crop to tight bounding box with padding
bbox = result_full.getbbox()
if bbox:
    w, h = result_full.size
    pad_x = int((bbox[2] - bbox[0]) * 0.08)
    pad_y = int((bbox[3] - bbox[1]) * 0.08)
    crop = (
        max(0, bbox[0] - pad_x),
        max(0, bbox[1] - pad_y),
        min(w, bbox[2] + pad_x),
        min(h, bbox[3] + pad_y),
    )
    result = result_full.crop(crop)
    print(f"Cropped from {result_full.size} to {result.size} (bbox: {bbox})")
else:
    result = result_full
    print("No bounding box found — keeping full size")

result.save(DST, "PNG")
print(f"Saved: {DST}")
