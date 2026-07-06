#!/usr/bin/env python3
"""Apr 8 EI: How Each Sign Says 'I Love You' Without Saying It
V3 template: circular engravings, velvet texture, plum/parchment alternating."""

from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import os, random

# === Brand colors ===
VOID = (30, 21, 40)
PLUM = (42, 31, 51)
GOLD_DIM = (176, 154, 110)
GOLD = (201, 173, 111)
GOLD_LIGHT = (212, 188, 124)
PARCHMENT = (240, 232, 216)
WARM_GRAY = (138, 125, 112)

# === Paths ===
BASE = os.path.expanduser("~/.openclaw/workspace/signseason")
SIGNS_DIR = os.path.join(BASE, "assets/illustrations/signs")
TEXTURE = os.path.join(BASE, "assets/textures/velvet-noise.png")
PFP = os.path.join(BASE, "assets/illustrations/pfp-transparent.png")

# === Fonts ===
EB_GARAMOND = "/tmp/fonts/EBGaramond.ttf"
EB_GARAMOND_IT = "/tmp/fonts/EBGaramond-Italic.ttf"
FONDAMENTO = "/tmp/fonts/Fondamento-Regular.ttf"
FONDAMENTO_IT = "/tmp/fonts/Fondamento-Italic.ttf"
DM_SANS = "/tmp/fonts/DMSans.ttf"

ZODIAC_FILES = {
    "aries": "aries-ram", "taurus": "taurus", "gemini": "gemini",
    "cancer": "cancer", "leo": "leo", "virgo": "virgo",
    "libra": "libra", "scorpio": "scorpio", "sagittarius": "sagittarius",
    "capricorn": "capricorn", "aquarius": "aquarius", "pisces": "pisces",
}

# Content: sign -> how they say I love you
CONTENT = [
    ("aries", "fights your battles\nbefore you even\nknow you have them"),
    ("taurus", "cooks your favorite meal\nwithout you asking"),
    ("gemini", "remembers the random thing\nyou mentioned three\nmonths ago"),
    ("cancer", "texts you to make sure\nyou got home safe"),
    ("leo", "brags about you to everyone\nlike you're the\nbest thing that happened"),
    ("virgo", "fixes the thing\nyou didn't even realize\nwas broken"),
    ("libra", "makes sure you're always\nincluded, always comfortable,\nalways heard"),
    ("scorpio", "lets you see the version\nof them nobody else\ngets to meet"),
    ("sagittarius", "changes their plans\nto make sure\nyou're in them"),
    ("capricorn", "builds a future\nthat has your name\nwritten into every plan"),
    ("aquarius", "shows up.\nconsistently.\neven when it's hard."),
    ("pisces", "writes you into\nthe version of the world\nthey dream about"),
]

def load_texture():
    return Image.open(TEXTURE).convert("RGBA")

def apply_texture(img, tex, opacity=0.12):
    tw, th = tex.size
    for x in range(0, img.width, tw):
        for y in range(0, img.height, th):
            region = tex.crop((0, 0, min(tw, img.width - x), min(th, img.height - y)))
            r, g, b, a = region.split()
            a = a.point(lambda p: int(p * opacity))
            region = Image.merge("RGBA", (r, g, b, a))
            img.alpha_composite(region, (x, y))
    return img

def make_plum_bg(w, h):
    img = Image.new("RGBA", (w, h), VOID)
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, int(h * 0.45)
    max_r = max(w, h)
    for r in range(max_r, 0, -3):
        frac = r / max_r
        alpha = int(40 * (1 - frac))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*PLUM, alpha))
    return img

def make_parchment_bg(w, h):
    img = Image.new("RGBA", (w, h), PARCHMENT)
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, int(h * 0.45)
    max_r = max(w, h)
    for r in range(max_r, 0, -3):
        frac = r / max_r
        c = int(232 - 12 * frac)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(c, c - 8, c - 24, 15))
    return img

def add_gold_stars(draw, w, h, count=50):
    random.seed(88)
    for _ in range(count):
        x, y = random.randint(0, w), random.randint(0, h)
        a = random.randint(15, 45)
        draw.point((x, y), fill=(*GOLD, a))

def gold_border(draw, w, h, margin=35, opacity=50):
    draw.rectangle([margin, margin, w - margin, h - margin], outline=(*GOLD, opacity), width=1)

def load_engraving(sign_name, target_size=None):
    fname = ZODIAC_FILES[sign_name]
    path = os.path.join(SIGNS_DIR, f"{fname}.png")
    img = Image.open(path).convert("RGBA")
    if target_size:
        img.thumbnail(target_size, Image.LANCZOS)
    w, h = img.size
    size = min(w, h)
    left = (w - size) // 2
    top = (h - size) // 2
    img = img.crop((left, top, left + size, top + size))
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, size - 1, size - 1], fill=255)
    output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask)
    ImageDraw.Draw(output).ellipse([1, 1, size - 2, size - 2], outline=(*GOLD, 120), width=2)
    return output

def center_text(draw, text, font, y, cx, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw // 2, y), text, font=font, fill=fill)
    return th

def draw_divider(draw, cx, y, width=80, color=(*GOLD_DIM, 120)):
    draw.line([(cx - width//2, y), (cx + width//2, y)], fill=color, width=1)

def draw_star_divider(draw, cx, y, color=GOLD_DIM):
    dot_r = 2
    gap = 18
    for i in range(-1, 2):
        dx = cx + i * gap
        draw.ellipse([dx - dot_r, y - dot_r, dx + dot_r, y + dot_r], fill=(*color, 160))

def make_title_slide(w, h, out_dir):
    img = make_plum_bg(w, h)
    tex = load_texture()
    img = apply_texture(img, tex, 0.12)
    draw = ImageDraw.Draw(img)
    cx = w // 2
    add_gold_stars(draw, w, h, 55)
    gold_border(draw, w, h)

    # Load a few engravings as decorative elements
    signs_top = ["aries", "cancer", "libra", "capricorn"]
    eng_size = 120
    gap = 25
    total = len(signs_top) * eng_size + (len(signs_top) - 1) * gap
    x_start = cx - total // 2
    for i, s in enumerate(signs_top):
        eng = load_engraving(s, (eng_size, eng_size))
        x = x_start + i * (eng_size + gap)
        img.alpha_composite(eng, (x, 450))

    draw = ImageDraw.Draw(img)
    title_font = ImageFont.truetype(FONDAMENTO, 68)
    subtitle_font = ImageFont.truetype(EB_GARAMOND_IT, 38)
    footer_font = ImageFont.truetype(DM_SANS, 16)

    y = 630
    draw_star_divider(draw, cx, y)
    y += 50

    # Multi-line title
    for line in ["How Each Sign", "Says 'I Love You'", "Without Saying It"]:
        h_line = center_text(draw, line, title_font, y, cx, GOLD_LIGHT)
        y += h_line + 20

    y += 30
    draw_divider(draw, cx, y, 90, (*GOLD, 80))
    y += 40
    center_text(draw, "the actions that speak louder", subtitle_font, y, cx, GOLD_DIM)

    center_text(draw, "signseason.com", footer_font, h - 55, cx, (*WARM_GRAY, 160))
    img.convert("RGB").save(os.path.join(out_dir, "slide-01-title.png"), quality=95)
    print("  ✓ Title slide")

def make_sign_slide(idx, sign, body, is_dark, w, h, out_dir, total_slides):
    img = make_plum_bg(w, h) if is_dark else make_parchment_bg(w, h)
    tex = load_texture()
    img = apply_texture(img, tex, 0.10 if is_dark else 0.06)
    draw = ImageDraw.Draw(img)
    cx = w // 2

    if is_dark:
        add_gold_stars(draw, w, h, 40)
        name_color = GOLD_LIGHT
        body_color = GOLD_DIM
        gold_border(draw, w, h)
    else:
        name_color = (42, 31, 51)  # PLUM
        body_color = (80, 65, 55)
        draw.rectangle([35, 35, w - 35, h - 35], outline=(42, 31, 51, 40), width=1)

    # Large centered engraving — vertically centered layout
    eng = load_engraving(sign, (300, 300))
    img.alpha_composite(eng, (cx - eng.width // 2, 420))
    draw = ImageDraw.Draw(img)

    name_font = ImageFont.truetype(FONDAMENTO, 56)
    body_font = ImageFont.truetype(EB_GARAMOND_IT, 48)
    footer_font = ImageFont.truetype(DM_SANS, 16)
    counter_font = ImageFont.truetype(EB_GARAMOND, 20)

    y = 420 + eng.height + 40
    center_text(draw, sign.title(), name_font, y, cx, name_color)
    y += 70

    draw_divider(draw, cx, y, 80, (*GOLD, 70) if is_dark else (42, 31, 51, 50))
    y += 35

    for line in body.split("\n"):
        h_line = center_text(draw, line, body_font, y, cx, body_color)
        y += h_line + int(48 * 0.55)

    center_text(draw, "signseason.com", footer_font, h - 50, 110, (*WARM_GRAY, 140))
    draw.text((w - 80, h - 50), f"{idx}/{total_slides}", font=counter_font, fill=(*WARM_GRAY, 140))

    fname = f"slide-{idx:02d}-{sign}.png"
    img.convert("RGB").save(os.path.join(out_dir, fname), quality=95)
    print(f"  ✓ {sign.title()} ({'dark' if is_dark else 'light'})")

def make_cta_slide(w, h, handle, slide_num, out_dir):
    img = make_plum_bg(w, h)
    tex = load_texture()
    img = apply_texture(img, tex, 0.12)
    draw = ImageDraw.Draw(img)
    cx = w // 2
    add_gold_stars(draw, w, h, 55)
    gold_border(draw, w, h)

    pfp = Image.open(PFP).convert("RGBA")
    pfp.thumbnail((200, 200), Image.LANCZOS)
    img.alpha_composite(pfp, (cx - pfp.width // 2, 350))
    draw = ImageDraw.Draw(img)

    y = 580
    draw_star_divider(draw, cx, y, GOLD_DIM)
    y += 40

    cta_font = ImageFont.truetype(FONDAMENTO, 52)
    handle_font = ImageFont.truetype(EB_GARAMOND_IT, 32)
    footer_font = ImageFont.truetype(DM_SANS, 16)

    center_text(draw, "follow for more", cta_font, y, cx, GOLD_LIGHT)
    y += 65
    center_text(draw, "zodiac truths", cta_font, y, cx, GOLD_LIGHT)
    y += 90
    draw_divider(draw, cx, y, 80, (*GOLD, 80))
    y += 35
    center_text(draw, handle, handle_font, y, cx, GOLD_DIM)
    center_text(draw, "signseason.com", footer_font, h - 55, cx, (*WARM_GRAY, 160))

    img.convert("RGB").save(os.path.join(out_dir, f"slide-{slide_num:02d}-cta.png"), quality=95)
    print("  ✓ CTA slide")

def make_pinterest_pin(out_dir):
    w, h = 1000, 1500
    img = make_plum_bg(w, h)
    tex = load_texture()
    img = apply_texture(img, tex, 0.10)
    draw = ImageDraw.Draw(img)
    cx = w // 2
    add_gold_stars(draw, w, h, 60)
    gold_border(draw, w, h, 30, 45)

    title_font = ImageFont.truetype(FONDAMENTO, 56)
    sign_font = ImageFont.truetype(FONDAMENTO, 30)
    desc_font = ImageFont.truetype(EB_GARAMOND_IT, 24)
    footer_font = ImageFont.truetype(DM_SANS, 22)

    y = 50
    for line in ["How Each Sign", "Says 'I Love You'", "Without Saying It"]:
        h_line = center_text(draw, line, title_font, y, cx, GOLD_LIGHT)
        y += h_line + 8
    y += 10
    draw_star_divider(draw, cx, y, GOLD_DIM)
    y += 25

    # Short standalone summaries for pin format
    PIN_SUMMARIES = {
        "aries": "fights your battles for you",
        "taurus": "cooks your favorite meal",
        "gemini": "remembers what you said months ago",
        "cancer": "checks you got home safe",
        "leo": "brags about you to everyone",
        "virgo": "quietly fixes everything",
        "libra": "makes sure you're always included",
        "scorpio": "shows you who they really are",
        "sagittarius": "changes their plans for you",
        "capricorn": "puts you in the five-year plan",
        "aquarius": "shows up consistently",
        "pisces": "dreams a world with you in it",
    }
    for sign, body in CONTENT:
        eng = load_engraving(sign, (45, 45))
        summary = PIN_SUMMARIES.get(sign, body.split("\n")[0])

        img.alpha_composite(eng, (60, y - 2))
        draw = ImageDraw.Draw(img)
        draw.text((120, y + 2), sign.title(), font=sign_font, fill=GOLD_LIGHT)
        y += 32
        draw.text((120, y), summary, font=desc_font, fill=GOLD_DIM)
        y += 32
        draw.line([(100, y), (w - 100, y)], fill=(*GOLD, 30), width=1)
        y += 12

    center_text(draw, "signseason.com", footer_font, h - 60, cx, (*WARM_GRAY, 180))
    img.convert("RGB").save(os.path.join(out_dir, "pin-love-language.png"), quality=95)
    print("  ✓ Pinterest pin")


# === MAIN ===
DATE = "2026-04-08"
TOTAL_CONTENT_SLIDES = 12
TOTAL_SLIDES = TOTAL_CONTENT_SLIDES + 2  # title + cta

for platform, handle in [("tiktok", "@sign_season"), ("instagram", "@signseasonco")]:
    out_dir = os.path.expanduser(f"~/.openclaw/workspace/signseason/content/social/slides-{DATE}-{platform}")
    os.makedirs(out_dir, exist_ok=True)
    print(f"\nGenerating {platform.upper()} slides (1080x1350)...")

    W, H = 1080, 1350
    make_title_slide(W, H, out_dir)

    for i, (sign, body) in enumerate(CONTENT):
        is_dark = i % 2 == 0  # Alternate dark/light
        make_sign_slide(i + 2, sign, body, is_dark, W, H, out_dir, TOTAL_SLIDES)

    make_cta_slide(W, H, handle, TOTAL_SLIDES, out_dir)

# Pinterest
pin_dir = os.path.expanduser(f"~/.openclaw/workspace/signseason/content/social/slides-{DATE}-pinterest")
os.makedirs(pin_dir, exist_ok=True)
print("\nGenerating Pinterest pin...")
make_pinterest_pin(pin_dir)

print(f"\n✅ Apr 8 EI slides complete")
