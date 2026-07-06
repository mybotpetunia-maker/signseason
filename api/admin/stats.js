// Vercel Serverless Function: Aggregated analytics
// GET /api/admin/stats?key=ADMIN_KEY&days=30

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

function dateRange(days) {
  var dates = [];
  for (var i = days - 1; i >= 0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

async function getSubscribers() {
  var RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return { total: 0, daily: [], list: [] };

  // Read from account-level contacts — same endpoint subscribe.js writes to.
  // (Previously used audiences/{id}/contacts which was always empty.)
  var contactsRes = await fetch('https://api.resend.com/contacts', {
    headers: { Authorization: 'Bearer ' + RESEND_KEY },
  });
  if (!contactsRes.ok) return { total: 0, daily: [], list: [] };

  var contacts = await contactsRes.json();
  var OWNER_EMAILS = ['tara.c.fung@gmail.com', 'tara@cocreate.ink', 'mybotpetunia@gmail.com'];
  var TEST_PATTERNS = ['@example.com', 'petunia.', 'test-petunia', 'capturetest'];
  var active = (contacts.data || []).filter(function (c) {
    var email = c.email.toLowerCase();
    if (c.unsubscribed) return false;
    if (OWNER_EMAILS.indexOf(email) !== -1) return false;
    if (TEST_PATTERNS.some(function(p) { return email.indexOf(p) !== -1; })) return false;
    return true;
  });

  // Group by date
  var byDate = {};
  active.forEach(function (c) {
    var date = c.created_at ? c.created_at.slice(0, 10) : 'unknown';
    byDate[date] = (byDate[date] || 0) + 1;
  });

  return {
    total: active.length,
    daily: Object.keys(byDate).sort().map(function (d) { return { date: d, signups: byDate[d] }; }),
    list: active.map(function (c) { return { email: c.email, joined: c.created_at }; }),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var key = req.query.key;
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  var days = parseInt(req.query.days, 10) || 30;
  if (days > 90) days = 90;
  if (days < 1) days = 1;

  var dates = dateRange(days);

  // Build Redis commands: for each date get total, sessions count, pageviews hash, referrers hash
  var cmds = [];
  dates.forEach(function (d) {
    cmds.push(['GET', 'ss:total:' + d]);
    cmds.push(['SCARD', 'ss:sessions:' + d]);
    cmds.push(['HGETALL', 'ss:pv:' + d]);
    cmds.push(['HGETALL', 'ss:ref:' + d]);
  });

  try {
    var [redisResults, subscriberData] = await Promise.all([
      redis(cmds),
      getSubscribers(),
    ]);

    var totalPageviews = 0;
    var totalUniques = 0;
    var daily = [];
    var pageTotals = {};
    var refTotals = {};

    for (var i = 0; i < dates.length; i++) {
      var base = i * 4;
      var dayPV = parseInt(redisResults[base].result, 10) || 0;
      var dayUniq = parseInt(redisResults[base + 1].result, 10) || 0;

      totalPageviews += dayPV;
      totalUniques += dayUniq;
      daily.push({ date: dates[i], pageviews: dayPV, uniques: dayUniq });

      // Aggregate page views
      var pvHash = redisResults[base + 2].result;
      if (pvHash && Array.isArray(pvHash)) {
        for (var j = 0; j < pvHash.length; j += 2) {
          var page = pvHash[j];
          var count = parseInt(pvHash[j + 1], 10) || 0;
          pageTotals[page] = (pageTotals[page] || 0) + count;
        }
      }

      // Aggregate referrers
      var refHash = redisResults[base + 3].result;
      if (refHash && Array.isArray(refHash)) {
        for (var k = 0; k < refHash.length; k += 2) {
          var src = refHash[k];
          var cnt = parseInt(refHash[k + 1], 10) || 0;
          refTotals[src] = (refTotals[src] || 0) + cnt;
        }
      }
    }

    var topPages = Object.keys(pageTotals)
      .map(function (p) { return { path: p, views: pageTotals[p] }; })
      .sort(function (a, b) { return b.views - a.views; })
      .slice(0, 20);

    var topReferrers = Object.keys(refTotals)
      .map(function (s) { return { source: s, visits: refTotals[s] }; })
      .sort(function (a, b) { return b.visits - a.visits; })
      .slice(0, 15);

    return res.status(200).json({
      period: { from: dates[0], to: dates[dates.length - 1], days: days },
      traffic: { totalPageviews: totalPageviews, totalUniques: totalUniques, daily: daily },
      topPages: topPages,
      topReferrers: topReferrers,
      subscribers: subscriberData,
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
