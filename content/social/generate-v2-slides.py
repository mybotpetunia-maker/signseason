from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

# --- Config ---
SIGNS = [
    ("ARIES", "♈", "fire", '"I chose you on purpose. Not by accident."'),
    ("TAURUS", "♉", "earthair", '"You are safe here. I am not going anywhere."'),
    ("GEMINI", "♊", "earthair", '"Both versions of you are worth knowing."'),
    ("CANCER", "♋", "water", '"You don\'t have to hold everyone together."'),
    ("LEO", "♌", "fire", '"You\'re not too much. You\'re exactly enough."'),
    ("VIRGO", "♍", "earthair", '"Rest is not something you have to earn."'),
    ("LIBRA", "♎", "earthair", '"Your needs are not an inconvenience."'),
    ("SCORPIO", "♏", "water", '"I see you. The real you. And I\'m still here."'),
    ("SAGITTARIUS", "♐", "fire", '"You don\'t have to leave to find yourself."'),
    ("CAPRICORN", "♑", "earthair", '"You have already done enough for today."'),
    ("AQUARIUS", "♒", "earthair", '"Your feelings are not a problem to solve."'),
    ("PISCES", "♓", "water", '"You are not imagining it. It is real."'),
]

BASE = "slides-2026-04-04-v2-tiktok"
TITLE_BG = f"{BASE}/title-bg.png"

# Fonts
SERIF_BOLD = "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf"
SERIF_ITALIC = "/System/Library/Fonts/Supplemental/Times New Roman Italic.ttf"
SERIF = "/System/Library/Fonts/Supplemental/Times New Roman.ttf"
SANS = "/System/Library/Fonts/Supplemental/Avenir Next.ttc"
SYMBOLS = "/System/Library/Fonts/Apple Symbols.ttf"

def make_gradient_overlay(img, opacity_top=0, opacity_bottom=200):
    """Add bottom-heavy dark gradient for text readability"""
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    w, h = img.size
    for y in range(h):
        # Gradient starts at 40% from top
        progress = max(0, (y - h * 0.35) / (h * 0.65))
        alpha = int(opacity_top + (opacity_bottom - opacity_top) * progress)
        draw.line([(0, y), (w, y)], fill=(20, 15, 30, alpha))
    return Image.alpha_composite(img.convert('RGBA'), overlay)

def draw_text_centered(draw, text, y, font, fill, max_width, img_width):
    """Draw text centered, wrapping if needed"""
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    if tw <= max_width:
        x = (img_width - tw) // 2
        draw.text((x, y), text, font=font, fill=fill)
        return bbox[3] - bbox[1]
    else:
        # Wrap
        words = text.split()
        lines = []
        current = ""
        for w in words:
            test = f"{current} {w}".strip()
            bbox_test = draw.textbbox((0, 0), test, font=font)
            if bbox_test[2] - bbox_test[0] <= max_width:
                current = test
            else:
                if current:
                    lines.append(current)
                current = w
        if current:
            lines.append(current)
        
        total_h = 0
        for line in lines:
            bbox_l = draw.textbbox((0, 0), line, font=font)
            lw = bbox_l[2] - bbox_l[0]
            lh = bbox_l[3] - bbox_l[1]
            x = (img_width - lw) // 2
            draw.text((x, y + total_h), line, font=font, fill=fill)
            total_h += int(lh * 1.3)
        return total_h

# --- TITLE SLIDE (TikTok 1080x1920) ---
def make_title_tk():
    bg = Image.open(TITLE_BG).resize((1080, 1080), Image.LANCZOS)
    # Extend to 9:16 by stretching/blurring the top and creating canvas
    canvas = Image.new('RGB', (1080, 1920), (20, 15, 30))
    # Place illustration in upper portion, slightly zoomed
    bg_large = bg.resize((1200, 1200), Image.LANCZOS)
    canvas.paste(bg_large.crop((60, 0, 1140, 1200)), (0, 0))
    # Boost saturation
    canvas = ImageEnhance.Color(canvas).enhance(1.3)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.1)
    # Gradient overlay
    canvas = make_gradient_overlay(canvas, opacity_top=0, opacity_bottom=230)
    draw = ImageDraw.Draw(canvas)
    
    # Title text - BIG and bold
    font_title = ImageFont.truetype(SERIF_BOLD, 100)
    font_sub = ImageFont.truetype(SERIF_ITALIC, 48)
    font_footer = ImageFont.truetype(SANS, 28)
    
    # Gold border frame
    draw.rectangle([(30, 30), (1050, 1890)], outline=(201, 173, 111, 60), width=1)
    
    y = 1350
    draw_text_centered(draw, "WHAT YOUR SIGN", y, font_title, (240, 232, 216), 900, 1080)
    y += 120
    draw_text_centered(draw, "SECRETLY", y, font_title, (218, 192, 128), 900, 1080)
    y += 120
    draw_text_centered(draw, "WANTS TO HEAR", y, font_title, (240, 232, 216), 900, 1080)
    y += 140
    draw_text_centered(draw, "the words you're waiting for", y, font_sub, (176, 154, 110), 800, 1080)
    
    # Footer
    draw_text_centered(draw, "signseason.com", 1840, font_footer, (138, 125, 112), 400, 1080)
    
    canvas = canvas.convert('RGB')
    canvas.save(f"{BASE}/slide-01-title.png", quality=92)
    print("title TK done")

# --- SIGN SLIDES ---
def make_sign_slide_tk(idx, name, glyph, element, quote):
    bg_file = f"{BASE}/bg-{element}.png"
    bg = Image.open(bg_file).resize((1080, 1080), Image.LANCZOS)
    canvas = Image.new('RGB', (1080, 1920), (20, 15, 30))
    # Place bg centered with blur edges
    bg_large = bg.resize((1200, 1200), Image.LANCZOS)
    canvas.paste(bg_large.crop((60, 60, 1140, 1140)), (0, 300))
    # Boost
    canvas = ImageEnhance.Color(canvas).enhance(1.2)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.1)
    # Heavy gradient for text readability
    canvas = make_gradient_overlay(canvas, opacity_top=120, opacity_bottom=220)
    # Add top gradient too
    overlay_top = Image.new('RGBA', (1080, 1920), (0, 0, 0, 0))
    draw_ot = ImageDraw.Draw(overlay_top)
    for y in range(600):
        alpha = int(180 * (1 - y / 600))
        draw_ot.line([(0, y), (1080, y)], fill=(20, 15, 30, alpha))
    canvas = Image.alpha_composite(canvas.convert('RGBA'), overlay_top).convert('RGB')
    
    draw = ImageDraw.Draw(canvas)
    
    # Gold border
    draw.rectangle([(30, 30), (1050, 1890)], outline=(201, 173, 111, 40), width=1)
    
    # Large zodiac glyph watermark
    try:
        glyph_font = ImageFont.truetype(SYMBOLS, 300)
        gb = draw.textbbox((0, 0), glyph, font=glyph_font)
        gw = gb[2] - gb[0]
        draw.text(((1080 - gw) // 2, 200), glyph, font=glyph_font, fill=(201, 173, 111, 25))
    except:
        pass
    
    # Sign name
    font_name = ImageFont.truetype(SERIF_BOLD, 80)
    font_sub = ImageFont.truetype(SERIF_ITALIC, 36)
    font_quote = ImageFont.truetype(SERIF_ITALIC, 56)
    font_label = ImageFont.truetype(SANS, 24)
    font_counter = ImageFont.truetype(SERIF, 22)
    
    # Layout
    y = 580
    draw_text_centered(draw, name, y, font_name, (240, 232, 216), 800, 1080)
    y += 100
    draw_text_centered(draw, "secretly wants to hear", y, font_sub, (176, 154, 110), 600, 1080)
    
    # Divider
    y += 80
    draw.line([(440, y), (640, y)], fill=(201, 173, 111, 80), width=1)
    
    # Quote - the main content
    y += 80
    draw_text_centered(draw, quote, y, font_quote, (218, 192, 128), 840, 1080)
    
    # Footer
    draw_text_centered(draw, f"{idx + 1} / 14", 1820, font_counter, (138, 125, 112), 200, 1080)
    draw_text_centered(draw, "signseason.com", 1855, font_label, (138, 125, 112), 400, 1080)
    
    fname = name.lower()
    canvas.save(f"{BASE}/slide-{idx+2:02d}-{fname}.png", quality=92)
    print(f"{fname} TK done")

# --- CTA SLIDE ---
def make_cta_tk():
    bg = Image.open(TITLE_BG).resize((1080, 1080), Image.LANCZOS)
    canvas = Image.new('RGB', (1080, 1920), (20, 15, 30))
    bg_blur = bg.filter(ImageFilter.GaussianBlur(8))
    bg_large = bg_blur.resize((1200, 1200), Image.LANCZOS)
    canvas.paste(bg_large.crop((60, 0, 1140, 1200)), (0, 300))
    canvas = ImageEnhance.Color(canvas).enhance(1.2)
    canvas = make_gradient_overlay(canvas, opacity_top=100, opacity_bottom=230)
    draw = ImageDraw.Draw(canvas)
    
    draw.rectangle([(30, 30), (1050, 1890)], outline=(201, 173, 111, 60), width=1)
    
    font_cta = ImageFont.truetype(SERIF_BOLD, 72)
    font_handle = ImageFont.truetype(SERIF_BOLD, 64)
    font_sub = ImageFont.truetype(SERIF_ITALIC, 40)
    font_url = ImageFont.truetype(SANS, 28)
    
    y = 750
    draw_text_centered(draw, "follow for your sign", y, font_sub, (176, 154, 110), 800, 1080)
    y += 100
    draw_text_centered(draw, "@sign_season", y, font_handle, (240, 232, 216), 800, 1080)
    y += 120
    draw_text_centered(draw, "get your birth chart free", y, font_sub, (201, 173, 111), 800, 1080)
    y += 80
    draw_text_centered(draw, "signseason.com/chart", y, font_url, (218, 192, 128), 600, 1080)
    
    canvas = canvas.convert('RGB')
    canvas.save(f"{BASE}/slide-14-cta.png", quality=92)
    print("cta TK done")

# Run all
make_title_tk()
for i, (name, glyph, elem, quote) in enumerate(SIGNS):
    make_sign_slide_tk(i, name, glyph, elem, quote)
make_cta_tk()
print("=== ALL TK DONE ===")
