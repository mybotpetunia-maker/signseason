from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

SIGNS = [
    ("ARIES", "♈", "fire", '"I chose you on purpose.\nNot by accident."'),
    ("TAURUS", "♉", "earthair", '"You are safe here.\nI am not going anywhere."'),
    ("GEMINI", "♊", "earthair", '"Both versions of you\nare worth knowing."'),
    ("CANCER", "♋", "water", '"You don\'t have to hold\neveryone together."'),
    ("LEO", "♌", "fire", '"You\'re not too much.\nYou\'re exactly enough."'),
    ("VIRGO", "♍", "earthair", '"Rest is not something\nyou have to earn."'),
    ("LIBRA", "♎", "earthair", '"Your needs are not\nan inconvenience."'),
    ("SCORPIO", "♏", "water", '"I see you. The real you.\nAnd I\'m still here."'),
    ("SAGITTARIUS", "♐", "fire", '"You don\'t have to leave\nto find yourself."'),
    ("CAPRICORN", "♑", "earthair", '"You have already done\nenough for today."'),
    ("AQUARIUS", "♒", "earthair", '"Your feelings are not\na problem to solve."'),
    ("PISCES", "♓", "water", '"You are not imagining it.\nIt is real."'),
]

BASE = "slides-2026-04-04-v2-tiktok"

SERIF_BOLD = "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf"
SERIF_ITALIC = "/System/Library/Fonts/Supplemental/Times New Roman Italic.ttf"
SERIF = "/System/Library/Fonts/Supplemental/Times New Roman.ttf"
SANS = "/System/Library/Fonts/Supplemental/Avenir Next.ttc"
SYMBOLS = "/System/Library/Fonts/Apple Symbols.ttf"

def draw_text_centered(draw, text, y, font, fill, max_width, img_width):
    """Draw text centered, handle manual line breaks"""
    lines = text.split('\n')
    total_h = 0
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        if tw <= max_width:
            x = (img_width - tw) // 2
            draw.text((x, y + total_h), line, font=font, fill=fill)
            total_h += int(th * 1.4)
        else:
            words = line.split()
            wrapped = []
            current = ""
            for w in words:
                test = f"{current} {w}".strip()
                bb = draw.textbbox((0, 0), test, font=font)
                if bb[2] - bb[0] <= max_width:
                    current = test
                else:
                    if current: wrapped.append(current)
                    current = w
            if current: wrapped.append(current)
            for wl in wrapped:
                bb = draw.textbbox((0, 0), wl, font=font)
                ww = bb[2] - bb[0]
                wh = bb[3] - bb[1]
                x = (img_width - ww) // 2
                draw.text((x, y + total_h), wl, font=font, fill=fill)
                total_h += int(wh * 1.4)
    return total_h

def add_text_backing(canvas, y_start, y_end, opacity=140):
    """Add dark semi-transparent backing behind text area"""
    overlay = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Feathered edges
    feather = 60
    for y in range(max(0, y_start - feather), y_start):
        a = int(opacity * (y - (y_start - feather)) / feather)
        draw.line([(0, y), (canvas.size[0], y)], fill=(15, 10, 25, a))
    for y in range(y_start, min(canvas.size[1], y_end)):
        draw.line([(0, y), (canvas.size[0], y)], fill=(15, 10, 25, opacity))
    for y in range(y_end, min(canvas.size[1], y_end + feather)):
        a = int(opacity * (1 - (y - y_end) / feather))
        draw.line([(0, y), (canvas.size[0], y)], fill=(15, 10, 25, a))
    return Image.alpha_composite(canvas.convert('RGBA'), overlay)

# --- TITLE SLIDE (FIXED) ---
def make_title_tk():
    bg = Image.open(f"{BASE}/title-bg.png").resize((1080, 1080), Image.LANCZOS)
    canvas = Image.new('RGB', (1080, 1920), (20, 15, 30))
    # Place illustration covering more of the canvas
    bg_large = bg.resize((1300, 1300), Image.LANCZOS)
    canvas.paste(bg_large.crop((110, 0, 1190, 1300)), (0, 100))
    canvas = ImageEnhance.Color(canvas).enhance(1.3)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.15)
    
    # Strong bottom gradient for text
    canvas = canvas.convert('RGBA')
    canvas = add_text_backing(canvas, 1200, 1920, opacity=200)
    
    draw = ImageDraw.Draw(canvas)
    
    # Gold border
    draw.rectangle([(30, 30), (1050, 1890)], outline=(201, 173, 111, 50), width=1)
    
    # Title - clear stacking, no overlap
    font_title = ImageFont.truetype(SERIF_BOLD, 96)
    font_sub = ImageFont.truetype(SERIF_ITALIC, 44)
    font_footer = ImageFont.truetype(SANS, 26)
    
    y = 1320
    draw_text_centered(draw, "WHAT YOUR SIGN", y, font_title, (240, 232, 216), 960, 1080)
    y += 130
    draw_text_centered(draw, "SECRETLY", y, font_title, (218, 192, 128), 960, 1080)
    y += 130
    draw_text_centered(draw, "WANTS TO HEAR", y, font_title, (240, 232, 216), 960, 1080)
    y += 120
    draw_text_centered(draw, "the words you're waiting for", y, font_sub, (176, 154, 110), 800, 1080)
    
    draw_text_centered(draw, "signseason.com", 1855, font_footer, (138, 125, 112), 400, 1080)
    
    canvas.convert('RGB').save(f"{BASE}/slide-01-title.png", quality=92)
    print("title done")

# --- SIGN SLIDES (FIXED) ---
def make_sign_slide_tk(idx, name, glyph, element, quote):
    bg_file = f"{BASE}/bg-{element}.png"
    bg = Image.open(bg_file).resize((1080, 1080), Image.LANCZOS)
    canvas = Image.new('RGB', (1080, 1920), (20, 15, 30))
    
    # Fill more of the canvas with the bg image
    bg_large = bg.resize((1300, 1300), Image.LANCZOS)
    canvas.paste(bg_large.crop((110, 60, 1190, 1260)), (0, 200))
    canvas = ImageEnhance.Color(canvas).enhance(1.25)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.15)
    
    canvas = canvas.convert('RGBA')
    # Top dark zone for glyph + name
    canvas = add_text_backing(canvas, 0, 700, opacity=160)
    # Bottom zone for quote
    canvas = add_text_backing(canvas, 1000, 1920, opacity=180)
    
    draw = ImageDraw.Draw(canvas)
    
    # Gold border
    draw.rectangle([(30, 30), (1050, 1890)], outline=(201, 173, 111, 35), width=1)
    
    # Large zodiac glyph - big watermark, centered in upper area
    try:
        glyph_font = ImageFont.truetype(SYMBOLS, 280)
        gb = draw.textbbox((0, 0), glyph, font=glyph_font)
        gw = gb[2] - gb[0]
        gh = gb[3] - gb[1]
        draw.text(((1080 - gw) // 2, 140), glyph, font=glyph_font, fill=(201, 173, 111, 30))
    except:
        pass
    
    # Sign name - on top of glyph watermark
    font_name = ImageFont.truetype(SERIF_BOLD, 80)
    font_sub = ImageFont.truetype(SERIF_ITALIC, 36)
    font_quote = ImageFont.truetype(SERIF_ITALIC, 54)
    font_counter = ImageFont.truetype(SERIF, 24)
    font_url = ImageFont.truetype(SANS, 24)
    
    y = 520
    draw_text_centered(draw, name, y, font_name, (240, 232, 216), 800, 1080)
    y += 100
    draw_text_centered(draw, "secretly wants to hear", y, font_sub, (176, 154, 110), 600, 1080)
    
    # Divider
    y += 80
    draw.line([(420, y), (660, y)], fill=(201, 173, 111, 80), width=1)
    
    # Quote - with proper backing, centered in lower area
    y = 1100
    draw_text_centered(draw, quote, y, font_quote, (240, 232, 216), 840, 1080)
    
    # Footer
    draw_text_centered(draw, f"{idx + 2} / 14", 1830, font_counter, (138, 125, 112), 200, 1080)
    draw_text_centered(draw, "signseason.com", 1865, font_url, (138, 125, 112), 400, 1080)
    
    fname = name.lower()
    canvas.convert('RGB').save(f"{BASE}/slide-{idx+2:02d}-{fname}.png", quality=92)
    print(f"{fname} done")

# --- CTA SLIDE (FIXED) ---
def make_cta_tk():
    bg = Image.open(f"{BASE}/title-bg.png").resize((1080, 1080), Image.LANCZOS)
    canvas = Image.new('RGB', (1080, 1920), (20, 15, 30))
    bg_blur = bg.filter(ImageFilter.GaussianBlur(6))
    bg_large = bg_blur.resize((1300, 1300), Image.LANCZOS)
    canvas.paste(bg_large.crop((110, 0, 1190, 1300)), (0, 200))
    canvas = ImageEnhance.Color(canvas).enhance(1.2)
    
    canvas = canvas.convert('RGBA')
    # Full overlay for CTA readability
    canvas = add_text_backing(canvas, 600, 1500, opacity=170)
    
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([(30, 30), (1050, 1890)], outline=(201, 173, 111, 50), width=1)
    
    font_handle = ImageFont.truetype(SERIF_BOLD, 72)
    font_sub = ImageFont.truetype(SERIF_ITALIC, 44)
    font_url = ImageFont.truetype(SANS, 32)
    
    # Vertically centered CTA block
    y = 780
    draw_text_centered(draw, "follow for your sign", y, font_sub, (201, 173, 111), 800, 1080)
    y += 100
    draw_text_centered(draw, "@sign_season", y, font_handle, (240, 232, 216), 800, 1080)
    y += 130
    # Divider
    draw.line([(420, y), (660, y)], fill=(201, 173, 111, 80), width=1)
    y += 60
    draw_text_centered(draw, "get your birth chart free", y, font_sub, (218, 192, 128), 800, 1080)
    y += 90
    draw_text_centered(draw, "signseason.com/chart", y, font_url, (201, 173, 111), 600, 1080)
    
    canvas.convert('RGB').save(f"{BASE}/slide-14-cta.png", quality=92)
    print("cta done")

make_title_tk()
for i, (name, glyph, elem, quote) in enumerate(SIGNS):
    make_sign_slide_tk(i, name, glyph, elem, quote)
make_cta_tk()
print("=== ALL TK V2 DONE ===")
