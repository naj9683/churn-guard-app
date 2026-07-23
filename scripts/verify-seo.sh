#!/usr/bin/env bash
# Run after every deployment to confirm no noindex regressions.
# Usage: bash scripts/verify-seo.sh [base_url]
# Default base_url: https://churnguardapp.com

BASE="${1:-https://churnguardapp.com}"

PAGES=(
  "/"
  "/pricing"
  "/audit"
  "/blog"
  "/blog/best-churn-prediction-software-saas-2026"
  "/about"
  "/privacy"
  "/terms"
)

PASS=0
FAIL=0

check_page() {
  local path="$1"
  local url="${BASE}${path}"

  # Fetch body and headers in one round-trip
  local body
  body=$(curl -sL --ssl-no-revoke --max-time 20 "$url" 2>/dev/null)

  local headers
  headers=$(curl -sI --ssl-no-revoke --max-time 20 "$url" 2>/dev/null)

  local ok=true
  local issues=()

  # 1. Check for noindex in meta tag
  if echo "$body" | grep -qi 'name="robots".*noindex'; then
    ok=false
    issues+=("FAIL: <meta name=robots> contains 'noindex'")
  fi

  # 2. Check for noindex in X-Robots-Tag header
  if echo "$headers" | grep -qi "x-robots-tag:.*noindex"; then
    ok=false
    local header_val
    header_val=$(echo "$headers" | grep -i "x-robots-tag" | tr -d '\r')
    issues+=("FAIL: X-Robots-Tag header: $header_val")
  fi

  # 3. Confirm index,follow is present
  local robots_meta
  robots_meta=$(echo "$body" | grep -oi 'name="robots" content="[^"]*"' | head -1)

  if $ok; then
    printf "  \033[32mPASS\033[0m  %-55s  %s\n" "$path" "${robots_meta:-no robots meta (inherits allow)}"
    PASS=$((PASS + 1))
  else
    printf "  \033[31mFAIL\033[0m  %s\n" "$path"
    for issue in "${issues[@]}"; do
      printf "        %s\n" "$issue"
    done
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "SEO noindex verification — $BASE"
echo "──────────────────────────────────────────────────────────────"

for page in "${PAGES[@]}"; do
  check_page "$page"
done

echo "──────────────────────────────────────────────────────────────"
if [ "$FAIL" -eq 0 ]; then
  printf "\033[32mAll %d pages clean — no noindex detected.\033[0m\n\n" "$PASS"
  exit 0
else
  printf "\033[31m%d page(s) failed — noindex detected! Fix before Google recrawls.\033[0m\n\n" "$FAIL"
  exit 1
fi
