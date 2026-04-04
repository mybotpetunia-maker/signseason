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

BASE_TK = "slides-2026-04-04-v2-tiktok"
BASE_IG = "slides-2026-04-04-v2-instagram"
BASE_PIN = "slides-2026-04-04-v2-pinterest"
os.makedirs(BASE_IG, exist_ok=True)
os.makedirs(BASE_PIN, exist_ok=True)

SERIF_BOLD = "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf"
SERIF_ITALIC = "/System/Library/Fonts/Supplemental/Times New Roman Italic.ttf"
SERIF = "/System/Library/Fonts/Supplemental/Times New Roman.ttf"
SANS = "/System/Library/Fonts/Supplemental/Avenir Next.ttc"
SYMBOLS = "/System/Library/Fonts/Apple Symbols.ttf"

W_IG, H_IG = 1080, 1350
W_PIN, H_PIN = 1000, 1500

def draw_text_centered(draw, text, y, font, fill, max_width, img_width):
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
    overlay = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    feather = 50
    for y in range(max(0, y_start - feather), y_start):
        a = int(opacity * (y - (y_start - feather)) / feather)
        draw.line([(0, y), (canvas.size[0], y)], fill=(15, 10, 25, a))
    for y in range(y_start, min(canvas.size[1], y_end)):
        draw.line([(0, y), (canvas.size[0], y)], fill=(15, 10, 25, opacity))
    for y in range(y_end, min(canvas.size[1], y_end + feather)):
        a = int(opacity * (1 - (y - y_end) / feather))
        draw.line([(0, y), (canvas.size[0], y)], fill=(15, 10, 25, a))
    return Image.alpha_composite(canvas.convert('RGBA'), overlay)

# --- IG TITLE ---
def make_title_ig():
    bg = Image.open(f"{BASE_TK}/title-bg.png").resize((1080, 1080), Image.LANCZOS)
    canvas = Image.new('RGB', (W_IG, H_IG), (20, 15, 30))
    bg_large = bg.resize((1200, 1200), Image.LANCZOS)
    canvas.paste(bg_large.crop((60, 60, 1140, 1110)), (0, 0))
    canvas = ImageEnhance.Color(canvas).enhance(1.3)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.15)
    canvas = canvas.convert('RGBA')
    canvas = add_text_backing(canvas, 850, H_IG, opacity=210)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([(25, 25), (W_IG-25, H_IG-25)], outline=(201, 173, 111, 50), width=1)
    
    font_title = ImageFont.truetype(SERIF_BOLD, 84)
    font_sub = ImageFont.truetype(SERIF_ITALIC, 40)
    font_footer = ImageFont.truetype(SANS, 22)
    
    y = 920
    draw_text_centered(draw, "WHAT YOUR SIGN", y, font_title, (240, 232, 216), 960, W_IG)
    y += 110
    draw_text_centered(draw, "SECRETLY", y, font_title, (218, 192, 128), 960, W_IG)
    y += 110
    draw_text_centered(draw, "WANTS TO HEAR", y, font_title, (240, 232, 216), 960, W_IG)
    y += 90
    draw_text_centered(draw, "the words you're waiting for", y, font_sub, (176, 154, 110), 800, W_IG)
    draw_text_centered(draw, "signseason.com", H_IG - 40, font_footer, (138, 125, 112), 400, W_IG)
    
    canvas.convert('RGB').save(f"{BASE_IG}/slide-01-title.png", quality=92)
    print("IG title done")

# --- IG SIGN SLIDES ---
def make_sign_ig(idx, name, glyph, element, quote):
    bg = Image.open(f"{BASE_TK}/bg-{element}.png").resize((1080, 1080), Image.LANCZOS)
    canvas = Image.new('RGB', (W_IG, H_IG), (20, 15, 30))
    bg_large = bg.resize((1200, 1200), Image.LANCZOS)
    canvas.paste(bg_large.crop((60, 100, 1140, 1100)), (0, 100))
    canvas = ImageEnhance.Color(canvas).enhance(1.25)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.15)
    canvas = canvas.convert('RGBA')
    canvas = add_text_backing(canvas, 0, 550, opacity=150)
    canvas = add_text_backing(canvas, 800, H_IG, opacity=170)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([(25, 25), (W_IG-25, H_IG-25)], outline=(201, 173, 111, 35), width=1)
    
    try:
        gf = ImageFont.truetype(SYMBOLS, 240)
        gb = draw.textbbox((0, 0), glyph, font=gf)
        draw.text(((W_IG - (gb[2]-gb[0])) // 2, 80), glyph, font=gf, fill=(201, 173, 111, 25))
    except: pass
    
    fn = ImageFont.truetype(SERIF_BOLD, 72)
    fs = ImageFont.truetype(SERIF_ITALIC, 32)
    fq = ImageFont.truetype(SERIF_ITALIC, 48)
    fc = ImageFont.truetype(SERIF, 22)
    fu = ImageFont.truetype(SANS, 20)
    
    y = 380
    draw_text_centered(draw, name, y, fn, (240, 232, 216), 800, W_IG)
    y += 90
    draw_text_centered(draw, "secretly wants to hear", y, fs, (176, 154, 110), 600, W_IG)
    y += 70
    draw.line([(400, y), (680, y)], fill=(201, 173, 111, 80), width=1)
    
    y = 880
    draw_text_centered(draw, quote, y, fq, (240, 232, 216), 840, W_IG)
    
    draw_text_centered(draw, f"{idx + 2} / 14", H_IG - 55, fc, (138, 125, 112), 200, W_IG)
    draw_text_centered(draw, "signseason.com", H_IG - 30, fu, (138, 125, 112), 400, W_IG)
    
    canvas.convert('RGB').save(f"{BASE_IG}/slide-{idx+2:02d}-{name.lower()}.png", quality=92)
    print(f"IG {name.lower()} done")

# --- IG CTA ---
def make_cta_ig():
    bg = Image.open(f"{BASE_TK}/title-bg.png").resize((1080, 1080), Image.LANCZOS)
    canvas = Image.new('RGB', (W_IG, H_IG), (20, 15, 30))
    bg_blur = bg.filter(ImageFilter.GaussianBlur(6))
    bg_large = bg_blur.resize((1200, 1200), Image.LANCZOS)
    canvas.paste(bg_large.crop((60, 60, 1140, 1110)), (0, 50))
    canvas = canvas.convert('RGBA')
    canvas = add_text_backing(canvas, 400, 1100, opacity=170)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([(25, 25), (W_IG-25, H_IG-25)], outline=(201, 173, 111, 50), width=1)
    
    fh = ImageFont.truetype(SERIF_BOLD, 64)
    fs = ImageFont.truetype(SERIF_ITALIC, 40)
    fu = ImageFont.truetype(SANS, 28)
    
    y = 530
    draw_text_centered(draw, "follow for your sign", y, fs, (201, 173, 111), 800, W_IG)
    y += 90
    draw_text_centered(draw, "@signseasonco", y, fh, (240, 232, 216), 800, W_IG)
    y += 110
    draw.line([(400, y), (680, y)], fill=(201, 173, 111, 80), width=1)
    y += 50
    draw_text_centered(draw, "get your birth chart free", y, fs, (218, 192, 128), 800, W_IG)
    y += 80
    draw_text_centered(draw, "signseason.com/chart", y, fu, (201, 173, 111), 600, W_IG)
    
    canvas.convert('RGB').save(f"{BASE_IG}/slide-14-cta.png", quality=92)
    print("IG cta done")

# --- PINTEREST PIN ---
def make_pin():
    bg = Image.open(f"{BASE_TK}/title-bg.png").resize((1000, 1000), Image.LANCZOS)
    canvas = Image.new('RGB', (W_PIN, H_PIN), (20, 15, 30))
    bg_large = bg.resize((1100, 1100), Image.LANCZOS)
    canvas.paste(bg_large.crop((50, 0, 1050, 900)), (0, 0))
    canvas = ImageEnhance.Color(canvas).enhance(1.3)
    canvas = canvas.convert('RGBA')
    canvas = add_text_backing(canvas, 700, H_PIN, opacity=220)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([(20, 20), (W_PIN-20, H_PIN-20)], outline=(201, 173, 111, 50), width=1)
    
    ft = ImageFont.truetype(SERIF_BOLD, 80)
    fs = ImageFont.truetype(SERIF_ITALIC, 36)
    fu = ImageFont.truetype(SANS, 28)
    
    y = 800
    draw_text_centered(draw, "WHAT YOUR SIGN", y, ft, (240, 232, 216), 900, W_PIN)
    y += 100
    draw_text_centered(draw, "SECRETLY", y, ft, (218, 192, 128), 900, W_PIN)
    y += 100
    draw_text_centered(draw, "WANTS TO HEAR", y, ft, (240, 232, 216), 900, W_PIN)
    y += 100
    draw_text_centered(draw, "the words you're waiting for", y, fs, (176, 154, 110), 800, W_PIN)
    y += 80
    draw_text_centered(draw, "signseason.com", y, fu, (138, 125, 112), 600, W_PIN)
    
    canvas.convert('RGB').save(f"{BASE_PIN}/pin-secretly-wants.png", quality=92)
    print("Pinterest pin done")

make_title_ig()
for i, s in enumerate(SIGNS):
    make_sign_ig(i, *s)
make_cta_ig()
make_pin()
print("=== ALL IG + PIN DONE ===")
