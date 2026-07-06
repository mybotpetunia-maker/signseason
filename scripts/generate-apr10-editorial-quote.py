#!/usr/bin/env python3
"""April 10 Editorial Quote: 'What Each Sign Needs to Hear Right Now'
EQ format: parchment bg, dark text, reflective/emotional tone.
Instagram carousel (1080x1350) + TikTok single (1080x1920)."""

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
PFP = os.path.expanduser("~/.openclaw/workspace/signseason/assets/illustrations/pfp-transparent.png")
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

# Each sign gets a short, honest message they need right now
SIGN_LINES = {
    "aries": "you don't have to earn rest.\nyou're not falling behind.\nyou're allowed to slow down\nwithout calling it weakness.",
    "taurus": "the thing you're holding onto\nbecause it's familiar isn't the\nsame as the thing that's\ngood for you. you know this.",
    "gemini": "you don't owe anyone\nthe entertaining version of you.\nthe quiet one is just\nas worth knowing.",
    "cancer": "you can't love someone\ninto choosing you.\nsome doors close because\nyou deserve an open one.",
    "leo": "the people who matter\nalready see you.\nyou don't have to\nperform to be loved.",
    "virgo": "the plan falling apart\nisn't proof you failed.\nit's proof you're human.\nthat was always the point.",
    "libra": "choosing yourself isn't selfish.\nit's the thing you've been\navoiding because it means\nsomeone might be disappointed.",
    "scorpio": "not everyone who gets close\nis going to leave.\nsome people actually mean it\nwhen they stay.",
    "sagittarius": "running from the feeling\ndoesn't make it smaller.\nit just means it's waiting\nwherever you land next.",
    "capricorn": "your worth isn't your output.\nthe world won't collapse\nif you take a breath.\nit might actually get better.",
    "aquarius": "you can care about something\nwithout understanding it.\nsome things don't need\na theory. they just need you.",
    "pisces": "you're not too much.\nyou never were.\nthe right people don't need\nyou to shrink.",
}

OUT_DIR = os.path.expanduser("~/.openclaw/workspace/signseason/content/social/slides-2026-04-10-editorial")
os.makedirs(OUT_DIR, exist_ok=True)

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

def create_title_slide(w=1080, h=1350):
    img = Image.new("RGBA", (w, h), PARCHMENT)
    tex = load_texture((w, h))
    if tex:
        img = Image.alpha_composite(img, tex)
    draw = ImageDraw.Draw(img)
    add_ornamental_border(draw, w, h)

    content_start = (h - 400) // 2
    y_line = content_start
    draw.line([(200, y_line), (w-200, y_line)], fill=GOLD_DIM, width=1)

    title_font = ImageFont.truetype(EB_GARAMOND_IT, 52)
    title_lines = ["what each sign needs", "to hear right now"]
    y = y_line + 50
    for line in title_lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        tw = bbox[2] - bbox[0]
        draw.text(((w - tw) // 2, y), line, fill=DARK_TEXT, font=title_font)
        y += 70

    sub_font = ImageFont.truetype(DM_SANS, 28)
    sub = "because sometimes the universe texts back"
    bbox = draw.textbbox((0, 0), sub, font=sub_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, y + 30), sub, fill=WARM_GRAY, font=sub_font)

    draw.line([(200, y + 90), (w-200, y + 90)], fill=GOLD_DIM, width=1)

    tag_font = ImageFont.truetype(DM_SANS, 20)
    tag = "signseason.com"
    bbox = draw.textbbox((0, 0), tag, font=tag_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, h - 80), tag, fill=GOLD_DIM, font=tag_font)

    try:
        pfp = Image.open(PFP).convert("RGBA").resize((60, 60), Image.LANCZOS)
        img.paste(pfp, ((w - 60) // 2, h - 160), pfp)
    except:
        pass

    return img.convert("RGB")

def create_sign_slide(sign, text, w=1080, h=1350):
    img = Image.new("RGBA", (w, h), PARCHMENT)
    tex = load_texture((w, h))
    if tex:
        img = Image.alpha_composite(img, tex)
    draw = ImageDraw.Draw(img)
    add_ornamental_border(draw, w, h)

    lines = text.split("\n")
    num_lines = len(lines)
    content_h = 48 + 20 + 56 + 15 + 1 + 30 + num_lines * 55 + 40 + 250
    y_start = max(100, (h - content_h) // 2)

    sym_font = ImageFont.truetype(SYMBOLS, 48)
    symbol = ZODIAC[sign]
    bbox = draw.textbbox((0, 0), symbol, font=sym_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, y_start), symbol, fill=GOLD, font=sym_font)

    name_font = ImageFont.truetype(EB_GARAMOND, 56)
    name = sign.upper()
    bbox = draw.textbbox((0, 0), name, font=name_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, y_start + 68), name, fill=DARK_TEXT, font=name_font)

    draw.line([(300, y_start + 145), (w-300, y_start + 145)], fill=GOLD_DIM, width=1)

    quote_font = ImageFont.truetype(EB_GARAMOND_IT, 38)
    y = y_start + 180
    for line in lines:
        bbox = draw.textbbox((0, 0), line.strip(), font=quote_font)
        tw = bbox[2] - bbox[0]
        draw.text(((w - tw) // 2, y), line.strip(), fill=MED_TEXT, font=quote_font)
        y += 55

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
            sign_img = sign_img.resize((250, 250), Image.LANCZOS)
            alpha = sign_img.split()[3]
            alpha = alpha.point(lambda p: int(p * 0.18))
            sign_img.putalpha(alpha)
            sx = (w - 250) // 2
            sy = y + 25
            img.paste(sign_img, (sx, sy), sign_img)
            draw = ImageDraw.Draw(img)
    except:
        pass

    tag_font = ImageFont.truetype(DM_SANS, 20)
    tag = "signseason.com"
    bbox = draw.textbbox((0, 0), tag, font=tag_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, h - 80), tag, fill=GOLD_DIM, font=tag_font)

    return img.convert("RGB")

def create_tiktok_compilation(w=1080, h=1920):
    img = Image.new("RGBA", (w, h), PARCHMENT)
    tex = load_texture((w, h))
    if tex:
        img = Image.alpha_composite(img, tex)
    draw = ImageDraw.Draw(img)
    add_ornamental_border(draw, w, h, margin=30)

    title_font = ImageFont.truetype(EB_GARAMOND_IT, 44)
    title = "what each sign needs to hear"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, 180), title, fill=DARK_TEXT, font=title_font)

    featured = ["aries", "cancer", "leo", "pisces"]
    sym_font = ImageFont.truetype(SYMBOLS, 36)
    name_font = ImageFont.truetype(EB_GARAMOND, 40)
    quote_font = ImageFont.truetype(EB_GARAMOND_IT, 30)
    tag_font = ImageFont.truetype(DM_SANS, 22)

    y = 320
    for sign in featured:
        symbol = ZODIAC[sign]
        name = sign.upper()
        sym_bbox = draw.textbbox((0, 0), symbol, font=sym_font)
        sym_w = sym_bbox[2] - sym_bbox[0]
        name_bbox = draw.textbbox((0, 0), name, font=name_font)
        name_w = name_bbox[2] - name_bbox[0]
        total_w = sym_w + 15 + name_w
        sx = (w - total_w) // 2
        draw.text((sx, y), symbol, fill=GOLD, font=sym_font)
        draw.text((sx + sym_w + 15, y - 2), name, fill=DARK_TEXT, font=name_font)

        text = SIGN_LINES[sign]
        lines = text.split("\n")
        qy = y + 55
        for line in lines:
            bbox = draw.textbbox((0, 0), line.strip(), font=quote_font)
            tw = bbox[2] - bbox[0]
            draw.text(((w - tw) // 2, qy), line.strip(), fill=MED_TEXT, font=quote_font)
            qy += 38

        y = qy + 30
        draw.line([(350, y), (w-350, y)], fill=GOLD_DIM, width=1)
        y += 35

    cta = "swipe for all 12 signs → signseason.com"
    bbox = draw.textbbox((0, 0), cta, font=tag_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, h - 100), cta, fill=GOLD_DIM, font=tag_font)

    return img.convert("RGB")

# === Generate ===
print("Generating April 10 Editorial Quote slides...")

title = create_title_slide()
title.save(os.path.join(OUT_DIR, "slide-00-title.png"), quality=95)
print("  ✓ Title slide")

signs_order = ["aries", "taurus", "gemini", "cancer", "leo", "virgo",
               "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]

for i, sign in enumerate(signs_order, 1):
    slide = create_sign_slide(sign, SIGN_LINES[sign])
    slide.save(os.path.join(OUT_DIR, f"slide-{i:02d}-{sign}.png"), quality=95)
    print(f"  ✓ {sign}")

tiktok = create_tiktok_compilation()
tiktok.save(os.path.join(OUT_DIR, "tiktok-compilation.png"), quality=95)
print("  ✓ TikTok compilation")

print(f"\nAll slides saved to {OUT_DIR}")
print(f"Total: 1 title + 12 signs + 1 TikTok = 14 images")
