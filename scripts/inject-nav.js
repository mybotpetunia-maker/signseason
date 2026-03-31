#!/usr/bin/env node
/**
 * Inject site-wide nav, related content, and topics section into all HTML pages.
 * Run from project root: node scripts/inject-nav.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ──────────────────────────────────────
// NAV HTML (inline, no includes needed)
// ──────────────────────────────────────
const NAV_HTML = `<nav class="site-nav">
  <div class="site-nav-inner">
    <a href="/" class="site-nav-brand">Sign Season</a>
    <ul class="site-nav-links">
      <li>
        <button type="button">Signs <span class="nav-arrow">&#9662;</span></button>
        <div class="nav-dropdown">
          <div class="nav-signs-grid">
            <a href="/signs/aries"><span class="sign-sym">&#9800;&#xFE0E;</span> Aries</a>
            <a href="/signs/taurus"><span class="sign-sym">&#9801;&#xFE0E;</span> Taurus</a>
            <a href="/signs/gemini"><span class="sign-sym">&#9802;&#xFE0E;</span> Gemini</a>
            <a href="/signs/cancer"><span class="sign-sym">&#9803;&#xFE0E;</span> Cancer</a>
            <a href="/signs/leo"><span class="sign-sym">&#9804;&#xFE0E;</span> Leo</a>
            <a href="/signs/virgo"><span class="sign-sym">&#9805;&#xFE0E;</span> Virgo</a>
            <a href="/signs/libra"><span class="sign-sym">&#9806;&#xFE0E;</span> Libra</a>
            <a href="/signs/scorpio"><span class="sign-sym">&#9807;&#xFE0E;</span> Scorpio</a>
            <a href="/signs/sagittarius"><span class="sign-sym">&#9808;&#xFE0E;</span> Sagittarius</a>
            <a href="/signs/capricorn"><span class="sign-sym">&#9809;&#xFE0E;</span> Capricorn</a>
            <a href="/signs/aquarius"><span class="sign-sym">&#9810;&#xFE0E;</span> Aquarius</a>
            <a href="/signs/pisces"><span class="sign-sym">&#9811;&#xFE0E;</span> Pisces</a>
          </div>
        </div>
      </li>
      <li>
        <button type="button">Topics <span class="nav-arrow">&#9662;</span></button>
        <div class="nav-dropdown">
          <div class="nav-topics-list">
            <a href="/signs/#in-love">Love &amp; Dating</a>
            <a href="/signs/#moon-signs">Moon Signs</a>
            <a href="/signs/#rising-signs">Rising Signs</a>
            <a href="/signs/#career">Career</a>
            <a href="/signs/#toxic-traits">Toxic Traits</a>
            <a href="/signs/#mercury-retrograde">Mercury Retrograde</a>
            <a href="/signs/#horoscopes-2026">Horoscopes 2026</a>
            <a href="/signs/#zodiac-men">Zodiac Men</a>
            <a href="/signs/#zodiac-women">Zodiac Women</a>
            <a href="/signs/#birthstones">Birthstones</a>
          </div>
        </div>
      </li>
      <li><a href="/compatibility">Compatibility</a></li>
      <li><a href="/crystals">Crystals</a></li>
      <li><a href="#subscribe">Subscribe</a></li>
    </ul>
    <button class="site-nav-hamburger" aria-label="Menu">&#9776;</button>
  </div>
</nav>
<div class="site-nav-mobile">
  <button class="site-nav-mobile-close" aria-label="Close menu">&times;</button>
  <div class="mobile-nav-section">
    <div class="mobile-nav-section-title">Signs</div>
    <div class="mobile-nav-signs-grid">
      <a href="/signs/aries">&#9800;&#xFE0E; Aries</a>
      <a href="/signs/taurus">&#9801;&#xFE0E; Taurus</a>
      <a href="/signs/gemini">&#9802;&#xFE0E; Gemini</a>
      <a href="/signs/cancer">&#9803;&#xFE0E; Cancer</a>
      <a href="/signs/leo">&#9804;&#xFE0E; Leo</a>
      <a href="/signs/virgo">&#9805;&#xFE0E; Virgo</a>
      <a href="/signs/libra">&#9806;&#xFE0E; Libra</a>
      <a href="/signs/scorpio">&#9807;&#xFE0E; Scorpio</a>
      <a href="/signs/sagittarius">&#9808;&#xFE0E; Sagittarius</a>
      <a href="/signs/capricorn">&#9809;&#xFE0E; Capricorn</a>
      <a href="/signs/aquarius">&#9810;&#xFE0E; Aquarius</a>
      <a href="/signs/pisces">&#9811;&#xFE0E; Pisces</a>
    </div>
  </div>
  <div class="mobile-nav-section">
    <div class="mobile-nav-section-title">Topics</div>
    <div class="mobile-nav-links">
      <a href="/signs/#in-love">Love &amp; Dating</a>
      <a href="/signs/#moon-signs">Moon Signs</a>
      <a href="/signs/#rising-signs">Rising Signs</a>
      <a href="/signs/#career">Career</a>
      <a href="/signs/#toxic-traits">Toxic Traits</a>
      <a href="/signs/#mercury-retrograde">Mercury Retrograde</a>
      <a href="/signs/#horoscopes-2026">Horoscopes 2026</a>
      <a href="/signs/#zodiac-men">Zodiac Men</a>
      <a href="/signs/#zodiac-women">Zodiac Women</a>
      <a href="/signs/#birthstones">Birthstones</a>
    </div>
  </div>
  <div class="mobile-nav-section">
    <div class="mobile-nav-section-title">Explore</div>
    <div class="mobile-nav-links">
      <a href="/compatibility">Compatibility</a>
      <a href="/crystals">Crystals</a>
      <a href="/signs/">All Signs</a>
      <a href="#subscribe">Subscribe</a>
    </div>
  </div>
</div>`;

const CSS_LINK = '<link rel="stylesheet" href="/css/nav.css">';
const JS_TAG = '<script src="/js/nav.js"></script>';

// ──────────────────────────────────────
// RELATED CONTENT HELPERS
// ──────────────────────────────────────
const SIGNS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];

const SIGN_NAMES = {
  aries:'Aries',taurus:'Taurus',gemini:'Gemini',cancer:'Cancer',
  leo:'Leo',virgo:'Virgo',libra:'Libra',scorpio:'Scorpio',
  sagittarius:'Sagittarius',capricorn:'Capricorn',aquarius:'Aquarius',pisces:'Pisces'
};

function titleCase(s) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getRelatedLinks(filePath) {
  const rel = path.relative(ROOT, filePath);
  const dir = path.dirname(rel);
  const base = path.basename(rel, '.html');
  const links = [];

  if (dir === 'signs' && base !== 'index' && base !== 'birthstones') {
    // Determine sign name from filename
    const sign = SIGNS.find(s => base === s || base.startsWith(s + '-'));
    if (!sign) return [];
    const name = SIGN_NAMES[sign];

    if (base === sign) {
      // Main sign page
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/${sign}-career`, `${name} Career`]);
      links.push([`/signs/${sign}-toxic-traits`, `${name} Toxic Traits`]);
      links.push([`/signs/dating-a-${sign}`, `Dating a ${name}`]);
      links.push([`/signs/best-match-for-${sign}`, `Best Match for ${name}`]);
      links.push([`/signs/${sign}-man`, `${name} Man`]);
    } else if (base.includes('-in-love') || base.startsWith('dating-a-')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/dating-a-${sign}`, `Dating a ${name}`]);
      links.push([`/signs/best-match-for-${sign}`, `Best Match for ${name}`]);
      links.push([`/compatibility`, `Compatibility`]);
      links.push([`/signs/${sign}-toxic-traits`, `${name} Toxic Traits`]);
      links.push([`/signs/${sign}-woman`, `${name} Woman`]);
    } else if (base.includes('best-match')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/dating-a-${sign}`, `Dating a ${name}`]);
      links.push([`/compatibility`, `Compatibility`]);
      links.push([`/signs/${sign}-man`, `${name} Man`]);
      links.push([`/signs/${sign}-woman`, `${name} Woman`]);
    } else if (base.includes('-moon')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-rising`, `${name} Rising`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/${sign}-career`, `${name} Career`]);
      links.push([`/signs/${sign}-2026-horoscope`, `${name} 2026 Horoscope`]);
      links.push([`/signs/${sign}-woman`, `${name} Woman`]);
    } else if (base.includes('-rising')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-moon`, `${name} Moon`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/${sign}-career`, `${name} Career`]);
      links.push([`/signs/${sign}-2026-horoscope`, `${name} 2026 Horoscope`]);
      links.push([`/signs/${sign}-man`, `${name} Man`]);
    } else if (base.includes('-career')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/${sign}-toxic-traits`, `${name} Toxic Traits`]);
      links.push([`/signs/${sign}-2026-horoscope`, `${name} 2026 Horoscope`]);
      links.push([`/signs/${sign}-moon`, `${name} Moon`]);
      links.push([`/signs/${sign}-man`, `${name} Man`]);
    } else if (base.includes('-toxic-traits')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/${sign}-when-angry`, `${name} When Angry`]);
      links.push([`/signs/are-${sign}-jealous`, `Are ${name} Jealous?`]);
      links.push([`/signs/dating-a-${sign}`, `Dating a ${name}`]);
      links.push([`/signs/${sign}-career`, `${name} Career`]);
    } else if (base.includes('-man') || base.includes('-woman')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/dating-a-${sign}`, `Dating a ${name}`]);
      links.push([`/signs/best-match-for-${sign}`, `Best Match for ${name}`]);
      links.push([`/signs/${sign}-toxic-traits`, `${name} Toxic Traits`]);
      const other = base.includes('-man') ? 'woman' : 'man';
      links.push([`/signs/${sign}-${other}`, `${name} ${titleCase(other)}`]);
    } else if (base.includes('horoscope')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-career`, `${name} Career`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/${sign}-moon`, `${name} Moon`]);
      links.push([`/signs/best-match-for-${sign}`, `Best Match for ${name}`]);
      links.push([`/signs/mercury-retrograde-in-${sign}`, `Mercury Retrograde in ${name}`]);
    } else if (base.includes('mercury-retrograde')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-2026-horoscope`, `${name} 2026 Horoscope`]);
      links.push([`/signs/${sign}-career`, `${name} Career`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/${sign}-when-angry`, `${name} When Angry`]);
      links.push([`/signs/${sign}-moon`, `${name} Moon`]);
    } else if (base.includes('-when-angry') || base.includes('jealous')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-toxic-traits`, `${name} Toxic Traits`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/dating-a-${sign}`, `Dating a ${name}`]);
      links.push([`/signs/${sign}-man`, `${name} Man`]);
      links.push([`/signs/${sign}-woman`, `${name} Woman`]);
    } else if (base.includes('-as-a-friend')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/are-${sign}-jealous`, `Are ${name} Jealous?`]);
      links.push([`/signs/${sign}-toxic-traits`, `${name} Toxic Traits`]);
      links.push([`/signs/${sign}-man`, `${name} Man`]);
      links.push([`/signs/${sign}-woman`, `${name} Woman`]);
    } else if (base.includes('-parent')) {
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/${sign}-career`, `${name} Career`]);
      links.push([`/signs/${sign}-man`, `${name} Man`]);
      links.push([`/signs/${sign}-woman`, `${name} Woman`]);
      links.push([`/signs/${sign}-as-a-friend`, `${name} as a Friend`]);
    } else if (base.includes('birthstone')) {
      // Monthly birthstone pages
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/birthstones/`, `All Birthstones`]);
      links.push([`/crystals/best-crystals-for-${sign}`, `Best Crystals for ${name}`]);
    } else {
      // Generic fallback for sign pages
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/${sign}-career`, `${name} Career`]);
      links.push([`/signs/${sign}-moon`, `${name} Moon`]);
    }
  } else if (dir === 'compatibility' && base !== 'index') {
    // Parse the two signs from filename
    const parts = base.split('-');
    // Find split point: signs can be multi-word (none currently, but safe)
    let sign1 = null, sign2 = null;
    for (let i = 1; i < parts.length; i++) {
      const s1 = parts.slice(0, i).join('-');
      const s2 = parts.slice(i).join('-');
      if (SIGNS.includes(s1) && SIGNS.includes(s2)) {
        sign1 = s1; sign2 = s2; break;
      }
    }
    if (sign1 && sign2) {
      const n1 = SIGN_NAMES[sign1], n2 = SIGN_NAMES[sign2];
      links.push([`/signs/${sign1}`, `${n1} Sign`]);
      links.push([`/signs/${sign2}`, `${n2} Sign`]);
      links.push([`/signs/${sign1}-in-love`, `${n1} in Love`]);
      links.push([`/signs/${sign2}-in-love`, `${n2} in Love`]);
      links.push([`/signs/best-match-for-${sign1}`, `Best Match for ${n1}`]);
      links.push([`/signs/best-match-for-${sign2}`, `Best Match for ${n2}`]);
    }
  } else if (dir === 'crystals' && base !== 'index') {
    const sign = SIGNS.find(s => base.includes(s));
    if (sign) {
      const name = SIGN_NAMES[sign];
      links.push([`/signs/${sign}`, `${name} Sign`]);
      links.push([`/signs/${sign}-in-love`, `${name} in Love`]);
      links.push([`/signs/best-match-for-${sign}`, `Best Match for ${name}`]);
      links.push([`/birthstones/`, `Birthstones`]);
      links.push([`/crystals/`, `All Crystal Guides`]);
      links.push([`/signs/${sign}-2026-horoscope`, `${name} 2026 Horoscope`]);
    }
  } else if (dir === 'birthstones' && base !== 'index') {
    // Monthly birthstone pages
    links.push([`/birthstones/`, `All Birthstones`]);
    links.push([`/crystals/`, `Crystal Guides`]);
    links.push([`/signs/`, `All Signs`]);
    links.push([`/compatibility`, `Compatibility`]);
  }

  // Filter to only existing files and remove self-links
  return links.filter(([href]) => {
    // Remove self-link
    const selfPath = '/' + rel.replace('.html', '').replace(/\/index$/, '/');
    const hrefNorm = href.replace(/\/$/, '');
    const selfNorm = selfPath.replace(/\/$/, '');
    if (hrefNorm === selfNorm) return false;

    // Check file exists
    let checkPath = href;
    if (checkPath.endsWith('/')) checkPath += 'index.html';
    else if (!checkPath.endsWith('.html')) checkPath += '.html';
    return fs.existsSync(path.join(ROOT, checkPath));
  }).slice(0, 6);
}

function buildRelatedHTML(links) {
  if (!links.length) return '';
  const cards = links.map(([href, label]) => `      <a href="${href}">${label}</a>`).join('\n');
  return `
  <div class="keep-reading">
    <p class="keep-reading-label">Keep Reading</p>
    <h2 class="keep-reading-title">You might also like</h2>
    <div class="keep-reading-grid">
${cards}
    </div>
  </div>`;
}

// ──────────────────────────────────────
// FILE PROCESSING
// ──────────────────────────────────────
const SKIP_DIRS = ['node_modules', '.git', 'scripts', 'components', 'assets', 'GSC html tag', 'admin', 'content', 'api'];
const SKIP_FILES = ['google53a81f31582ee8d7.html', 'design-system-preview.html', 'pfp.html'];

function findHTMLFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findHTMLFiles(full));
    } else if (entry.name.endsWith('.html') && !SKIP_FILES.includes(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(ROOT, filePath);
  const isHomepage = rel === 'index.html';

  // Skip if already processed
  if (html.includes('site-nav')) {
    console.log(`  SKIP (already has site-nav): ${rel}`);
    return;
  }

  // 1. Add CSS link in <head> before </style> or before </head>
  if (!html.includes('/css/nav.css')) {
    if (html.includes('</style>')) {
      html = html.replace('</style>', '</style>\n  ' + CSS_LINK);
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', '  ' + CSS_LINK + '\n</head>');
    }
  }

  // 2. Add nav HTML after <body> tag
  if (isHomepage) {
    // Homepage: insert nav after texture div, add has-site-nav class
    // The homepage has its own sticky nav that we're replacing
    html = html.replace('<body>', '<body class="has-site-nav">');
    // Insert site nav after the texture div
    html = html.replace(
      '<div class="texture" aria-hidden="true"></div>',
      '<div class="texture" aria-hidden="true"></div>\n\n' + NAV_HTML
    );
    // Remove the old nav from homepage (it scrolls in)
    // The old nav has class="nav" id="nav" - we keep it but hide it via the new nav
    // Actually, let's keep the homepage old nav behavior but the new site-nav is always visible
    // The old .nav on homepage slides in on scroll - we don't need it anymore
    html = html.replace(/  <!-- NAV -->\n  <nav class="nav" id="nav">[\s\S]*?<\/nav>\n/m, '');
    // Remove the old nav scroll JS
    html = html.replace(
      /const nav = document\.getElementById\('nav'\);\nwindow\.addEventListener\('scroll', \(\) => \{\n  nav\.classList\.toggle\('visible', window\.scrollY > window\.innerHeight \* 0\.5\);\n\}, \{ passive: true \}\);/,
      ''
    );
  } else {
    // Article pages: add nav before existing breadcrumb nav, add body class
    html = html.replace('<body>', '<body class="has-site-nav">');

    // Find existing breadcrumb nav and insert site nav before it
    if (html.includes('<nav class="nav">')) {
      html = html.replace('<nav class="nav">', NAV_HTML + '\n\n  <nav class="nav breadcrumb-nav">');
    } else {
      // No breadcrumb - insert after <body>
      html = html.replace('<body class="has-site-nav">', '<body class="has-site-nav">\n' + NAV_HTML);
    }
  }

  // 3. Add related content (for article pages, not index pages)
  const dir = path.dirname(rel);
  const base = path.basename(rel, '.html');
  if (!isHomepage && base !== 'index' && !rel.startsWith('content/')) {
    const related = getRelatedLinks(filePath);
    if (related.length > 0) {
      const relatedHTML = buildRelatedHTML(related);
      // Insert before footer
      if (html.includes('<footer')) {
        html = html.replace(/(\n\s*<!-- Footer -->|\n\s*<footer)/, relatedHTML + '\n$1');
      }
    }
  }

  // 4. Add nav.js before </body>
  if (!html.includes('/js/nav.js')) {
    html = html.replace('</body>', JS_TAG + '\n</body>');
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  OK: ${rel}`);
}

// ──────────────────────────────────────
// MAIN
// ──────────────────────────────────────
console.log('Finding HTML files...');
const files = findHTMLFiles(ROOT);
console.log(`Found ${files.length} HTML files`);

let processed = 0;
for (const f of files) {
  processFile(f);
  processed++;
}

console.log(`\nDone! Processed ${processed} files.`);
