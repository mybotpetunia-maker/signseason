// Vercel Serverless Function: Email signup via Resend
// POST /api/subscribe { email: "user@example.com" }

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://signseason.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 1. Add contact to Resend
    await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
      }),
    });

    // 2. Fetch welcome email template from our template endpoint
    const DRIP_SECRET = process.env.DRIP_SECRET;
    const templateUrl = `https://signseason.com/api/drip-template?id=welcome${DRIP_SECRET ? `&key=${DRIP_SECRET}` : ''}`;
    
    let welcomeHtml;
    let welcomeSubject = 'your chart called. it has notes. ✨';
    
    try {
      const templateResp = await fetch(templateUrl);
      if (templateResp.ok) {
        const template = await templateResp.json();
        welcomeHtml = template.html;
        welcomeSubject = template.subject;
      }
    } catch (e) {
      console.error('Template fetch error (using fallback):', e);
    }

    // Fallback inline template if template endpoint fails
    if (!welcomeHtml) {
      welcomeHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>
<body style="margin:0;padding:0;background-color:#1A1320;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1320;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
<tr><td style="border:1px solid rgba(201,173,111,0.25);padding:48px 32px;background-color:#2A1F33;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:28px;"><div style="width:60px;height:1px;background-color:rgba(138,125,112,0.5);"></div></td></tr></table>
<h1 style="font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#F0E8D8;margin:0 0 12px;text-align:center;">Hey. I'm Stella.</h1>
<p style="font-family:Georgia,serif;font-size:17px;font-style:italic;color:#B09A6E;margin:0 0 32px;text-align:center;">Your chart called. It has notes.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:28px;"><div style="width:40px;height:1px;background-color:rgba(138,125,112,0.3);"></div></td></tr></table>
<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 20px;">You're in. Every week, I'll send you horoscopes that are actually worth reading, compatibility takes your group chat will fight over, and crystal recs that go deeper than "rose quartz for love."</p>
<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 32px;">Your first weekly horoscope lands soon. In the meantime, go find your sign. I already know which one you'll click first.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:32px;"><a href="https://signseason.com/#signs" style="display:inline-block;padding:16px 32px;background-color:#C9AD6F;color:#1A1320;text-decoration:none;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;border-radius:4px;">Find Your Sign</a></td></tr></table>
<p style="font-family:Georgia,serif;font-size:16px;font-style:italic;color:#B09A6E;margin:0 0 32px;text-align:center;">&#10024; Stella</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:16px;"><div style="width:60px;height:1px;background-color:rgba(138,125,112,0.3);"></div></td></tr></table>
<p style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:12px;color:#8A7D70;margin:0;text-align:center;">Sign Season &middot; <a href="https://signseason.com" style="color:#C9AD6F;text-decoration:none;">signseason.com</a></p>
</td></tr></table>
</td></tr></table>
</body></html>`;
    }

    // Send welcome email
    const welcomeRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Stella from Sign Season <stars@signseason.com>',
        to: [email],
        subject: welcomeSubject,
        html: welcomeHtml,
      }),
    });

    if (!welcomeRes.ok) {
      const err = await welcomeRes.json();
      console.error('Resend email error:', err);
      return res.status(500).json({ error: 'Failed to send welcome email' });
    }

    // 3. Mark welcome drip as sent in Redis
    const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
    const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (REDIS_URL && REDIS_TOKEN) {
      try {
        await fetch(`${REDIS_URL}/set/${encodeURIComponent(`drip:${email}:welcome`)}/1`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${REDIS_TOKEN}` },
        });
      } catch (e) {
        console.error('Redis drip tracking error:', e);
      }
    }

    // 4. Notify Tara via Telegram
    const TG_TOKEN = process.env.TG_BOT_TOKEN;
    const TG_CHAT = process.env.TG_CHAT_ID;
    if (TG_TOKEN && TG_CHAT) {
      try {
        await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TG_CHAT,
            text: `✨ New Sign Season subscriber!\n${email}`,
            parse_mode: 'HTML',
          }),
        });
      } catch (tgErr) {
        console.error('Telegram notify error:', tgErr);
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
