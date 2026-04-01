#!/usr/bin/env python3
"""Generate April 2 social slides: PO (Photo + Overlay) — Your Moon Sign Knows"""

import os
import json
import math
import base64
import urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# === BRAND SPECS ===
DEEP_NIGHT = (26, 19, 32)       # #1A1320
PLUM = (42, 31, 51)             # #2A1F33
GOLD = (201, 173, 111)          # #C9AD6F
CREAM = (240, 232, 216)         # #F0E8D8
WHITE = (255, 255, 255)
WARM_GRAY = (138, 125, 112)

# Font paths
GEORGIA_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
GEORGIA_ITALIC = "/System/Library/Fonts/Supplemental/Georgia Bold Italic.ttf"
GEORGIA = "/System/Library/Fonts/Supplemental/Georgia.ttf"
HELVETICA = "/System/Library/Fonts/Helvetica.ttc"
APPLE_SYMBOLS = "/System/Library/Fonts/Apple Symbols.ttf"

BASE_DIR = "/Users/petunia1/.openclaw/workspace/signseason/content/social"

# Moon sign content — short, punchy, group-chat energy
MOON_SIGNS = [
    {"sign": "Aries", "symbol": "♈", "text": "your moon sign knows\nyou feel everything at full volume\nand pretend you don't"},
    {"sign": "Taurus", "symbol": "♉", "text": "your moon sign knows\nyou need 3 business days\nto process your own feelings"},
    {"sign": "Gemini", "symbol": "♊", "text": "your moon sign knows\nyou intellectualize emotions\nso you don't have to feel them"},
    {"sign": "Cancer", "symbol": "♋", "text": "your moon sign knows\nyou remember every tone shift\nin every conversation ever"},
    {"sign": "Leo", "symbol": "♌", "text": "your moon sign knows\nyou need to be chosen first\nor you won't choose at all"},
    {"sign": "Virgo", "symbol": "♍", "text": "your moon sign knows\nyou 'help' people because\nfeeling needed feels like love"},
    {"sign": "Libra", "symbol": "♎", "text": "your moon sign knows\nyou'd rather be wrong together\nthan right alone"},
    {"sign": "Scorpio", "symbol": "♏", "text": "your moon sign knows\nyou already know how\nthis ends. you always do."},
    {"sign": "Sagittarius", "symbol": "♐", "text": "your moon sign knows\nyou leave before anyone\ngets close enough to disappoint you"},
    {"sign": "Capricorn", "symbol": "♑", "text": "your moon sign knows\nyou turned your pain into\na productivity system"},
    {"sign": "Aquarius", "symbol": "♒", "text": "your moon sign knows\nyou care so deeply you had to\nbuild walls that look like logic"},
    {"sign": "Pisces", "symbol": "♓", "text": "your moon sign knows\nyou absorb everyone's energy\nand call it your own mood"},
]

def generate_dalle_moon():
    """Generate celestial moon photo via DALL-E."""
    output_path = os.path.join(BASE_DIR, "dalle-moon-apr2.png")
    if os.path.exists(output_path):
        print(f"Moon image already exists: {output_path}")
        return output_path
    
    api_key = os.environ.get("OPENAI_API_KEY")
    prompt = (
        "A dramatic full moon rising over a dark cosmic landscape, deep indigo and violet sky, "
        "scattered stars, ethereal misty clouds, cinematic lighting, moody and mystical atmosphere, "
        "high resolution photography style, no text, no people"
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
    
    print("Generating DALL-E moon image...")
    resp = urllib.request.urlopen(req, timeout=120)
    data = json.loads(resp.read())
    
    # gpt-image-1 returns base64
    if data["data"][0].get("b64_json"):
        img_data = base64.b64decode(data["data"][0]["b64_json"])
        with open(output_path, "wb") as f:
            f.write(img_data)
    elif data["data"][0].get("url"):
        img_resp = urllib.request.urlopen(data["data"][0]["url"], timeout=60)
        with open(output_path, "wb") as f:
            f.write(img_resp.read())
    
    print(f"Saved moon image: {output_path}")
    return output_path


def create_dark_overlay(bg_img, width, height):
    """Resize bg image and add dark gradient overlay for text readability."""
    # Resize to cover
    img = bg_img.copy()
    img_ratio = img.width / img.height
    target_ratio = width / height
    
    if img_ratio > target_ratio:
        new_h = height
        new_w = int(height * img_ratio)
    else:
        new_w = width
        new_h = int(width / img_ratio)
    
    img = img.resize((new_w, new_h), Image.LANCZOS)
    
    # Center crop
    left = (new_w - width) // 2
    top = (new_h - height) // 2
    img = img.crop((left, top, left + width, top + height))
    
    # Darken
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(0.35)
    
    # Add gradient overlay (darker at bottom)
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for y in range(height):
        alpha = int(40 + (y / height) * 100)
        draw.line([(0, y), (width, y)], fill=(26, 19, 32, alpha))
    
    img = img.convert("RGBA")
    img = Image.alpha_composite(img, overlay)
    return img.convert("RGB")


def draw_gold_border(draw, width, height, inset=30, thickness=2):
    for i in range(thickness):
        draw.rectangle(
            [inset + i, inset + i, width - inset - 1 - i, height - inset - 1 - i],
            outline=GOLD
        )


def draw_watermark(draw, width, height, text="signseason.com", font_size=14):
    try:
        font = ImageFont.truetype(HELVETICA, font_size)
    except:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (width - tw) // 2
    y = height - 50
    draw.text((x, y), text, fill=(*GOLD, 180) if hasattr(draw, '_image') else GOLD, font=font)


def wrap_text(text, font, max_width, draw):
    """Word-wrap text to fit within max_width."""
    lines = []
    for paragraph in text.split('\n'):
        words = paragraph.split()
        if not words:
            lines.append("")
            continue
        current = words[0]
        for word in words[1:]:
            test = current + " " + word
            bbox = draw.textbbox((0, 0), test, font=font)
            if bbox[2] - bbox[0] <= max_width:
                current = test
            else:
                lines.append(current)
                current = word
        lines.append(current)
    return lines


def generate_title_slide(bg_img, width, height, output_path):
    """Title slide: YOUR MOON SIGN KNOWS"""
    img = create_dark_overlay(bg_img, width, height)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw, width, height)
    
    cx = width // 2
    cy = int(height * 0.55)
    
    # Moon symbol
    try:
        symbol_font = ImageFont.truetype(APPLE_SYMBOLS, 80)
    except:
        symbol_font = ImageFont.truetype(GEORGIA_BOLD, 80)
    draw.text((cx, cy - 180), "☽", fill=GOLD, font=symbol_font, anchor="mm")
    
    # Title
    title_font = ImageFont.truetype(GEORGIA_BOLD, 52 if width >= 1080 else 44)
    draw.text((cx, cy - 60), "YOUR MOON", fill=WHITE, font=title_font, anchor="mm")
    draw.text((cx, cy + 10), "SIGN KNOWS", fill=WHITE, font=title_font, anchor="mm")
    
    # Divider
    draw.line([(cx - 60, cy + 70), (cx + 60, cy + 70)], fill=GOLD, width=2)
    
    # Subtitle
    sub_font = ImageFont.truetype(GEORGIA, 22)
    draw.text((cx, cy + 110), "the things you don't say out loud", fill=CREAM, font=sub_font, anchor="mm")
    
    draw_watermark(draw, width, height)
    img.save(output_path, quality=95)


def generate_sign_slide(bg_img, width, height, sign_data, output_path):
    """Individual sign slide with moon photo overlay."""
    img = create_dark_overlay(bg_img, width, height)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw, width, height)
    
    cx = width // 2
    # Shift content down for better vertical balance
    cy = int(height * 0.58)
    
    # Sign symbol
    try:
        symbol_font = ImageFont.truetype(APPLE_SYMBOLS, 60)
    except:
        symbol_font = ImageFont.truetype(GEORGIA_BOLD, 60)
    draw.text((cx, cy - 170), sign_data["symbol"], fill=GOLD, font=symbol_font, anchor="mm")
    
    # Sign name
    name_font = ImageFont.truetype(GEORGIA_BOLD, 28)
    draw.text((cx, cy - 100), sign_data["sign"].upper(), fill=GOLD, font=name_font, anchor="mm", 
              spacing=8)
    
    # Main text
    text_font = ImageFont.truetype(GEORGIA_ITALIC, 32 if width >= 1080 else 28)
    lines = sign_data["text"].split('\n')
    line_height = 50
    start_y = cy - (len(lines) * line_height) // 2 + 50
    
    for i, line in enumerate(lines):
        y = start_y + i * line_height
        # First line is "your moon sign knows" — make it smaller
        if i == 0:
            header_font = ImageFont.truetype(GEORGIA, 20)
            draw.text((cx, y), line, fill=GOLD, font=header_font, anchor="mm")
        else:
            draw.text((cx, y + 10), line, fill=WHITE, font=text_font, anchor="mm")
    
    draw_watermark(draw, width, height)
    img.save(output_path, quality=95)


def generate_cta_slide(bg_img, width, height, output_path):
    """CTA slide."""
    img = create_dark_overlay(bg_img, width, height)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw, width, height)
    
    cx = width // 2
    cy = int(height * 0.55)
    
    # Moon symbol
    try:
        symbol_font = ImageFont.truetype(APPLE_SYMBOLS, 60)
    except:
        symbol_font = ImageFont.truetype(GEORGIA_BOLD, 60)
    draw.text((cx, cy - 140), "☽", fill=GOLD, font=symbol_font, anchor="mm")
    
    title_font = ImageFont.truetype(GEORGIA_BOLD, 36)
    draw.text((cx, cy - 50), "want more?", fill=WHITE, font=title_font, anchor="mm")
    
    # Divider
    draw.line([(cx - 60, cy), (cx + 60, cy)], fill=GOLD, width=2)
    
    sub_font = ImageFont.truetype(GEORGIA, 22)
    draw.text((cx, cy + 40), "signseason.com", fill=GOLD, font=sub_font, anchor="mm")
    draw.text((cx, cy + 80), "your cosmic cheat sheet", fill=CREAM, font=sub_font, anchor="mm")
    
    follow_font = ImageFont.truetype(GEORGIA, 18)
    draw.text((cx, cy + 140), "follow for daily zodiac drops", fill=WARM_GRAY, font=follow_font, anchor="mm")
    
    img.save(output_path, quality=95)


def generate_pinterest_pin(bg_img, sign_data_list, output_path):
    """Pinterest: collage-style pin with top 4 signs."""
    width, height = 1000, 1500
    # Extra dark overlay for Pinterest (text readability over moon)
    img = bg_img.copy()
    img_ratio = img.width / img.height
    target_ratio = width / height
    if img_ratio > target_ratio:
        new_h = height
        new_w = int(height * img_ratio)
    else:
        new_w = width
        new_h = int(width / img_ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - width) // 2
    top = (new_h - height) // 2
    img = img.crop((left, top, left + width, top + height))
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(0.25)  # Much darker for text readability
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(height):
        alpha = int(60 + (y / height) * 80)
        od.line([(0, y), (width, y)], fill=(26, 19, 32, alpha))
    img = img.convert("RGBA")
    img = Image.alpha_composite(img, overlay).convert("RGB")
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw, width, height)
    
    cx = width // 2
    
    # Title
    title_font = ImageFont.truetype(GEORGIA_BOLD, 44)
    draw.text((cx, 120), "YOUR MOON", fill=WHITE, font=title_font, anchor="mm")
    draw.text((cx, 175), "SIGN KNOWS", fill=WHITE, font=title_font, anchor="mm")
    
    draw.line([(cx - 60, 220), (cx + 60, 220)], fill=GOLD, width=2)
    
    sub_font = ImageFont.truetype(GEORGIA, 18)
    draw.text((cx, 250), "the things you don't say out loud", fill=CREAM, font=sub_font, anchor="mm")
    
    # Show 4 signs as preview
    preview_signs = [sign_data_list[0], sign_data_list[3], sign_data_list[7], sign_data_list[10]]  # Aries, Cancer, Scorpio, Aquarius
    y_start = 330
    sign_font = ImageFont.truetype(GEORGIA_BOLD, 22)
    text_font = ImageFont.truetype(GEORGIA_ITALIC, 18)
    symbol_font = ImageFont.truetype(APPLE_SYMBOLS, 32)
    
    for i, sd in enumerate(preview_signs):
        y = y_start + i * 240
        
        # Symbol + name
        draw.text((cx, y), sd["symbol"], fill=GOLD, font=symbol_font, anchor="mm")
        draw.text((cx, y + 35), sd["sign"].upper(), fill=GOLD, font=sign_font, anchor="mm")
        
        # Just the emotional lines (skip "your moon sign knows")
        lines = sd["text"].split('\n')[1:]
        for j, line in enumerate(lines):
            draw.text((cx, y + 70 + j * 28), line, fill=WHITE, font=text_font, anchor="mm")
        
        # Divider between signs (not after last)
        if i < 3:
            div_y = y + 70 + len(lines) * 28 + 30
            draw.line([(cx - 40, div_y), (cx + 40, div_y)], fill=GOLD, width=1)
    
    # CTA at bottom
    cta_font = ImageFont.truetype(GEORGIA, 20)
    draw.text((cx, height - 90), "all 12 signs at signseason.com", fill=GOLD, font=cta_font, anchor="mm")
    draw_watermark(draw, width, height)
    
    img.save(output_path, quality=95)


def main():
    # Generate or load moon image
    moon_path = generate_dalle_moon()
    moon_img = Image.open(moon_path)
    
    platforms = {
        "tiktok": (1080, 1920),
        "instagram": (1080, 1350),
    }
    
    for platform, (w, h) in platforms.items():
        out_dir = os.path.join(BASE_DIR, f"slides-2026-04-02-{platform}")
        os.makedirs(out_dir, exist_ok=True)
        
        # Slide 1: Title
        generate_title_slide(moon_img, w, h, os.path.join(out_dir, "slide-01-title.png"))
        print(f"  [{platform}] Title slide done")
        
        # Slides 2-13: Each sign
        for i, sign_data in enumerate(MOON_SIGNS):
            filename = f"slide-{i+2:02d}-{sign_data['sign'].lower()}.png"
            generate_sign_slide(moon_img, w, h, sign_data, os.path.join(out_dir, filename))
            print(f"  [{platform}] {sign_data['sign']} done")
        
        # Slide 14: CTA
        generate_cta_slide(moon_img, w, h, os.path.join(out_dir, "slide-14-cta.png"))
        print(f"  [{platform}] CTA slide done")
    
    # Pinterest pin
    pin_dir = os.path.join(BASE_DIR, "slides-2026-04-02-pinterest")
    os.makedirs(pin_dir, exist_ok=True)
    generate_pinterest_pin(moon_img, MOON_SIGNS, os.path.join(pin_dir, "pin-moon-sign-knows.png"))
    print("  [pinterest] Pin done")
    
    print("\n✅ All April 2 assets generated!")
    print(f"  TikTok: {BASE_DIR}/slides-2026-04-02-tiktok/ (14 slides)")
    print(f"  Instagram: {BASE_DIR}/slides-2026-04-02-instagram/ (14 slides)")
    print(f"  Pinterest: {BASE_DIR}/slides-2026-04-02-pinterest/ (1 pin)")


if __name__ == "__main__":
    main()
