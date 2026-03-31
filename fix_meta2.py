import re

fixes = {
    "./compatibility/taurus-sagittarius.html": "Taurus and Sagittarius compatibility: the anchor vs. the arrow. Can this fundamentally mismatched earth-fire pairing find common ground in love?",
    "./compatibility/virgo-capricorn.html": "Virgo and Capricorn compatibility: two earth signs building something real. Ambitious, loyal, and surprisingly steamy. The full honest breakdown.",
    "./compatibility/aries-capricorn.html": "Aries and Capricorn compatibility: the sprinter vs. the marathon runner. Two cardinal signs battling over love, trust, and who gets to lead.",
    "./compatibility/taurus-leo.html": "Taurus and Leo compatibility: two fixed signs, one remote control. Stubborn, glamorous, and fighting over who runs the show. Full breakdown.",
    "./compatibility/taurus-scorpio.html": "Taurus and Scorpio compatibility: opposite signs, obsessive attraction, zero middle ground. The gravitational pull is inescapable. Full guide.",
    "./compatibility/cancer-scorpio.html": "Cancer and Scorpio compatibility: two water signs who feel everything. Intensely loyal, wildly emotional, and capable of a love that wrecks you.",
}

for path, new_desc in fixes.items():
    assert len(new_desc) <= 155, f"TOO LONG ({len(new_desc)}): {path}"
    with open(path) as f:
        content = f.read()
    # Use a more robust pattern that matches content="..." with possible apostrophes inside
    pattern = r'(<meta\s+name="description"\s+content=")(.*?)(")'
    m = re.search(pattern, content)
    if m:
        new_content = content[:m.start(2)] + new_desc + content[m.end(2):]
        with open(path, 'w') as f:
            f.write(new_content)
        print(f"FIXED {path}: {len(new_desc)} chars")
    else:
        print(f"NOT FOUND: {path}")

# Final verification of ALL files
print("\n=== FINAL VERIFICATION ===")
import os
all_good = True
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            fp = os.path.join(root, f)
            with open(fp) as fh:
                content = fh.read()
            # Try both quote styles
            for pat in [r'<meta\s+name="description"\s+content="(.*?)"', r"<meta\s+name='description'\s+content='(.*?)'"]:
                m = re.search(pat, content)
                if m:
                    desc = m.group(1)
                    if len(desc) > 155:
                        print(f"FAIL {fp}: {len(desc)} chars")
                        all_good = False
                    break

if all_good:
    print("ALL META DESCRIPTIONS ARE ≤155 CHARS ✅")
