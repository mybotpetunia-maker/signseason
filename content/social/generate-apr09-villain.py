#!/usr/bin/env python3
"""Apr 9 — Each Sign in Their Villain Era (EI format: engraving + plum bg)"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os, textwrap

# === Brand colors ===
VOID = (30, 21, 40)
PLUM = (42, 31, 51)
PLUM_MID = (53, 40, 64)
GOLD = (201, 173, 111)
GOLD_LIGHT = (212, 188, 124)
GOLD_PALE = (226, 212, 167)
GOLD_DIM = (176, 154, 110)
PARCHMENT = (240, 232, 216)

# === Paths ===
SIGNS_DIR = os.path.expanduser("~/.openclaw/workspace/signseason/assets/illustrations/signs")
TEXTURE = os.path.expanduser("~/.openclaw/workspace/signseason/assets/textures/velvet-noise.png")

# === Fonts ===
EB_GARAMOND = "/tmp/fonts/EBGaramond.ttf"
EB_GARAMOND_IT = "/tmp/fonts/EBGaramond-Italic.ttf"
FONDAMENTO = "/tmp/fonts/Fondamento-Regular.ttf"
DM_SANS = "/tmp/fonts/DMSans.ttf"
SYMBOLS = "/System/Library/Fonts/Apple Symbols.ttf"

W, H = 1080, 1350

SIGNS = [
    ("aries", "♈", "burns the bridge, then swims\nacross to make sure you\nsaw the fire."),
    ("taurus", "♉", "stopped replying. that's it.\nthat's the whole villain arc.\nsilence as a weapon."),
    ("gemini", "♊", "told everyone your secrets\nbut made it sound like\ngeneral life advice."),
    ("cancer", "♋", "withdrew all the love\nthey gave you and now\nyou're emotionally bankrupt."),
    ("leo", "♌", "posted a glow-up so lethal\nyour ex's new partner\nstarted questioning things."),
    ("virgo", "♍", "calmly listed every flaw\nyou thought they never noticed.\nspoiler: they noticed everything."),
    ("libra", "♎", "stayed charming while quietly\nreplacing you in every\nfriend group you shared."),
    ("scorpio", "♏", "they didn't get revenge.\nthey just let you live\nknowing they could."),
    ("sagittarius", "♐", "left the country.\ndidn't tell you.\nposted from Lisbon."),
    ("capricorn", "♑", "outperformed you professionally\nand personally. on purpose.\nand they have receipts."),
    ("aquarius", "♒", "emotionally detached so cleanly\nyou're still wondering if\nyou imagined the whole thing."),
    ("pisces", "♓", "wrote something about you\nso beautiful and devastating\nyou can't even be mad."),
]

def load_texture():
    if os.path.exists(TEXTURE):
        return Image.open(TEXTURE).convert("RGBA")
    return None

def apply_texture(img, tex, opacity=0.12):
    if tex is None:
        return img
    tw, th = tex.size
    for x in range(0, img.width, tw):
        for y in range(0, img.height, th):
            region = tex.crop((0, 0, min(tw, img.width - x), min(th, img.height - y)))
            r, g, b, a = region.split()
            a = a.point(lambda p: int(p * opacity))
            region = Image.merge("RGBA", (r, g, b, a))
            img.alpha_composite(region, (x, y))
    return img

def make_plum_bg():
    img = Image.new("RGBA", (W, H), VOID)
    draw = ImageDraw.Draw(img)
    cx, cy = W // 2, int(H * 0.4)
    max_r = max(W, H)
    for r in range(max_r, 0, -4):
        frac = r / max_r
        alpha = int(35 * (1 - frac))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*PLUM_MID, alpha))
    return img

def draw_gold_border(draw, margin=28, width=1):
    draw.rectangle([margin, margin, W - margin, H - margin], outline=GOLD_DIM, width=width)

def draw_centered_text(draw, text, y, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (W - tw) // 2
    draw.text((x, y), text, font=font, fill=fill)
    return bbox[3] - bbox[1]

def make_title_slide(tex):
    img = make_plum_bg()
    img = apply_texture(img, tex)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw)

    # "EACH SIGN IN THEIR" — centered vertically
    font_sub = ImageFont.truetype(DM_SANS, 32)
    draw_centered_text(draw, "EACH SIGN IN THEIR", 575, font_sub, GOLD_DIM)

    # "Villain Era"
    font_title = ImageFont.truetype(EB_GARAMOND_IT, 96)
    draw_centered_text(draw, "Villain Era", 625, font_title, GOLD)

    # decorative dots
    font_dots = ImageFont.truetype(DM_SANS, 24)
    draw_centered_text(draw, "·  ·  ·", 745, font_dots, GOLD_DIM)

    # subtitle
    font_tag = ImageFont.truetype(EB_GARAMOND_IT, 36)
    draw_centered_text(draw, "because growth isn't always pretty", 790, font_tag, GOLD_PALE)

    # branding
    font_brand = ImageFont.truetype(DM_SANS, 22)
    draw_centered_text(draw, "signseason.com", H - 70, font_brand, GOLD_DIM)

    return img

def make_sign_slide(sign, symbol, body_text, tex, slide_num, total):
    img = make_plum_bg()
    img = apply_texture(img, tex)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw)

    # Load engraving with luminance-based gold tint
    sign_file = sign if sign != "aries" else "aries-ram"
    eng_path = os.path.join(SIGNS_DIR, f"{sign_file}.png")
    if os.path.exists(eng_path):
        eng = Image.open(eng_path).convert("RGBA")
        eng_size = 300
        eng.thumbnail((eng_size, eng_size), Image.LANCZOS)
        # Create gold-tinted version using luminance
        gray = eng.convert("L")  # luminance
        # Map luminance to gold tones: dark areas stay dark, light areas become gold
        gold_r = gray.point(lambda p: int(GOLD[0] * p / 255))
        gold_g = gray.point(lambda p: int(GOLD[1] * p / 255))
        gold_b = gray.point(lambda p: int(GOLD[2] * p / 255))
        gold_eng = Image.merge("RGB", (gold_r, gold_g, gold_b)).convert("RGBA")
        # Use inverted luminance as alpha so dark bg areas become transparent
        alpha_mask = gray.point(lambda p: min(255, int(p * 1.5)))
        gold_eng.putalpha(alpha_mask)
        ex = (W - gold_eng.width) // 2
        ey = 320
        img.alpha_composite(gold_eng, (ex, ey))

    # Sign name — positioned below engraving with better vertical balance
    font_sign = ImageFont.truetype(DM_SANS, 30)
    y_name = 660
    draw = ImageDraw.Draw(img)  # refresh after composite
    draw_centered_text(draw, sign.upper(), y_name, font_sign, GOLD_DIM)

    # Symbol
    font_sym = ImageFont.truetype(SYMBOLS, 42)
    draw_centered_text(draw, symbol, y_name + 42, font_sym, GOLD)

    # Decorative line
    lw = 60
    draw.line([(W//2 - lw, y_name + 98), (W//2 + lw, y_name + 98)], fill=GOLD_DIM, width=1)

    # Body text
    font_body = ImageFont.truetype(EB_GARAMOND_IT, 48)
    lines = body_text.split("\n")
    y_body = y_name + 120
    for line in lines:
        h = draw_centered_text(draw, line, y_body, font_body, PARCHMENT)
        y_body += h + 16

    # Branding + slide number
    font_brand = ImageFont.truetype(DM_SANS, 20)
    draw.text((50, H - 60), "signseason.com", font=font_brand, fill=GOLD_DIM)
    draw.text((W - 80, H - 60), f"{slide_num}/{total}", font=font_brand, fill=GOLD_DIM)

    return img

def make_cta_slide(tex):
    img = make_plum_bg()
    img = apply_texture(img, tex)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw)

    font_q = ImageFont.truetype(EB_GARAMOND_IT, 52)
    draw_centered_text(draw, "which sign had the", 540, font_q, GOLD_PALE)
    draw_centered_text(draw, "coldest villain arc?", 605, font_q, GOLD_PALE)

    font_dots = ImageFont.truetype(DM_SANS, 24)
    draw_centered_text(draw, "·  ·  ·", 680, font_dots, GOLD_DIM)

    font_cta = ImageFont.truetype(DM_SANS, 28)
    draw_centered_text(draw, "tag them. they already know.", 730, font_cta, GOLD_DIM)

    font_brand = ImageFont.truetype(DM_SANS, 24)
    draw_centered_text(draw, "signseason.com", H - 70, font_brand, GOLD_DIM)

    return img

def generate_all():
    tex = load_texture()
    total = 14  # title + 12 signs + cta

    for platform in ["tiktok", "instagram", "pinterest"]:
        outdir = os.path.expanduser(f"~/.openclaw/workspace/signseason/content/social/slides-2026-04-09-{platform}")
        os.makedirs(outdir, exist_ok=True)

        # Title
        title = make_title_slide(tex)
        title.convert("RGB").save(f"{outdir}/slide-01-title.png", quality=95)

        # Sign slides
        for i, (sign, sym, body) in enumerate(SIGNS):
            slide = make_sign_slide(sign, sym, body, tex, i + 2, total)
            slide.convert("RGB").save(f"{outdir}/slide-{i+2:02d}-{sign}.png", quality=95)

        # CTA
        cta = make_cta_slide(tex)
        cta.convert("RGB").save(f"{outdir}/slide-14-cta.png", quality=95)

        print(f"  {platform}: {total} slides → {outdir}")

if __name__ == "__main__":
    print("Generating Apr 9 slides: Each Sign in Their Villain Era")
    generate_all()
    print("Done!")
