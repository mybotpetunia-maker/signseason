#!/usr/bin/env python3
"""Apr 11 — Each Sign's Weekend Mood (TC format: text card, plum bg)"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

# === Brand colors ===
VOID = (30, 21, 40)
PLUM = (42, 31, 51)
PLUM_MID = (53, 40, 64)
GOLD = (201, 173, 111)
GOLD_LIGHT = (212, 188, 124)
GOLD_PALE = (226, 212, 167)
GOLD_DIM = (176, 154, 110)

# === Paths ===
TEXTURE = os.path.expanduser("~/.openclaw/workspace/signseason/assets/textures/velvet-noise.png")
OUT_DIR = os.path.expanduser("~/.openclaw/workspace/signseason/content/social/slides-2026-04-11-tiktok")

# === Fonts ===
EB_GARAMOND = "/tmp/fonts/EBGaramond.ttf"
EB_GARAMOND_IT = "/tmp/fonts/EBGaramond-Italic.ttf"
FONDAMENTO = "/tmp/fonts/Fondamento-Regular.ttf"
DM_SANS = "/tmp/fonts/DMSans.ttf"
SYMBOLS = "/System/Library/Fonts/Apple Symbols.ttf"

W, H = 1080, 1350

SIGNS = [
    ("aries",       "♈", "already texted three people,\nstarted a project, and\nabandoned it. thriving."),
    ("taurus",      "♉", "horizontal. snacks. something\ncomforting on in the background.\nperfect. no notes."),
    ("gemini",      "♊", "double-booked themselves,\ncanceled one, feels guilty,\ntexted both people anyway."),
    ("cancer",      "♋", "hosting something small that\nbecame a whole thing.\ndeep down they love it."),
    ("leo",         "♌", "outfit planned since Wednesday.\nwill look incredible.\neveryone will know it."),
    ("virgo",       "♍", "cleaning, then relaxing, then\ncleaning again because relaxing\nfelt suspicious."),
    ("libra",       "♎", "still deciding between\ntwo plans they both\nsaid yes to. classic."),
    ("scorpio",     "♏", "doing exactly what they\nwant and not telling\nanyone about it. perfect."),
    ("sagittarius", "♐", "said 'I might go'\nto five things. will\nshow up to one."),
    ("capricorn",   "♑", "technically off. technically still\nchecking email. technically lying\nto themselves about resting."),
    ("aquarius",    "♒", "deep in a documentary\nor a rabbit hole\nor some inexplicable side project."),
    ("pisces",      "♓", "drifted into a feeling,\nfollowed it, ended up\nsomewhere beautiful and random."),
]


def load_texture():
    if os.path.exists(TEXTURE):
        return Image.open(TEXTURE).convert("RGBA")
    return None


def apply_texture(img, tex, opacity=0.12):
    if tex is None:
        return img
    tw, th = tex.size
    for x in range(0, img.width, tw):
        for y in range(0, img.height, th):
            region = tex.crop((0, 0, min(tw, img.width - x), min(th, img.height - y)))
            r, g, b, a = region.split()
            a = a.point(lambda p: int(p * opacity))
            region = Image.merge("RGBA", (r, g, b, a))
            img.alpha_composite(region, (x, y))
    return img


def make_plum_bg():
    img = Image.new("RGBA", (W, H), VOID)
    draw = ImageDraw.Draw(img)
    cx, cy = W // 2, int(H * 0.4)
    max_r = max(W, H)
    for r in range(max_r, 0, -4):
        frac = r / max_r
        alpha = int(35 * (1 - frac))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*PLUM_MID, alpha))
    return img


def draw_gold_border(draw, margin=28, width=1):
    draw.rectangle([margin, margin, W - margin, H - margin], outline=GOLD_DIM, width=width)


def draw_centered_text(draw, text, y, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (W - tw) // 2
    draw.text((x, y), text, font=font, fill=fill)
    return bbox[3] - bbox[1]


def make_title_slide(tex):
    img = make_plum_bg()
    img = apply_texture(img, tex)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw)

    # Vertical center block: compute total height first
    # "EACH SIGN'S" label
    font_label = ImageFont.truetype(DM_SANS, 34)
    # "Weekend Mood" title
    font_title = ImageFont.truetype(EB_GARAMOND_IT, 88)
    # divider + tap line
    font_dots = ImageFont.truetype(DM_SANS, 28)
    font_tag = ImageFont.truetype(DM_SANS, 28)

    label_h = 34
    title_h = 88
    dots_h = 28
    tag_h = 28
    gap = 24
    total_block = label_h + gap + title_h + gap + dots_h + gap + tag_h

    # Push content down — font metrics tend to report taller than visual height
    # so centering with raw metrics sits too high
    y_start = (H - total_block) // 2 + 60

    # Letter-spaced "EACH SIGN'S"
    spaced = "E A C H   S I G N ' S"
    bbox = draw.textbbox((0, 0), spaced, font=font_label)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, y_start), spaced, font=font_label, fill=GOLD_DIM)
    y_cur = y_start + label_h + gap

    draw_centered_text(draw, "Weekend Mood", y_cur, font_title, GOLD)
    y_cur += title_h + gap

    draw_centered_text(draw, "·  ·  ·", y_cur, font_dots, GOLD_DIM)
    y_cur += dots_h + gap

    # "tap for your sign" in italic — use EB Garamond Italic for warmth
    font_tap = ImageFont.truetype(EB_GARAMOND_IT, 32)
    draw_centered_text(draw, "tap for your sign", y_cur, font_tap, GOLD_DIM)

    # Decorative thin horizontal lines above title block (no emoji — Pillow can't render them)
    lw = 120
    draw.line([(W // 2 - lw, y_start - 40), (W // 2 + lw, y_start - 40)], fill=GOLD_DIM, width=1)
    draw.line([(W // 2 - lw // 2, y_start - 28), (W // 2 + lw // 2, y_start - 28)], fill=GOLD_DIM, width=1)

    # Branding
    font_brand = ImageFont.truetype(DM_SANS, 22)
    draw_centered_text(draw, "Sign Season", H - 70, font_brand, GOLD_DIM)

    return img


def make_sign_slide(sign, symbol, body_text, tex):
    img = make_plum_bg()
    img = apply_texture(img, tex)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw)

    # Fonts
    font_sym = ImageFont.truetype(SYMBOLS, 52)   # bumped up for visibility
    font_name = ImageFont.truetype(FONDAMENTO, 42)
    font_body = ImageFont.truetype(EB_GARAMOND_IT, 52)
    font_brand = ImageFont.truetype(DM_SANS, 22)

    # Measure actual rendered heights for precise centering
    dummy_draw = draw  # reuse draw for measuring

    sym_bbox = dummy_draw.textbbox((0, 0), symbol, font=font_sym)
    sym_h = sym_bbox[3] - sym_bbox[1]

    name_bbox = dummy_draw.textbbox((0, 0), sign.capitalize(), font=font_name)
    name_h = name_bbox[3] - name_bbox[1]

    # Body text
    lines = body_text.split("\n")
    line_spacing = 76  # generous: 52px font + 24px gap

    body_bbox = dummy_draw.textbbox((0, 0), lines[0], font=font_body)
    single_line_h = body_bbox[3] - body_bbox[1]
    body_block_h = single_line_h + (len(lines) - 1) * line_spacing

    sym_to_name_gap = 20
    name_to_divider = 24
    divider_gap = 24
    divider_to_body = 36

    total_h = (sym_h + sym_to_name_gap + name_h + name_to_divider + 1
               + divider_gap + divider_to_body + body_block_h)

    # Center in the zone between border and watermark, then nudge down
    # because font metrics over-report height making raw center look too high
    SAFE_TOP = 60   # inside border + breathing room
    SAFE_BOT = 110  # above watermark
    available = H - SAFE_TOP - SAFE_BOT
    y_start = SAFE_TOP + (available - total_h) // 2 + 80

    # Zodiac symbol (Apple Symbols — no emoji)
    y_sym = y_start
    draw_centered_text(draw, symbol, y_sym, font_sym, GOLD)
    y_cur = y_sym + sym_h + sym_to_name_gap

    # Sign name
    draw_centered_text(draw, sign.capitalize(), y_cur, font_name, GOLD)
    y_cur += name_h + name_to_divider

    # Thin decorative line
    lw = 80
    draw.line([(W // 2 - lw, y_cur), (W // 2 + lw, y_cur)], fill=GOLD_DIM, width=1)
    y_cur += 1 + divider_gap + divider_to_body

    # Body text — 3 lines, generous spacing
    for line in lines:
        draw_centered_text(draw, line, y_cur, font_body, GOLD_PALE)
        y_cur += line_spacing

    # Watermark bottom
    draw_centered_text(draw, "Sign Season", H - 65, font_brand, GOLD_DIM)

    return img


def make_closing_slide(tex):
    img = make_plum_bg()
    img = apply_texture(img, tex)
    draw = ImageDraw.Draw(img)
    draw_gold_border(draw)

    font_q = ImageFont.truetype(EB_GARAMOND_IT, 52)
    font_cta = ImageFont.truetype(DM_SANS, 28)
    font_brand_f = ImageFont.truetype(FONDAMENTO, 38)
    font_brand_s = ImageFont.truetype(DM_SANS, 24)

    # Question
    q_lines = ["what's your sign's mood", "this weekend?"]
    line_spacing = 68
    total_q = len(q_lines) * line_spacing
    gap_after_q = 32
    cta_h = 28
    gap_after_cta = 48
    brand_h = 38
    gap_after_brand = 16
    url_h = 24

    total_block = total_q + gap_after_q + cta_h + gap_after_cta + brand_h + gap_after_brand + url_h
    y_cur = (H - total_block) // 2

    for line in q_lines:
        draw_centered_text(draw, line, y_cur, font_q, GOLD_PALE)
        y_cur += line_spacing

    y_cur += gap_after_q
    draw_centered_text(draw, "follow for daily sign content", y_cur, font_cta, GOLD_DIM)
    y_cur += cta_h + gap_after_cta

    draw_centered_text(draw, "Sign Season", y_cur, font_brand_f, GOLD)
    y_cur += brand_h + gap_after_brand

    draw_centered_text(draw, "signseason.com", y_cur, font_brand_s, GOLD_DIM)

    return img


def generate_all():
    os.makedirs(OUT_DIR, exist_ok=True)
    tex = load_texture()

    # Title
    title = make_title_slide(tex)
    title.convert("RGB").save(f"{OUT_DIR}/slide-01-title.png", quality=95)
    print(f"  slide-01-title.png")

    # Sign slides
    for i, (sign, sym, body) in enumerate(SIGNS):
        slide = make_sign_slide(sign, sym, body, tex)
        fname = f"slide-{i+2:02d}-{sign}.png"
        slide.convert("RGB").save(f"{OUT_DIR}/{fname}", quality=95)
        print(f"  {fname}")

    # Closing CTA
    cta = make_closing_slide(tex)
    cta.convert("RGB").save(f"{OUT_DIR}/slide-14-closing.png", quality=95)
    print(f"  slide-14-closing.png")

    print(f"\nDone! 14 slides → {OUT_DIR}")


if __name__ == "__main__":
    print("Generating Apr 11 slides: Each Sign's Weekend Mood")
    generate_all()
