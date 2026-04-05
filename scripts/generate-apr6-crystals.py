#!/usr/bin/env python3
"""April 6 — Aries Season Crystals: PO (Photo + Overlay) style slides."""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os, textwrap

# === Brand colors ===
VOID = (30, 21, 40)
PLUM = (42, 31, 51)
GOLD = (201, 173, 111)
GOLD_LIGHT = (212, 188, 124)
GOLD_PALE = (226, 212, 167)
PARCHMENT = (240, 232, 216)
WHITE = (255, 255, 255)

# === Paths ===
SIGNS_DIR = os.path.expanduser("~/.openclaw/workspace/signseason/assets/illustrations/signs")
TOPICS_DIR = os.path.expanduser("~/.openclaw/workspace/signseason/assets/illustrations/topics")
TEXTURE = os.path.expanduser("~/.openclaw/workspace/signseason/assets/textures/velvet-noise.png")
PFP = os.path.expanduser("~/.openclaw/workspace/signseason/assets/illustrations/pfp-transparent.png")
OUTPUT_BASE = os.path.expanduser("~/.openclaw/workspace/signseason/content/social")

# === Fonts ===
EB_GARAMOND = "/tmp/fonts/EBGaramond.ttf"
EB_GARAMOND_IT = "/tmp/fonts/EBGaramond-Italic.ttf"
FONDAMENTO = "/tmp/fonts/Fondamento-Regular.ttf"
DM_SANS = "/tmp/fonts/DMSans.ttf"
SYMBOLS = "/System/Library/Fonts/Apple Symbols.ttf"

ZODIAC = {
    "aries": ("♈", "aries-ram"), "taurus": ("♉", "taurus"), "gemini": ("♊", "gemini"),
    "cancer": ("♋", "cancer"), "leo": ("♌", "leo"), "virgo": ("♍", "virgo"),
    "libra": ("♎", "libra"), "scorpio": ("♏", "scorpio"), "sagittarius": ("♐", "sagittarius"),
    "capricorn": ("♑", "capricorn"), "aquarius": ("♒", "aquarius"), "pisces": ("♓", "pisces"),
}

# Crystal data: each sign's crystal for Aries season + why
CRYSTAL_DATA = [
    ("aries", "Carnelian", "your season, your stone.\ncarnelian channels all that\nfire without burning bridges."),
    ("taurus", "Black Tourmaline", "aries season is chaos\nfor your nervous system.\nblack tourmaline is your\nenergetic noise-canceling."),
    ("gemini", "Citrine", "your brain is already\nrunning 47 tabs.\ncitrine keeps the right ones open."),
    ("cancer", "Rose Quartz", "aries energy feels abrasive\nto your soft interior.\nrose quartz is the padding."),
    ("leo", "Tiger's Eye", "you love aries season energy\nbut you need to direct it.\ntiger's eye keeps the crown straight."),
    ("virgo", "Amethyst", "your inner critic gets LOUD\nduring aries season.\namethyst tells it to sit down."),
    ("libra", "Lepidolite", "opposite sign season = tension.\nlepidolite smooths the edges\nwithout dulling your sparkle."),
    ("scorpio", "Obsidian", "you already operate in\nthe deep end. obsidian\nkeeps you from drowning in it."),
    ("sagittarius", "Labradorite", "aries season says GO.\nyou were already going.\nlabradorite makes sure\nyou're going somewhere good."),
    ("capricorn", "Garnet", "everyone's being impulsive.\nyou're being strategic.\ngarnet rewards the long game."),
    ("aquarius", "Fluorite", "your ideas multiply in aries season.\nfluorite helps you pick\nthe one worth building."),
    ("pisces", "Moonstone", "aries season is a fire alarm\nfor your water sign soul.\nmoonstone keeps you\nfloating, not fleeing."),
]

def ensure_fonts():
    """Download fonts if not present."""
    os.makedirs("/tmp/fonts", exist_ok=True)
    fonts = {
        "EBGaramond.ttf": "https://github.com/google/fonts/raw/main/ofl/ebgaramond/EBGaramond%5Bwght%5D.ttf",
        "EBGaramond-Italic.ttf": "https://github.com/google/fonts/raw/main/ofl/ebgaramond/EBGaramond-Italic%5Bwght%5D.ttf",
        "Fondamento-Regular.ttf": "https://github.com/google/fonts/raw/main/ofl/fondamento/Fondamento-Regular.ttf",
        "DMSans.ttf": "https://github.com/google/fonts/raw/main/ofl/dmsans/DMSans%5Bopsz%2Cwght%5D.ttf",
    }
    for name, url in fonts.items():
        path = f"/tmp/fonts/{name}"
        if not os.path.exists(path):
            import urllib.request
            urllib.request.urlretrieve(url, path)

def load_texture(size):
    """Load and tile the velvet noise texture."""
    if os.path.exists(TEXTURE):
        tex = Image.open(TEXTURE).convert("RGBA")
        canvas = Image.new("RGBA", size, (0,0,0,0))
        for y in range(0, size[1], tex.height):
            for x in range(0, size[0], tex.width):
                canvas.paste(tex, (x, y))
        return ImageEnhance.Brightness(canvas).enhance(0.3)
    return None

def gradient_bg(size, top_color=VOID, bot_color=PLUM):
    """Create vertical gradient background."""
    img = Image.new("RGB", size, top_color)
    draw = ImageDraw.Draw(img)
    for y in range(size[1]):
        r = int(top_color[0] + (bot_color[0] - top_color[0]) * y / size[1])
        g = int(top_color[1] + (bot_color[1] - top_color[1]) * y / size[1])
        b = int(top_color[2] + (bot_color[2] - top_color[2]) * y / size[1])
        draw.line([(0, y), (size[0], y)], fill=(r, g, b))
    img = img.convert("RGBA")
    tex = load_texture(size)
    if tex:
        img = Image.alpha_composite(img, tex)
    return img

def add_watermark(img, size):
    """Add @signseason watermark at bottom."""
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype(DM_SANS, 28)
    except:
        font = ImageFont.load_default()
    text = "signseason.com"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (size[0] - tw) // 2
    y = size[1] - 60
    draw.text((x, y), text, fill=(*GOLD, 120), font=font)
    return img

def add_pfp_badge(img, size):
    """Add small profile pic badge in corner."""
    if os.path.exists(PFP):
        pfp = Image.open(PFP).convert("RGBA").resize((60, 60), Image.LANCZOS)
        img.paste(pfp, (size[0] - 80, 20), pfp)
    return img

def make_title_slide(size, label):
    """Create the hook/title slide."""
    img = gradient_bg(size)
    draw = ImageDraw.Draw(img)
    
    # Load crystal topic illustration
    crystal_path = os.path.join(TOPICS_DIR, "crystals.png")
    if os.path.exists(crystal_path):
        crystal = Image.open(crystal_path).convert("RGBA")
        # Resize to fit nicely
        max_dim = min(size[0], size[1]) // 2
        crystal.thumbnail((max_dim, max_dim), Image.LANCZOS)
        # Center horizontally, upper third
        cx = (size[0] - crystal.width) // 2
        cy = size[1] // 6
        # Dim it slightly
        enhancer = ImageEnhance.Brightness(crystal)
        crystal = enhancer.enhance(0.6)
        img.paste(crystal, (cx, cy), crystal)
    
    # Title text
    try:
        title_font = ImageFont.truetype(EB_GARAMOND, 72 if size[0] >= 1080 else 64)
        sub_font = ImageFont.truetype(EB_GARAMOND_IT, 36 if size[0] >= 1080 else 30)
    except:
        title_font = ImageFont.load_default()
        sub_font = title_font
    
    title = "the crystal you need\nthis aries season"
    subtitle = "based on your sign"
    
    # Position title in lower half
    title_y = size[1] * 0.55
    for i, line in enumerate(title.split("\n")):
        bbox = draw.textbbox((0, 0), line, font=title_font)
        tw = bbox[2] - bbox[0]
        x = (size[0] - tw) // 2
        # Dark backing
        draw.text((x+2, title_y + i*80 + 2), line, fill=(*VOID, 180), font=title_font)
        draw.text((x, title_y + i*80), line, fill=GOLD_PALE, font=title_font)
    
    sub_y = title_y + len(title.split("\n")) * 80 + 30
    bbox = draw.textbbox((0, 0), subtitle, font=sub_font)
    tw = bbox[2] - bbox[0]
    x = (size[0] - tw) // 2
    draw.text((x, sub_y), subtitle, fill=(*GOLD, 200), font=sub_font)
    
    img = add_pfp_badge(img, size)
    img = add_watermark(img, size)
    return img

def make_sign_slide(size, sign, crystal_name, description):
    """Create a per-sign crystal slide."""
    img = gradient_bg(size)
    draw = ImageDraw.Draw(img)
    
    glyph, filename = ZODIAC[sign]
    
    try:
        glyph_font = ImageFont.truetype(SYMBOLS, 80)
        name_font = ImageFont.truetype(EB_GARAMOND, 56 if size[0] >= 1080 else 48)
        crystal_font = ImageFont.truetype(FONDAMENTO, 44 if size[0] >= 1080 else 38)
        body_font = ImageFont.truetype(EB_GARAMOND_IT, 34 if size[0] >= 1080 else 28)
    except:
        glyph_font = name_font = crystal_font = body_font = ImageFont.load_default()
    
    # Load sign illustration
    sign_img_loaded = None
    sign_path = os.path.join(SIGNS_DIR, f"{filename}.png")
    if os.path.exists(sign_path):
        sign_img_loaded = Image.open(sign_path).convert("RGBA")
        max_dim = min(size[0], size[1]) // 5
        sign_img_loaded.thumbnail((max_dim, max_dim), Image.LANCZOS)
        enhancer = ImageEnhance.Brightness(sign_img_loaded)
        sign_img_loaded = enhancer.enhance(0.25)
    
    # Calculate total content height as ONE unified block:
    # illustration (20px gap) glyph (10px gap) name (30px gap) divider (30px gap) crystal (50px gap) description
    illus_h = (sign_img_loaded.height + 20) if sign_img_loaded else 0
    glyph_h = 90
    name_h = 70
    divider_gap = 30
    divider_h = 30
    crystal_h = 60
    desc_lines = description.split("\n")
    desc_h = len(desc_lines) * 44
    total_h = illus_h + glyph_h + name_h + divider_gap + divider_h + crystal_h + desc_h
    
    # Center entire block (account for footer at bottom)
    footer_reserve = 80
    available_h = size[1] - footer_reserve
    y_cursor = (available_h - total_h) // 2
    y_cursor = max(y_cursor, 40)  # minimum top padding
    
    # Sign illustration (centered, part of the block)
    if sign_img_loaded:
        sx = (size[0] - sign_img_loaded.width) // 2
        img.paste(sign_img_loaded, (sx, y_cursor), sign_img_loaded)
        y_cursor += sign_img_loaded.height + 20
    
    # Zodiac glyph
    bbox = draw.textbbox((0, 0), glyph, font=glyph_font)
    gw = bbox[2] - bbox[0]
    draw.text(((size[0] - gw) // 2, y_cursor), glyph, fill=GOLD, font=glyph_font)
    y_cursor += glyph_h
    
    # Sign name
    sign_upper = sign.upper()
    bbox = draw.textbbox((0, 0), sign_upper, font=name_font)
    nw = bbox[2] - bbox[0]
    draw.text(((size[0] - nw) // 2, y_cursor), sign_upper, fill=PARCHMENT, font=name_font)
    y_cursor += name_h
    
    # Divider line
    line_w = size[0] * 0.3
    lx = (size[0] - line_w) // 2
    draw.line([(lx, y_cursor), (lx + line_w, y_cursor)], fill=(*GOLD, 100), width=1)
    y_cursor += divider_h
    
    # Crystal name
    bbox = draw.textbbox((0, 0), crystal_name, font=crystal_font)
    cw = bbox[2] - bbox[0]
    draw.text(((size[0] - cw) // 2, y_cursor), crystal_name, fill=GOLD_LIGHT, font=crystal_font)
    y_cursor += crystal_h
    
    # Description
    for line in desc_lines:
        bbox = draw.textbbox((0, 0), line, font=body_font)
        lw = bbox[2] - bbox[0]
        draw.text(((size[0] - lw) // 2, y_cursor), line, fill=(*PARCHMENT, 220), font=body_font)
        y_cursor += 44
    
    img = add_watermark(img, size)
    return img

def make_cta_slide(size):
    """Final CTA slide."""
    img = gradient_bg(size)
    draw = ImageDraw.Draw(img)
    
    try:
        title_font = ImageFont.truetype(EB_GARAMOND, 52)
        sub_font = ImageFont.truetype(EB_GARAMOND_IT, 32)
        url_font = ImageFont.truetype(DM_SANS, 36)
    except:
        title_font = sub_font = url_font = ImageFont.load_default()
    
    lines = [
        ("want your full crystal profile?", title_font, GOLD_PALE),
        ("", None, None),
        ("get your free birth chart reading", sub_font, (*PARCHMENT, 200)),
        ("and find out which stones", sub_font, (*PARCHMENT, 200)),
        ("actually work for your placements", sub_font, (*PARCHMENT, 200)),
        ("", None, None),
        ("signseason.com/chart", url_font, GOLD),
    ]
    
    total_height = sum(60 if l[0] else 30 for l in lines)
    y = (size[1] - total_height) // 2
    
    for text, font, color in lines:
        if not text:
            y += 30
            continue
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((size[0] - tw) // 2, y), text, fill=color, font=font)
        y += 60
    
    img = add_pfp_badge(img, size)
    img = add_watermark(img, size)
    return img

def generate_all():
    ensure_fonts()
    
    platforms = {
        "tiktok": (1080, 1920),
        "instagram": (1080, 1350),
        "pinterest": (1000, 1500),
    }
    
    for platform, size in platforms.items():
        out_dir = os.path.join(OUTPUT_BASE, f"slides-2026-04-06-{platform}")
        os.makedirs(out_dir, exist_ok=True)
        
        # Title slide
        title = make_title_slide(size, platform)
        title.convert("RGB").save(os.path.join(out_dir, "slide-01-title.png"), quality=92)
        
        # Per-sign slides
        for i, (sign, crystal, desc) in enumerate(CRYSTAL_DATA):
            slide = make_sign_slide(size, sign, crystal, desc)
            slide.convert("RGB").save(os.path.join(out_dir, f"slide-{i+2:02d}-{sign}.png"), quality=92)
        
        # CTA slide
        cta = make_cta_slide(size)
        cta.convert("RGB").save(os.path.join(out_dir, f"slide-{len(CRYSTAL_DATA)+2:02d}-cta.png"), quality=92)
        
        print(f"  {platform}: {len(CRYSTAL_DATA) + 2} slides → {out_dir}")

if __name__ == "__main__":
    print("Generating April 6 slides: Aries Season Crystals")
    generate_all()
    print("Done!")
