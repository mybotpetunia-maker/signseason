#!/usr/bin/env python3
"""Generate 36 Pinterest pin images for signseason.com"""

import math
import os
from PIL import Image, ImageDraw, ImageFont

# === BRAND SPECS ===
WIDTH, HEIGHT = 1000, 1500
DEEP_NIGHT = (0x1A, 0x13, 0x20)
PLUM = (0x2A, 0x1F, 0x33)
GOLD = (0xC9, 0xAD, 0x6F)
PARCHMENT = (0xF0, 0xE8, 0xD8)
CREAM = (0xD4, 0xC8, 0xB4)
WARM_GRAY = (0x8A, 0x7D, 0x70)

# === FONTS ===
FONT_DIR = "/System/Library/Fonts"
GEORGIA_BOLD = f"{FONT_DIR}/Supplemental/Georgia Bold.ttf"
GEORGIA = f"{FONT_DIR}/Supplemental/Georgia.ttf"
HELVETICA = f"{FONT_DIR}/Helvetica.ttc"
COURIER = f"{FONT_DIR}/Supplemental/Courier New.ttf"
APPLE_SYMBOLS = f"{FONT_DIR}/Apple Symbols.ttf"

# === OUTPUT DIRS ===
BASE = os.path.dirname(os.path.abspath(__file__))
SIGNS_DIR = os.path.join(BASE, "pins", "signs")
COMPAT_DIR = os.path.join(BASE, "pins", "compatibility")
CRYSTAL_DIR = os.path.join(BASE, "pins", "crystals")
for d in [SIGNS_DIR, COMPAT_DIR, CRYSTAL_DIR]:
    os.makedirs(d, exist_ok=True)


def make_background():
    """Create radial gradient from Plum (center) to Deep Night (edges)."""
    img = Image.new("RGB", (WIDTH, HEIGHT), DEEP_NIGHT)
    pixels = img.load()
    cx, cy = WIDTH // 2, HEIGHT // 2
    max_dist = math.sqrt(cx**2 + cy**2)
    for y in range(HEIGHT):
        for x in range(WIDTH):
            dist = math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
            ratio = min(dist / max_dist, 1.0)
            r = int(PLUM[0] * (1 - ratio) + DEEP_NIGHT[0] * ratio)
            g = int(PLUM[1] * (1 - ratio) + DEEP_NIGHT[1] * ratio)
            b = int(PLUM[2] * (1 - ratio) + DEEP_NIGHT[2] * ratio)
            pixels[x, y] = (r, g, b)
    return img


def draw_border(draw):
    """Gold border frame inset 30px."""
    inset = 30
    draw.rectangle(
        [inset, inset, WIDTH - inset - 1, HEIGHT - inset - 1],
        outline=GOLD, width=2
    )


def draw_watermark(draw):
    """signseason.com watermark at bottom."""
    font = ImageFont.truetype(COURIER, 22)
    text = "signseason.com"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((WIDTH - tw) // 2, HEIGHT - 65), text, fill=WARM_GRAY, font=font)


def draw_decorative_stars(draw):
    """Draw subtle decorative dots/stars to fill space."""
    import random
    random.seed(42)  # reproducible
    star_font = ImageFont.truetype(APPLE_SYMBOLS, 12)
    for _ in range(30):
        x = random.randint(60, WIDTH - 60)
        y = random.randint(60, HEIGHT - 60)
        opacity_color = tuple(int(c * 0.3) for c in GOLD)
        draw.text((x, y), "\u00B7", fill=opacity_color, font=star_font)


def draw_cta(draw, y):
    """Draw 'Tap to read more' CTA."""
    font = ImageFont.truetype(GEORGIA, 28)
    text = "Tap to read more"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((WIDTH - tw) // 2, y), text, fill=GOLD, font=font)


def centered_text(draw, y, text, font, fill):
    """Draw centered text, return bottom y."""
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text(((WIDTH - tw) // 2, y), text, fill=fill, font=font)
    return y + th


def wrap_text(draw, text, font, max_width):
    """Simple word-wrap returning list of lines."""
    words = text.split()
    lines = []
    current = ""
    for w in words:
        test = f"{current} {w}".strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = w
    if current:
        lines.append(current)
    return lines


# === ZODIAC DATA ===
SIGNS = [
    ("Aries", "\u2648", ["Bold and fearless leader", "Passionate and energetic", "Fiercely independent", "Quick-witted and direct", "Natural-born trailblazer"]),
    ("Taurus", "\u2649", ["Grounded and reliable", "Sensual and pleasure-seeking", "Patient but stubborn", "Loyal to the core", "Appreciates beauty and comfort"]),
    ("Gemini", "\u264A", ["Curious and adaptable", "Quick-minded communicator", "Social butterfly energy", "Dual nature and versatile", "Never a dull moment"]),
    ("Cancer", "\u264B", ["Deeply intuitive and nurturing", "Emotionally intelligent", "Fiercely protective of loved ones", "Home is their sanctuary", "Sensitive yet surprisingly strong"]),
    ("Leo", "\u264C", ["Born to shine and lead", "Warm-hearted and generous", "Creative and dramatic flair", "Loyal and protective", "Radiates confidence naturally"]),
    ("Virgo", "\u264D", ["Analytical and detail-oriented", "Quietly powerful and capable", "Service-driven perfectionist", "Practical problem solver", "Sharp wit, humble heart"]),
    ("Libra", "\u264E", ["Harmony-seeking diplomat", "Natural sense of beauty", "Charming and social", "Fair-minded and just", "Romantic at heart"]),
    ("Scorpio", "\u264F", ["Intensely passionate and deep", "Magnetic and mysterious", "Fiercely loyal once trusted", "Emotionally fearless", "Transformative energy"]),
    ("Sagittarius", "\u2650", ["Adventurous free spirit", "Optimistic truth-seeker", "Philosophical and wise", "Hilariously blunt and honest", "Born to explore the world"]),
    ("Capricorn", "\u2651", ["Ambitious and disciplined", "Strategic long-term planner", "Quiet confidence and authority", "Dry humor, deep loyalty", "Built to climb mountains"]),
    ("Aquarius", "\u2652", ["Visionary and unconventional", "Humanitarian at heart", "Intellectually independent", "Marches to their own beat", "Future-focused innovator"]),
    ("Pisces", "\u2653", ["Deeply empathetic and intuitive", "Creative dreamworld dweller", "Emotionally boundless", "Gentle yet surprisingly resilient", "Sees beauty everywhere"]),
]

COMPAT_PAIRS = [
    ("Aries", "\u2648", "Leo", "\u264C", 92, ["Fire meets fire -- unstoppable energy", "Natural leaders who respect each other", "Passion that never burns out"]),
    ("Taurus", "\u2649", "Cancer", "\u264B", 89, ["Earth and water nurture deep roots", "Shared love of home and comfort", "Emotional security on lock"]),
    ("Gemini", "\u264A", "Libra", "\u264E", 88, ["Air sign soulmates in conversation", "Social power couple energy", "Intellectual chemistry off the charts"]),
    ("Cancer", "\u264B", "Scorpio", "\u264F", 94, ["Water sign intensity at its peak", "Emotional depth that transforms both", "Unbreakable bond once trust is built"]),
    ("Leo", "\u264C", "Sagittarius", "\u2650", 90, ["Adventure and passion collide", "Fire signs who fan each other's flames", "Life is never boring together"]),
    ("Virgo", "\u264D", "Capricorn", "\u2651", 91, ["Earth signs building empires together", "Shared work ethic and vision", "Quiet devotion that lasts decades"]),
    ("Libra", "\u264E", "Aquarius", "\u2652", 85, ["Air signs with big ideas", "Freedom-loving yet deeply connected", "The couple everyone wants to be"]),
    ("Scorpio", "\u264F", "Pisces", "\u2653", 93, ["Water sign magic and mystery", "Spiritual and emotional fusion", "They just get each other"]),
    ("Sagittarius", "\u2650", "Aries", "\u2648", 87, ["Bold adventurers in love", "Spontaneous and thrilling connection", "Mutual respect for independence"]),
    ("Capricorn", "\u2651", "Taurus", "\u2649", 90, ["Solid earth sign foundation", "Loyalty and ambition combined", "The long game, played together"]),
    ("Aquarius", "\u2652", "Gemini", "\u264A", 86, ["Minds that never stop sparking", "Eccentric and proud of it", "Friendship-first love that endures"]),
    ("Pisces", "\u2653", "Cancer", "\u264B", 91, ["Emotional wavelength perfectly matched", "Nurturing and dreaming together", "A love that feels like coming home"]),
]

CRYSTALS = [
    ("Aries", [("Carnelian", "Fuels courage and bold action"), ("Red Jasper", "Grounds fiery energy into strength"), ("Citrine", "Amplifies confidence and willpower")]),
    ("Taurus", [("Rose Quartz", "Opens the heart to deeper love"), ("Emerald", "Attracts abundance and loyalty"), ("Lapis Lazuli", "Balances stubbornness with wisdom")]),
    ("Gemini", [("Agate", "Centers scattered mental energy"), ("Tiger's Eye", "Sharpens focus and decision-making"), ("Aquamarine", "Soothes communication anxiety")]),
    ("Cancer", [("Moonstone", "Honors intuition and emotional cycles"), ("Selenite", "Cleanses and protects sensitive energy"), ("Pearl", "Nurtures inner calm and self-worth")]),
    ("Leo", [("Sunstone", "Radiates joy and creative power"), ("Pyrite", "Boosts confidence and manifestation"), ("Tiger's Eye", "Channels bold energy with focus")]),
    ("Virgo", [("Amazonite", "Eases perfectionist overthinking"), ("Peridot", "Attracts prosperity and self-worth"), ("Fluorite", "Organizes mental clarity beautifully")]),
    ("Libra", [("Lepidolite", "Restores emotional equilibrium"), ("Rose Quartz", "Deepens love and harmony"), ("Tourmaline", "Protects empathic boundaries")]),
    ("Scorpio", [("Obsidian", "Reveals hidden truths fearlessly"), ("Labradorite", "Enhances transformation and mysticism"), ("Malachite", "Absorbs negativity and heals deep")]),
    ("Sagittarius", [("Turquoise", "Protects the adventurous spirit"), ("Sodalite", "Grounds wisdom into daily life"), ("Amethyst", "Calms restless energy with insight")]),
    ("Capricorn", [("Garnet", "Fuels ambition and endurance"), ("Black Tourmaline", "Shields from burnout and negativity"), ("Smoky Quartz", "Grounds big goals into reality")]),
    ("Aquarius", [("Amethyst", "Amplifies visionary intuition"), ("Aquamarine", "Supports authentic self-expression"), ("Clear Quartz", "Magnifies innovative thinking")]),
    ("Pisces", [("Amethyst", "Deepens spiritual connection"), ("Aquamarine", "Calms emotional overwhelm"), ("Fluorite", "Protects dreamy energy from chaos")]),
]


# Pre-generate background (expensive, do once)
print("Generating radial gradient background...")
BG = make_background()
print("Background ready.")


def new_pin():
    """Return fresh copy of background with draw context."""
    img = BG.copy()
    draw = ImageDraw.Draw(img)
    draw_border(draw)
    draw_watermark(draw)
    return img, draw


# ============================================================
# BATCH 1: Sign overview pins
# ============================================================
print("\n--- Batch 1: Sign Overview Pins ---")
for sign_name, symbol, traits in SIGNS:
    img, draw = new_pin()
    draw_decorative_stars(draw)

    # Measure content height first
    sym_font = ImageFont.truetype(APPLE_SYMBOLS, 160)
    h_font = ImageFont.truetype(GEORGIA_BOLD, 72)
    sub_font = ImageFont.truetype(GEORGIA, 30)
    trait_font = ImageFont.truetype(HELVETICA, 32)
    bullet_sym_font = ImageFont.truetype(APPLE_SYMBOLS, 18)
    cta_font = ImageFont.truetype(GEORGIA, 28)

    y = 380

    # Zodiac symbol (large, centered)
    y = centered_text(draw, y, symbol, sym_font, GOLD) + 30

    # Decorative line
    line_w = 200
    draw.line([(WIDTH // 2 - line_w // 2, y), (WIDTH // 2 + line_w // 2, y)], fill=GOLD, width=2)
    y += 30

    # Sign name headline
    y = centered_text(draw, y, sign_name.upper(), h_font, GOLD) + 35

    # Subtext
    y = centered_text(draw, y, "Key Personality Traits", sub_font, PARCHMENT) + 45

    # Traits as bullet points
    for trait in traits:
        bx = 120
        draw.text((bx, y + 6), "\u25C6", fill=GOLD, font=bullet_sym_font)
        draw.text((bx + 35, y), trait, fill=CREAM, font=trait_font)
        y += 55

    # CTA
    y += 40
    draw_cta(draw, y)

    fname = f"{sign_name.lower()}.png"
    img.save(os.path.join(SIGNS_DIR, fname), "PNG")
    print(f"  [OK] {fname}")


# ============================================================
# BATCH 2: Compatibility pins
# ============================================================
print("\n--- Batch 2: Compatibility Pins ---")
for s1_name, s1_sym, s2_name, s2_sym, score, bullets in COMPAT_PAIRS:
    img, draw = new_pin()
    draw_decorative_stars(draw)

    y = 320
    # Both symbols side by side
    sym_font = ImageFont.truetype(APPLE_SYMBOLS, 130)
    heart_font = ImageFont.truetype(GEORGIA_BOLD, 60)

    # Calculate positions for: symbol1  &  symbol2
    s1_bbox = draw.textbbox((0, 0), s1_sym, font=sym_font)
    s2_bbox = draw.textbbox((0, 0), s2_sym, font=sym_font)
    amp_bbox = draw.textbbox((0, 0), "&", font=heart_font)
    s1w = s1_bbox[2] - s1_bbox[0]
    s2w = s2_bbox[2] - s2_bbox[0]
    ampw = amp_bbox[2] - amp_bbox[0]
    gap = 30
    total = s1w + gap + ampw + gap + s2w
    sx = (WIDTH - total) // 2

    draw.text((sx, y), s1_sym, fill=GOLD, font=sym_font)
    amp_y = y + 40
    draw.text((sx + s1w + gap, amp_y), "&", fill=PARCHMENT, font=heart_font)
    draw.text((sx + s1w + gap + ampw + gap, y), s2_sym, fill=GOLD, font=sym_font)

    y += 170

    # Decorative line
    line_w = 300
    draw.line([(WIDTH // 2 - line_w // 2, y), (WIDTH // 2 + line_w // 2, y)], fill=GOLD, width=2)
    y += 35

    # "Are [Sign] & [Sign] Compatible?"
    q_font = ImageFont.truetype(GEORGIA_BOLD, 48)
    q_lines = [f"Are {s1_name} & {s2_name}", "Compatible?"]
    for line in q_lines:
        y = centered_text(draw, y, line, q_font, GOLD) + 8
    y += 25

    # Compatibility score
    score_font = ImageFont.truetype(GEORGIA_BOLD, 96)
    y = centered_text(draw, y, f"{score}%", score_font, PARCHMENT) + 10

    label_font = ImageFont.truetype(COURIER, 24)
    y = centered_text(draw, y, "COMPATIBILITY SCORE", label_font, WARM_GRAY) + 40

    # Bullet points
    bullet_font = ImageFont.truetype(HELVETICA, 30)
    bullet_sym = ImageFont.truetype(APPLE_SYMBOLS, 16)
    for bullet in bullets:
        lines = wrap_text(draw, bullet, bullet_font, WIDTH - 240)
        for i, line in enumerate(lines):
            bx = 110
            if i == 0:
                draw.text((bx, y + 5), "\u25C6", fill=GOLD, font=bullet_sym)
            draw.text((bx + 35, y), line, fill=CREAM, font=bullet_font)
            y += 48

    # CTA
    y += 30
    draw_cta(draw, y)

    fname = f"{s1_name.lower()}-{s2_name.lower()}.png"
    img.save(os.path.join(COMPAT_DIR, fname), "PNG")
    print(f"  [OK] {fname}")


# ============================================================
# BATCH 3: Crystal pins
# ============================================================
SIGN_SYMBOLS = {s[0]: s[1] for s in SIGNS}

print("\n--- Batch 3: Crystal Pins ---")
for sign_name, crystals in CRYSTALS:
    img, draw = new_pin()
    draw_decorative_stars(draw)

    y = 130

    # Zodiac symbol
    sym_font = ImageFont.truetype(APPLE_SYMBOLS, 100)
    symbol = SIGN_SYMBOLS.get(sign_name, "")
    y = centered_text(draw, y, symbol, sym_font, GOLD) + 20

    # Sign name
    h_font = ImageFont.truetype(GEORGIA_BOLD, 64)
    y = centered_text(draw, y, sign_name.upper(), h_font, GOLD) + 10

    # "Best Crystals"
    sub_font = ImageFont.truetype(GEORGIA_BOLD, 48)
    y = centered_text(draw, y, "Best Crystals", sub_font, PARCHMENT) + 20

    # Decorative line
    line_w = 300
    draw.line([(WIDTH // 2 - line_w // 2, y), (WIDTH // 2 + line_w // 2, y)], fill=GOLD, width=2)
    y += 50

    # Each crystal as a card-like block
    crystal_name_font = ImageFont.truetype(GEORGIA_BOLD, 42)
    crystal_desc_font = ImageFont.truetype(HELVETICA, 30)
    num_font = ImageFont.truetype(GEORGIA_BOLD, 36)

    for i, (crystal, desc) in enumerate(crystals):
        # Number label
        num_text = f"0{i + 1}"
        num_bbox = draw.textbbox((0, 0), num_text, font=num_font)
        nw = num_bbox[2] - num_bbox[0]
        draw.text(((WIDTH - nw) // 2, y), num_text, fill=GOLD, font=num_font)
        y += 55

        # Crystal name
        y = centered_text(draw, y, crystal, crystal_name_font, PARCHMENT) + 12

        # Description wrapped
        lines = wrap_text(draw, desc, crystal_desc_font, WIDTH - 200)
        for line in lines:
            y = centered_text(draw, y, line, crystal_desc_font, CREAM) + 6
        y += 60

    # CTA
    draw_cta(draw, y)

    fname = f"{sign_name.lower()}-crystals.png"
    img.save(os.path.join(CRYSTAL_DIR, fname), "PNG")
    print(f"  [OK] {fname}")

print(f"\nDone! 36 pins generated.")
