#!/bin/bash
# Update email capture CTAs across all sign pages for better conversion

cd /Users/petunia1/.openclaw/workspace/signseason

# Count files to update
total=$(ls signs/*.html compatibility/*.html crystals/*.html 2>/dev/null | wc -l | tr -d ' ')
updated=0

for f in signs/*.html compatibility/*.html crystals/*.html; do
  [ -f "$f" ] || continue
  
  # Skip index pages (they have different structure)
  [[ "$f" == */index.html ]] && continue
  
  # Update mid-content CTA button text: "Get My Horoscope" → "Send Me the Tea"
  if grep -q "Get My Horoscope" "$f"; then
    sed -i '' 's/Get My Horoscope/Send Me the Tea/g' "$f"
  fi
  
  # Update bottom CTA button text: "Subscribe Free" → "Yes, Read Me"
  if grep -q "Subscribe Free" "$f"; then
    sed -i '' 's/Subscribe Free/Yes, Read Me/g' "$f"
  fi
  
  # Update success message
  if grep -q "You're in\. The stars will be in touch\." "$f"; then
    sed -i '' "s/You're in\. The stars will be in touch\./Your reading is on the way. Check your inbox (and spam, we're new here)./g" "$f"
  fi
  
  # Update bottom success message  
  if grep -q "Welcome to the season\. Check your inbox" "$f"; then
    sed -i '' "s|Welcome to the season\. Check your inbox for an email from <strong>stars@signseason\.com</strong>\. Check spam if you don't see it\.|You're in. Your first reading drops in 60 seconds. Check spam if you don't see it.|g" "$f"
  fi
  
  updated=$((updated + 1))
done

echo "Updated $updated files"
