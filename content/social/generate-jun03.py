#!/usr/bin/env python3
"""Jun 03 — What Each Sign Looks Like When They're Done With You (EI style, plum bg, circular engravings)."""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os, math, random

# === Brand colors ===
VOID       = (30, 21, 40)
PLUM       = (42, 31, 51)
PLUM_MID   = (53, 40, 64)
GOLD_DIM   = (176, 154, 110)
GOLD       = (201, 173, 111)
GOLD_LIGHT = (212, 188, 124)
GOLD_PALE  = (226, 212, 167)
PARCHMENT  = (240, 232, 216)
WARM_GRAY  = (138, 125, 112)

# === Paths ===
WORKSPACE    = os.path.expanduser("~/.openclaw/workspace/signseason")
SIGNS_DIR    = os.path.join(WORKSPACE, "assets/illustrations/signs")
TEXTURE_PATH = os.path.join(WORKSPACE, "assets/textures/velvet-noise.png")
OUT_TIKTOK   = os.path.expanduser("~/.openclaw/workspace/signseason/content/social/slides-2026-06-03-tiktok")
OUT_IG       = os.path.expanduser("~/.openclaw/workspace/signseason/content/social/slides-2026-06-03-instagram")

# === Fonts ===
EB_GARAMOND    = "/tmp/fonts/EBGaramond.ttf"
EB_GARAMOND_IT = "/tmp/fonts/EBGaramond-Italic.ttf"
FONDAMENTO     = "/tmp/fonts/Fondamento-Regular.ttf"
DM_SANS        = "/tmp/fonts/DMSans.ttf"
SYMBOLS        = "/System/Library/Fonts/Apple Symbols.ttf"

SIGNS = [
    ("aries",       "♈", "aries-ram",    "Aries",
     "stops arguing with you.\naries who goes quiet\nis aries who's already\nout the door."),
    ("taurus",      "♉", "taurus",       "Taurus",
     "was patient.\nfor a long time.\nthen one day the warmth\njust turns off. completely."),
    ("gemini",      "♊", "gemini",       "Gemini",
     "has a new best friend.\nyou'll find out about it\nthrough someone else.\nit's already been two weeks."),
    ("cancer",      "♋", "cancer",       "Cancer",
     "stops checking in.\nno more \"did you eat?\"\nno more \"you ok?\"\nyou'll notice when it's gone."),
    ("leo",         "♌", "leo",          "Leo",
     "stops performing for you.\nno more warmth, no more shine.\nleo's attention is a spotlight.\nand they've moved it."),
    ("virgo",       "♍", "virgo",        "Virgo",
     "stops trying to fix things.\nvirgo who's done\ndoesn't criticize.\nthey just stop caring enough to."),
    ("libra",       "♎", "libra",        "Libra",
     "becomes very, very\npolite.\ncold-polite.\nthe kind that means nothing."),
    ("scorpio",     "♏", "scorpio",      "Scorpio",
     "deletes you.\nnot just the number.\nthe memories. the version\nof themselves that knew you."),
    ("sagittarius", "♐", "sagittarius",  "Sagittarius",
     "books a trip.\ntells you about it\nas if you're not\nthe reason they're leaving."),
    ("capricorn",   "♑", "capricorn",    "Capricorn",
     "removes you from\nthe long-term plan.\ncapricorn doesn't grieve.\nthey reorganize."),
    ("aquarius",    "♒", "aquarius",     "Aquarius",
     "starts treating you\nlike an interesting case study.\nobservational.\ndetached. clinical."),
    ("pisces",      "♓", "pisces",       "Pisces",
     "disappears slowly.\nfirst the depth goes.\nthen the replies.\nthen them. entirely."),
]

TITLE_LINES = ["what each sign looks like", "when they're done with you"]
TITLE_SUB   = "gemini season hits different."

os.makedirs(OUT_TIKTOK, exist_ok=True)
os.makedirs(OUT_IG, exist_ok=True)


# ── helpers ───────────────────────────────────────────────────────────────────

def load_texture():
    if not os.path.exists(TEXTURE_PATH):
        return None
    return Image.open(TEXTURE_PATH).convert("RGBA")


def apply_texture(img, tex, opacity=0.12):
    if tex is None:
        return img
    tw, th = tex.size
    overlay = Image.new("RGBA", img.size, (0,0,0,0))
    for x in range(0, img.size[0], tw):
        for y in range(0, img.size[1], th):
            r, g, b, a = tex.split()
            a = a.point(lambda p: int(p * opacity))
            patch = Image.merge("RGBA", (r, g, b, a))
            cw = min(tw, img.size[0] - x)
            ch = min(th, img.size[1] - y)
            overlay.paste(patch.crop((0,0,cw,ch)), (x,y))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def make_plum_bg(w, h):
    img = Image.new("RGBA", (w, h), VOID)
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, int(h * 0.42)
    for r in range(max(w, h), 0, -4):
        frac = r / max(w, h)
        alpha = int(35 * (1 - frac))
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(*PLUM_MID, alpha))
    return img


def circular_crop(path, size):
    """Crop image to a circle."""
    try:
        img = Image.open(path).convert("RGBA").resize((size, size), Image.LANCZOS)
    except Exception:
        return None
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse([0, 0, size, size], fill=255)
    img.putalpha(mask)
    return img


def gold_ring(size, ring_w=6):
    """Draw a gold ring around circle."""
    img = Image.new("RGBA", (size + ring_w*2, size + ring_w*2), (0,0,0,0))
    d = ImageDraw.Draw(img)
    d.ellipse([0, 0, size + ring_w*2, size + ring_w*2], outline=GOLD, width=ring_w)
    return img


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


def draw_centered_text(draw, text, y, w, fnt, color, line_spacing=1.2):
    lines = text.split("\n")
    total_h = 0
    line_sizes = []
    for l in lines:
        bb = draw.textbbox((0, 0), l, font=fnt)
        lh = bb[3] - bb[1]
        line_sizes.append((bb[2]-bb[0], lh))
        total_h += lh
    total_h += int(line_sizes[0][1] * (line_spacing - 1)) * (len(lines) - 1)

    cur_y = y
    for i, (line, (lw, lh)) in enumerate(zip(lines, line_sizes)):
        x = (w - lw) // 2
        draw.text((x, cur_y), line, font=fnt, fill=color)
        cur_y += int(lh * line_spacing)
    return cur_y


def gold_divider(draw, cx, y, width=160):
    draw.line([(cx - width//2, y), (cx + width//2, y)], fill=GOLD_DIM, width=1)
    draw.ellipse([cx-3, y-3, cx+3, y+3], fill=GOLD_DIM)


# ── slide builders ────────────────────────────────────────────────────────────

def make_title_slide(w, h, tex):
    bg = make_plum_bg(w, h)
    bg = apply_texture(bg, tex)
    draw = ImageDraw.Draw(bg)

    cx = w // 2

    # Top ornament line
    gold_divider(draw, cx, int(h * 0.22), width=200)

    # Brand tag
    f_brand = font(DM_SANS, 28 if h > 1000 else 22)
    draw.text((cx - draw.textlength("SIGN SEASON", font=f_brand)//2, int(h * 0.24)),
              "SIGN SEASON", font=f_brand, fill=GOLD_DIM)

    # Main title — use smaller font to keep text away from edges
    f_title = font(FONDAMENTO, 68 if h > 1000 else 50)
    title_y = int(h * 0.32)
    for line in TITLE_LINES:
        lw = draw.textlength(line, font=f_title)
        draw.text(((w - lw)//2, title_y), line, font=f_title, fill=GOLD_LIGHT)
        title_y += 80 if h > 1000 else 58

    # Subtitle
    f_sub = font(EB_GARAMOND_IT, 44 if h > 1000 else 32)
    sub_y = title_y + 20
    sw = draw.textlength(TITLE_SUB, font=f_sub)
    draw.text(((w - sw)//2, sub_y), TITLE_SUB, font=f_sub, fill=GOLD_PALE)

    # Engravings — 4-grid preview
    preview_signs = ["aries-ram", "scorpio", "pisces", "gemini"]
    circ_size = 200 if h > 1000 else 140
    spacing = 30
    total_w = circ_size * 4 + spacing * 3
    start_x = (w - total_w) // 2
    circ_y = int(h * 0.58)

    for i, sname in enumerate(preview_signs):
        path = os.path.join(SIGNS_DIR, f"{sname}.png")
        circ = circular_crop(path, circ_size)
        if circ:
            ring = gold_ring(circ_size, ring_w=4)
            px = start_x + i * (circ_size + spacing)
            bg.alpha_composite(ring, (px - 4, circ_y - 4))
            bg.alpha_composite(circ, (px, circ_y))

    # Bottom divider + swipe cue
    gold_divider(draw, cx, int(h * 0.82), width=200)
    f_cue = font(DM_SANS, 28 if h > 1000 else 22)
    cue = "swipe to find your sign →"
    draw.text((cx - draw.textlength(cue, font=f_cue)//2, int(h * 0.84)),
              cue, font=f_cue, fill=WARM_GRAY)

    # Bottom tag
    f_tag = font(DM_SANS, 24 if h > 1000 else 18)
    tag = "@sign_season"
    draw.text((cx - draw.textlength(tag, font=f_tag)//2, int(h * 0.92)),
              tag, font=f_tag, fill=GOLD_DIM)

    return bg.convert("RGB")


def make_sign_slide(w, h, tex, sign_key, symbol, img_key, label, copy_text):
    bg = make_plum_bg(w, h)
    bg = apply_texture(bg, tex)
    draw = ImageDraw.Draw(bg)
    cx = w // 2

    # Circular engraving — shifted down to better center content on slide
    circ_size = 340 if h > 1000 else 240
    img_path = os.path.join(SIGNS_DIR, f"{img_key}.png")
    circ = circular_crop(img_path, circ_size)
    circ_y = int(h * 0.28)
    if circ:
        ring = gold_ring(circ_size, ring_w=6)
        bg.alpha_composite(ring, (cx - circ_size//2 - 6, circ_y - 6))
        bg.alpha_composite(circ, (cx - circ_size//2, circ_y))

    # Zodiac symbol (Apple Symbols)
    sym_y = circ_y + circ_size + (20 if h > 1000 else 12)
    try:
        f_sym = ImageFont.truetype(SYMBOLS, 42 if h > 1000 else 30)
        sym_w = draw.textlength(symbol, font=f_sym)
        draw.text(((w - sym_w)//2, sym_y), symbol, font=f_sym, fill=GOLD)
    except Exception:
        pass

    # Sign label
    f_label = font(FONDAMENTO, 88 if h > 1000 else 62)
    label_y = sym_y + (56 if h > 1000 else 40)
    lw = draw.textlength(label, font=f_label)
    draw.text(((w - lw)//2, label_y), label, font=f_label, fill=GOLD_LIGHT)

    # Divider
    div_y = label_y + (100 if h > 1000 else 72)
    gold_divider(draw, cx, div_y, width=160)

    # Copy text
    f_copy = font(EB_GARAMOND_IT, 52 if h > 1000 else 38)
    text_y = div_y + (30 if h > 1000 else 22)
    lines = copy_text.split("\n")
    for line in lines:
        lw = draw.textlength(line, font=f_copy)
        draw.text(((w - lw)//2, text_y), line, font=f_copy, fill=PARCHMENT)
        text_y += int((52 if h > 1000 else 38) * 1.38)

    # Bottom tag
    f_tag = font(DM_SANS, 26 if h > 1000 else 20)
    tag = "signseason.com"
    tw = draw.textlength(tag, font=f_tag)
    draw.text(((w - tw)//2, int(h * 0.93)), tag, font=f_tag, fill=GOLD_DIM)

    return bg.convert("RGB")


def make_outro_slide(w, h, tex):
    bg = make_plum_bg(w, h)
    bg = apply_texture(bg, tex)
    draw = ImageDraw.Draw(bg)
    cx = w // 2

    gold_divider(draw, cx, int(h * 0.34), width=200)

    f_main = font(FONDAMENTO, 72 if h > 1000 else 52)
    lines = ["which sign are you?", "tag them."]
    y = int(h * 0.38)
    for line in lines:
        lw = draw.textlength(line, font=f_main)
        draw.text(((w-lw)//2, y), line, font=f_main, fill=GOLD_LIGHT)
        y += 94 if h > 1000 else 68

    f_sub = font(EB_GARAMOND_IT, 46 if h > 1000 else 34)
    sub = "follow for your daily dose."
    sw = draw.textlength(sub, font=f_sub)
    draw.text(((w-sw)//2, y + 24), sub, font=f_sub, fill=GOLD_PALE)

    gold_divider(draw, cx, int(h * 0.70), width=200)

    f_handle = font(DM_SANS, 32 if h > 1000 else 24)
    handle = "@sign_season  •  signseason.com"
    hw = draw.textlength(handle, font=f_handle)
    draw.text(((w-hw)//2, int(h * 0.73)), handle, font=f_handle, fill=GOLD_DIM)

    return bg.convert("RGB")


# ── main ──────────────────────────────────────────────────────────────────────

def generate(out_dir, w, h):
    tex = load_texture()
    print(f"Generating {w}x{h} → {out_dir}")

    # Title
    title = make_title_slide(w, h, tex)
    title.save(os.path.join(out_dir, "slide-00-title.png"))
    print("  slide-00-title.png")

    # 12 sign slides
    for i, (sign_key, symbol, img_key, label, copy_text) in enumerate(SIGNS, 1):
        slide = make_sign_slide(w, h, tex, sign_key, symbol, img_key, label, copy_text)
        fname = f"slide-{i:02d}-{sign_key}.png"
        slide.save(os.path.join(out_dir, fname))
        print(f"  {fname}")

    # Outro
    outro = make_outro_slide(w, h, tex)
    outro.save(os.path.join(out_dir, "slide-13-outro.png"))
    print("  slide-13-outro.png")
    print(f"Done — {out_dir}")


if __name__ == "__main__":
    generate(OUT_TIKTOK, 1080, 1920)  # TikTok portrait
    generate(OUT_IG, 1080, 1350)      # IG portrait
    print("\nAll done.")
