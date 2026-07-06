# Sign Season — Complete Handoff Document

_Written July 6, 2026 for transition of management from OpenClaw/Petunia to Claude._

---

## What Sign Season Is

**signseason.com** is an astrology content brand monetized through affiliate links. Pure attention arbitrage: generate traffic through SEO and social, monetize through product recommendations (Amazon, Etsy, ShareASale, Audible, etc.).

**Business model:** No products. No customer service. No chargebacks. No fulfillment. Static content pages drive organic and social traffic. Affiliate links and display ads (at scale) generate revenue.

**Business goal:** 1 million monthly unique visitors. Revenue target: $1-3K/month in affiliate income at 100K+ visitors; display ad monetization (Mediavine) at 50K+ sessions/month.

**Legal entity:** TF Ventures LLC — ALL legal pages, footers, contracts must say "TF Ventures LLC," never Tara's personal name.

**Mailing address:** 6688 Nolensville Rd, Ste 108 #2223, Brentwood, TN 37027 (iPostal1 virtual mailbox, PMB 2223).

---

## Current State (as of July 2026)

- **~511+ pages** in sitemap covering signs, compatibility, crystals, moon signs, rising signs, and 30+ content verticals
- **Site is live** at signseason.com
- **~20 pages indexed by Google** (primary blocker — 95%+ of content invisible to search)
- **Social posting paused** since April 10, 2026 (Tara's instruction — do not resume without explicit permission)
- **Birth chart tool live** at signseason.com/chart
- **Compatibility quiz live** at signseason.com/quiz/compatibility
- **Big Three calculator live** at signseason.com/quiz/big-three
- **Email drip running** via Resend (~5 contacts)
- **Analytics dashboard** at signseason.com/admin (password-gated)

---

## Tech Infrastructure

### Hosting & Deployment
- **Platform:** Vercel
- **Project name:** `signseason`
- **Project ID:** `prj_HjvnxRLMVTzOUgMVH771XLlKdApA`
- **Org ID:** `team_ndhzvBy2Mff0ocYcOWA0b8PY`
- **Repo:** GitHub (mybotpetunia-maker org) — `signseason` repo
- **Deploy process:** Push to main branch → Vercel auto-deploys
- **Source of truth for deployment:** `memory/vercel-deployment-process.md` in the OpenClaw workspace
- **Domain registrar:** Porkbun (signseason.com) — DNS points to Vercel

### Source Code
- **Location:** `/Users/petunia1/.openclaw/workspace/signseason/` on Tara's Mac
- **All pages are static HTML** — no build step required
- **API routes:** Vercel serverless functions in `/api/` directory
  - `api/chart-submit.js` — birth chart form handler
  - `api/subscribe.js` — email signup handler
  - `api/track.js` — pageview analytics
  - `api/drip.js` + `api/drip-template.js` — email drip automation
  - `api/big-three.js` — Big Three ephemeris calculation engine
  - `api/quiz-og.js` — dynamic Open Graph image for compatibility quiz
- **Config:** `vercel.json` (cleanUrls: true, security headers)

### Database / Storage
- **Provider:** Upstash Redis (instance: `eager-orca-67781`)
- **What's stored:**
  - Pageview analytics (`pageviews:*`)
  - Unique visitor tracking
  - Referrer data
  - Subscriber records (`subscriber:{email}`)
  - Birth chart data (`birthchart:{email}`) — name, email, birth date, sun/moon/rising signs
  - Email drip status per user
  - Owner traffic exclusion flag (localStorage: `signseason_owner=true`)
- **Analytics dashboard:** signseason.com/admin — password-gated
  - Admin API key saved in 1Password as "Sign Season - Admin API Key" (new api key, no expiration, rotated April 5 2026)

### Email
- **Provider:** Resend
- **Sending domain:** signseason.com
- **From address:** stars@signseason.com ("Stella from Sign Season")
- **Planned:** stella@ alias for Stella's persona emails
- **Resend CLI:** installed and authenticated (v1.6.0)
- **DNS:** SPF, DKIM, DMARC all verified and working
- **Drip sequence:** 5-email welcome series, triggered on chart form submission
- **All emails MUST include:**
  1. Unsubscribe link (`{{{RESEND_UNSUBSCRIBE_URL}}}`)
  2. Physical address (Sign Season, 6688 Nolensville Rd, Ste 108 #2223, Brentwood, TN 37027)
  3. "Why you're receiving this" line
  4. Accurate From/Subject

### Analytics
- Custom dashboard at signseason.com/admin
- Upstash Redis backend (same instance as user data)
- Tracks: pageviews, uniques, referrers, subscriber growth
- Owner traffic excluded via localStorage flag (set `signseason_owner=true` in browser console to exclude your own visits)

### SEO Setup
- **Google Search Console:** site verified with `google53a81f31582ee8d7` meta tag (in every page `<head>`)
- **Pinterest domain verification:** `p:domain_verify` meta tag with value `621b0e7155899f63b4676e823d77759b` (in every page `<head>`)
- **IndexNow:** configured for Bing/Yandex submission on deploys
- **Sitemap:** signseason.com/sitemap.xml
- **Schema markup:** BreadcrumbList on all pages, FAQPage on ~14 pages, GEO summaries
- **CRITICAL rule:** Every new page must have BOTH verification meta tags in `<head>` — check existing pages for the exact format

### Social Accounts
| Platform | Handle | Status |
|----------|--------|--------|
| TikTok | @sign_season | Active (posting PAUSED Apr 10) |
| Instagram | @signseasonco | Active (posting PAUSED Apr 10) |
| Pinterest | pinterest.com/signseason | Active (PAUSED) |
| Twitter/X | @signseason | Active (posting PAUSED) |
| Facebook | Sign Season page | Active (PAUSED) |

**Note:** All social posting was paused April 10, 2026 per Tara's instruction. Do not resume without explicit permission.

---

## Credentials & Where to Find Them

**All credentials are stored in 1Password (Petunia vault).** This is the source of truth. Items to look for:

| Service | 1Password Item Name | Notes |
|---------|-------------------|-------|
| Vercel | Vercel (mybotpetunia@gmail.com) | Google OAuth via mybotpetunia@gmail.com |
| GitHub | GitHub (mybotpetunia-maker org) | mybotpetunia-maker organization |
| Upstash Redis | Upstash / Sign Season Redis | REST URL + token for database access |
| Resend | Resend (Sign Season) | API key for email sending |
| Sign Season Admin | Sign Season - Admin API Key | Dashboard password (no expiration key) |
| Pinterest API | Pinterest API key | App ID 1557637 — trial access only, can't create pins via API |
| Google Ads | Google Ads (mybotpetunia@gmail.com) | Account restored after appeal |
| Google Search Console | Linked to mybotpetunia@gmail.com | |
| Porkbun (domain) | Porkbun (signseason.com) | Domain registrar |

**Primary Google account:** mybotpetunia@gmail.com — used for Vercel, GSC, Google Ads, Beehiiv, and most services.

**Pinterest credentials:** Also stored at `~/.config/pinterest/credentials.json` on Tara's Mac.

---

## Content Verticals (Pages That Exist)

Each of the 12 zodiac signs has pages for:
- Main sign hub (e.g., `signs/aries.html`)
- In love, man, woman, moon, rising, soulmate, best match, worst match
- Career, strengths, weaknesses, toxic traits, red flags, turn-ons
- Communication style, love language, when angry, jealousy
- Dating, gift guide, in bed, as a friend, parenting, pet owner
- Spirit animal, apologize-to, how to tell if they like you
- Mercury retrograde in [sign]
- 2026 horoscope

**Other verticals:**
- 144 compatibility pairs (`compatibility/aries-scorpio.html` etc.)
- 66 reverse compat redirects (noindex)
- 12 crystal pages
- 12 birthstone pages (monthly)
- Life path numbers 1-9, 11, 22, 33
- Elements: fire, earth, air, water signs
- Modalities: cardinal, fixed, mutable signs
- Legal: privacy.html, terms.html, disclosure.html

---

## Interactive Tools

### Birth Chart (signseason.com/chart)
- Form: name, email, birth date, birth time (optional), city, country
- On submit: calculates sun sign, sends personalized Stella email via Resend, stores in Redis
- All 12 sun sign email readings written in Stella's voice
- Telegram notification fires on every signup (to Tara's Telegram: 5216609288)
- V2 (in progress): moon + rising calculation engine (Meeus algorithm, pure JS, 500-city lookup)

### Compatibility Quiz (signseason.com/quiz/compatibility)
- 78 unique sign pairs, shareable URLs (`?signs=scorpio-pisces`)
- Dynamic OG images via `api/quiz-og.js`
- Email capture

### Big Three Calculator (signseason.com/quiz/big-three)
- Uses ephemeris engine (`api/big-three.js`)
- Shareable result URLs
- Rising sign "locked" without birth time input

---

## Brand Identity

### Voice
- **Persona:** "Your astrology-obsessed best friend who also happens to be really good at it"
- **NOT:** academic, woo-woo, clickbait, corporate, generic
- Never say "AI" — this is an astrology brand, not a tech brand
- No em dashes (standing rule from Tara)
- Short sentences, punchy, like texts

### Stella (Email/SMS Persona)
- Stella is Sign Season's branded voice for emails and SMS
- Sign-off everywhere: `✨ Stella` — no variations
- Social channels do NOT use Stella's name — she earns her name through email/SMS only
- Full persona doc: `signseason/STELLA-PERSONA.md`

### Visual System
- **Primary colors:** Deep Night `#0D0D1A`, Cosmic Violet `#7B68EE`, Soft Moonlight `#F0EEFF`
- **Accents:** Celestial Gold `#E8C547`, Nebula Pink `#E88DB5`
- **Fonts:** Playfair Display (headlines), DM Sans (body), Space Mono (data/accents)
- Dark mode is the default — astrology lives at night
- Full brand guide: `signseason/BRAND-IDENTITY.md`
- Full visual system: `signseason/BRAND-VISUAL-SYSTEM.md`
- Design tokens: `signseason/style/tokens.css`

---

## SEO Status & Primary Blocker

**The core problem:** ~511 pages exist but only ~20 are indexed by Google. 95% of the content is invisible.

**Why it's happening:**
- New domain (no authority yet)
- Google discovered URLs but won't crawl them without backlinks/authority
- Too many pages submitted too fast for a new domain

**What needs to happen:**
1. Build backlinks (Reddit, Quora, guest posts, Pinterest pins = backlinks from pinterest.com)
2. GSC CLI re-auth (Tara needs to run: `cd ~/workspace/gsc-cli && node gsc.js auth`)
3. Optimize striking-distance pages — these were already partially done (git commit: `2b6297a`)
4. Internal linking audit — every page should link to 5+ related pages
5. Pinterest pinning (each pin = backlink from pinterest.com)

**Full strategy doc:** `signseason/TRAFFIC-STRATEGY.md`

---

## What Was Working Before Social Posting Paused

- TikTok engagement was building: Toxic Pairings got 1.2K views, Crystal post 625 views, 6 comments
- Pinterest publishing via managed browser (API trial access can't create pins)
- Twitter/X posting 2x/day
- Facebook cross-posting

**Format that was working:**
- V3 template: circular engraving crops with gold rings, Fondamento/EB Garamond/DM Sans fonts, velvet noise texture, plum+gold palette
- Font sizes: body minimum 48px on 1080px canvas, headlines 68px+
- Content type that got traction: "Toxic Pairings," crystal-by-sign posts

**Why it paused:** Tara felt the carousel content looked like "AI slop" on April 8. She stopped all posting on April 10 with instruction to not resume without explicit restart.

---

## Monetization (Not Yet Active)

- **Affiliate links:** No active affiliate accounts yet. Amazon Associates, Awin, ShareASale accounts need to be created (Tara action item).
- **Display ads:** Not yet at traffic threshold. Mediavine requires 50K sessions/month. Google AdSense available at 10K.
- **Email list:** 5 subscribers as of last check. Needs traffic to grow.

---

## Key Files in the Repo

| File | Purpose |
|------|---------|
| `BRAND-IDENTITY.md` | Voice, colors, fonts, full brand guide |
| `STELLA-PERSONA.md` | Stella voice guide, tone spectrum, example copy |
| `BRAND-VISUAL-SYSTEM.md` | Visual design specs |
| `DESIGN-SYSTEM.md` | Design tokens and components |
| `TRAFFIC-STRATEGY.md` | Road to 1M uniques — full strategy doc |
| `CONTENT-GENERATION-RULES.md` | Rules for writing new content pages |
| `QA-CHECKLIST.md` | Pre-deploy QA checklist |
| `WEEKLY-PLAN-APR-6.md` | Last active weekly plan |
| `style/tokens.css` | CSS design tokens |
| `api/` | All serverless API functions |
| `emails/drip-sequence.js` | Email drip configuration |
| `pinterest/PUBLISH-GUIDE.md` | How to publish Pinterest pins via browser |
| `scripts/` | Social slide generation scripts (Python/Pillow) |
| `sitemap.xml` | Full sitemap |
| `vercel.json` | Vercel config |

---

## Standing Rules (Non-Negotiable)

1. **Never say "AI"** on customer-facing pages or content
2. **No em dashes** anywhere in content or copy
3. **Every new page needs both meta tags in `<head>`:**
   - `<meta name="google-site-verification" content="google53a81f31582ee8d7" />`
   - `<meta name="p:domain_verify" content="621b0e7155899f63b4676e823d77759b"/>`
4. **Every email must include:** unsubscribe link, physical address, "why you're receiving this"
5. **Legal entity is TF Ventures LLC** — all footers/legal pages must reference this
6. **"Done" means tested on the production URL** — not just deployed
7. **Social posting is PAUSED** — do not resume without Tara's explicit instruction
8. **Distribution confidence before product investment** — validate traffic channels before building features

---

## Immediate Opportunities (What Should Happen Next)

1. **Fix indexing:** This is the #1 lever. Everything else is secondary until Google is indexing more than 20 pages.
2. **Backlinks:** Reddit seeding, Quora answers, Pinterest pinning
3. **GSC re-auth:** Tara needs to re-auth the GSC CLI for write access
4. **Affiliate accounts:** Set up Amazon Associates at minimum — affiliate links in crystal and gift guide pages are ready to activate
5. **Resume social (when Tara says so):** The TikTok format that was working should be refined and relaunched

---

## Context on Tara's Working Style

- CEO mindset: sets goals, expects autonomous execution
- No hand-holding, no asking for permission repeatedly
- Values: proactivity, resourcefulness, results
- When she says stop, stop. When she restarts, go.
- She wants to know when things are done, not a play-by-play of how you got there

---

_This document was generated July 6, 2026. The source of truth for all credentials is 1Password (Petunia vault). The source of truth for all code is the signseason GitHub repo (mybotpetunia-maker org)._
