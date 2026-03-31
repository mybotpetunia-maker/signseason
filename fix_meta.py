import os, re

# Map of file path -> new meta description (all ≤155 chars)
fixes = {
    "./compatibility/taurus-sagittarius.html": "Taurus and Sagittarius compatibility: the anchor vs. the arrow. Can earth and fire find middle ground? Your honest guide to this wild pairing.",
    "./compatibility/virgo-capricorn.html": "Virgo and Capricorn compatibility: two earth signs building an empire together. Loyal, ambitious, and surprisingly steamy. The full breakdown.",
    "./compatibility/sagittarius-pisces.html": "Sagittarius and Pisces compatibility: two dreamers, one square aspect. Can mutable fire and water stop losing the car keys long enough to fall in love?",
    "./compatibility/aries-capricorn.html": "Aries and Capricorn compatibility: the sprinter vs. the marathon runner. Two cardinal signs battling for the lead in love, trust, and everything else.",
    "./compatibility/aquarius-aquarius.html": "Aquarius and Aquarius compatibility: two aliens who finally found each other. Eccentric, electric, and emotionally... working on it. Full breakdown.",
    "./compatibility/gemini-scorpio.html": "Gemini and Scorpio compatibility: light meets dark, and neither blinks. Can this volatile air-water pairing survive each other? The honest truth.",
    "./compatibility/virgo-sagittarius.html": "Virgo and Sagittarius compatibility: the editor meets the philosopher. Can detail-obsessed earth and big-picture fire actually make it work?",
    "./compatibility/taurus-leo.html": "Taurus and Leo compatibility: two fixed signs fighting over one remote. Stubborn, glamorous, and way more passionate than you'd expect.",
    "./compatibility/libra-scorpio.html": "Libra and Scorpio compatibility: the charmer meets the detective. Can beauty and the abyss coexist? Your brutally honest guide to this pairing.",
    "./compatibility/aries-gemini.html": "Aries and Gemini compatibility: fire meets air and the sparks never stop. Fast, fun, and allergic to boredom. Here's the full honest breakdown.",
    "./compatibility/pisces-pisces.html": "Pisces and Pisces compatibility: a beautiful dream that needs a reality check. Two fish navigating love, trust, and the concept of boundaries.",
    "./compatibility/libra-libra.html": "Libra and Libra compatibility: two diplomats, zero decisions. This double air sign pairing is gorgeous, maddening, and deeply indecisive.",
    "./compatibility/aries-aquarius.html": "Aries and Aquarius compatibility: the rebel and the revolutionary. Electric, freedom-loving, and building a life nobody else understands.",
    "./compatibility/leo-aquarius.html": "Leo and Aquarius compatibility: opposite signs with magnetic chemistry and clashing egos. The tension either destroys you or makes you obsessed.",
    "./compatibility/aries-scorpio.html": "Aries and Scorpio compatibility: Mars-ruled intensity times two. Can the passion survive the power struggle? Your brutally honest guide.",
    "./compatibility/scorpio-scorpio.html": "Scorpio and Scorpio compatibility: the most intense pairing in the zodiac. Double water, double obsession, and the terror of being truly known.",
    "./compatibility/taurus-gemini.html": "Taurus and Gemini compatibility: the homebody meets the social butterfly. Can patience alone hold this earth-air mismatch together? Let's find out.",
    "./compatibility/sagittarius-capricorn.html": "Sagittarius and Capricorn compatibility: the wild horse meets the mountain goat. Can freedom and structure coexist? The brutally honest breakdown.",
    "./compatibility/libra-sagittarius.html": "Libra and Sagittarius compatibility: the socialite and the philosopher. Air meets fire, every weekend becomes an event. Full honest breakdown.",
    "./compatibility/aries-taurus.html": "Aries and Taurus compatibility: unstoppable force meets immovable object. Fire and earth at totally different speeds. The full honest breakdown.",
    "./compatibility/virgo-virgo.html": "Virgo and Virgo compatibility: two perfectionists, one relationship. Can this double earth pairing survive the relentless pursuit of improvement?",
    "./compatibility/aries-leo.html": "Aries and Leo compatibility: two fire signs, one explosive pairing. Bold, dramatic, and surprisingly tender. Can they actually make it work?",
    "./compatibility/virgo-pisces.html": "Virgo and Pisces compatibility: the healer meets the dreamer. Opposite signs with magnetic tension between logic and intuition. Full breakdown.",
    "./compatibility/taurus-scorpio.html": "Taurus and Scorpio compatibility: opposite signs, obsessive attraction, zero middle ground. The gravitational pull is real. Full honest breakdown.",
    "./compatibility/gemini-cancer.html": "Gemini and Cancer compatibility: the head and the heart sharing one life. Can air and water bridge the gap? Your brutally honest guide.",
    "./compatibility/scorpio-pisces.html": "Scorpio and Pisces compatibility: two water signs who read each other without words. Deeply psychic, intensely bonded, and a little bit terrifying.",
    "./compatibility/taurus-taurus.html": "Taurus and Taurus compatibility: double the loyalty, double the stubbornness, double the thread count. Can they ever get off the couch? Let's see.",
    "./compatibility/taurus-capricorn.html": "Taurus and Capricorn compatibility: earth meets earth, and the foundation is granite. A powerhouse pairing built to last. The full breakdown.",
    "./compatibility/scorpio-sagittarius.html": "Scorpio and Sagittarius compatibility: depth meets detachment. Water and fire navigating the eternal tension between merging and freedom.",
    "./compatibility/gemini-gemini.html": "Gemini and Gemini compatibility: four personalities, infinite conversations, zero follow-through. Can this chaotic duo ever finish a single plan?",
    "./compatibility/leo-leo.html": "Leo and Leo compatibility: two lions, one kingdom. This double fire sign pairing is dramatic, passionate, and fighting for the spotlight.",
    "./compatibility/leo-scorpio.html": "Leo and Scorpio compatibility: the king and the spy in a fixed-sign standoff. Power struggles, passion, and whether anyone ever actually wins.",
    "./compatibility/virgo-scorpio.html": "Virgo and Scorpio compatibility: the detective meets the interrogator. Private, loyal, and one of the deepest bonds in the entire zodiac.",
    "./compatibility/aries-libra.html": "Aries and Libra compatibility: opposites on the zodiac wheel, magnets in real life. The tension that fuels this polarity pairing is unmatched.",
    "./compatibility/cancer-scorpio.html": "Cancer and Scorpio compatibility: two water signs who feel everything. Intensely loyal, wildly emotional, and a love that wrecks everyone else.",
    "./compatibility/taurus-pisces.html": "Taurus and Pisces compatibility: the poet and the gardener building a dream world with an actual foundation. Tender, deep, and surprisingly real.",
    "./compatibility/cancer-virgo.html": "Cancer and Virgo compatibility: the nurturer meets the perfectionist. Quiet devotion, practical love, and a relationship everyone secretly envies.",
    "./compatibility/aries-pisces.html": "Aries and Pisces compatibility: the ram charges ahead, the fish swims in circles. Fire and water on wildly different wavelengths. Full breakdown.",
    "./compatibility/aquarius-pisces.html": "Aquarius and Pisces compatibility: the visionary meets the dreamer. Air and water on beautifully mismatched wavelengths. The full breakdown.",
    "./compatibility/cancer-sagittarius.html": "Cancer and Sagittarius compatibility: the homebody and the wanderer attempt coexistence. Can this quincunx pairing actually beat the odds?",
    "./compatibility/leo-virgo.html": "Leo and Virgo compatibility: the performer and the critic, zodiac neighbors. When the spotlight meets the spreadsheet, things get interesting.",
    "./compatibility/gemini-sagittarius.html": "Gemini and Sagittarius compatibility: opposite signs on the curiosity axis. Electric air-fire chemistry with one big question: can they commit?",
    "./compatibility/virgo-aquarius.html": "Virgo and Aquarius compatibility: the perfectionist meets the revolutionary. Earth and air on fundamentally different wavelengths. Full breakdown.",
    "./compatibility/leo-capricorn.html": "Leo and Capricorn compatibility: the spotlight vs. the corner office. How the Sun and Saturn clash over authority, love, trust, and who runs it.",
    "./compatibility/sagittarius-sagittarius.html": "Sagittarius and Sagittarius compatibility: double the wanderlust, half the follow-through. Does anyone ever book a return flight? Full breakdown.",
    "./compatibility/libra-aquarius.html": "Libra and Aquarius compatibility: two air signs with big ideas and beautiful aesthetics. Brilliant together, occasionally infuriating. Full guide.",
    "./compatibility/aries-aries.html": "Aries and Aries compatibility: two rams, double the fire, double the collisions. Can this same-sign pairing survive each other? Honest breakdown.",
    "./compatibility/gemini-leo.html": "Gemini and Leo compatibility: the storyteller and the star. This dazzling air-fire pairing is all charm, laughter, and never wanting the party to end.",
    "./compatibility/aries-sagittarius.html": "Aries and Sagittarius compatibility: two fire signs chasing the next adventure together. All fun until things get real. The full honest breakdown.",
    "./compatibility/virgo-libra.html": "Virgo and Libra compatibility: the perfectionist meets the peacekeeper. Cerebral, refined, and figuring out if their differences are strengths.",
    "./compatibility/capricorn-capricorn.html": "Capricorn and Capricorn compatibility: the power couple who scheduled their first kiss. Ambitious, loyal, and allergic to relaxation.",
    "./crystals/best-crystals-for-gemini.html": "Gemini needs crystals that match the dual brain energy and help it slow down. Stones for the sign with seventeen tabs open at all times.",
    "./crystals/best-crystals-for-scorpio.html": "Scorpio crystals for your magnetic, transformative energy. Stones that match your depth, protect your vibe, and help you actually let things go.",
    "./crystals/best-crystals-for-virgo.html": "Virgo crystals to calm the spiral, quiet the inner critic, and let your brilliance land. The best stones for earth's most devoted perfectionist.",
    "./crystals/best-crystals-for-sagittarius.html": "Sagittarius crystals to ground the wanderer and sharpen the philosopher. Stones that help you stay present and actually finish what you started.",
    "./crystals/best-crystals-for-libra.html": "Libra crystals for balance, backbone, and finally making a decision. The best stones for the sign that's beautiful, charming, and paralyzed.",
    "./crystals/best-crystals-for-aquarius.html": "Aquarius crystals to ground the genius and open the heart. Stones for the visionary who's convinced they're the only rational one in any room.",
    "./signs/january-birthstone.html": "January birthstone garnet brings protection, passion, and grounding. Discover garnet properties, zodiac ties to Capricorn and Aquarius, and more.",
}

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            if path in fixes:
                with open(path) as fh:
                    content = fh.read()
                pattern = r'(<meta\s+name=["\']description["\']\s+content=["\'])([^"\']*)(["\']\s*/?>)'
                m = re.search(pattern, content)
                if m:
                    new_desc = fixes[path]
                    assert len(new_desc) <= 155, f"TOO LONG ({len(new_desc)}): {path}: {new_desc}"
                    new_content = content[:m.start(2)] + new_desc + content[m.end(2):]
                    with open(path, 'w') as fh:
                        fh.write(new_content)
                    print(f"FIXED {path}: {len(new_desc)} chars")
                else:
                    print(f"PATTERN NOT FOUND: {path}")

# Verify
print("\n=== VERIFICATION ===")
all_good = True
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path) as fh:
                content = fh.read()
            pattern = r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']*)["\']'
            m = re.search(pattern, content)
            if m:
                desc = m.group(1)
                if len(desc) > 155:
                    print(f"FAIL {path}: {len(desc)} chars: {desc}")
                    all_good = False

if all_good:
    print("ALL META DESCRIPTIONS ARE ≤155 CHARS ✅")
else:
    print("SOME STILL OVER 155 ❌")
