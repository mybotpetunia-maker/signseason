# Content Generation Rules for Sign Season

## CRITICAL: Every page MUST include in <head>:
```html
<meta name="google-site-verification" content="google53a81f31582ee8d7" />
<meta name="p:domain_verify" content="621b0e7155899f63b4676e823d77759b"/>
```

## Voice & Style
- Astrology-obsessed best friend, group chat energy
- NEVER use em dashes (—). Use commas, periods, colons, or restructure.
- NEVER mention "AI" anywhere
- Conversational, warm, occasionally funny
- No fluff intros like "Have you ever wondered..." Just get into it.
- Title ≤ 60 characters, meta description ≤ 155 characters

## Technical Requirements
- Use the same CSS/design system as existing pages (see signs/aries-toxic-traits.html as template)
- Include: site nav, breadcrumbs, Article schema, BreadcrumbList schema, FAQPage schema (4 Q&As), Twitter cards, OG tags
- Email subscribe forms (mid-article + bottom) with submitForm() JS
- Analytics script: `<script src="/js/analytics.js" defer></script>`
- Nav scripts: `<link rel="stylesheet" href="/css/nav.css">` and `<script src="/js/nav.js"></script>`
- Stars background: `<script src="/js/stars.js"></script>`
- body class: `has-site-nav`
- Canonical URL format: `https://signseason.com/signs/[slug]`
- datePublished: 2026-03-31

## Content Structure
Each page should have:
1. Hero section with h1 + tagline
2. 4-6 content sections with h2 headings
3. Pull quotes (1-2 per page)
4. Highlight boxes (1-2 per page, for key insights)
5. Mid-article email CTA
6. Bottom email CTA
7. "Keep Reading" section with 6 related links
8. Footer

## Content Length
- Minimum 1500 words of actual content per page
- Each section should be 2-4 substantive paragraphs

## File Location
- All sign-specific pages go in: signs/[slug].html
- Numerology pages go in: signs/life-path-[number].html
