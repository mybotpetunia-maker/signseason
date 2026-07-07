#!/usr/bin/env node
// SEO fixes from Claude's audit — run once, then delete
// 1. Add 48 new pages + /chart to sitemap.xml
// 2. Add internal links from sign hub pages to new verticals
// 3. Noindex + canonical on 9 remaining signs/*-birthstone.html
// 4. Remove all 12 signs/*-birthstone from sitemap
// 5. Dedupe parent entries in sitemap
// 6. Noindex 5 utility pages

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SIGNS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const TODAY = '2026-07-06';

// ── 1. Fix sitemap.xml ──
console.log('=== Fixing sitemap.xml ===');
let sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');

// Remove all signs/*-birthstone entries
for (const m of MONTHS) {
  const pattern = new RegExp(`\\s*<url>\\s*<loc>https://signseason\\.com/signs/${m}-birthstone</loc>[\\s\\S]*?</url>`, 'g');
  sitemap = sitemap.replace(pattern, '');
}
// Also remove signs/birthstones if it exists
sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/signseason\.com\/signs\/birthstones<\/loc>[\s\S]*?<\/url>/g, '');
console.log('  Removed signs/*-birthstone entries from sitemap');

// Dedupe: collect all URLs, rebuild without duplicates
const urlBlocks = [];
const seenUrls = new Set();
const urlRegex = /<url>\s*<loc>(.*?)<\/loc>[\s\S]*?<\/url>/g;
let match;
while ((match = urlRegex.exec(sitemap)) !== null) {
  const url = match[1];
  if (!seenUrls.has(url)) {
    seenUrls.add(url);
    urlBlocks.push(match[0]);
  }
}
const dupeCount = sitemap.match(/<url>/g)?.length - urlBlocks.length;
console.log(`  Deduped ${dupeCount} duplicate entries`);

// Add new pages
const newUrls = [];

// /chart
if (!seenUrls.has('https://signseason.com/chart')) {
  newUrls.push(`  <url>\n    <loc>https://signseason.com/chart</loc>\n    <lastmod>${TODAY}</lastmod>\n  </url>`);
}

// 48 new pages
for (const sign of SIGNS) {
  const pages = [
    `how-to-attract-${sign}`,
    `venus-in-${sign}`,
    `north-node-in-${sign}`,
    `${sign}-attachment-style`,
  ];
  for (const p of pages) {
    const url = `https://signseason.com/signs/${p}`;
    if (!seenUrls.has(url)) {
      newUrls.push(`  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </url>`);
    }
  }
}

console.log(`  Adding ${newUrls.length} new URLs to sitemap`);

// Rebuild sitemap
const newSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlBlocks.join('\n')}\n${newUrls.join('\n')}\n</urlset>`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), newSitemap);

// Count final URLs
const finalCount = (newSitemap.match(/<url>/g) || []).length;
console.log(`  Final sitemap: ${finalCount} URLs`);

// ── 2. Add internal links from sign hub pages ──
console.log('\n=== Adding internal links to sign hub pages ===');

const newVerticals = {
  'how-to-attract': 'How to Attract',
  'venus-in': 'Venus in',
  'north-node-in': 'North Node in',
  'attachment-style': 'Attachment Style',
};

for (const sign of SIGNS) {
  const hubPath = path.join(ROOT, 'signs', `${sign}.html`);
  if (!fs.existsSync(hubPath)) {
    console.log(`  SKIP: ${sign}.html not found`);
    continue;
  }
  
  let html = fs.readFileSync(hubPath, 'utf8');
  const capSign = sign.charAt(0).toUpperCase() + sign.slice(1);
  
  // Build new links
  const newLinks = [
    `<a href="/signs/how-to-attract-${sign}">How to Attract ${capSign}</a>`,
    `<a href="/signs/venus-in-${sign}">Venus in ${capSign}</a>`,
    `<a href="/signs/north-node-in-${sign}">North Node in ${capSign}</a>`,
    `<a href="/signs/${sign}-attachment-style">${capSign} Attachment Style</a>`,
  ];
  
  // Find keep-reading-grid and add links before closing </div>
  const gridMatch = html.match(/<div class="keep-reading-grid">([\s\S]*?)<\/div>/);
  if (gridMatch) {
    // Check which links already exist
    const addLinks = newLinks.filter(link => !html.includes(link));
    if (addLinks.length > 0) {
      const newGridContent = gridMatch[1].trimEnd() + '\n      ' + addLinks.join('\n      ') + '\n    ';
      html = html.replace(gridMatch[0], `<div class="keep-reading-grid">${newGridContent}</div>`);
      fs.writeFileSync(hubPath, html);
      console.log(`  ${sign}.html: added ${addLinks.length} links`);
    } else {
      console.log(`  ${sign}.html: links already present`);
    }
  } else {
    console.log(`  ${sign}.html: no keep-reading-grid found`);
  }
}

// ── 3. Noindex + canonical on remaining signs/*-birthstone.html ──
console.log('\n=== Fixing birthstone pages (noindex + canonical) ===');

// Check which months already have noindex
const alreadyFixed = ['october', 'november', 'december'];
const needFix = MONTHS.filter(m => !alreadyFixed.includes(m));

for (const month of needFix) {
  const filePath = path.join(ROOT, 'signs', `${month}-birthstone.html`);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP: ${month}-birthstone.html not found`);
    continue;
  }
  
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has noindex
  if (html.includes('noindex')) {
    console.log(`  ${month}-birthstone.html: already noindexed`);
    continue;
  }
  
  // Add noindex meta tag after <head> or after charset
  if (html.includes('<meta charset')) {
    html = html.replace(
      /(<meta charset="UTF-8"[^>]*>)/i,
      `$1\n  <meta name="robots" content="noindex, follow">\n  <link rel="canonical" href="https://signseason.com/birthstones/${month}">`
    );
  } else if (html.includes('<head>')) {
    html = html.replace(
      '<head>',
      `<head>\n  <meta name="robots" content="noindex, follow">\n  <link rel="canonical" href="https://signseason.com/birthstones/${month}">`
    );
  }
  
  fs.writeFileSync(filePath, html);
  console.log(`  ${month}-birthstone.html: added noindex + canonical`);
}

// ── 4. Noindex utility pages ──
console.log('\n=== Noindexing utility pages ===');

const utilityPages = [
  'components/nav.html',
  'design-system-preview.html',
  'pfp.html',
  'content/social/dalle-test.html',
  'content/social/2026-03-31-engraving.html',
];

for (const page of utilityPages) {
  const filePath = path.join(ROOT, page);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP: ${page} not found`);
    continue;
  }
  
  let html = fs.readFileSync(filePath, 'utf8');
  
  if (html.includes('noindex')) {
    console.log(`  ${page}: already noindexed`);
    continue;
  }
  
  // Add noindex
  if (html.includes('<head>')) {
    html = html.replace('<head>', '<head>\n  <meta name="robots" content="noindex, nofollow">');
  } else if (html.includes('<meta charset')) {
    html = html.replace(
      /(<meta charset="UTF-8"[^>]*>)/i,
      `$1\n  <meta name="robots" content="noindex, nofollow">`
    );
  } else {
    // Prepend if no head tag
    html = `<meta name="robots" content="noindex, nofollow">\n` + html;
  }
  
  fs.writeFileSync(filePath, html);
  console.log(`  ${page}: added noindex`);
}

console.log('\n=== Done ===');
