# Sign Season QA Checklist

_If a check fails, it's not deployed. Period._

---

## Tier 1: Infrastructure (every deploy)

### Status Codes
- [ ] Curl EVERY URL in sitemap.xml — all must return 200
- [ ] Count HTML files vs sitemap entries — must match

### Deploy Verification
- [ ] `git push` exit code 0
- [ ] Wait 30s, confirm production URL returns 200
- [ ] Grep for specific changed content on production (not just status code)

---

## Tier 2: Correctness (every deploy that changes pages)

### HTML Validation
- [ ] Run `tidy -errors` or W3C validator on every changed page
- [ ] Zero errors for: nested `<a>` tags, unclosed elements, invalid nesting
- [ ] No `<a>` inside `<a>` — ever

### Link Destination Audit
- [ ] Every link goes to the CORRECT page, not just a valid one
- [ ] Compatibility links point to the right section/pair
- [ ] No duplicate links (two different signs linking to the same pair)
- [ ] All nav links go where they say they go
- [ ] Internal links use consistent paths (no mixing /page and /page/)

### Content Integrity
- [ ] No placeholder text (Lorem ipsum, TODO, FIXME, TBD)
- [ ] No broken images (curl every img src)
- [ ] No empty links (href="#" in production without a plan)
- [ ] Every page has unique, descriptive `<title>`
- [ ] Every page has `<meta name="description">`

---

## Tier 3: Human Experience (weekly + after major changes)

### Cross-Page Consistency
- [ ] All pages share the same nav structure
- [ ] All pages share the same footer (social links, section links, privacy)
- [ ] Font families match across all pages
- [ ] Color scheme consistent (no one-off pages with different palettes)

### Readability
- [ ] No font sizes below 12px (0.75rem at base 16px) on any element
- [ ] Body text at least 16px
- [ ] Line height at least 1.4 on body text
- [ ] Sufficient contrast (gold on dark plum — spot-check)

### Navigation Completeness
- [ ] Every section (signs, compatibility, crystals) is reachable from every other section
- [ ] Homepage links to all section index pages
- [ ] Each section index links to all children
- [ ] Each child page links back to its section and to homepage
- [ ] No dead-end pages (pages with no outbound navigation)

### Mobile
- [ ] Cards/grids collapse properly at 375px viewport
- [ ] Text doesn't overflow or get cut off
- [ ] Touch targets are at least 44x44px
- [ ] No horizontal scroll

---

## QA Proof Standard

**Every QA report must include actual output, not assertions.**

❌ Bad: "I verified the pages are live."
✅ Good: "curl returned 200. grep found 78 links. tidy -errors reports 0 errors. Font size audit: smallest is 0.75rem (12px)."

❌ Bad: "Links are correct."
✅ Good: "All 12 compatibility links on /signs resolve to /compatibility. Verified: grep output shows href='/compatibility' x12, no other /compatibility/* paths."

If I can't paste the proof, I haven't done the QA.

---

## Why This Exists

On 2026-03-28, Tara asked me to audit signseason.com/signs "like a human." My existing QA (Tier 1 only) missed: nested `<a>` tags, wrong link destinations, unreadably small fonts, missing navigation, and a bare footer. All issues a human would catch in 5 seconds of looking at the page. "Curl returns 200" is not QA. It's a health check. This checklist exists because those are different things and I confused them.
