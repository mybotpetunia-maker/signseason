// Vercel Serverless Function: Pageview beacon receiver
// POST /api/track — stores pageview data in Upstash Redis

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
