# Sign Season — Visual Brand System

_Defined March 29, 2026. This is the single source of truth for all Sign Season visual content._

---

## Brand Anchor

The PFP: gold stipple sun engraving on deep plum. Classical celestial atlas meets luxury tarot deck. Everything we make should feel like it came from the same world as that image.

**PFP location:** `signseason/assets/illustrations/pfp.png`

---

## Social Handles

- **TikTok:** @sign_season
- **Instagram:** @signseasonco
- **Website:** signseason.com

---

## Color Palette

| Token | Name | Hex | RGB | Usage |
|-------|------|-----|-----|-------|
| `--plum` | Plum | `#2A1F33` | (42, 31, 51) | Primary background |
| `--deep-night` | Deep Night | `#1A1320` | (26, 19, 32) | Darker bg variant, grid gaps |
| `--gold` | Gold | `#C9AD6F` | (201, 173, 111) | Primary accent, stars, highlights |
| `--gold-dim` | Gold Dim | `#B09A6E` | (176, 154, 110) | Secondary text, subtitles |
| `--parchment` | Parchment | `#F0E8D8` | (240, 232, 216) | Heading text on dark, editorial bg |
| `--cream` | Cream | `#D4C8B4` | (212, 200, 180) | Body text on dark |
| `--warm-gray` | Warm Gray | `#8A7D70` | (138, 125, 112) | Tertiary, footnotes, dates |

### Background Variants
- **Dark (default):** Radial gradient from `--deep-night` edges to `--plum` center, with gold star speckles
- **Light (editorial):** Radial gradient from `#E6DEC8` edges to `--parchment` center
- **Photo:** Celestial photography with dark overlay (rgba(20, 15, 30, 0.4)) for text readability

---

## Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display/Wordmark | Fondamento Italic | 400i | Brand name, decorative |
| Headlines | EB Garamond (or Times New Roman as fallback) | Bold/Regular | Slide headlines, card titles |
| Headlines (italic) | EB Garamond Italic (or TNR Italic) | 400i | Quotes, editorial text, subtitles |
| Body | DM Sans (or Avenir Next as fallback) | 400 | Descriptions, CTAs, small text |
| Labels | Space Mono (or Courier New as fallback) | 400 | Dates, zodiac labels, categories |

### Type Hierarchy by Platform

**Rule: Nothing under 30px on any canvas except footers. If you can't read it on a phone, it's too small.**

Phone rendering context: a 1080px canvas displays at ~390px on most phones. That's a ~2.77x reduction. So 40px on canvas ≈ 14px on phone.

#### TikTok (1080 x 1920, 9:16)
**Margins: 120px (11% each side). Max text width: 840px.**

| Element | Font | Size | Weight/Style | Color |
|---------|------|------|-------------|-------|
| Headline | Serif (TNR) | **80px** | **Bold** | Parchment |
| Body/Subtitle | Serif (TNR) | **48px** | **Italic** (unbolded) | Gold Bright (#DAC080) |
| Zodiac Symbols | Apple Color Emoji | **56px** | — | Warm Gray |
| Label Text | Mono (Courier) | **28px** | Regular | Warm Gray |
| Slide Counter | Serif | **24px** | Regular | Gold Dim |
| URL Footer | Sans (Avenir) | **22px** | Regular | Warm Gray |
| Gap (headline→body) | — | **80px** | — | — |
| Body line spacing | — | **1.7x** | — | — |
| Headline line spacing | — | **1.3x** | — | — |

*Phone rendering: headline ~29px, body ~17px.*

#### Instagram Carousel (1080 x 1350, 4:5)
**Margins: 120px (11% each side). Max text width: 840px.**

| Element | Font | Size | Weight/Style | Color |
|---------|------|------|-------------|-------|
| Headline | Serif (TNR) | **72px** | **Bold** | Parchment |
| Body/Subtitle | Serif (TNR) | **42px** | **Italic** (unbolded) | Gold Bright (#DAC080) |
| Zodiac Symbols | Apple Color Emoji | **48px** | — | Warm Gray |
| Label Text | Mono (Courier) | **24px** | Regular | Warm Gray |
| Slide Counter | Serif | **22px** | Regular | Gold Dim |
| URL Footer | Sans (Avenir) | **18px** | Regular | Warm Gray |
| Gap (headline→body) | — | **60px** | — | — |
| Body line spacing | — | **1.7x** | — | — |
| Headline line spacing | — | **1.3x** | — | — |

*Phone rendering: headline ~26px, body ~15px.*

#### Instagram Single Post (1080 x 1080, 1:1)
**Margins: 120px.**

| Element | Font | Size | Weight/Style | Color |
|---------|------|------|-------------|-------|
| Headline | Serif (TNR) | **76px** | **Bold** | Parchment or Plum |
| Body/Subtitle | Serif (TNR) | **44px** | **Italic** (unbolded) | Gold or Warm Gray |
| Zodiac Symbols | Apple Color Emoji | **52px** | — | — |
| URL Footer | Sans (Avenir) | **20px** | Regular | Warm Gray |

#### Pinterest Pin (1000 x 1500, 2:3)
Pinterest renders pins SMALL in the feed (~236px wide). All text must be oversized.
**Margins: 70px minimum.**

| Element | Font | Size | Weight/Style | Color |
|---------|------|------|-------------|-------|
| Title | Serif (TNR) | **90px** | **Bold** | Plum |
| Sign Names/Labels | Serif (TNR) | **36px** | **Bold** | Plum |
| Advice/Body | Serif (TNR) | **32px** | **Italic** | Warm Gray Dark (#6C5F52) |
| Category Label | Mono (Courier) | **28px** | Regular | Warm Gray |
| URL Footer | Sans (Avenir) | **28px** | Regular | Plum |
| Subtitle | Serif (TNR) | **36px** | Italic | Warm Gray |

*Pin feed rendering: title ~21px, body ~8px. Tap-to-expand roughly 2x.*

#### Stories / Reels Cover (1080 x 1920, 9:16)
Same specs as TikTok.

#### Emoji Rendering
- Times New Roman does NOT support zodiac/emoji glyphs (renders as empty boxes)
- Apple Color Emoji fails in Pillow ("invalid pixel size") — do NOT use
- Use **Apple Symbols** font (`/System/Library/Fonts/Apple Symbols.ttf`) for zodiac glyphs — heaviest strokes, best visibility on dark backgrounds
- Render zodiac symbols at **1.5-2x** the surrounding text size for visual presence
- Mixed rendering: split text into segments, use TNR for letters, Apple Symbols for zodiac glyphs
- **NEVER use modern emoji** (✨🔥💀 etc) on slides — they render as empty boxes in Pillow. Zodiac symbols (♈-♓) only.

#### Hierarchy Rule
**Headlines = Bold. Body = Italic (unbolded). Never both bold.** Size ratio: body should be ~55-60% of headline. This creates three layers of differentiation: weight + size + style. Margins must be 120px minimum (11%+ each side).

---

## Design Elements

### Gold Border Frame
- Thin 1px border, `--gold` at 24% opacity (60/255)
- 40px margin from edges (30px on engraving posts)
- Used on text cards and engraving posts

### Decorative Divider
- Thin horizontal line, 90px wide, centered
- Color: `--warm-gray` or `--gold` at low opacity
- Placed above headline text

### Star Field
- 40-55 gold-tinted dots per 1080x1080
- RGBA: `(201, 173, 111, alpha)` where alpha = 20-55
- Size: 1px dots (no larger)
- Random but seeded for consistency within a post

### Engraving Illustrations (DALL-E)
- Style: "stipple engraving, gold ink on deep plum purple (#2A1F33), classical celestial atlas from 1800s, fine dot stippling technique"
- Used for: zodiac animal/symbol features
- Always include gold border frame
- Zodiac label at bottom: serif font, `--gold`

---

## Post Types (4-type rotation)

### 1. Text Cards
- **Background:** Dark (plum radial gradient + gold stars)
- **Border:** Gold frame
- **Text:** Parchment headlines, Gold Dim subtitles
- **Use for:** Carousel covers, zodiac trait lists, red flags, rankings, CTAs

### 2. Engraving Illustrations
- **Background:** DALL-E generated, matching PFP stipple style
- **Border:** Gold frame
- **Label:** Zodiac name + symbol at bottom in gold
- **Use for:** Zodiac sign features, sign-of-the-month intros

### 3. Editorial Quotes
- **Background:** Light (parchment radial gradient)
- **Border:** Plum frame
- **Text:** Plum italic headlines, Warm Gray attribution
- **Label:** Mono category text at top (e.g., "ARIES SEASON")
- **Use for:** Reflective quotes, poetic zodiac content, deeper insights

### 4. Photo + Overlay
- **Background:** DALL-E celestial photography (moons, night skies, stars)
- **Overlay:** Dark semi-transparent layer for readability
- **Text:** Gold or Parchment italic
- **Use for:** Seasonal announcements, retrograde alerts, moon phases

---

## Grid Pattern (3-column IG feed)

```
[Text Card]     [Engraving]    [Editorial]
[Photo+Overlay] [Text Card]    [Engraving]
[Editorial]     [Photo+Overlay] [Text Card]
```

The diagonal rotation ensures:
- No two adjacent posts are the same type
- Dark and light posts alternate for visual rhythm
- The grid reads as cohesive from profile view

---

## Carousel Format Specs

### TikTok / IG Reels / Stories
- **Dimensions:** 1080 x 1920 (9:16)
- **CTA slide handle:** @sign_season (TikTok) / @signseasonco (IG)

### IG Feed Carousel
- **Dimensions:** 1080 x 1350 (4:5)
- **CTA slide handle:** @signseasonco

### IG Feed Single Post / Grid Preview
- **Dimensions:** 1080 x 1080 (1:1)

---

## DALL-E Prompt Templates

### Zodiac Engraving
```
A detailed stipple engraving illustration of a [ZODIAC ANIMAL] in a classical celestial atlas style, gold ink on deep plum purple background (#2A1F33). Fine dot stippling technique like an 1800s astronomy textbook. [POSE/ANGLE DESCRIPTION]. Surrounded by subtle star map lines and constellation dots. No text. Square format.
```

### Celestial Photography
```
[SCENE DESCRIPTION — moon, night sky, stars, etc.]. Deep plum and navy sky with warm golden light. Moody, intimate, contemplative. Film grain texture. Color palette: deep plum (#2A1F33), gold (#C9AD6F), dark navy (#1A1320). No text. Square format. Fine art photography style.
```

---

## Inspo References
- **@sistersvillage** — dark monochrome consistency, text-forward
- **@thepulpgirls** — illustrated warmth, artistic variety
- **@moonomens** — editorial quality, mixed media rhythm (closest comp)

---

## Asset Locations
- PFP: `signseason/assets/illustrations/pfp.png`
- Grid mockup: `signseason/content/social/grid-mockup/`
- TikTok slides: `signseason/content/social/slides-YYYY-MM-DD/`
- IG carousel slides: `signseason/content/social/slides-YYYY-MM-DD-ig/`

---

_This system is the law. Every visual asset gets checked against it before posting._
