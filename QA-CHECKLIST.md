# Sign Season QA Checklist

_If a check fails, it's not deployed. Period._

## Per-Deployment QA (every git push)

### 1. Vercel Deploy Verification
- [ ] `git push` succeeded (check exit code)
- [ ] Wait 30 seconds for Vercel build
- [ ] Confirm deployment: `curl -sL -o /dev/null -w "%{http_code}" https://signseason.com` returns 200

### 2. Changed Pages — Full Content Verification
For EVERY page that was added or modified in this deploy:
- [ ] `curl -sL` the production URL (not localhost, not vercel preview)
- [ ] Grep for specific content that should be on the page (title, key heading, unique text)
- [ ] Verify links work: pick 3 internal links from the page, curl each one
- [ ] Check for broken images: grep for `<img` tags, curl each `src`

### 3. Sitemap Consistency
- [ ] Count URLs in sitemap.xml: `grep -c "<url>" sitemap.xml`
- [ ] Count actual HTML files: `find . -name "*.html" -not -path "./node_modules/*" | wc -l`
- [ ] These numbers should match (minus any non-HTML routes)
- [ ] Every HTML file has a corresponding sitemap entry
- [ ] No sitemap entries point to nonexistent pages

### 4. Cross-Page Navigation
- [ ] Homepage links to all section index pages
- [ ] Each section index page links to all its child pages
- [ ] Every child page has a working "back" link to its section/home
- [ ] No dead links (run: `grep -roh 'href="[^"]*"' *.html | sort -u | head -50` and spot-check)

### 5. SEO Basics
- [ ] Every page has unique `<title>` tag
- [ ] Every page has `<meta name="description">`
- [ ] Every page has `<link rel="canonical">`
- [ ] robots.txt is accessible: `curl https://signseason.com/robots.txt`
- [ ] sitemap.xml is accessible: `curl https://signseason.com/sitemap.xml`

---

## Weekly QA Pass (Saturday, automated via cron)

### Full Site Crawl
- [ ] Curl EVERY page in sitemap.xml, log status codes
- [ ] Any non-200 = immediate fix
- [ ] Check 5 random pages for correct content rendering (title, body text, links)
- [ ] Verify all 12 sign pages load
- [ ] Verify all 12 crystal pages load  
- [ ] Verify all 78 compatibility pages load
- [ ] Verify compatibility index page loads and has 78 links
- [ ] Check Google Search Console for crawl errors (if accessible)

### Content Integrity
- [ ] No placeholder text ("Lorem ipsum", "TODO", "FIXME")
- [ ] No broken affiliate links (once affiliate accounts are set up)
- [ ] Email capture forms submit successfully (once implemented)

---

## QA Proof Standard

**Every QA report must include actual output, not assertions.**

Bad: "I verified the pages are live."
Good: "curl https://signseason.com/compatibility returned 200. grep found 78 href links to /compatibility/ pages. Spot-checked aries-taurus (200), leo-pisces (200), virgo-scorpio (200)."

If I can't paste the proof, I haven't done the QA.
