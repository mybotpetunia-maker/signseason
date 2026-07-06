#!/usr/bin/env python3
"""April 19 Editorial Quote: 'What Each Sign Refuses to Say Out Loud'
EQ format: parchment bg, dark text, italic serif style.
TikTok portrait: 1080x1920."""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

# === Brand colors ===
VOID = (30, 21, 40)
PLUM = (42, 31, 51)
GOLD = (201, 173, 111)
GOLD_DIM = (176, 154, 110)
GOLD_PALE = (226, 212, 167)
PARCHMENT = (240, 232, 216)
WARM_GRAY = (138, 125, 112)
DARK_TEXT = (45, 35, 50)
MED_TEXT = (80, 65, 85)

# === Paths ===
TEXTURE = os.path.expanduser("~/.openclaw/workspace/signseason/assets/textures/paper-grain.png")
SIGNS_DIR = os.path.expanduser("~/.openclaw/workspace/signseason/assets/illustrations/signs")

# === Fonts ===
EB_GARAMOND = "/tmp/fonts/EBGaramond.ttf"
EB_GARAMOND_IT = "/tmp/fonts/EBGaramond-Italic.ttf"
FONDAMENTO = "/tmp/fonts/Fondamento-Regular.ttf"
DM_SANS = "/tmp/fonts/DMSans.ttf"
SYMBOLS = "/System/Library/Fonts/Apple Symbols.ttf"

ZODIAC = {
    "aries": "♈", "taurus": "♉", "gemini": "♊", "cancer": "♋",
    "leo": "♌", "virgo": "♍", "libra": "♎", "scorpio": "♏",
    "sagittarius": "♐", "capricorn": "♑", "aquarius": "♒", "pisces": "♓",
}

SIGN_LINES = {
    "aries": "I don't actually know\nwhat I want.\nI'm just moving fast\nso I don't have to think about it.",
    "taurus": "I'm scared it won't\nwork out.\nSo I'm not trying.\nI'm calling it patience.",
    "gemini": "I'm lonely.\nNot bored. Not restless.\nActually lonely.\nAnd I don't know how to say that.",
    "cancer": "I resent people\nI chose to help.\nI did it to myself\nand I'm angry at them anyway.",
    "leo": "I need reassurance\nconstantly.\nNot just occasionally.\nConstantly.",
    "virgo": "I don't actually have it\ntogether.\nThe lists are\nhow I cope.",
    "libra": "I already know\nwhat I want.\nI'm asking your opinion\nso you'll take the blame.",
    "scorpio": "I miss them.\nI won't reach out.\nBut I check.\nEvery single day.",
    "sagittarius": "I'm afraid of\nbeing known.\nNot rejected.\nJust... fully seen.",
    "capricorn": "I don't know\nwho I am\nwhen I'm not\nbeing productive.",
    "aquarius": "I care what\npeople think.\nI've built an entire\nidentity around not caring.",
    "pisces": "I knew it wasn't\ngoing to work.\nI stayed anyway.\nBecause hope is a drug.",
}

OUT_DIR = os.path.expanduser("~/.openclaw/workspace/signseason/content/social/slides-2026-04-19-editorial")
os.makedirs(OUT_DIR, exist_ok=True)

W, H = 1080, 1920

def load_texture(size):
    try:
        tex = Image.open(TEXTURE).convert("RGBA").resize(size, Image.LANCZOS)
        enhancer = ImageEnhance.Brightness(tex)
        tex = enhancer.enhance(1.1)
        return tex
    except:
        return None

def add_ornamental_border(draw, w, h, color=GOLD_DIM, margin=40, thickness=2):
    m = margin
    draw.rectangle([m, m, w-m, h-m], outline=color, width=thickness)
    draw.rectangle([m+8, m+8, w-m-8, h-m-8], outline=(*color[:3], 100), width=1)
    dot_r = 4
    for cx, cy in [(m, m), (w-m, m), (m, h-m), (w-m, h-m)]:
        draw.ellipse([cx-dot_r, cy-dot_r, cx+dot_r, cy+dot_r], fill=color)

def create_title_slide(w=W, h=H):
    img = Image.new("RGBA", (w, h), PARCHMENT)
    tex = load_texture((w, h))
    if tex:
        img = Image.alpha_composite(img, tex)
    draw = ImageDraw.Draw(img)
    add_ornamental_border(draw, w, h)

    # Vertical center block
    center_y = h // 2

    # Top decorative line
    draw.line([(150, center_y - 230), (w-150, center_y - 230)], fill=GOLD_DIM, width=1)

    # Small label above title
    label_font = ImageFont.truetype(DM_SANS, 24)
    label = "SIGN SEASON"
    bbox = draw.textbbox((0, 0), label, font=label_font)
    lw = bbox[2] - bbox[0]
    draw.text(((w - lw) // 2, center_y - 200), label, fill=WARM_GRAY, font=label_font)

    # Main title — Fondamento, large
    title_font = ImageFont.truetype(FONDAMENTO, 72)
    title_lines = ["What Each Sign", "Refuses to Say", "Out Loud"]
    y = center_y - 150
    for line in title_lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        tw = bbox[2] - bbox[0]
        draw.text(((w - tw) // 2, y), line, fill=DARK_TEXT, font=title_font)
        y += 95

    # Subtitle / tagline
    sub_font = ImageFont.truetype(EB_GARAMOND_IT, 36)
    sub = "the thought that lives rent-free at 2am"
    bbox = draw.textbbox((0, 0), sub, font=sub_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, y + 25), sub, fill=MED_TEXT, font=sub_font)

    # Bottom decorative line
    draw.line([(150, y + 90), (w-150, y + 90)], fill=GOLD_DIM, width=1)

    # Footer
    tag_font = ImageFont.truetype(DM_SANS, 22)
    tag = "signseason.com"
    bbox = draw.textbbox((0, 0), tag, font=tag_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, h - 100), tag, fill=GOLD_DIM, font=tag_font)

    return img.convert("RGB")

def create_sign_slide(sign, text, w=W, h=H):
    img = Image.new("RGBA", (w, h), PARCHMENT)
    tex = load_texture((w, h))
    if tex:
        img = Image.alpha_composite(img, tex)
    draw = ImageDraw.Draw(img)
    add_ornamental_border(draw, w, h)

    lines = text.split("\n")
    num_lines = len(lines)

    # Content block — center vertically
    # Approx height: symbol(56) + gap(20) + name(70) + line(30) + quotes(num_lines*65) + engraving(300) + footer
    content_h = 56 + 20 + 70 + 30 + num_lines * 65 + 300
    y_start = max(120, (h - content_h) // 2)

    # Zodiac symbol
    sym_font = ImageFont.truetype(SYMBOLS, 56)
    symbol = ZODIAC[sign]
    bbox = draw.textbbox((0, 0), symbol, font=sym_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, y_start), symbol, fill=GOLD, font=sym_font)

    # Sign name
    name_font = ImageFont.truetype(EB_GARAMOND, 64)
    name = sign.upper()
    bbox = draw.textbbox((0, 0), name, font=name_font)
    tw = bbox[2] - bbox[0]
    y_name = y_start + 76
    draw.text(((w - tw) // 2, y_name), name, fill=DARK_TEXT, font=name_font)

    # Divider
    y_div = y_name + 80
    draw.line([(280, y_div), (w-280, y_div)], fill=GOLD_DIM, width=1)

    # Quote lines — italic, larger for TikTok portrait
    quote_font = ImageFont.truetype(EB_GARAMOND_IT, 46)
    y = y_div + 50
    for line in lines:
        stripped = line.strip()
        if stripped:
            bbox = draw.textbbox((0, 0), stripped, font=quote_font)
            tw = bbox[2] - bbox[0]
            draw.text(((w - tw) // 2, y), stripped, fill=MED_TEXT, font=quote_font)
        y += 65

    # Sign engraving (watermark style)
    sign_files = {
        "aries": "aries-ram", "taurus": "taurus", "gemini": "gemini",
        "cancer": "cancer", "leo": "leo", "virgo": "virgo",
        "libra": "libra", "scorpio": "scorpio", "sagittarius": "sagittarius",
        "capricorn": "capricorn", "aquarius": "aquarius", "pisces": "pisces"
    }
    try:
        sign_file = sign_files.get(sign, sign)
        sign_img_path = os.path.join(SIGNS_DIR, f"{sign_file}.png")
        if os.path.exists(sign_img_path):
            sign_img = Image.open(sign_img_path).convert("RGBA")
            sign_img = sign_img.resize((280, 280), Image.LANCZOS)
            alpha = sign_img.split()[3]
            alpha = alpha.point(lambda p: int(p * 0.15))
            sign_img.putalpha(alpha)
            sx = (w - 280) // 2
            sy = y + 20
            img.paste(sign_img, (sx, sy), sign_img)
            draw = ImageDraw.Draw(img)
    except:
        pass

    # Footer
    tag_font = ImageFont.truetype(DM_SANS, 22)
    tag = "signseason.com"
    bbox = draw.textbbox((0, 0), tag, font=tag_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, h - 100), tag, fill=GOLD_DIM, font=tag_font)

    return img.convert("RGB")

def create_cta_slide(w=W, h=H):
    img = Image.new("RGBA", (w, h), PARCHMENT)
    tex = load_texture((w, h))
    if tex:
        img = Image.alpha_composite(img, tex)
    draw = ImageDraw.Draw(img)
    add_ornamental_border(draw, w, h)

    center_y = h // 2

    # Top line
    draw.line([(150, center_y - 240), (w-150, center_y - 240)], fill=GOLD_DIM, width=1)

    # Main CTA question — italic serif, large
    cta_font = ImageFont.truetype(EB_GARAMOND_IT, 70)
    cta = "which one"
    cta2 = "hit different?"
    bbox = draw.textbbox((0, 0), cta, font=cta_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, center_y - 200), cta, fill=DARK_TEXT, font=cta_font)
    bbox = draw.textbbox((0, 0), cta2, font=cta_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, center_y - 115), cta2, fill=DARK_TEXT, font=cta_font)

    # Divider
    draw.line([(280, center_y - 20), (w-280, center_y - 20)], fill=GOLD_DIM, width=1)

    # Handle
    handle_font = ImageFont.truetype(FONDAMENTO, 42)
    handle = "follow @signseasonco"
    bbox = draw.textbbox((0, 0), handle, font=handle_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, center_y + 20), handle, fill=DARK_TEXT, font=handle_font)

    # URL
    url_font = ImageFont.truetype(DM_SANS, 28)
    url = "signseason.com"
    bbox = draw.textbbox((0, 0), url, font=url_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, center_y + 90), url, fill=WARM_GRAY, font=url_font)

    # Bottom line
    draw.line([(150, center_y + 150), (w-150, center_y + 150)], fill=GOLD_DIM, width=1)

    # Small tagline
    tag_font = ImageFont.truetype(EB_GARAMOND_IT, 30)
    tag = "share this with your person"
    bbox = draw.textbbox((0, 0), tag, font=tag_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, center_y + 190), tag, fill=MED_TEXT, font=tag_font)

    return img.convert("RGB")

# === Generate ===
print("Generating April 19 Editorial Quote slides: What Each Sign Refuses to Say Out Loud")

title = create_title_slide()
title.save(os.path.join(OUT_DIR, "slide-00-title.png"), quality=95)
print("  ✓ Title slide")

signs_order = ["aries", "taurus", "gemini", "cancer", "leo", "virgo",
               "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]

for i, sign in enumerate(signs_order, 1):
    slide = create_sign_slide(sign, SIGN_LINES[sign])
    slide.save(os.path.join(OUT_DIR, f"slide-{i:02d}-{sign}.png"), quality=95)
    print(f"  ✓ {sign}")

cta = create_cta_slide()
cta.save(os.path.join(OUT_DIR, "slide-13-cta.png"), quality=95)
print("  ✓ CTA slide")

print(f"\nAll 14 slides saved to {OUT_DIR}")
