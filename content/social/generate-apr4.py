#!/usr/bin/env python3
"""Generate April 4 social slides: EI (Engraving Illustration) — What Your Sign Secretly Wants to Hear
Light parchment backgrounds + DALL-E engraving hero illustration."""

import os
import json
import math
import base64
import urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# === BRAND SPECS — LIGHT PALETTE ===
PARCHMENT = (240, 232, 216)       # #F0E8D8 center
EDGE_COLOR = (230, 222, 200)      # #E6DEC8 edges
PLUM = (42, 31, 51)               # #2A1F33 headlines
DEEP_NIGHT = (26, 19, 32)        # #1A1320 body
GOLD = (201, 173, 111)           # #C9AD6F accents
WARM_GRAY = (138, 125, 112)      # #8A7D70 watermark/secondary
SOFT_GOLD = (218, 195, 145)      # lighter gold for borders on light bg

# Font paths
GEORGIA_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
GEORGIA_ITALIC = "/System/Library/Fonts/Supplemental/Georgia Bold Italic.ttf"
GEORGIA = "/System/Library/Fonts/Supplemental/Georgia.ttf"
HELVETICA = "/System/Library/Fonts/Helvetica.ttc"
APPLE_SYMBOLS = "/System/Library/Fonts/Apple Symbols.ttf"

BASE_DIR = "/Users/petunia1/.openclaw/workspace/signseason/content/social"

# Content — punchy, group-chat energy, what each sign secretly needs to hear
SIGN_DATA = [
    {"sign": "Aries", "symbol": "\u2648", "wants": "you don't have to\nfight for love.\nsome people will just\ngive it to you."},
    {"sign": "Taurus", "symbol": "\u2649", "wants": "it's okay to want\nmore than what's\ncomfortable.\nyou won't lose\neverything by changing."},
    {"sign": "Gemini", "symbol": "\u264a", "wants": "you're not 'too much.'\nthe right people\nwill want every\nversion of you."},
    {"sign": "Cancer", "symbol": "\u264b", "wants": "you can put\nyourself first\nand still be\na good person."},
    {"sign": "Leo", "symbol": "\u264c", "wants": "you don't have to\nperform to be loved.\nyou being quiet\nis enough too."},
    {"sign": "Virgo", "symbol": "\u264d", "wants": "rest is not laziness.\nyou've already\nproven yourself.\nyou can stop now."},
    {"sign": "Libra", "symbol": "\u264e", "wants": "your needs aren't\nan inconvenience.\nstop shrinking\nso others fit."},
    {"sign": "Scorpio", "symbol": "\u264f", "wants": "not everyone\nis going to betray you.\nlet someone in\nbefore you run out\nof walls to build."},
    {"sign": "Sagittarius", "symbol": "\u2650", "wants": "staying doesn't mean\nyou're trapped.\nsome roots\ngrow into wings."},
    {"sign": "Capricorn", "symbol": "\u2651", "wants": "you are more\nthan your work.\npeople love YOU,\nnot your resume."},
    {"sign": "Aquarius", "symbol": "\u2652", "wants": "you don't have to\nunderstand your feelings\nto let yourself\nhave them."},
    {"sign": "Pisces", "symbol": "\u2653", "wants": "you're allowed to\nset boundaries\nwithout feeling guilty.\nyour softness\nis not weakness."},
]


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
    y = height - 50
    draw.text((x, y), text, fill=WARM_GRAY, font=font)


def text_size(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def sf(base_size, width, ref_width=1080):
    return max(12, int(base_size * width / ref_width))


def generate_dalle_illustration():
    """Generate celestial engraving illustration via DALL-E."""
    output_path = os.path.join(BASE_DIR, "dalle-celestial-ear-apr4.png")
    if os.path.exists(output_path):
        print(f"Illustration already exists: {output_path}")
        return output_path

    api_key = os.environ.get("OPENAI_API_KEY")
    prompt = (
        "A vintage astronomical engraving illustration of a celestial figure whispering secrets "
        "into the ear of the cosmos. Stipple engraving style with fine crosshatching and line work. "
        "Stars and constellation lines in the background. Classical 18th century scientific illustration "
        "aesthetic. Gold and cream tones on a warm ivory parchment background. Elegant, mystical, "
        "detailed. No text, no words, no letters."
    )

    payload = json.dumps({
        "model": "gpt-image-1",
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024",
        "quality": "high"
    }).encode()

    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    )

    print("Generating DALL-E celestial illustration...")
    resp = urllib.request.urlopen(req, timeout=120)
    data = json.loads(resp.read())

    if data["data"][0].get("b64_json"):
        img_data = base64.b64decode(data["data"][0]["b64_json"])
        with open(output_path, "wb") as f:
            f.write(img_data)
    elif data["data"][0].get("url"):
        img_resp = urllib.request.urlopen(data["data"][0]["url"], timeout=60)
        with open(output_path, "wb") as f:
            f.write(img_resp.read())

    print(f"Saved illustration: {output_path}")
    return output_path


def composite_illustration(bg_img, illustration, width, height, max_illust_h_pct=0.35):
    """Place the engraving illustration onto the parchment background, centered in upper portion."""
    img = bg_img.copy()
    illust = illustration.copy()

    # Resize illustration to fit
    max_h = int(height * max_illust_h_pct)
    max_w = int(width * 0.6)
    illust_ratio = illust.width / illust.height
    if illust.height > max_h:
        illust = illust.resize((int(max_h * illust_ratio), max_h), Image.LANCZOS)
    if illust.width > max_w:
        illust = illust.resize((max_w, int(max_w / illust_ratio)), Image.LANCZOS)

    # Center horizontally, position based on canvas height
    x = (width - illust.width) // 2
    is_tall = height / width > 1.5
    y = int(height * 0.22) if is_tall else int(height * 0.12)

    # Blend with parchment — make illustration semi-transparent for elegance
    if illust.mode != "RGBA":
        illust = illust.convert("RGBA")
    
    img = img.convert("RGBA")
    img.paste(illust, (x, y), illust)
    return img.convert("RGB")


def generate_title_slide(width, height, illustration, output_path):
    """Title slide with engraving illustration on parchment."""
    bg = make_radial_gradient(width, height)
    # Scale illustration and position based on aspect ratio
    is_tall = height / width > 1.5  # 9:16 story format
    illust_pct = 0.25 if is_tall else 0.30
    img = composite_illustration(bg, illustration, width, height, max_illust_h_pct=illust_pct)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw, width, height)

    cx = width // 2
    # For tall formats, push everything down more to center the content group
    text_y = int(height * 0.60) if is_tall else int(height * 0.55)

    # Title
    title_size = sf(50, width)
    title_font = ImageFont.truetype(GEORGIA_BOLD, title_size)
    sub_size = sf(22, width)
    sub_font = ImageFont.truetype(GEORGIA_ITALIC, sub_size)
    tag_size = sf(18, width)
    tag_font = ImageFont.truetype(GEORGIA, tag_size)

    # "WHAT YOUR SIGN"
    t1 = "WHAT YOUR SIGN"
    tw1, th1 = text_size(draw, t1, title_font)
    draw.text(((width - tw1) // 2, text_y), t1, fill=PLUM, font=title_font)

    # "SECRETLY WANTS"
    t2 = "SECRETLY WANTS"
    tw2, th2 = text_size(draw, t2, title_font)
    draw.text(((width - tw2) // 2, text_y + th1 + 10), t2, fill=PLUM, font=title_font)

    # "TO HEAR"
    t3 = "TO HEAR"
    tw3, th3 = text_size(draw, t3, title_font)
    draw.text(((width - tw3) // 2, text_y + th1 + th2 + 20), t3, fill=PLUM, font=title_font)

    # Divider
    div_y = text_y + th1 + th2 + th3 + 50
    draw_gold_divider(draw, cx, div_y, length=sf(120, width))

    # Subtitle
    sub_text = "the words you're waiting for"
    stw, sth = text_size(draw, sub_text, sub_font)
    draw.text(((width - stw) // 2, div_y + 20), sub_text, fill=WARM_GRAY, font=sub_font)

    draw_watermark(draw, width, height)
    img.save(output_path, "PNG", optimize=True)


def generate_sign_slide(width, height, sign_data, slide_num, total, output_path):
    """Individual sign slide — parchment bg, dark text, gold accents."""
    img = make_radial_gradient(width, height)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw, width, height)

    cx = width // 2
    cy = int(height * 0.54)  # shifted down for better vertical centering

    # Symbol
    sym_size = sf(64, width)
    try:
        sym_font = ImageFont.truetype(APPLE_SYMBOLS, sym_size)
    except:
        sym_font = ImageFont.truetype(GEORGIA_BOLD, sym_size)

    sym_w, sym_h = text_size(draw, sign_data["symbol"], sym_font)
    
    # Sign name
    name_size = sf(28, width)
    name_font = ImageFont.truetype(GEORGIA_BOLD, name_size)
    name_w, name_h = text_size(draw, sign_data["sign"].upper(), name_font)
    
    # Header: "secretly wants to hear"
    header_size = sf(16, width)
    header_font = ImageFont.truetype(GEORGIA_ITALIC, header_size)
    header_text = "secretly wants to hear"
    header_w, header_h = text_size(draw, header_text, header_font)
    
    # Main quote text
    quote_size = sf(38, width)
    quote_font = ImageFont.truetype(GEORGIA_ITALIC, quote_size)
    lines = sign_data["wants"].split('\n')
    line_heights = [text_size(draw, line, quote_font)[1] for line in lines]
    line_spacing = 1.3
    total_quote_h = sum(line_heights) + int(line_heights[0] * (line_spacing - 1)) * (len(lines) - 1)

    # Layout: measure total content height for vertical centering
    gap1 = sf(10, width)   # sym to name
    gap2 = sf(8, width)    # name to header
    gap3 = sf(20, width)   # header to divider
    div_h = 2
    gap4 = sf(20, width)   # divider to quote

    total_h = sym_h + gap1 + name_h + gap2 + header_h + gap3 + div_h + gap4 + total_quote_h
    start_y = (height - total_h) // 2 + int(height * 0.03)  # nudge down 3% for balance

    # Draw symbol
    draw.text(((width - sym_w) // 2, start_y), sign_data["symbol"], fill=GOLD, font=sym_font)
    y = start_y + sym_h + gap1

    # Draw sign name
    draw.text(((width - name_w) // 2, y), sign_data["sign"].upper(), fill=PLUM, font=name_font)
    y += name_h + gap2

    # Draw header
    draw.text(((width - header_w) // 2, y), header_text, fill=WARM_GRAY, font=header_font)
    y += header_h + gap3

    # Divider
    draw_gold_divider(draw, cx, y, length=sf(100, width))
    y += div_h + gap4

    # Draw quote lines
    for line in lines:
        lw, lh = text_size(draw, line, quote_font)
        draw.text(((width - lw) // 2, y), line, fill=DEEP_NIGHT, font=quote_font)
        y += int(lh * line_spacing)

    # Slide number
    num_size = sf(14, width)
    try:
        num_font = ImageFont.truetype(HELVETICA, num_size)
    except:
        num_font = ImageFont.load_default()
    num_text = f"{slide_num} / {total}"
    nw, nh = text_size(draw, num_text, num_font)
    draw.text(((width - nw) // 2, height - 70), num_text, fill=(110, 98, 86), font=num_font)  # darker for legibility

    draw_watermark(draw, width, height)
    img.save(output_path, "PNG", optimize=True)


def generate_cta_slide(width, height, illustration, handle, output_path):
    """CTA slide with illustration on parchment."""
    bg = make_radial_gradient(width, height)
    # Smaller illustration for CTA
    img = composite_illustration(bg, illustration, width, height, max_illust_h_pct=0.30)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw, width, height)

    cx = width // 2
    text_y = int(height * 0.50)

    title_size = sf(40, width)
    title_font = ImageFont.truetype(GEORGIA_BOLD, title_size)
    sub_size = sf(22, width)
    sub_font = ImageFont.truetype(GEORGIA, sub_size)
    handle_size = sf(28, width)
    handle_font = ImageFont.truetype(GEORGIA_BOLD, handle_size)

    # "save this"
    t1 = "save this"
    tw1, th1 = text_size(draw, t1, title_font)
    draw.text(((width - tw1) // 2, text_y), t1, fill=PLUM, font=title_font)

    # Divider
    draw_gold_divider(draw, cx, text_y + th1 + 20, length=sf(120, width))

    # "send it to the friend who needs it"
    t2 = "send it to the friend"
    tw2, th2 = text_size(draw, t2, sub_font)
    draw.text(((width - tw2) // 2, text_y + th1 + 50), t2, fill=DEEP_NIGHT, font=sub_font)

    t3 = "who needs it"
    tw3, th3 = text_size(draw, t3, sub_font)
    draw.text(((width - tw3) // 2, text_y + th1 + 50 + th2 + 8), t3, fill=DEEP_NIGHT, font=sub_font)

    # Handle
    htw, hth = text_size(draw, handle, handle_font)
    draw.text(((width - htw) // 2, text_y + th1 + 50 + th2 + th3 + 40), handle, fill=GOLD, font=handle_font)

    # "signseason.com"
    site_size = sf(18, width)
    site_font = ImageFont.truetype(GEORGIA, site_size)
    site = "signseason.com"
    stw, sth = text_size(draw, site, site_font)
    draw.text(((width - stw) // 2, text_y + th1 + 50 + th2 + th3 + 40 + hth + 15), site, fill=WARM_GRAY, font=site_font)

    draw_watermark(draw, width, height)
    img.save(output_path, "PNG", optimize=True)


def generate_pinterest_pin(illustration, output_path):
    """Pinterest pin — parchment bg, 4 preview signs, engraving at top."""
    width, height = 1000, 1500
    bg = make_radial_gradient(width, height)
    img = composite_illustration(bg, illustration, width, height, max_illust_h_pct=0.12)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw, width, height, inset=25)

    cx = width // 2

    # Title well below illustration — ensure no overlap
    # Illustration: starts at 8% height, max 12% height = ends at ~20% height
    # Title must start below that with clear gap
    title_y = int(height * 0.25)
    title_font = ImageFont.truetype(GEORGIA_BOLD, 36)
    sub_font = ImageFont.truetype(GEORGIA_ITALIC, 16)

    t1 = "WHAT YOUR SIGN"
    tw1, th1 = text_size(draw, t1, title_font)
    draw.text(((width - tw1) // 2, title_y), t1, fill=PLUM, font=title_font)

    t2 = "SECRETLY WANTS TO HEAR"
    tw2, th2 = text_size(draw, t2, title_font)
    draw.text(((width - tw2) // 2, title_y + th1 + 5), t2, fill=PLUM, font=title_font)

    draw_gold_divider(draw, cx, title_y + th1 + th2 + 25, length=120)

    sub = "the words you're waiting for"
    stw, sth = text_size(draw, sub, sub_font)
    draw.text(((width - stw) // 2, title_y + th1 + th2 + 40), sub, fill=WARM_GRAY, font=sub_font)

    # Preview 4 signs
    preview_signs = [SIGN_DATA[0], SIGN_DATA[3], SIGN_DATA[7], SIGN_DATA[9]]  # Aries, Cancer, Scorpio, Capricorn
    y_start = title_y + th1 + th2 + 80
    
    sign_font = ImageFont.truetype(GEORGIA_BOLD, 20)
    text_font = ImageFont.truetype(GEORGIA_ITALIC, 16)
    symbol_font = ImageFont.truetype(APPLE_SYMBOLS, 28)

    for i, sd in enumerate(preview_signs):
        y = y_start + i * 220

        # Symbol + name
        sym_w, sym_h = text_size(draw, sd["symbol"], symbol_font)
        draw.text(((width - sym_w) // 2, y), sd["symbol"], fill=GOLD, font=symbol_font)

        name_w, name_h = text_size(draw, sd["sign"].upper(), sign_font)
        draw.text(((width - name_w) // 2, y + sym_h + 5), sd["sign"].upper(), fill=PLUM, font=sign_font)

        # Quote lines (first 2-3 lines only for space, add ellipsis)
        all_lines = sd["wants"].split('\n')
        lines = all_lines[:3]
        if len(all_lines) > 3:
            lines[-1] = lines[-1] + "\u2026"  # add ellipsis to last shown line
        for j, line in enumerate(lines):
            lw, lh = text_size(draw, line, text_font)
            draw.text(((width - lw) // 2, y + sym_h + name_h + 15 + j * 24), line, fill=DEEP_NIGHT, font=text_font)

        # Divider
        if i < 3:
            div_y = y + sym_h + name_h + 15 + len(lines) * 24 + 20
            draw.line([(cx - 40, div_y), (cx + 40, div_y)], fill=GOLD, width=1)

    # CTA at bottom
    cta_font = ImageFont.truetype(GEORGIA, 18)
    cta_text = "all 12 signs at signseason.com"
    cw, ch = text_size(draw, cta_text, cta_font)
    draw.text(((width - cw) // 2, height - 80), cta_text, fill=GOLD, font=cta_font)

    draw_watermark(draw, width, height, font_size=13)
    img.save(output_path, "PNG", optimize=True)


def main():
    # Generate DALL-E illustration
    illust_path = generate_dalle_illustration()
    illustration = Image.open(illust_path)

    platforms = {
        "tiktok": {"size": (1080, 1920), "handle": "@sign_season"},
        "instagram": {"size": (1080, 1350), "handle": "@signseasonco"},
    }

    total_slides = 14  # title + 12 signs + CTA

    for platform_name, config in platforms.items():
        w, h = config["size"]
        handle = config["handle"]
        out_dir = os.path.join(BASE_DIR, f"slides-2026-04-04-{platform_name}")
        os.makedirs(out_dir, exist_ok=True)

        # Slide 1: Title
        generate_title_slide(w, h, illustration, os.path.join(out_dir, "slide-01-title.png"))
        print(f"  [{platform_name}] Title slide done")

        # Slides 2-13: Each sign
        for i, sign_data in enumerate(SIGN_DATA):
            filename = f"slide-{i+2:02d}-{sign_data['sign'].lower()}.png"
            generate_sign_slide(w, h, sign_data, i + 2, total_slides,
                              os.path.join(out_dir, filename))
            print(f"  [{platform_name}] {sign_data['sign']} done")

        # Slide 14: CTA
        generate_cta_slide(w, h, illustration, handle, os.path.join(out_dir, "slide-14-cta.png"))
        print(f"  [{platform_name}] CTA done")

    # Pinterest pin
    pin_dir = os.path.join(BASE_DIR, "slides-2026-04-04-pinterest")
    os.makedirs(pin_dir, exist_ok=True)
    generate_pinterest_pin(illustration, os.path.join(pin_dir, "pin-secretly-wants.png"))
    print("  [pinterest] Pin done")

    print("\n\u2705 All April 4 assets generated!")
    print(f"  TikTok: {BASE_DIR}/slides-2026-04-04-tiktok/ (14 slides)")
    print(f"  Instagram: {BASE_DIR}/slides-2026-04-04-instagram/ (14 slides)")
    print(f"  Pinterest: {BASE_DIR}/slides-2026-04-04-pinterest/ (1 pin)")


if __name__ == "__main__":
    main()
