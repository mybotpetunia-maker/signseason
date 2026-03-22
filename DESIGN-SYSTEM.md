# Sign Season — Design System

_Classical mysticism meets editorial precision._

## Design Philosophy

**Classical, not new-age.** The visual language pulls from astronomical atlases, copperplate engravings, and European print tradition. This is astrology through the lens of a rare bookshop, not a crystal shop on Etsy.

**Monochromatic discipline.** Limited palette, maximum impact. Every color earns its place. If we need more visual interest, we add texture or illustration, not another accent color.

**Editorial asymmetry.** Text placed with intention, not just centered. Layouts should feel curated, like a gallery wall or a well-designed magazine spread.

**Dark mode is the cosmos.** The deep purple background isn't just "dark mode." It's the night sky. Content floats in space.

---

## Color Palette

### Primary Surface
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-cosmos` | `#1A1030` | Primary background. Deep aubergine-violet, richer than pure black. |
| `--color-cosmos-light` | `#241845` | Elevated surfaces: cards, modals, nav. Subtle lift from base. |
| `--color-cosmos-accent` | `#2E2055` | Borders, dividers, hover states on surfaces. |

### Content Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-lavender` | `#9B8EC4` | Primary text color. Soft periwinkle on dark surfaces. Warm, not clinical white. |
| `--color-lavender-light` | `#C4B8E8` | Headlines, emphasis text. Brighter lavender for hierarchy. |
| `--color-lavender-muted` | `#6B5F8A` | Secondary text: dates, captions, metadata. |
| `--color-cream` | `#F5F0E8` | High-contrast moments only: CTAs, critical UI, card surfaces when needed. Warm ivory, not stark white. |

### Accent
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-gold` | `#C4A44A` | Antiqued brass gold. Stars, highlights, hover accents. Warmer and more muted than the previous bright gold. |
| `--color-gold-muted` | `#8A7635` | Gold at reduced intensity for borders, subtle star elements. |

### Semantic Mapping
```css
--color-bg:          var(--color-cosmos);
--color-bg-card:     var(--color-cosmos-light);
--color-bg-elevated: var(--color-cosmos-accent);
--color-text:        var(--color-lavender);
--color-text-emphasis: var(--color-lavender-light);
--color-text-muted:  var(--color-lavender-muted);
--color-text-high:   var(--color-cream);
--color-accent:      var(--color-gold);
--color-accent-muted: var(--color-gold-muted);
--color-border:      var(--color-cosmos-accent);
--color-cta-bg:      var(--color-cream);
--color-cta-text:    var(--color-cosmos);
```

### What Changed from V1
- Killed `--color-cosmic-violet` (#7B68EE) — too saturated, too "tech startup"
- Killed `--color-nebula-pink` — unnecessary, added visual noise
- Background shifted from near-black navy (#0D0D1A) to aubergine-violet (#1A1030) — warmer, more distinctive
- Text shifted from near-white (#F0EEFF) to lavender (#9B8EC4) — softer, more atmospheric
- Gold shifted from bright (#E8C547) to antiqued brass (#C4A44A) — feels aged, luxe, not shiny
- Cream introduced (#F5F0E8) for high-contrast moments — warm ivory, like the paper stock in the reference

---

## Typography

### Display — Headlines & Wordmark
**Font:** Custom display serif with Art Nouveau character. Candidates:
- **Cormorant Garamond** (Google Fonts, free) — high contrast, elegant, classical
- **Playfair Display** (current) — acceptable but more generic
- **Freight Display** (paid) — closest to the Third House reference

**Recommendation:** Switch to **Cormorant Garamond** for display. It has the high thick/thin contrast and classical engraving quality from the reference, and it's free via Google Fonts.

**Usage:**
- Hero headlines: `--text-5xl` (3.5rem), `--weight-bold`, uppercase, letter-spacing 0.08em
- Section headlines: `--text-3xl` (2rem), `--weight-semibold`, title case
- Card titles: `--text-xl` (1.25rem), `--weight-semibold`

### Body — Running Text & UI
**Font:** **DM Sans** (keeping this — it's clean, warm, excellent readability)

**Usage:**
- Body text: `--text-base` (1rem), `--weight-normal`, line-height 1.7
- Captions & metadata: `--text-sm` (0.875rem), `--weight-normal`
- Labels & tags: `--text-xs` (0.75rem), `--weight-medium`, uppercase, letter-spacing 0.12em

### Accent — Data & Details
**Font:** **Space Mono** (keeping this — space-age monospace fits the celestial theme)

**Usage:**
- Zodiac symbols, dates, chart coordinates
- Small data callouts
- Never for body text

### Hierarchy Rules
1. **Only one display-size element per viewport.** If the hero headline is huge, nothing else on screen competes.
2. **Labels are always uppercase, tracked wide.** This is the "address on the business card" treatment from the reference.
3. **Body text is always sentence case, generous line height.** Readability over style.

---

## Spacing System

Base unit: **8px (0.5rem)**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 0.25rem (4px) | Tight gaps: icon-to-text |
| `--space-2` | 0.5rem (8px) | Base unit: inline spacing |
| `--space-3` | 0.75rem (12px) | Small component padding |
| `--space-4` | 1rem (16px) | Standard component padding |
| `--space-6` | 1.5rem (24px) | Between related elements |
| `--space-8` | 2rem (32px) | Between components |
| `--space-12` | 3rem (48px) | Between sections |
| `--space-16` | 4rem (64px) | Major section breaks |
| `--space-24` | 6rem (96px) | Page-level vertical rhythm |

### Section Rhythm
Sections alternate between `--space-16` and `--space-24` vertical padding. No two sections should feel like they run together. The reference image had generous negative space. Breathe.

---

## Illustration Style

### Primary Style: Copperplate Engraving
Inspired directly by the Third House ram illustration:
- **Fine crosshatching and contour lines** mimicking 18th-19th century astronomical/astrological atlas plates
- **Single color** (lavender-light on cosmos background, or cosmos on cream cards)
- **Classical, dignified poses** for zodiac animals/figures
- **Decorative scrollwork borders** — baroque/rococo cartouche elements as section ornaments
- **Star burst motifs** as dividers and accents

### Where Illustrations Go
- **Zodiac cards:** Each of the 12 signs gets a copperplate-style illustration (ram, bull, twins, crab, lion, maiden, scales, scorpion, archer, sea-goat, water-bearer, fish)
- **Section dividers:** Scrollwork ornaments between major page sections
- **Hero accents:** Star fields or celestial map fragments as background texture
- **Content pages:** Small inline illustrations at section heads

### What to Avoid
- Generic zodiac symbol clip art (♈︎ as a graphic element is fine in mono/code contexts, not as illustration)
- Neon/gradient zodiac art
- 3D renders
- Anything that reads "Canva template"
- Realistic photo-style AI art of mystical objects (crystals, candles) — save photography for social, not the site

### Generation Approach
Use AI image generation (ChatGPT/DALL-E or Midjourney) with prompts targeting:
- "copperplate engraving style"
- "astronomical atlas illustration"
- "18th century natural history illustration"
- "single color line art on transparent background"
- "baroque scrollwork border ornament"

---

## Component Patterns

### Cards (Zodiac Grid, Explore, Content)
```
┌─────────────────────────────────┐
│                                 │  bg: --color-cosmos-light
│   [Engraving illustration]     │  border: 1px solid --color-cosmos-accent
│                                 │  border-radius: --radius-md (8px)
│   ZODIAC SIGN                  │  padding: --space-6 to --space-8
│   Date Range                   │  
│   Brief description            │  hover: border-color → --color-gold-muted
│                                 │         subtle glow, slight translateY(-2px)
└─────────────────────────────────┘
```

**Rules:**
- Cards always have visible borders (lesson from Pentagram: "no tappable affordance")
- Hover state includes both color shift and subtle motion
- Illustrations are centered, text below
- Title in display serif, metadata in body sans, uppercase tracked

### Buttons / CTAs
**Primary (cream on dark):**
- Background: `--color-cream`
- Text: `--color-cosmos`
- Font: DM Sans, `--weight-medium`, uppercase, tracked
- Padding: `--space-3` vertical, `--space-6` horizontal
- Border-radius: `--radius-sm` (4px) — not too rounded, keeps the editorial feel
- Hover: background shifts to `--color-gold`, text stays dark

**Secondary (outline):**
- Background: transparent
- Border: 1px solid `--color-lavender-muted`
- Text: `--color-lavender`
- Hover: border and text shift to `--color-lavender-light`

### Email Input
**The #1 conversion killer from the Pentagram review.** Must be unmissable.
- Input field: `--color-cream` background, `--color-cosmos` text
- Visible, high-contrast, full-width on mobile
- Paired with cream CTA button inline (on desktop) or stacked (mobile)
- Label above in `--color-lavender-light`: "Get your weekly horoscope"
- Placeholder text in `--color-lavender-muted` on cream: "your@email.com"

### Section Layout
```
[Section Label — uppercase, tracked, gold, DM Sans]

[Section Headline — display serif, lavender-light, large]

[Body content / cards / grid]

─── ✦ ─── [ornamental divider] ─── ✦ ───

[Next section]
```

### Navigation
- Minimal. Wordmark left, 2-3 text links right.
- Sticky on scroll with subtle backdrop blur
- Font: DM Sans, `--weight-medium`, `--text-sm`
- Links in `--color-lavender`, hover to `--color-lavender-light`
- No hamburger menu unless truly needed at mobile

---

## Layout Grid

- **Max width:** 1200px (content), centered with auto margins
- **Content column:** 720px for long-form reading
- **Zodiac grid:** 3 columns desktop, 2 tablet, 1 mobile (with proper gutters of `--space-6`)
- **Asymmetric options:** For editorial pages, text can float left at 60% with sidebar elements at 35% (inspired by the asymmetric card layout in the reference)

---

## Texture & Atmosphere

### Background Treatment
The reference used a velvet/felt surface with visible fiber and subtle shimmer. Digital equivalent:
- Very subtle noise texture overlay on `--color-cosmos` (opacity 3-5%)
- Optional: faint radial gradient from center (slightly lighter cosmos) to edges (darker) — creates depth without being obvious
- Star field: tiny scattered dots at very low opacity (2-3%) as a CSS background pattern

### Surface Distinction
- Page background: `--color-cosmos` + noise
- Card surfaces: `--color-cosmos-light`, solid (no noise) — the lift comes from the color shift
- Elevated elements: `--color-cosmos-accent` border or subtle box-shadow

---

## Accessibility

- All text meets WCAG AA contrast ratios against its background
- `--color-lavender` (#9B8EC4) on `--color-cosmos` (#1A1030) = ~5.2:1 ✓
- `--color-cream` (#F5F0E8) on `--color-cosmos` (#1A1030) = ~12.8:1 ✓
- `--color-lavender-muted` (#6B5F8A) on `--color-cosmos` (#1A1030) = ~2.8:1 — **use only for decorative/non-essential text**
- Focus states: `--color-gold` outline on interactive elements
- Motion: respect `prefers-reduced-motion` for all transitions

---

## Summary: Before → After

| Element | V1 (Current) | V2 (This System) |
|---------|-------------|-------------------|
| Background | Generic dark navy | Rich aubergine-violet with subtle texture |
| Text | Near-white | Soft lavender (cream for emphasis only) |
| Accent | Bright violet + gold + pink | Antiqued brass gold only |
| Typography | Playfair Display | Cormorant Garamond (display), DM Sans (body) |
| Cards | No borders, no affordance | Bordered, illustrated, hoverable |
| Illustrations | None | Copperplate engraving style zodiac art |
| Email input | Invisible ghost field | High-contrast cream field, unmissable |
| Layout | Centered everything | Editorial asymmetry, clear section rhythm |
| Mood | "Developer's dark mode" | "Rare bookshop meets observatory" |
