#!/usr/bin/env python3
"""V3 Toxic Pairings: website-congruent slides using actual site engravings."""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os, random

# === Brand colors (from signseason.com CSS) ===
VOID = (30, 21, 40)
PLUM = (42, 31, 51)
PLUM_MID = (53, 40, 64)
PLUM_LIFT = (61, 46, 74)
GOLD_DIM = (176, 154, 110)
GOLD = (201, 173, 111)
GOLD_LIGHT = (212, 188, 124)
GOLD_PALE = (226, 212, 167)
PARCHMENT = (240, 232, 216)
WARM_GRAY = (138, 125, 112)

# === Paths ===
SIGNS_DIR = os.path.expanduser("~/.openclaw/workspace/signseason/assets/illustrations/signs")
TEXTURE = os.path.expanduser("~/.openclaw/workspace/signseason/assets/textures/velvet-noise.png")
PFP = os.path.expanduser("~/.openclaw/workspace/signseason/assets/illustrations/pfp-transparent.png")
COMPAT_IMG = os.path.expanduser("~/.openclaw/workspace/signseason/assets/illustrations/topics/compatibility.png")

# === Fonts ===
EB_GARAMOND = "/tmp/fonts/EBGaramond.ttf"
EB_GARAMOND_IT = "/tmp/fonts/EBGaramond-Italic.ttf"
FONDAMENTO = "/tmp/fonts/Fondamento-Regular.ttf"
FONDAMENTO_IT = "/tmp/fonts/Fondamento-Italic.ttf"
DM_SANS = "/tmp/fonts/DMSans.ttf"
SYMBOLS = "/System/Library/Fonts/Apple Symbols.ttf"

ZODIAC = {
    "aries": ("♈", "aries-ram"), "taurus": ("♉", "taurus"), "gemini": ("♊", "gemini"),
    "cancer": ("♋", "cancer"), "leo": ("♌", "leo"), "virgo": ("♍", "virgo"),
    "libra": ("♎", "libra"), "scorpio": ("♏", "scorpio"), "sagittarius": ("♐", "sagittarius"),
    "capricorn": ("♑", "capricorn"), "aquarius": ("♒", "aquarius"), "pisces": ("♓", "pisces"),
}

PAIRINGS = [
    ("aries", "cancer", "one wants to fight about it.\nthe other wants to cry about it.\nnobody actually talks about it."),
    ("taurus", "aquarius", "one needs routine like oxygen.\nthe other treats commitment\nlike a theoretical concept."),
    ("gemini", "scorpio", "gemini talks to everyone.\nscorpio trusts no one.\nthis was doomed from\nthe group chat."),
    ("leo", "virgo", "leo wants a standing ovation.\nvirgo wants to give\nconstructive feedback.\nboth leave feeling unappreciated."),
    ("sagittarius", "pisces", "sag books the flight.\npisces catches feelings.\nsag forgets to text back.\npisces writes a poem about it."),
    ("capricorn", "libra", "capricorn has a five-year plan.\nlibra can't pick a restaurant.\nthe spreadsheet vs the\n\"let's just see\" energy."),
]

# Layout variants for visual variety
LAYOUTS = ["side_by_side", "stacked_offset", "large_small", "centered_overlap", "diagonal", "framed"]

def load_texture():
    """Load velvet noise texture for overlay."""
    tex = Image.open(TEXTURE).convert("RGBA")
    return tex

def apply_texture(img, tex, opacity=0.15):
    """Tile texture over image."""
    tw, th = tex.size
    for x in range(0, img.width, tw):
        for y in range(0, img.height, th):
            region = tex.crop((0, 0, min(tw, img.width - x), min(th, img.height - y)))
            # Reduce opacity
            r, g, b, a = region.split()
            a = a.point(lambda p: int(p * opacity))
            region = Image.merge("RGBA", (r, g, b, a))
            img.alpha_composite(region, (x, y))
    return img

def make_plum_bg(w, h):
    """Website-style plum background with radial gradient."""
    img = Image.new("RGBA", (w, h), VOID)
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, int(h * 0.45)
    max_r = max(w, h)
    for r in range(max_r, 0, -3):
        frac = r / max_r
        alpha = int(40 * (1 - frac))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*PLUM, alpha))
    return img

def make_parchment_bg(w, h):
    """Light parchment background."""
    img = Image.new("RGBA", (w, h), PARCHMENT)
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, int(h * 0.45)
    max_r = max(w, h)
    for r in range(max_r, 0, -3):
        frac = r / max_r
        c = int(232 - 12 * frac)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(c, c - 8, c - 24, 15))
    return img

def add_gold_stars(draw, w, h, count=50):
    """Subtle gold star speckles."""
    random.seed(77)
    for _ in range(count):
        x, y = random.randint(0, w), random.randint(0, h)
        a = random.randint(15, 45)
        draw.point((x, y), fill=(*GOLD, a))

def gold_border(draw, w, h, margin=35, opacity=50):
    """Thin gold border frame."""
    draw.rectangle([margin, margin, w - margin, h - margin], outline=(*GOLD, opacity), width=1)

def load_engraving(sign_name, target_size=None):
    """Load a sign engraving, resize, and crop to circle with gold ring."""
    _, fname = ZODIAC[sign_name]
    path = os.path.join(SIGNS_DIR, f"{fname}.png")
    img = Image.open(path).convert("RGBA")
    if target_size:
        img.thumbnail(target_size, Image.LANCZOS)
    
    # Crop to circle
    w, h = img.size
    size = min(w, h)
    # Center crop to square first
    left = (w - size) // 2
    top = (h - size) // 2
    img = img.crop((left, top, left + size, top + size))
    
    # Create circular mask
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([0, 0, size - 1, size - 1], fill=255)
    
    # Apply mask
    output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask)
    
    # Add thin gold ring border
    ring_draw = ImageDraw.Draw(output)
    ring_draw.ellipse([1, 1, size - 2, size - 2], outline=(*GOLD, 120), width=2)
    
    return output

def center_text(draw, text, font, y, cx, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw // 2, y), text, font=font, fill=fill)
    return th

def draw_divider(draw, cx, y, width=80, color=(*GOLD_DIM, 120)):
    draw.line([(cx - width//2, y), (cx + width//2, y)], fill=color, width=1)

def draw_star_divider(draw, cx, y, color=GOLD_DIM):
    """Three-dot divider like the website's ✶ ✶ ✶."""
    # Use simple dots instead of unicode stars to avoid rendering issues
    dot_r = 2
    gap = 18
    for i in range(-1, 2):
        dx = cx + i * gap
        draw.ellipse([dx - dot_r, y - dot_r, dx + dot_r, y + dot_r], fill=(*color, 160))

# ============================================================
# TITLE SLIDE - Uses compatibility engraving + site branding
# ============================================================
def make_title_slide(w, h, out_dir):
    img = make_plum_bg(w, h)
    tex = load_texture()
    img = apply_texture(img, tex, 0.12)
    draw = ImageDraw.Draw(img)
    cx = w // 2
    add_gold_stars(draw, w, h, 55)
    
    # Load compatibility engraving as hero element
    compat = Image.open(COMPAT_IMG).convert("RGBA")
    # Tint it slightly gold
    enhancer = ImageEnhance.Brightness(compat)
    compat = enhancer.enhance(0.85)
    compat.thumbnail((500, 500), Image.LANCZOS)
    # Center it in upper portion
    cx_img = cx - compat.width // 2
    img.alpha_composite(compat, (cx_img, 120))
    
    draw = ImageDraw.Draw(img)
    
    # Fondamento display title
    title_font = ImageFont.truetype(FONDAMENTO, 72)
    subtitle_font = ImageFont.truetype(EB_GARAMOND_IT, 36)
    label_font = ImageFont.truetype(DM_SANS, 16)
    footer_font = ImageFont.truetype(DM_SANS, 16)
    
    y = 680
    draw_star_divider(draw, cx, y)
    y += 40
    
    center_text(draw, "Most Toxic", title_font, y, cx, GOLD_LIGHT)
    y += 82
    center_text(draw, "Zodiac Pairings", title_font, y, cx, GOLD_LIGHT)
    y += 100
    
    draw_divider(draw, cx, y, 90, (*GOLD, 80))
    y += 30
    
    center_text(draw, "ranked by how long you'll pretend it's fine", subtitle_font, y, cx, GOLD_DIM)
    
    # Footer
    gold_border(draw, w, h, 35, 40)
    center_text(draw, "signseason.com", footer_font, h - 55, cx, (*WARM_GRAY, 160))
    
    img.convert("RGB").save(os.path.join(out_dir, "slide-01-title.png"), quality=95)
    print("  ✓ Title (compatibility engraving + Fondamento)")

# ============================================================
# PAIRING SLIDES - 3 different layout styles
# ============================================================

def make_pairing_side_by_side(idx, s1, s2, body, is_dark, w, h, out_dir):
    """Two engravings side by side, text below."""
    img = make_plum_bg(w, h) if is_dark else make_parchment_bg(w, h)
    tex = load_texture()
    img = apply_texture(img, tex, 0.10 if is_dark else 0.06)
    draw = ImageDraw.Draw(img)
    cx = w // 2
    
    if is_dark:
        add_gold_stars(draw, w, h, 40)
        name_color = GOLD_LIGHT
        body_color = GOLD_DIM
        glyph_color = (*WARM_GRAY, 180)
        gold_border(draw, w, h)
    else:
        name_color = PLUM
        body_color = (80, 65, 55)
        glyph_color = (*WARM_GRAY, 200)
        draw.rectangle([35, 35, w - 35, h - 35], outline=(*PLUM, 40), width=1)
    
    # Load engravings
    eng1 = load_engraving(s1, (280, 280))
    eng2 = load_engraving(s2, (280, 280))
    
    # Place side by side - push down for better vertical balance
    gap = 60
    total_w = eng1.width + gap + eng2.width
    x_start = cx - total_w // 2
    y_eng = 100
    
    img.alpha_composite(eng1, (x_start, y_eng))
    img.alpha_composite(eng2, (x_start + eng1.width + gap, y_eng))
    
    draw = ImageDraw.Draw(img)
    
    # "x" between them
    x_font = ImageFont.truetype(EB_GARAMOND_IT, 32)
    x_pos_x = x_start + eng1.width + gap // 2
    x_pos_y = y_eng + eng1.height // 2 - 16
    bbox = draw.textbbox((0, 0), "×", font=x_font)
    draw.text((x_pos_x - (bbox[2]-bbox[0])//2, x_pos_y), "×", font=x_font, fill=glyph_color)
    
    # Sign names - title case, Fondamento for consistency
    name_font = ImageFont.truetype(FONDAMENTO, 46)
    y = y_eng + max(eng1.height, eng2.height) + 30
    
    center_text(draw, s1.title(), name_font, y, cx, name_color)
    y += 55
    x_font_sb = ImageFont.truetype(EB_GARAMOND_IT, 28)
    center_text(draw, "×", x_font_sb, y, cx, glyph_color)
    y += 35
    center_text(draw, s2.title(), name_font, y, cx, name_color)
    y += 60
    
    draw_divider(draw, cx, y, 80, (*GOLD, 70) if is_dark else (*PLUM, 50))
    y += 30
    
    # Body
    body_font = ImageFont.truetype(EB_GARAMOND_IT, 34)
    for line in body.split("\n"):
        h_line = center_text(draw, line, body_font, y, cx, body_color)
        y += h_line + int(34 * 0.65)
    
    # Footer
    footer_font = ImageFont.truetype(DM_SANS, 16)
    counter_font = ImageFont.truetype(EB_GARAMOND, 20)
    center_text(draw, "signseason.com", footer_font, h - 50, 110, (*WARM_GRAY, 140))
    draw.text((w - 80, h - 50), f"{idx+1}/8", font=counter_font, fill=(*WARM_GRAY, 140))
    
    fname = f"slide-{idx+1:02d}-{s1}-{s2}.png"
    img.convert("RGB").save(os.path.join(out_dir, fname), quality=95)
    print(f"  ✓ {s1} × {s2} (side-by-side, {'dark' if is_dark else 'light'})")

def make_pairing_stacked(idx, s1, s2, body, is_dark, w, h, out_dir):
    """Engravings side by side with names underneath each, text below. Vertical layout."""
    img = make_plum_bg(w, h) if is_dark else make_parchment_bg(w, h)
    tex = load_texture()
    img = apply_texture(img, tex, 0.10 if is_dark else 0.06)
    draw = ImageDraw.Draw(img)
    cx = w // 2
    
    if is_dark:
        add_gold_stars(draw, w, h, 40)
        name_color = GOLD_LIGHT
        body_color = GOLD_DIM
        glyph_color = (*WARM_GRAY, 180)
        gold_border(draw, w, h)
    else:
        name_color = PLUM
        body_color = (80, 65, 55)
        glyph_color = (*WARM_GRAY, 200)
        draw.rectangle([35, 35, w - 35, h - 35], outline=(*PLUM, 40), width=1)
    
    # Both engravings side by side with gap + × between
    eng1 = load_engraving(s1, (240, 240))
    eng2 = load_engraving(s2, (240, 240))
    
    gap = 100  # Wide gap with × in between
    total_w = eng1.width + gap + eng2.width
    x_start = cx - total_w // 2
    y_eng = 100
    
    img.alpha_composite(eng1, (x_start, y_eng))
    img.alpha_composite(eng2, (x_start + eng1.width + gap, y_eng))
    
    draw = ImageDraw.Draw(img)
    
    # × between the circles
    x_font = ImageFont.truetype(EB_GARAMOND_IT, 32)
    x_cx = x_start + eng1.width + gap // 2
    x_cy = y_eng + eng1.height // 2 - 16
    bbox = draw.textbbox((0, 0), "×", font=x_font)
    draw.text((x_cx - (bbox[2]-bbox[0])//2, x_cy), "×", font=x_font, fill=glyph_color)
    
    # Sign names under each circle
    label_font = ImageFont.truetype(FONDAMENTO, 30)
    y_label = y_eng + max(eng1.height, eng2.height) + 15
    
    # Sign 1 name centered under its circle
    s1_cx = x_start + eng1.width // 2
    center_text(draw, s1.title(), label_font, y_label, s1_cx, name_color)
    
    # Sign 2 name centered under its circle
    s2_cx = x_start + eng1.width + gap + eng2.width // 2
    center_text(draw, s2.title(), label_font, y_label, s2_cx, name_color)
    
    y = y_label + 60
    draw_divider(draw, cx, y, 80, (*GOLD, 70) if is_dark else (*PLUM, 50))
    y += 35
    
    # Body
    body_font = ImageFont.truetype(EB_GARAMOND_IT, 34)
    for line in body.split("\n"):
        h_line = center_text(draw, line, body_font, y, cx, body_color)
        y += h_line + int(34 * 0.65)
    
    # Footer
    footer_font = ImageFont.truetype(DM_SANS, 16)
    counter_font = ImageFont.truetype(EB_GARAMOND, 20)
    center_text(draw, "signseason.com", footer_font, h - 50, 110, (*WARM_GRAY, 140))
    draw.text((w - 80, h - 50), f"{idx+1}/8", font=counter_font, fill=(*WARM_GRAY, 140))
    
    fname = f"slide-{idx+1:02d}-{s1}-{s2}.png"
    img.convert("RGB").save(os.path.join(out_dir, fname), quality=95)
    print(f"  ✓ {s1} × {s2} (labeled pair, {'dark' if is_dark else 'light'})")

def make_pairing_framed(idx, s1, s2, body, is_dark, w, h, out_dir):
    """Engraving in a medallion frame with text alongside. Most editorial."""
    img = make_plum_bg(w, h) if is_dark else make_parchment_bg(w, h)
    tex = load_texture()
    img = apply_texture(img, tex, 0.10 if is_dark else 0.06)
    draw = ImageDraw.Draw(img)
    cx = w // 2
    
    if is_dark:
        add_gold_stars(draw, w, h, 40)
        name_color = GOLD_LIGHT
        body_color = GOLD_DIM
        gold_border(draw, w, h)
    else:
        name_color = PLUM
        body_color = (80, 65, 55)
        draw.rectangle([35, 35, w - 35, h - 35], outline=(*PLUM, 40), width=1)
    
    # Both engravings equal size, side by side with wider spacing
    eng1 = load_engraving(s1, (240, 240))
    eng2 = load_engraving(s2, (240, 240))
    
    gap = 120
    total_w = eng1.width + gap + eng2.width
    x_start = cx - total_w // 2
    img.alpha_composite(eng1, (x_start, 80))
    img.alpha_composite(eng2, (x_start + eng1.width + gap, 80))
    
    draw = ImageDraw.Draw(img)
    
    # Names centered - title case, Fondamento, stacked
    name_font = ImageFont.truetype(FONDAMENTO, 46)
    x_font_fr = ImageFont.truetype(EB_GARAMOND_IT, 28)
    
    y = 380
    center_text(draw, s1.title(), name_font, y, cx, name_color)
    y += 55
    center_text(draw, "×", x_font_fr, y, cx, (*WARM_GRAY, 160))
    y += 35
    center_text(draw, s2.title(), name_font, y, cx, name_color)
    y += 60
    
    draw_divider(draw, cx, y, 90, (*GOLD, 70) if is_dark else (*PLUM, 50))
    y += 35
    
    # Body
    body_font = ImageFont.truetype(EB_GARAMOND_IT, 36)
    for line in body.split("\n"):
        h_line = center_text(draw, line, body_font, y, cx, body_color)
        y += h_line + int(36 * 0.65)
    
    # Footer
    footer_font = ImageFont.truetype(DM_SANS, 16)
    counter_font = ImageFont.truetype(EB_GARAMOND, 20)
    center_text(draw, "signseason.com", footer_font, h - 50, 110, (*WARM_GRAY, 140))
    draw.text((w - 80, h - 50), f"{idx+1}/8", font=counter_font, fill=(*WARM_GRAY, 140))
    
    fname = f"slide-{idx+1:02d}-{s1}-{s2}.png"
    img.convert("RGB").save(os.path.join(out_dir, fname), quality=95)
    print(f"  ✓ {s1} × {s2} (framed diagonal, {'dark' if is_dark else 'light'})")

# ============================================================
# CTA SLIDE
# ============================================================
def make_cta_slide(w, h, handle, out_dir):
    img = make_plum_bg(w, h)
    tex = load_texture()
    img = apply_texture(img, tex, 0.12)
    draw = ImageDraw.Draw(img)
    cx = w // 2
    add_gold_stars(draw, w, h, 55)
    gold_border(draw, w, h)
    
    # PFP as decorative element
    pfp = Image.open(PFP).convert("RGBA")
    pfp.thumbnail((200, 200), Image.LANCZOS)
    img.alpha_composite(pfp, (cx - pfp.width//2, 350))
    
    draw = ImageDraw.Draw(img)
    
    y = 580
    draw_star_divider(draw, cx, y, GOLD_DIM)
    y += 40
    
    cta_font = ImageFont.truetype(FONDAMENTO, 52)
    handle_font = ImageFont.truetype(EB_GARAMOND_IT, 32)
    footer_font = ImageFont.truetype(DM_SANS, 16)
    
    center_text(draw, "follow for more", cta_font, y, cx, GOLD_LIGHT)
    y += 65
    center_text(draw, "zodiac chaos", cta_font, y, cx, GOLD_LIGHT)
    y += 90
    
    draw_divider(draw, cx, y, 80, (*GOLD, 80))
    y += 35
    
    center_text(draw, handle, handle_font, y, cx, GOLD_DIM)
    
    center_text(draw, "signseason.com", footer_font, h - 55, cx, (*WARM_GRAY, 160))
    
    img.convert("RGB").save(os.path.join(out_dir, "slide-08-cta.png"), quality=95)
    print("  ✓ CTA slide (PFP + Fondamento)")

# ============================================================
# PINTEREST PIN
# ============================================================
def make_pinterest_pin(out_dir):
    w, h = 1000, 1500
    img = make_plum_bg(w, h)
    tex = load_texture()
    img = apply_texture(img, tex, 0.10)
    draw = ImageDraw.Draw(img)
    cx = w // 2
    add_gold_stars(draw, w, h, 60)
    gold_border(draw, w, h, 30, 45)
    
    # Title
    title_font = ImageFont.truetype(FONDAMENTO, 64)
    pair_font = ImageFont.truetype(EB_GARAMOND, 34)
    desc_font = ImageFont.truetype(EB_GARAMOND_IT, 26)
    footer_font = ImageFont.truetype(DM_SANS, 22)
    
    y = 100
    center_text(draw, "Most Toxic", title_font, y, cx, GOLD_LIGHT)
    y += 78
    center_text(draw, "Zodiac Pairings", title_font, y, cx, GOLD_LIGHT)
    y += 90
    
    draw_star_divider(draw, cx, y, GOLD_DIM)
    y += 50
    
    for s1, s2, body in PAIRINGS:
        # Load tiny engravings
        eng1 = load_engraving(s1, (70, 70))
        eng2 = load_engraving(s2, (70, 70))
        
        # Place side by side with text
        pair_text = f"{s1.title()} × {s2.title()}"
        
        # Engravings flanking the text
        bbox = draw.textbbox((0, 0), pair_text, font=pair_font)
        tw = bbox[2] - bbox[0]
        
        total = eng1.width + 20 + tw + 20 + eng2.width
        x_start = cx - total // 2
        
        img.alpha_composite(eng1, (x_start, y - 10))
        center_text(draw, pair_text, pair_font, y + 15, cx, GOLD_LIGHT)
        img.alpha_composite(eng2, (x_start + total - eng2.width, y - 10))
        
        draw = ImageDraw.Draw(img)
        y += 70
        
        first_line = body.split("\n")[0]
        center_text(draw, first_line, desc_font, y, cx, GOLD_DIM)
        y += 55
    
    center_text(draw, "signseason.com", footer_font, h - 60, cx, (*WARM_GRAY, 180))
    
    img.convert("RGB").save(os.path.join(out_dir, "pin-toxic-pairings.png"), quality=95)
    print("  ✓ Pinterest pin")


# ============================================================
# MAIN
# ============================================================
# Layout assignment for variety: alternate layouts AND dark/light
layout_assignments = [
    (make_pairing_side_by_side, True),   # 1: aries x cancer - dark, side by side
    (make_pairing_stacked, False),        # 2: taurus x aquarius - light, stacked
    (make_pairing_framed, True),          # 3: gemini x scorpio - dark, framed diagonal
    (make_pairing_side_by_side, False),   # 4: leo x virgo - light, side by side
    (make_pairing_stacked, True),         # 5: sag x pisces - dark, stacked
    (make_pairing_framed, False),         # 6: cap x libra - light, framed diagonal
]

for platform, handle, suffix in [("tiktok", "@sign_season", ""), ("instagram", "@signseasonco", "")]:
    out_dir = os.path.expanduser(f"~/.openclaw/workspace/signseason/content/social/slides-2026-04-05-v3-{platform}")
    os.makedirs(out_dir, exist_ok=True)
    print(f"\nGenerating V3 {platform.upper()} slides (1080x1350)...")
    
    W, H = 1080, 1350
    make_title_slide(W, H, out_dir)
    
    for i, (s1, s2, body) in enumerate(PAIRINGS):
        layout_fn, is_dark = layout_assignments[i]
        layout_fn(i + 1, s1, s2, body, is_dark, W, H, out_dir)
    
    make_cta_slide(W, H, handle, out_dir)

# Pinterest
PIN_DIR = os.path.expanduser("~/.openclaw/workspace/signseason/content/social/slides-2026-04-05-v3-pinterest")
os.makedirs(PIN_DIR, exist_ok=True)
print("\nGenerating V3 Pinterest pin...")
make_pinterest_pin(PIN_DIR)

print("\n✅ V3 complete — website-congruent, 3 layout variants, actual engravings")
