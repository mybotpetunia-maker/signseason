#!/usr/bin/env python3
"""Apr 18 — How Each Sign Acts When They Like Someone (EI style, plum bg, circular engravings)."""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os, math, random, shutil

# === Brand colors ===
VOID       = (30, 21, 40)
PLUM       = (42, 31, 51)
PLUM_MID   = (53, 40, 64)
GOLD_DIM   = (176, 154, 110)
GOLD       = (201, 173, 111)
GOLD_LIGHT = (212, 188, 124)
GOLD_PALE  = (226, 212, 167)
PARCHMENT  = (240, 232, 216)
PARCH_DARK = (210, 198, 174)
WARM_GRAY  = (138, 125, 112)
OFF_WHITE  = (240, 232, 216)

# === Paths ===
WORKSPACE   = os.path.expanduser("~/.openclaw/workspace/signseason")
SIGNS_DIR   = os.path.join(WORKSPACE, "assets/illustrations/signs")
TEXTURE_PATH= os.path.join(WORKSPACE, "assets/textures/velvet-noise.png")
OUT_DIR     = os.path.expanduser("~/.openclaw/workspace/signseason/content/social/slides-2026-04-18-tiktok")

# === Fonts ===
EB_GARAMOND    = "/tmp/fonts/EBGaramond.ttf"
EB_GARAMOND_IT = "/tmp/fonts/EBGaramond-Italic.ttf"
FONDAMENTO     = "/tmp/fonts/Fondamento-Regular.ttf"
DM_SANS        = "/tmp/fonts/DMSans.ttf"
SYMBOLS        = "/System/Library/Fonts/Apple Symbols.ttf"

# TikTok portrait
W, H = 1080, 1920

SIGNS = [
    ("aries",       "♈", "aries-ram",    "Aries",       "tells you directly.\nor picks a fight with you.\nsometimes both.\n(it's love.)"),
    ("taurus",      "♉", "taurus",       "Taurus",       "starts appearing\neverywhere you go.\n\"coincidence,\" they say.\nit's not."),
    ("gemini",      "♊", "gemini",       "Gemini",       "texts you their entire\npersonality in 24 hours.\nif you keep up,\nyou passed."),
    ("cancer",      "♋", "cancer",       "Cancer",       "makes you food.\nasked if you got home safe.\nknows your coffee order.\nit's them. they like you."),
    ("leo",         "♌", "leo",          "Leo",          "starts performing their\nbest self in every room\nyou share.\nyou're the audience."),
    ("virgo",       "♍", "virgo",        "Virgo",        "edits your emails.\nunsolicited.\nbecause they care\nand care looks like feedback."),
    ("libra",       "♎", "libra",        "Libra",        "agrees with everything\nyou say. loses their\nown opinion entirely.\nthis is the danger."),
    ("scorpio",     "♏", "scorpio",      "Scorpio",      "researches you.\nnot in a creepy way.\nmore of a \"I've read your\nhigh school bio\" way."),
    ("sagittarius", "♐", "sagittarius",  "Sagittarius",  "invites you on things.\nspontaneous things.\n\"want to just drive somewhere?\"\nyes. they like you."),
    ("capricorn",   "♑", "capricorn",    "Capricorn",    "makes time.\nand they don't make time\nfor anyone.\nyou're on the calendar."),
    ("aquarius",    "♒", "aquarius",     "Aquarius",     "tells you interesting facts\nabout yourself like they\nhaven't been paying attention.\nthey've been paying attention."),
    ("pisces",      "♓", "pisces",       "Pisces",       "writes about you.\ndoesn't tell you.\nyou'll find out eventually.\nit's a good poem."),
]

os.makedirs(OUT_DIR, exist_ok=True)

# ── helpers ──────────────────────────────────────────────────────────────────

def load_texture():
    if not os.path.exists(TEXTURE_PATH):
        return None
    tex = Image.open(TEXTURE_PATH).convert("RGBA")
    return tex

def apply_texture(img, tex, opacity=0.13):
    if tex is None:
        return img
    tw, th = tex.size
    for x in range(0, img.width, tw):
        for y in range(0, img.height, th):
            region = tex.crop((0, 0, min(tw, img.width - x), min(th, img.height - y)))
            r2, g2, b2, a2 = region.split()
            a2 = a2.point(lambda p: int(p * opacity))
            region = Image.merge("RGBA", (r2, g2, b2, a2))
            img.alpha_composite(region, (x, y))
    return img

def make_plum_bg(w, h):
    img = Image.new("RGBA", (w, h), VOID)
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, int(h * 0.42)
    max_r = max(w, h)
    for r in range(max_r, 0, -4):
        frac = r / max_r
        alpha = int(35 * (1 - frac))
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(*PLUM, alpha))
    return img

def circular_crop(sign_key, size):
    """Load sign engraving, crop to circle, apply gold ring."""
    # Try different file naming
    for name in [sign_key, sign_key.split("-")[0]]:
        path = os.path.join(SIGNS_DIR, f"{name}.png")
        if os.path.exists(path):
            break
    else:
        # fallback: blank circle
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        return img

    src = Image.open(path).convert("RGBA")
    # Center-crop to square
    sw, sh = src.size
    sq = min(sw, sh)
    left = (sw - sq) // 2
    top  = (sh - sq) // 2
    src = src.crop((left, top, left+sq, top+sq)).resize((size, size), Image.LANCZOS)

    # Darken/tint to match plum palette
    r, g, b, a = src.split()
    enhancer = ImageEnhance.Brightness(src.convert("RGB"))
    tinted = enhancer.enhance(0.72)
    # Apply gold tint overlay
    tint = Image.new("RGB", (size, size), (80, 55, 20))
    tinted = Image.blend(tinted, tint, 0.18)
    src = Image.merge("RGBA", (*tinted.split(), a))

    # Circular mask
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, size-1, size-1], fill=255)
    result = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    result.paste(src, mask=mask)

    # Gold ring
    ring = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    rd = ImageDraw.Draw(ring)
    thickness = max(3, size // 60)
    for i in range(thickness):
        rd.ellipse([i, i, size-1-i, size-1-i], outline=(*GOLD, 200))
    # Inner ring (thinner, dimmer)
    gap = thickness + 5
    rd.ellipse([gap, gap, size-1-gap, size-1-gap], outline=(*GOLD_DIM, 100))
    result.alpha_composite(ring)

    return result

def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception as e:
        print(f"  Font warning: {path} @ {size}: {e}")
        return ImageFont.load_default()

def draw_centered(draw, text, y, fnt, color, img_w):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw = bbox[2] - bbox[0]
    draw.text(((img_w - tw) // 2, y), text, font=fnt, fill=color)

def multiline_centered(draw, text, y, fnt, color, img_w, spacing=14):
    lines = text.split("\n")
    line_h = fnt.size + spacing
    total_h = len(lines) * line_h
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=fnt)
        tw = bbox[2] - bbox[0]
        draw.text(((img_w - tw) // 2, y + i * line_h), line, font=fnt, fill=color)
    return total_h

def draw_gold_divider(draw, cx, y, length=80):
    draw.line([(cx - length//2, y), (cx + length//2, y)], fill=GOLD, width=1)
    # Diamond accent
    s = 4
    draw.polygon([(cx, y-s), (cx+s, y), (cx, y+s), (cx-s, y)], fill=GOLD)

# ── Title slide ───────────────────────────────────────────────────────────────

def make_title_slide(tex):
    img = make_plum_bg(W, H)
    img = apply_texture(img, tex)
    draw = ImageDraw.Draw(img)
    cx = W // 2

    # Top watermark
    wm = font(DM_SANS, 26)
    draw_centered(draw, "SIGN SEASON", 72, wm, (*GOLD_DIM, 200), W)

    # Gold top rule
    draw.line([(cx - 120, 115), (cx + 120, 115)], fill=(*GOLD_DIM, 120), width=1)

    # Main headline — vertically centered in the canvas
    title_font = font(FONDAMENTO, 96)
    # 4 headline lines + divider + subtitle + spacing = ~600px block
    # Center that block: start at (H - 600) // 2
    y = (H - 620) // 2
    for line in ["How Each", "Sign Acts", "When They", "Like Someone"]:
        draw_centered(draw, line, y, title_font, GOLD_PALE, W)
        y += 112

    # Divider
    draw_gold_divider(draw, cx, y + 30)

    # Subtitle
    sub = font(EB_GARAMOND_IT, 44)
    draw_centered(draw, "a field guide to zodiac crushes", y + 65, sub, (*PARCHMENT, 210), W)

    # Decorative dots (safe — no glyph fonts needed)
    random.seed(42)
    for _ in range(22):
        sx = random.randint(80, W-80)
        sy = random.randint(80, H-150)
        a = random.randint(18, 55)
        r = random.randint(1, 3)
        draw.ellipse([sx-r, sy-r, sx+r, sy+r], fill=(*GOLD, a))

    # Bottom handle
    handle_font = font(DM_SANS, 30)
    draw_centered(draw, "@sign_season", H - 100, handle_font, (*GOLD_DIM, 180), W)
    draw.line([(cx - 80, H-110), (cx + 80, H-110)], fill=(*GOLD_DIM, 80), width=1)

    return img.convert("RGB")

# ── Sign slide ────────────────────────────────────────────────────────────────

def make_sign_slide(sign_key, symbol, img_name, label, body_text, tex, idx):
    # All slides use dark plum for consistent carousel look
    img = make_plum_bg(W, H)
    img = apply_texture(img, tex)
    if True:
        bg_color = VOID
        headline_color = GOLD_PALE
        body_color = OFF_WHITE
        accent_color = GOLD
        ring_color = GOLD
        wm_color = (*GOLD_DIM, 180)
        handle_color = (*GOLD_DIM, 160)

    draw = ImageDraw.Draw(img)
    cx = W // 2

    # Top watermark
    wm = font(DM_SANS, 26)
    draw_centered(draw, "SIGN SEASON", 72, wm, wm_color, W)
    draw.line([(cx - 100, 115), (cx + 100, 115)], fill=(*ring_color, 100), width=1)

    # ── Calculate total content block height so we can center it ──
    circ_size = 380
    n_body_lines = len(body_text.split("\n"))
    line_h = 68
    block_h = circ_size + 30 + 60 + 80 + 50 + 30 + (n_body_lines * line_h)
    # start_y: center between top watermark area (140) and bottom handle (H-140)
    usable_top = 140
    usable_bot = H - 140
    start_y = usable_top + ((usable_bot - usable_top) - block_h) // 2
    start_y = max(start_y, 140)

    # Circular engraving
    circ = circular_crop(img_name, circ_size)
    img.alpha_composite(circ, (cx - circ_size//2, start_y))

    # Zodiac symbol + sign name
    sym_font  = font(SYMBOLS, 52)
    name_font = font(FONDAMENTO, 80)
    y_after_circ = start_y + circ_size + 30
    draw_centered(draw, symbol, y_after_circ, sym_font, (*accent_color, 220), W)
    draw_centered(draw, label.upper(), y_after_circ + 65, name_font, headline_color, W)

    # Divider
    draw_gold_divider(draw, cx, y_after_circ + 158)

    # Body text
    body_font = font(EB_GARAMOND_IT, 52)
    body_y = y_after_circ + 185
    lines = body_text.split("\n")
    for line in lines:
        bbox = draw.textbbox((0,0), line, font=body_font)
        tw = bbox[2] - bbox[0]
        draw.text(((W - tw)//2, body_y), line, font=body_font, fill=body_color)
        body_y += line_h

    # Bottom handle
    handle_font = font(DM_SANS, 30)
    draw_centered(draw, "@sign_season", H - 100, handle_font, handle_color, W)
    draw.line([(cx - 80, H-110), (cx + 80, H-110)], fill=(*ring_color, 70), width=1)

    return img.convert("RGB")

# ── CTA slide ─────────────────────────────────────────────────────────────────

def make_cta_slide(tex):
    img = make_plum_bg(W, H)
    img = apply_texture(img, tex)
    draw = ImageDraw.Draw(img)
    cx = W // 2

    wm = font(DM_SANS, 26)
    draw_centered(draw, "SIGN SEASON", 72, wm, (*GOLD_DIM, 180), W)
    draw.line([(cx - 100, 115), (cx + 100, 115)], fill=(*GOLD_DIM, 80), width=1)

    cta_font = font(FONDAMENTO, 72)
    y = 380
    for line in ["which sign", "are you?", "", "(be honest)"]:
        if line:
            draw_centered(draw, line, y, cta_font, GOLD_PALE, W)
        y += 90

    draw_gold_divider(draw, cx, y + 20)

    sub_font = font(EB_GARAMOND_IT, 44)
    draw_centered(draw, "follow for your daily cosmic update", y + 65, sub_font, (*PARCHMENT, 200), W)
    draw_centered(draw, "signseason.com", y + 130, sub_font, (*GOLD, 180), W)

    # Scatter zodiac symbols
    symbols_font = font(SYMBOLS, 36)
    all_syms = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"]
    random.seed(99)
    for i, sym in enumerate(all_syms):
        sx = random.randint(80, W-80)
        sy = random.randint(750, H-250)
        draw.text((sx, sy), sym, font=symbols_font, fill=(*GOLD, random.randint(30, 80)))

    handle_font = font(DM_SANS, 30)
    draw_centered(draw, "@sign_season", H - 100, handle_font, (*GOLD_DIM, 160), W)

    return img.convert("RGB")

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print(f"Generating Apr 18 slides → {OUT_DIR}")
    tex = load_texture()

    # Title
    slide = make_title_slide(tex)
    path = os.path.join(OUT_DIR, "slide-00-title.png")
    slide.save(path, "PNG", optimize=True)
    print(f"  ✓ slide-00-title.png")

    # Signs
    for i, (sign_key, symbol, img_name, label, body) in enumerate(SIGNS):
        slide = make_sign_slide(sign_key, symbol, img_name, label, body, tex, i)
        path = os.path.join(OUT_DIR, f"slide-{i+1:02d}-{sign_key}.png")
        slide.save(path, "PNG", optimize=True)
        print(f"  ✓ slide-{i+1:02d}-{sign_key}.png")

    # CTA
    slide = make_cta_slide(tex)
    path = os.path.join(OUT_DIR, "slide-13-cta.png")
    slide.save(path, "PNG", optimize=True)
    print(f"  ✓ slide-13-cta.png")

    print(f"\nDone. {len(SIGNS) + 2} slides saved to {OUT_DIR}")

if __name__ == "__main__":
    main()
