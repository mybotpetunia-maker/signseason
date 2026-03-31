#!/bin/bash
cd /Users/petunia1/.openclaw/workspace/signseason

# Sign-to-illustration mapping
declare -A SIGN_IMG
SIGN_IMG[aries]="aries-ram.png"
SIGN_IMG[taurus]="taurus.png"
SIGN_IMG[gemini]="gemini.png"
SIGN_IMG[cancer]="cancer.png"
SIGN_IMG[leo]="leo.png"
SIGN_IMG[virgo]="virgo.png"
SIGN_IMG[libra]="libra.png"
SIGN_IMG[scorpio]="scorpio.png"
SIGN_IMG[sagittarius]="sagittarius.png"
SIGN_IMG[capricorn]="capricorn.png"
SIGN_IMG[aquarius]="aquarius.png"
SIGN_IMG[pisces]="pisces.png"

SIGNS=(aries taurus gemini cancer leo virgo libra scorpio sagittarius capricorn aquarius pisces)

# Capitalize first letter
cap() {
  echo "$(echo "${1:0:1}" | tr '[:lower:]' '[:upper:]')${1:1}"
}

# Add illustration to sign-hero pages (signs/ directory)
add_sign_illustration() {
  local file="$1"
  local sign="$2"
  local img="${SIGN_IMG[$sign]}"
  local cap_sign=$(cap "$sign")
  
  # Skip if already has sign-illustration
  if grep -q 'sign-illustration' "$file"; then
    return
  fi
  
  # Check for sign-hero header pattern and add img before h1
  if grep -q '<header class="sign-hero">' "$file"; then
    sed -i '' 's|<header class="sign-hero">|<header class="sign-hero">\n    <img src="/assets/illustrations/signs/'"$img"'" alt="'"$cap_sign"' engraving" class="sign-illustration" style="width:180px;height:180px;object-fit:contain;margin:0 auto 24px;display:block;opacity:0.85;">|' "$file"
    echo "  Added illustration to $file"
  fi
}

# Add illustration to crystal-hero pages
add_crystal_illustration() {
  local file="$1"
  local sign="$2"
  local img="${SIGN_IMG[$sign]}"
  local cap_sign=$(cap "$sign")
  
  if grep -q 'sign-illustration' "$file"; then
    return
  fi
  
  if grep -q '<header class="crystal-hero">' "$file"; then
    sed -i '' 's|<header class="crystal-hero">|<header class="crystal-hero">\n    <img src="/assets/illustrations/signs/'"$img"'" alt="'"$cap_sign"' engraving" class="sign-illustration" style="width:180px;height:180px;object-fit:contain;margin:0 auto 24px;display:block;opacity:0.85;">|' "$file"
    echo "  Added illustration to $file"
  fi
}

# Add callout CSS if not present
add_callout_css() {
  local file="$1"
  if grep -q '\.callout' "$file"; then
    return
  fi
  # Add callout CSS before </style>
  sed -i '' 's|</style>|.callout { border-left: 3px solid var(--gold-dim); padding: 20px 24px; margin: 32px 0; background: rgba(42, 31, 51, 0.5); border-radius: 0 4px 4px 0; font-style: italic; color: var(--gold-pale); font-size: 1.1rem; line-height: 1.6; }\n</style>|' "$file"
}

# Add a callout around a good paragraph (find first <p> in second section)
add_callouts() {
  local file="$1"
  if grep -q 'class="callout"' "$file"; then
    return
  fi
  # We'll use Python for smarter callout insertion
}

echo "=== Adding illustrations to sign pages ==="

for sign in "${SIGNS[@]}"; do
  echo "Processing $sign..."
  
  # Page types with {sign}-{type}.html pattern
  for suffix in man woman career toxic-traits in-love moon rising when-angry as-a-friend parent 2026-horoscope; do
    file="signs/${sign}-${suffix}.html"
    if [ -f "$file" ]; then
      add_sign_illustration "$file" "$sign"
      add_callout_css "$file"
    fi
  done
  
  # dating-a-{sign}.html
  file="signs/dating-a-${sign}.html"
  if [ -f "$file" ]; then
    add_sign_illustration "$file" "$sign"
    add_callout_css "$file"
  fi
  
  # best-match-for-{sign}.html
  file="signs/best-match-for-${sign}.html"
  if [ -f "$file" ]; then
    add_sign_illustration "$file" "$sign"
    add_callout_css "$file"
  fi
  
  # are-{sign}-jealous.html
  file="signs/are-${sign}-jealous.html"
  if [ -f "$file" ]; then
    add_sign_illustration "$file" "$sign"
    add_callout_css "$file"
  fi
  
  # mercury-retrograde-in-{sign}.html
  file="signs/mercury-retrograde-in-${sign}.html"
  if [ -f "$file" ]; then
    add_sign_illustration "$file" "$sign"
    add_callout_css "$file"
  fi
  
  # crystals/best-crystals-for-{sign}.html
  file="crystals/best-crystals-for-${sign}.html"
  if [ -f "$file" ]; then
    add_crystal_illustration "$file" "$sign"
    add_callout_css "$file"
  fi
done

echo ""
echo "=== Done adding illustrations and CSS ==="
echo ""

# Count what we added
echo "Pages with sign-illustration now:"
grep -rl 'sign-illustration' signs/ crystals/ | wc -l
