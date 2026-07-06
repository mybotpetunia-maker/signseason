#!/usr/bin/env python3
"""April 7 Editorial Quote: 'The Signs When They Finally Stop Pretending They're Fine'
EQ format: parchment bg, dark text, reflective/emotional tone.
Instagram carousel (1080x1350) + TikTok single (1080x1920)."""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os, textwrap

# === Brand colors ===
VOID = (30, 21, 40)
PLUM = (42, 31, 51)
PLUM_MID = (53, 40, 64)
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

# Each sign gets a short, emotionally honest line
SIGN_LINES = {
    "aries": "stops fighting everyone else's\nbattles and finally sits with\nthe war inside their own head.",
    "taurus": "lets the routine collapse.\nstops cooking. stops cleaning.\njust... sits there. and that's\nwhen you know it's bad.",
    "gemini": "goes quiet. no texts, no memes,\nno deflecting with humor.\nthe silence is the loudest\nthing they've ever said.",
    "cancer": "stops taking care of everyone\nand realizes nobody noticed\nthey were drowning.",
    "leo": "drops the performance.\nno filter, no audience,\njust someone who's exhausted\nfrom being \"on\" all the time.",
    "virgo": "lets the apartment get messy.\nstops fixing everyone.\nadmits they don't have\na plan for this one.",
    "libra": "picks a side. finally says\nwhat they actually feel\ninstead of what will keep\nthe peace.",
    "scorpio": "doesn't push you away.\nthey just... let you in.\nand it terrifies them\nmore than anything.",
    "sagittarius": "stops running.\ncancels the trip.\nstays in one place long enough\nto feel the thing they've\nbeen outrunning.",
    "capricorn": "takes a day off.\nnot a \"working from home\" day.\nan actual day where they\ndo nothing and feel everything.",
    "aquarius": "admits they need someone.\nnot humanity. not a cause.\njust one specific person\nto sit with them.",
    "pisces": "stops romanticizing the pain\nand admits it just hurts.\nno poetry. no deeper meaning.\njust hurt.",
}

OUT_DIR = os.path.expanduser("~/.openclaw/workspace/signseason/content/social/slides-2026-04-07-editorial")
os.makedirs(OUT_DIR, exist_ok=True)

def load_texture(size):
    """Load paper texture and resize."""
    try:
        tex = Image.open(TEXTURE).convert("RGBA").resize(size, Image.LANCZOS)
        enhancer = ImageEnhance.Brightness(tex)
        tex = enhancer.enhance(1.1)
        return tex
    except:
        return None

def add_ornamental_border(draw, w, h, color=GOLD_DIM, margin=40, thickness=2):
    """Thin ornamental border with corner flourishes."""
    m = margin
    # Outer border
    draw.rectangle([m, m, w-m, h-m], outline=color, width=thickness)
    # Inner border
    draw.rectangle([m+8, m+8, w-m-8, h-m-8], outline=(*color[:3], 100), width=1)
    # Corner dots
    dot_r = 4
    for cx, cy in [(m, m), (w-m, m), (m, h-m), (w-m, h-m)]:
        draw.ellipse([cx-dot_r, cy-dot_r, cx+dot_r, cy+dot_r], fill=color)

def create_title_slide(w=1080, h=1350):
    """Title slide for carousel."""
    img = Image.new("RGBA", (w, h), PARCHMENT)
    tex = load_texture((w, h))
    if tex:
        img = Image.alpha_composite(img, tex)
    draw = ImageDraw.Draw(img)
    
    add_ornamental_border(draw, w, h)
    
    # Center content vertically in frame
    content_start = (h - 400) // 2  # Center a ~400px content block
    
    # Decorative line
    y_line = content_start
    draw.line([(200, y_line), (w-200, y_line)], fill=GOLD_DIM, width=1)
    
    # Title
    title_font = ImageFont.truetype(EB_GARAMOND_IT, 52)
    title_lines = ["the signs when they", "finally stop pretending", "they're fine"]
    y = y_line + 40
    for line in title_lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        tw = bbox[2] - bbox[0]
        draw.text(((w - tw) // 2, y), line, fill=DARK_TEXT, font=title_font)
        y += 65
    
    # Subtitle
    sub_font = ImageFont.truetype(DM_SANS, 28)
    sub = "because everyone breaks differently"
    bbox = draw.textbbox((0, 0), sub, font=sub_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, y + 30), sub, fill=WARM_GRAY, font=sub_font)
    
    # Bottom decorative line
    draw.line([(200, y + 85), (w-200, y + 85)], fill=GOLD_DIM, width=1)
    
    # signseason.com at bottom
    tag_font = ImageFont.truetype(DM_SANS, 20)
    tag = "signseason.com"
    bbox = draw.textbbox((0, 0), tag, font=tag_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, h - 80), tag, fill=GOLD_DIM, font=tag_font)
    
    # PFP
    try:
        pfp = Image.open(PFP).convert("RGBA").resize((60, 60), Image.LANCZOS)
        img.paste(pfp, ((w - 60) // 2, h - 160), pfp)
    except:
        pass
    
    return img.convert("RGB")

def create_sign_slide(sign, text, w=1080, h=1350):
    """Individual sign slide."""
    img = Image.new("RGBA", (w, h), PARCHMENT)
    tex = load_texture((w, h))
    if tex:
        img = Image.alpha_composite(img, tex)
    draw = ImageDraw.Draw(img)
    
    add_ornamental_border(draw, w, h)
    
    # Calculate content height to center vertically
    lines = text.split("\n")
    num_lines = len(lines)
    # Approx: symbol(48) + gap(20) + name(56) + gap(15) + line(1) + gap(30) + text(num_lines*55) + gap(40) + illustration(250)
    content_h = 48 + 20 + 56 + 15 + 1 + 30 + num_lines * 55 + 40 + 250
    y_start = max(100, (h - content_h) // 2)
    
    # Zodiac symbol
    sym_font = ImageFont.truetype(SYMBOLS, 48)
    symbol = ZODIAC[sign]
    bbox = draw.textbbox((0, 0), symbol, font=sym_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, y_start), symbol, fill=GOLD, font=sym_font)
    
    # Sign name
    name_font = ImageFont.truetype(EB_GARAMOND, 56)
    name = sign.upper()
    bbox = draw.textbbox((0, 0), name, font=name_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, y_start + 68), name, fill=DARK_TEXT, font=name_font)
    
    # Decorative line
    draw.line([(300, y_start + 145), (w-300, y_start + 145)], fill=GOLD_DIM, width=1)
    
    # Quote text (italic, centered) — BELOW line, NO illustration overlap
    quote_font = ImageFont.truetype(EB_GARAMOND_IT, 38)
    y = y_start + 180
    for line in lines:
        bbox = draw.textbbox((0, 0), line.strip(), font=quote_font)
        tw = bbox[2] - bbox[0]
        draw.text(((w - tw) // 2, y), line.strip(), fill=MED_TEXT, font=quote_font)
        y += 55
    
    # Sign illustration BELOW text (small, faded, decorative)
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
    
    # signseason.com
    tag_font = ImageFont.truetype(DM_SANS, 20)
    tag = "signseason.com"
    bbox = draw.textbbox((0, 0), tag, font=tag_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, h - 80), tag, fill=GOLD_DIM, font=tag_font)
    
    return img.convert("RGB")

def create_tiktok_compilation(w=1080, h=1920):
    """Single TikTok slide with 4 signs featured."""
    img = Image.new("RGBA", (w, h), PARCHMENT)
    tex = load_texture((w, h))
    if tex:
        img = Image.alpha_composite(img, tex)
    draw = ImageDraw.Draw(img)
    
    add_ornamental_border(draw, w, h, margin=30)
    
    # Title — extra top padding for platform UI overlays
    title_font = ImageFont.truetype(EB_GARAMOND_IT, 44)
    title = "the signs when they stop pretending"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, 180), title, fill=DARK_TEXT, font=title_font)
    
    # Show 4 featured signs — distribute evenly
    featured = ["cancer", "scorpio", "gemini", "capricorn"]
    sym_font = ImageFont.truetype(SYMBOLS, 36)
    name_font = ImageFont.truetype(EB_GARAMOND, 40)
    quote_font = ImageFont.truetype(EB_GARAMOND_IT, 30)
    tag_font = ImageFont.truetype(DM_SANS, 22)
    
    y = 320
    for sign in featured:
        # Symbol + name
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
        
        # Quote lines
        text = SIGN_LINES[sign]
        lines = text.split("\n")
        qy = y + 55
        for line in lines:
            bbox = draw.textbbox((0, 0), line.strip(), font=quote_font)
            tw = bbox[2] - bbox[0]
            draw.text(((w - tw) // 2, qy), line.strip(), fill=MED_TEXT, font=quote_font)
            qy += 38
        
        # Separator
        y = qy + 30
        draw.line([(350, y), (w-350, y)], fill=GOLD_DIM, width=1)
        y += 35
    
    # CTA
    cta = "swipe for all 12 signs → signseason.com"
    bbox = draw.textbbox((0, 0), cta, font=tag_font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) // 2, h - 100), cta, fill=GOLD_DIM, font=tag_font)
    
    return img.convert("RGB")

# === Generate all slides ===
print("Generating April 7 Editorial Quote slides...")

# Title
title = create_title_slide()
title.save(os.path.join(OUT_DIR, "slide-00-title.png"), quality=95)
print("  ✓ Title slide")

# Individual sign slides
signs_order = ["aries", "taurus", "gemini", "cancer", "leo", "virgo",
               "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]

for i, sign in enumerate(signs_order, 1):
    slide = create_sign_slide(sign, SIGN_LINES[sign])
    slide.save(os.path.join(OUT_DIR, f"slide-{i:02d}-{sign}.png"), quality=95)
    print(f"  ✓ {sign}")

# TikTok compilation
tiktok = create_tiktok_compilation()
tiktok.save(os.path.join(OUT_DIR, "tiktok-compilation.png"), quality=95)
print("  ✓ TikTok compilation")

print(f"\nAll slides saved to {OUT_DIR}")
print(f"Total: 1 title + 12 signs + 1 TikTok = 14 images")
