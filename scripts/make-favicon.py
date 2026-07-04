"""
Extract the blue mark from logo-purple.png, make it square, save as app/icon.png
(Next.js App Router uses app/icon.png as favicon automatically)
"""
from PIL import Image
import numpy as np

SRC = r"C:\Users\najwa\churn-guard\churn-guard-app\public\logo-purple.png"
DST = r"C:\Users\najwa\churn-guard\churn-guard-app\app\icon.png"

img = Image.open(SRC).convert("RGBA")
data = np.array(img)

# Find columns that contain blue pixels
R, G, B, A = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
# Strict blue: high B, low R (distinguishes pure blue from #8B5CF6 purple which has R=139)
is_blue = (B > 150) & (R < 100) & (A > 50)

if is_blue.sum() > 0:
    cols = np.where(is_blue.any(axis=0))[0]
    rows = np.where(is_blue.any(axis=1))[0]
    x_min, x_max = int(cols.min()), int(cols.max())
    y_min, y_max = int(rows.min()), int(rows.max())
    print(f"Blue mark region: x={x_min}-{x_max}, y={y_min}-{y_max}")

    # Crop with 15% padding
    pad = int(max(x_max - x_min, y_max - y_min) * 0.15)
    crop = img.crop((
        max(0, x_min - pad),
        max(0, y_min - pad),
        min(img.width, x_max + pad),
        min(img.height, y_max + pad)
    ))

    # Make square by padding shorter dimension
    w, h = crop.size
    side = max(w, h)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(crop, ((side - w) // 2, (side - h) // 2))

    # Save at multiple sizes embedded in one PNG
    square_512 = square.resize((512, 512), Image.LANCZOS)
    square_512.save(DST, "PNG")
    print(f"Saved favicon icon: {DST} ({square_512.size})")
else:
    print("No blue pixels found!")
