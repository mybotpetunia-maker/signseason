#!/usr/bin/env node
/**
 * SEO Feedback Loop — Sign Season
 * 
 * Pulls GSC data, tiers pages by ranking potential, generates:
 * 1. Prioritized optimization list (which existing pages to improve)
 * 2. New content recommendations (which verticals to expand)
 * 3. Social content priorities (what to create slides/pins for)
 * 
 * Usage:
 *   node seo-feedback-loop.js              — Full report
 *   node seo-feedback-loop.js --json       — JSON output for automation
 *   node seo-feedback-loop.js --days 28    — Custom date range
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GSC_DIR = path.join(__dirname, '..', '..', 'gsc-cli');
const TOKEN_PATH = path.join(GSC_DIR, 'token.json');
const SITE_URL = 'https://signseason.com/';
const SIGNS_DIR = path.join(__dirname, '..', 'signs');
const COMPAT_DIR = path.join(__dirname, '..', 'compatibility');
const OUTPUT_PATH = path.join(__dirname, '..', '..', 'memory', 'seo-feedback-latest.json');

const ALL_SIGNS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];

// Content verticals we track
const VERTICALS = [
  'soulmate', 'weaknesses', 'strengths', 'toxic-traits', 'when-angry', 'in-love', 'in-bed',
  'communication-style', 'love-language', 'red-flags', 'turn-ons', 'career', 'moon', 'rising',
  'spirit-animal', 'parent', 'pet-owner', 'gift-guide', 'as-a-friend', 'man', 'woman',
  '2026-horoscope', 'best-match', 'worst-match', 'dating', 'jealous'
];

async function authorize() {
  const gmailCreds = path.join(GSC_DIR, '..', 'gmail-cli', 'credentials.json');
  const credsPath = fs.existsSync(path.join(GSC_DIR, 'credentials.json'))
    ? path.join(GSC_DIR, 'credentials.json') : gmailCreds;
  const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
  const { client_id, client_secret } = creds.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3847');
  
  if (!fs.existsSync(TOKEN_PATH)) {
    console.error('❌ Not authorized. Run: cd gsc-cli && node gsc.js auth');
    process.exit(1);
  }
  
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  oAuth2Client.setCredentials(token);
  oAuth2Client.on('tokens', (tokens) => {
    const existing = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    fs.writeFileSync(TOKEN_PATH, JSON.stringify({ ...existing, ...tokens }, null, 2));
  });
  return oAuth2Client;
}

async function fetchGSCData(auth, days) {
  const webmasters = google.searchconsole({ version: 'v1', auth });
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const fmt = d => d.toISOString().split('T')[0];

  // Fetch pages with query dimensions for richer data
  const [pageRes, queryRes, pageQueryRes] = await Promise.all([
    webmasters.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(endDate),
        dimensions: ['page'],
        rowLimit: 500,
      },
    }),
    webmasters.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(endDate),
        dimensions: ['query'],
        rowLimit: 500,
      },
    }),
    webmasters.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(endDate),
        dimensions: ['page', 'query'],
        rowLimit: 1000,
      },
    }),
  ]);

  return {
    pages: (pageRes.data.rows || []).map(r => ({
      page: r.keys[0].replace('https://signseason.com', ''),
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
    queries: (queryRes.data.rows || []).map(r => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
    pageQueries: (pageQueryRes.data.rows || []).map(r => ({
      page: r.keys[0].replace('https://signseason.com', ''),
      query: r.keys[1],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
    dateRange: { start: fmt(startDate), end: fmt(endDate) },
  };
}

function tierPages(pages) {
  const tier1 = []; // Position < 10, almost getting clicks
  const tier2 = []; // Position 10-20, striking distance
  const tier3 = []; // Position 20+, but has impressions (Google sees potential)
  const unranked = []; // No GSC data

  for (const p of pages) {
    if (p.position < 10) tier1.push({ ...p, tier: 1 });
    else if (p.position < 20) tier2.push({ ...p, tier: 2 });
    else tier3.push({ ...p, tier: 3 });
  }

  // Sort each tier by impressions (highest potential first)
  tier1.sort((a, b) => b.impressions - a.impressions);
  tier2.sort((a, b) => b.impressions - a.impressions);
  tier3.sort((a, b) => b.impressions - a.impressions);

  return { tier1, tier2, tier3 };
}

function analyzeVerticals(pages) {
  const verticalPerformance = {};

  for (const p of pages) {
    const pagePath = p.page;
    for (const v of VERTICALS) {
      if (pagePath.includes(v)) {
        if (!verticalPerformance[v]) {
          verticalPerformance[v] = { totalImpressions: 0, totalClicks: 0, avgPosition: 0, pages: 0, positions: [] };
        }
        verticalPerformance[v].totalImpressions += p.impressions;
        verticalPerformance[v].totalClicks += p.clicks;
        verticalPerformance[v].positions.push(p.position);
        verticalPerformance[v].pages++;
      }
    }
  }

  // Calculate averages
  for (const v of Object.keys(verticalPerformance)) {
    const vp = verticalPerformance[v];
    vp.avgPosition = vp.positions.reduce((a, b) => a + b, 0) / vp.positions.length;
    delete vp.positions;
  }

  // Sort by total impressions
  return Object.entries(verticalPerformance)
    .sort(([, a], [, b]) => b.totalImpressions - a.totalImpressions)
    .map(([vertical, data]) => ({ vertical, ...data }));
}

function analyzeExistingPages(pages) {
  // Check all sign page files for content gaps
  const existingFiles = new Set();
  if (fs.existsSync(SIGNS_DIR)) {
    for (const f of fs.readdirSync(SIGNS_DIR)) {
      existingFiles.add('/signs/' + f.replace('.html', ''));
    }
  }
  if (fs.existsSync(COMPAT_DIR)) {
    for (const f of fs.readdirSync(COMPAT_DIR)) {
      existingFiles.add('/compatibility/' + f.replace('.html', ''));
    }
  }

  const pageMap = new Map(pages.map(p => [p.page, p]));
  
  // Find pages that exist but have zero GSC impressions
  const invisible = [];
  for (const path of existingFiles) {
    if (!pageMap.has(path)) {
      invisible.push(path);
    }
  }

  return { totalPages: existingFiles.size, invisible, tracked: pages.length };
}

function generateContentPriorities(verticalPerf, tiers) {
  const priorities = [];

  // 1. Expand verticals that are working (tier 1/2 verticals → build for remaining signs)
  const workingVerticals = verticalPerf
    .filter(v => v.avgPosition < 15 && v.totalImpressions >= 3)
    .map(v => v.vertical);

  for (const v of workingVerticals) {
    const existingSignPages = [];
    const missingSigns = [];
    for (const sign of ALL_SIGNS) {
      const path = `/signs/${sign}-${v}`;
      const altPath = `/signs/are-${sign}-${v}`;
      // Check if file exists
      const exists = fs.existsSync(path.replace('/signs/', SIGNS_DIR + '/') + '.html') ||
                     fs.existsSync(altPath.replace('/signs/', SIGNS_DIR + '/') + '.html');
      if (exists) existingSignPages.push(sign);
      else missingSigns.push(sign);
    }
    if (missingSigns.length > 0) {
      priorities.push({
        type: 'expand_vertical',
        vertical: v,
        missingSigns,
        existingCount: existingSignPages.length,
        reason: `"${v}" vertical is ranking (avg position ${verticalPerf.find(vp => vp.vertical === v).avgPosition.toFixed(1)}). Build remaining ${missingSigns.length} sign pages.`,
      });
    }
  }

  // 2. Optimize high-impression pages stuck in tier 2
  for (const p of tiers.tier2) {
    if (p.impressions >= 5) {
      priorities.push({
        type: 'optimize_existing',
        page: p.page,
        impressions: p.impressions,
        position: p.position,
        reason: `${p.impressions} impressions at position ${p.position.toFixed(1)}. Needs content expansion + internal links to push to page 1.`,
      });
    }
  }

  // 3. Social amplification for tier 1 pages
  for (const p of tiers.tier1) {
    priorities.push({
      type: 'social_amplify',
      page: p.page,
      impressions: p.impressions,
      position: p.position,
      reason: `Already at position ${p.position.toFixed(1)}. Create social posts to drive engagement signals.`,
    });
  }

  return priorities;
}

function generateOptimizationChecklist(page, pageQueries) {
  const checks = [];
  const pagePath = page.page;
  const filePath = path.join(__dirname, '..') + pagePath + '.html';
  
  if (!fs.existsSync(filePath)) return checks;
  
  const html = fs.readFileSync(filePath, 'utf8');
  
  // 1. Word count check
  const articleMatch = html.match(/<article[\s\S]*?<\/article>/);
  if (articleMatch) {
    const text = articleMatch[0].replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount < 1500) {
      checks.push({ issue: 'thin_content', detail: `Only ${wordCount} words. Target 2000+ for competitive queries.` });
    }
  }
  
  // 2. Internal link count in article body
  if (articleMatch) {
    const internalLinks = (articleMatch[0].match(/href="\/signs\/[^"]*"/g) || []).length;
    if (internalLinks < 5) {
      checks.push({ issue: 'low_internal_links', detail: `Only ${internalLinks} contextual internal links. Add 5-10 relevant cross-links in body copy.` });
    }
  }
  
  // 3. Image count
  if (articleMatch) {
    const images = (articleMatch[0].match(/<img/g) || []).length;
    if (images < 2) {
      checks.push({ issue: 'few_images', detail: `Only ${images} image(s). Add 2-3 relevant images with descriptive alt text.` });
    }
  }
  
  // 4. FAQ schema check
  if (!html.includes('FAQPage')) {
    checks.push({ issue: 'no_faq_schema', detail: 'Missing FAQPage schema. Add 3-5 FAQs for rich snippet eligibility.' });
  }
  
  // 5. Table of contents / jump links
  const h2Count = (html.match(/<h2/g) || []).length;
  const hasJumpLinks = html.includes('href="#') && !html.includes('href="#main');
  if (h2Count >= 4 && !hasJumpLinks) {
    checks.push({ issue: 'no_toc', detail: `${h2Count} sections but no table of contents. Add jump links for UX + potential sitelinks.` });
  }
  
  // 6. Meta description length
  const descMatch = html.match(/name="description"\s+content="([^"]*)"/);
  if (descMatch) {
    const desc = descMatch[1];
    if (desc.length < 120) {
      checks.push({ issue: 'short_meta_desc', detail: `Meta description is ${desc.length} chars. Target 140-155 for max SERP real estate.` });
    }
  }
  
  // 7. Related queries we're NOT targeting
  const relatedQueries = pageQueries
    .filter(pq => pq.page === page.page && pq.impressions > 0)
    .sort((a, b) => b.impressions - a.impressions);
  
  if (relatedQueries.length > 0) {
    checks.push({ 
      issue: 'query_coverage', 
      detail: `Ranking for ${relatedQueries.length} queries. Top: ${relatedQueries.slice(0, 5).map(q => `"${q.query}" (pos ${q.position.toFixed(0)})`).join(', ')}` 
    });
  }

  // 8. dateModified freshness
  const modMatch = html.match(/"dateModified":\s*"([^"]*)"/);
  if (modMatch) {
    const modDate = new Date(modMatch[1]);
    const daysSinceUpdate = (Date.now() - modDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 30) {
      checks.push({ issue: 'stale_content', detail: `Last modified ${modMatch[1]} (${Math.floor(daysSinceUpdate)} days ago). Refresh content + update dateModified.` });
    }
  }

  return checks;
}

function printReport(data, tiers, verticals, contentAnalysis, priorities) {
  console.log('\n' + '='.repeat(70));
  console.log('  📊 SEO FEEDBACK LOOP — Sign Season');
  console.log('  ' + data.dateRange.start + ' to ' + data.dateRange.end);
  console.log('='.repeat(70));

  // Aggregate stats
  const totalImpressions = data.pages.reduce((s, p) => s + p.impressions, 0);
  const totalClicks = data.pages.reduce((s, p) => s + p.clicks, 0);
  console.log(`\n  Total: ${totalImpressions} impressions, ${totalClicks} clicks`);
  console.log(`  Pages tracked: ${contentAnalysis.tracked} / ${contentAnalysis.totalPages} total`);
  console.log(`  Pages with zero impressions: ${contentAnalysis.invisible.length}`);

  // Tier 1
  console.log('\n🟢 TIER 1 — Almost Ranking (position < 10)');
  console.log('   Action: Internal link boost + social amplification');
  console.log('   ' + '-'.repeat(65));
  if (tiers.tier1.length === 0) console.log('   (none yet)');
  for (const p of tiers.tier1) {
    console.log(`   ${p.page.padEnd(45)} ${String(p.impressions).padStart(4)} impr  pos ${p.position.toFixed(1)}`);
  }

  // Tier 2
  console.log('\n🟡 TIER 2 — Striking Distance (position 10-20)');
  console.log('   Action: Content expansion + internal links + FAQ refresh');
  console.log('   ' + '-'.repeat(65));
  if (tiers.tier2.length === 0) console.log('   (none yet)');
  for (const p of tiers.tier2) {
    console.log(`   ${p.page.padEnd(45)} ${String(p.impressions).padStart(4)} impr  pos ${p.position.toFixed(1)}`);
  }

  // Tier 3
  console.log('\n🔴 TIER 3 — Indexed but Buried (position 20+)');
  console.log('   Action: Major rewrite if high impressions, deprioritize if low');
  console.log('   ' + '-'.repeat(65));
  for (const p of tiers.tier3.slice(0, 10)) {
    const flag = p.impressions >= 10 ? ' ← HIGH VOLUME' : '';
    console.log(`   ${p.page.padEnd(45)} ${String(p.impressions).padStart(4)} impr  pos ${p.position.toFixed(1)}${flag}`);
  }

  // Vertical performance
  console.log('\n📈 VERTICAL PERFORMANCE (which topics Google rewards)');
  console.log('   ' + '-'.repeat(65));
  for (const v of verticals.slice(0, 15)) {
    console.log(`   ${v.vertical.padEnd(25)} ${String(v.totalImpressions).padStart(4)} impr  ${v.pages} pages  avg pos ${v.avgPosition.toFixed(1)}`);
  }

  // Priorities
  console.log('\n🎯 CONTENT PRIORITIES (data-driven)');
  console.log('   ' + '-'.repeat(65));
  for (const p of priorities.slice(0, 10)) {
    const icon = p.type === 'expand_vertical' ? '📝' : p.type === 'optimize_existing' ? '🔧' : '📱';
    console.log(`   ${icon} ${p.reason}`);
  }

  // Page-level optimization for top tier 2 pages
  console.log('\n🔧 PAGE OPTIMIZATION CHECKLIST (Tier 2 high-value pages)');
  console.log('   ' + '-'.repeat(65));
  for (const p of tiers.tier2.filter(p => p.impressions >= 5)) {
    const checks = generateOptimizationChecklist(p, data.pageQueries);
    console.log(`\n   ${p.page} (${p.impressions} impr, pos ${p.position.toFixed(1)})`);
    if (checks.length === 0) {
      console.log('     ✅ No issues found');
    }
    for (const c of checks) {
      console.log(`     ⚠️  ${c.issue}: ${c.detail}`);
    }
  }

  // Also check tier 1 pages
  for (const p of tiers.tier1.filter(p => p.impressions >= 3)) {
    const checks = generateOptimizationChecklist(p, data.pageQueries);
    if (checks.filter(c => c.issue !== 'query_coverage').length > 0) {
      console.log(`\n   ${p.page} (${p.impressions} impr, pos ${p.position.toFixed(1)}) — TIER 1`);
      for (const c of checks) {
        console.log(`     ${c.issue === 'query_coverage' ? 'ℹ️' : '⚠️'}  ${c.issue}: ${c.detail}`);
      }
    }
  }

  console.log('\n' + '='.repeat(70));
}

// Main
const args = process.argv.slice(2);
const daysIdx = args.indexOf('--days');
const days = daysIdx >= 0 ? parseInt(args[daysIdx + 1]) : 28;
const jsonOutput = args.includes('--json');

const auth = await authorize();
const data = await fetchGSCData(auth, days);
const tiers = tierPages(data.pages);
const verticals = analyzeVerticals(data.pages);
const contentAnalysis = analyzeExistingPages(data.pages);
const priorities = generateContentPriorities(verticals, tiers);

// Save to memory for other scripts to consume
const report = {
  generated: new Date().toISOString(),
  dateRange: data.dateRange,
  tiers: { tier1: tiers.tier1, tier2: tiers.tier2, tier3: tiers.tier3 },
  verticals,
  contentAnalysis: { totalPages: contentAnalysis.totalPages, tracked: contentAnalysis.tracked, invisibleCount: contentAnalysis.invisible.length },
  priorities,
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printReport(data, tiers, verticals, contentAnalysis, priorities);
  console.log(`\n💾 Report saved to memory/seo-feedback-latest.json`);
}
