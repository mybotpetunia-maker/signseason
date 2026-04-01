// Vercel Serverless Function: Pageview beacon receiver
// POST /api/track — stores pageview data in Upstash Redis
// Bot filtering: rejects known crawlers, headless browsers, and non-browser UAs

var BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
  /headless/i, /phantom/i, /puppet/i, /playwright/i, /selenium/i,
  /lighthouse/i, /pagespeed/i, /gtmetrix/i, /pingdom/i,
  /curl/i, /wget/i, /httpie/i, /python/i, /java\//i, /go-http/i,
  /node-fetch/i, /axios/i, /undici/i, /got\//i,
  /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i, /whatsapp/i,
  /telegrambot/i, /discordbot/i, /slackbot/i,
  /googlebot/i, /bingbot/i, /yandexbot/i, /baiduspider/i, /duckduckbot/i,
  /applebot/i, /petalbot/i, /semrushbot/i, /ahrefsbot/i, /mj12bot/i,
  /dotbot/i, /rogerbot/i, /screaming frog/i, /sitebulb/i,
  /gptbot/i, /chatgpt/i, /claudebot/i, /anthropic/i, /cohere/i,
  /bytespider/i, /amazonbot/i, /ia_archiver/i,
  /preview/i, /embed/i, /fetch/i, /scan/i, /check/i, /monitor/i,
  /uptime/i, /statuspage/i, /dataprovider/i, /netcraft/i,
];

// Browsers always have Mozilla/ and one of these rendering engines
function looksLikeBrowser(ua) {
  if (!ua) return false;
  // Must have Mozilla/ prefix (all real browsers do)
  if (!/^Mozilla\//.test(ua)) return false;
  // Must mention at least one real rendering engine or browser
  if (/Chrome|Firefox|Safari|Edge|Opera|Brave|Vivaldi|Samsung/i.test(ua)) return true;
  return false;
}

function isBot(ua) {
  if (!ua) return true;
  // Check explicit bot patterns
  for (var i = 0; i < BOT_PATTERNS.length; i++) {
    if (BOT_PATTERNS[i].test(ua)) return true;
  }
  // If it doesn't look like a real browser, reject
  if (!looksLikeBrowser(ua)) return true;
  return false;
}

function extractDomain(referrer) {
  if (!referrer || referrer === '(direct)') return '(direct)';
  try {
    var host = new URL(referrer).hostname.replace(/^www\./, '');
    return host || '(direct)';
  } catch (e) {
    return '(direct)';
  }
}

async function redis(commands) {
  var url = process.env.UPSTASH_REDIS_URL;
  var token = process.env.UPSTASH_REDIS_TOKEN;
  var res = await fetch(url + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Bot filtering — check user-agent
  var ua = req.headers['user-agent'] || '';
  if (isBot(ua)) {
    return res.status(200).json({ ok: true }); // silent discard, don't reveal filtering
  }

  // Rate limit: ignore if body > 1KB
  var raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  if (raw && raw.length > 1024) {
    return res.status(413).json({ error: 'Payload too large' });
  }

  try {
    var data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    var path = data.p || '/';
    var referrer = data.r || '(direct)';
    var sessionId = data.s || 'unknown';

    var today = new Date().toISOString().slice(0, 10);
    var refDomain = extractDomain(referrer);
    var TTL = 7776000; // 90 days

    var cmds = [
      ['HINCRBY', 'ss:pv:' + today, path, 1],
      ['INCRBY', 'ss:total:' + today, 1],
      ['HINCRBY', 'ss:ref:' + today, refDomain, 1],
      ['SADD', 'ss:sessions:' + today, sessionId],
      ['EXPIRE', 'ss:pv:' + today, TTL],
      ['EXPIRE', 'ss:total:' + today, TTL],
      ['EXPIRE', 'ss:ref:' + today, TTL],
      ['EXPIRE', 'ss:sessions:' + today, TTL],
    ];

    await redis(cmds);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Track error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
