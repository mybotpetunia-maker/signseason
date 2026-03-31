#!/usr/bin/env python3
"""Generate Aries Season Affirmations slides for signseason.com social media."""

import os
import math
from PIL import Image, ImageDraw, ImageFont

# === BRAND SPECS ===
PARCHMENT = (240, 232, 216)       # #F0E8D8 center
EDGE_COLOR = (230, 222, 200)      # #E6DEC8 edges
PLUM = (42, 31, 51)               # #2A1F33 headlines
DEEP_NIGHT = (26, 19, 32)        # #1A1320 body
GOLD = (201, 173, 111)           # #C9AD6F accents
WARM_GRAY = (138, 125, 112)      # #8A7D70 watermark

# Font paths
GEORGIA_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
GEORGIA_ITALIC = "/System/Library/Fonts/Supplemental/Georgia Bold Italic.ttf"
GEORGIA = "/System/Library/Fonts/Supplemental/Georgia.ttf"
HELVETICA = "/System/Library/Fonts/Helvetica.ttc"
APPLE_SYMBOLS = "/System/Library/Fonts/Apple Symbols.ttf"

SLIDES = [
    {"type": "title", "headline": "Aries Season\nAffirmations", "subtitle": "March 21 - April 19"},
    {"type": "quote", "text": "I trust my instincts,\neven when the path\nisn\u2019t clear."},
    {"type": "quote", "text": "My anger is\ninformation,\nnot destruction."},
    {"type": "quote", "text": "I don\u2019t need\npermission to\ntake up space."},
    {"type": "quote", "text": "Starting over is\nnot failure.\nIt\u2019s courage."},
    {"type": "quote", "text": "I lead by being\nexactly who I am."},
    {"type": "cta"},
]

OUTPUT_BASE = "/Users/petunia1/.openclaw/workspace/signseason/content/social/2026-03-31"

PLATFORMS = {
    "tiktok":    {"size": (1080, 1920), "handle": "@sign_season"},
    "instagram": {"size": (1080, 1350), "handle": "@signseasonco"},
    "pinterest": {"size": (1000, 1500), "handle": "signseason.com"},
}


def make_radial_gradient(width, height):
    """Create radial gradient from edge color to parchment center."""
    cx, cy = width / 2, height / 2
    max_dist = math.sqrt(cx**2 + cy**2)
    scale = 4
    sw, sh = width // scale, height // scale
    small = Image.new("RGB", (sw, sh), EDGE_COLOR)
    sp = small.load()
    for y in range(sh):
        for x in range(sw):
            dist = math.sqrt((x * scale - cx)**2 + (y * scale - cy)**2)
            ratio = min(dist / max_dist, 1.0)
            r = int(PARCHMENT[0] + (EDGE_COLOR[0] - PARCHMENT[0]) * ratio)
            g = int(PARCHMENT[1] + (EDGE_COLOR[1] - PARCHMENT[1]) * ratio)
            b = int(PARCHMENT[2] + (EDGE_COLOR[2] - PARCHMENT[2]) * ratio)
            sp[x, y] = (r, g, b)
    return small.resize((width, height), Image.LANCZOS)


def draw_gold_border(draw, width, height, inset=30, thickness=2):
    for i in range(thickness):
        draw.rectangle(
            [inset + i, inset + i, width - inset - 1 - i, height - inset - 1 - i],
            outline=GOLD
        )


def draw_gold_divider(draw, cx, y, length=120, thickness=2):
    draw.line([(cx - length//2, y), (cx + length//2, y)], fill=GOLD, width=thickness)


def draw_gold_diamond(draw, cx, y, size=6):
    draw.polygon([(cx, y - size), (cx + size, y), (cx, y + size), (cx - size, y)], fill=GOLD)


def draw_watermark(draw, width, height, font_size=14):
    try:
        font = ImageFont.truetype(HELVETICA, font_size)
    except:
        font = ImageFont.load_default()
    text = "signseason.com"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (width - tw) // 2
    y = height - 30 - font_size // 2
    draw.text((x, y), text, fill=WARM_GRAY, font=font)


def text_size(draw, text, font):
    """Get width,height of text."""
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def draw_centered_text(draw, text, y, font, fill, width):
    tw, th = text_size(draw, text, font)
    draw.text(((width - tw) // 2, y), text, fill=fill, font=font)
    return th


def multiline_height(draw, text, font, line_spacing=1.35):
    """Calculate total height of multiline text."""
    lines = text.split("\n")
    total = 0
    for i, line in enumerate(lines):
        _, th = text_size(draw, line, font)
        total += th
        if i < len(lines) - 1:
            total += int(th * (line_spacing - 1))
    return total


def draw_multiline_centered(draw, text, y_start, font, fill, width, line_spacing=1.35):
    lines = text.split("\n")
    y = y_start
    for line in lines:
        tw, th = text_size(draw, line, font)
        draw.text(((width - tw) // 2, y), line, fill=fill, font=font)
        y += int(th * line_spacing)
    return y - y_start


def sf(base_size, width, ref_width=1080):
    """Scale font size."""
    return max(12, int(base_size * width / ref_width))


def generate_slide(slide_data, slide_num, width, height, handle):
    img = make_radial_gradient(width, height)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw, width, height)
    cx = width // 2
    cy = height // 2
    slide_type = slide_data["type"]
    
    # Spacing unit proportional to height
    sp = lambda pct: int(height * pct / 100)

    if slide_type == "title":
        sym_size = sf(72, width)
        hl_size = sf(64, width)
        sub_size = sf(28, width)
        try:
            sym_font = ImageFont.truetype(APPLE_SYMBOLS, sym_size)
        except:
            sym_font = ImageFont.truetype(GEORGIA_BOLD, sym_size)
        hl_font = ImageFont.truetype(GEORGIA_BOLD, hl_size)
        sub_font = ImageFont.truetype(GEORGIA, sub_size)

        # Measure all content
        sym_h = text_size(draw, "\u2648", sym_font)[1]
        hl_h = multiline_height(draw, slide_data["headline"], hl_font, 1.25)
        sub_h = text_size(draw, slide_data["subtitle"], sub_font)[1]
        gap = sp(1.2)  # gap between elements
        div_h = 2  # divider line height
        
        total_h = sym_h + gap + div_h + gap + hl_h + gap + div_h + gap + sub_h
        y = (height - total_h) // 2

        draw_centered_text(draw, "\u2648", y, sym_font, GOLD, width)
        y += sym_h + gap
        draw_gold_divider(draw, cx, y, length=sf(120, width))
        y += div_h + gap
        draw_multiline_centered(draw, slide_data["headline"], y, hl_font, PLUM, width, line_spacing=1.25)
        y += hl_h + gap
        draw_gold_divider(draw, cx, y, length=sf(120, width))
        y += div_h + gap
        draw_centered_text(draw, slide_data["subtitle"], y, sub_font, WARM_GRAY, width)

    elif slide_type == "quote":
        qm_size = sf(120, width)
        qt_size = sf(48, width)
        num_size = sf(18, width)
        qm_font = ImageFont.truetype(GEORGIA_BOLD, qm_size)
        qt_font = ImageFont.truetype(GEORGIA_ITALIC, qt_size)
        num_font = ImageFont.truetype(HELVETICA, num_size)

        # Measure
        open_h = text_size(draw, "\u201C", qm_font)[1]
        qt_h = multiline_height(draw, slide_data["text"], qt_font, 1.35)
        close_h = text_size(draw, "\u201D", qm_font)[1]
        diamond_size = sf(6, width)
        gap_small = sp(0.5)
        gap_med = sp(1.0)
        
        # Open quote overlaps a bit — use reduced height
        open_display_h = int(open_h * 0.55)
        total_h = open_display_h + gap_small + qt_h + gap_small + close_h * 0.55 + gap_med + diamond_size * 2
        y = (height - total_h) // 2

        draw_centered_text(draw, "\u201C", y, qm_font, GOLD, width)
        y += open_display_h + gap_small
        draw_multiline_centered(draw, slide_data["text"], y, qt_font, DEEP_NIGHT, width, line_spacing=1.35)
        y += qt_h + gap_small
        draw_centered_text(draw, "\u201D", y, qm_font, GOLD, width)
        y += int(close_h * 0.55) + gap_med
        draw_gold_diamond(draw, cx, y, size=diamond_size)

        # Slide number at bottom
        num_text = f"{slide_num} / 7"
        draw_centered_text(draw, num_text, height - sp(3.5), num_font, WARM_GRAY, width)

    elif slide_type == "cta":
        hl_size = sf(42, width)
        handle_size = sf(36, width)
        body_size = sf(24, width)
        sym_size = sf(56, width)
        hl_font = ImageFont.truetype(GEORGIA_BOLD, hl_size)
        handle_font = ImageFont.truetype(HELVETICA, handle_size)
        body_font = ImageFont.truetype(HELVETICA, body_size)
        try:
            sym_font = ImageFont.truetype(APPLE_SYMBOLS, sym_size)
        except:
            sym_font = ImageFont.truetype(GEORGIA_BOLD, sym_size)

        # Measure
        sym_h = text_size(draw, "\u2648", sym_font)[1]
        save_h = text_size(draw, "Save & Share", hl_font)[1]
        more_h = text_size(draw, "More at signseason.com", body_font)[1]
        handle_h = text_size(draw, handle, handle_font)[1]
        gap = sp(1.5)
        div_h = 2

        total_h = sym_h + gap + div_h + gap + save_h + gap*2 + more_h + gap*2 + handle_h + gap + div_h
        y = (height - total_h) // 2

        draw_centered_text(draw, "\u2648", y, sym_font, GOLD, width)
        y += sym_h + gap
        draw_gold_divider(draw, cx, y, length=sf(160, width))
        y += div_h + gap
        draw_centered_text(draw, "Save & Share", y, hl_font, PLUM, width)
        y += save_h + gap * 2
        draw_centered_text(draw, "More at signseason.com", y, body_font, DEEP_NIGHT, width)
        y += more_h + gap * 2
        draw_centered_text(draw, handle, y, handle_font, GOLD, width)
        y += handle_h + gap
        draw_gold_divider(draw, cx, y, length=sf(160, width))

    draw_watermark(draw, width, height, font_size=sf(14, width))
    return img


def generate_pinterest_pin(width, height, handle):
    """Generate a single combined Pinterest pin with all quotes."""
    img = make_radial_gradient(width, height)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw, width, height, inset=25, thickness=2)
    
    cx = width // 2
    
    sym_size = sf(48, width)
    hl_size = sf(44, width)
    sub_size = sf(20, width)
    qt_size = sf(28, width)
    cta_size = sf(22, width)
    
    try:
        sym_font = ImageFont.truetype(APPLE_SYMBOLS, sym_size)
    except:
        sym_font = ImageFont.truetype(GEORGIA_BOLD, sym_size)
    hl_font = ImageFont.truetype(GEORGIA_BOLD, hl_size)
    sub_font = ImageFont.truetype(GEORGIA, sub_size)
    qt_font = ImageFont.truetype(GEORGIA_ITALIC, qt_size)
    cta_font = ImageFont.truetype(HELVETICA, cta_size)
    
    quotes = [
        "I trust my instincts, even when\nthe path isn\u2019t clear.",
        "My anger is information,\nnot destruction.",
        "I don\u2019t need permission\nto take up space.",
        "Starting over is not failure.\nIt\u2019s courage.",
        "I lead by being\nexactly who I am.",
    ]
    
    # Measure everything first to center
    sym_h = text_size(draw, "\u2648", sym_font)[1]
    hl_h = text_size(draw, "Aries Season Affirmations", hl_font)[1]
    sub_h = text_size(draw, "March 21 - April 19", sub_font)[1]
    cta1_h = text_size(draw, "More at signseason.com", cta_font)[1]
    cta2_h = text_size(draw, handle, cta_font)[1]
    
    quote_heights = [multiline_height(draw, q, qt_font, 1.25) for q in quotes]
    
    gap = 10
    diamond_gap = 18
    div_gap = 15
    
    total_h = (sym_h + gap + hl_h + gap//2 + sub_h + div_gap + 2 + div_gap +
               sum(quote_heights) + len(quotes) * (diamond_gap * 2) +
               div_gap + 2 + div_gap + cta1_h + gap + cta2_h)
    
    y = (height - total_h) // 2
    
    # Title section
    draw_centered_text(draw, "\u2648", y, sym_font, GOLD, width)
    y += sym_h + gap
    draw_centered_text(draw, "Aries Season Affirmations", y, hl_font, PLUM, width)
    y += hl_h + gap // 2
    draw_centered_text(draw, "March 21 - April 19", y, sub_font, WARM_GRAY, width)
    y += sub_h + div_gap
    draw_gold_divider(draw, cx, y, length=int(140 * width / 1000))
    y += 2 + div_gap
    
    # Quotes
    for i, quote in enumerate(quotes):
        h = draw_multiline_centered(draw, quote, y, qt_font, DEEP_NIGHT, width, line_spacing=1.25)
        y += h + diamond_gap
        draw_gold_diamond(draw, cx, y, size=4)
        y += diamond_gap
    
    # CTA
    draw_gold_divider(draw, cx, y, length=int(140 * width / 1000))
    y += 2 + div_gap
    draw_centered_text(draw, "More at signseason.com", y, cta_font, PLUM, width)
    y += cta1_h + gap
    draw_centered_text(draw, handle, y, cta_font, GOLD, width)
    
    draw_watermark(draw, width, height, font_size=sf(13, width, ref_width=1000))
    return img


def main():
    for platform in ["tiktok", "instagram", "pinterest"]:
        os.makedirs(os.path.join(OUTPUT_BASE, platform), exist_ok=True)
    
    for platform_name in ["tiktok", "instagram"]:
        p = PLATFORMS[platform_name]
        w, h = p["size"]
        handle = p["handle"]
        print(f"\n=== Generating {platform_name} ({w}x{h}) ===")
        
        for i, slide_data in enumerate(SLIDES):
            img = generate_slide(slide_data, i + 1, w, h, handle)
            filename = f"slide_{i+1:02d}.png"
            filepath = os.path.join(OUTPUT_BASE, platform_name, filename)
            img.save(filepath, "PNG", optimize=True)
            size_kb = os.path.getsize(filepath) / 1024
            print(f"  {filename}: {size_kb:.0f} KB")
    
    p = PLATFORMS["pinterest"]
    w, h = p["size"]
    handle = p["handle"]
    print(f"\n=== Generating pinterest ({w}x{h}) ===")
    img = generate_pinterest_pin(w, h, handle)
    filepath = os.path.join(OUTPUT_BASE, "pinterest", "slide_01.png")
    img.save(filepath, "PNG", optimize=True)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  slide_01.png: {size_kb:.0f} KB")
    
    print("\n=== SUMMARY ===")
    for platform in ["tiktok", "instagram", "pinterest"]:
        folder = os.path.join(OUTPUT_BASE, platform)
        files = sorted(os.listdir(folder))
        total = sum(os.path.getsize(os.path.join(folder, f)) for f in files)
        print(f"{platform}/: {len(files)} files, {total/1024:.0f} KB total")
        for f in files:
            size = os.path.getsize(os.path.join(folder, f)) / 1024
            print(f"  {f}: {size:.0f} KB")


if __name__ == "__main__":
    main()
