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
    // 1. Add contact to Resend audience
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (audienceId) {
      await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
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
    }

    // 2. Send welcome email
    const welcomeRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sign Season <stars@signseason.com>',
        to: [email],
        subject: '✨ Welcome to Sign Season',
        html: `
          <div style="font-family: Georgia, 'Cormorant Garamond', serif; max-width: 520px; margin: 0 auto; padding: 48px 24px; background: #110B20; color: #D0C8E4;">
            <h1 style="font-size: 32px; font-weight: 300; color: #F0E8D8; margin-bottom: 8px; letter-spacing: -0.02em;">Welcome to Sign Season.</h1>
            <p style="font-size: 18px; font-style: italic; color: #7A6E96; margin-bottom: 32px;">It's always somebody's season. Now it's yours.</p>
            <p style="font-size: 15px; line-height: 1.7; color: #A89BC8; margin-bottom: 24px;">You're in. Every week, you'll get your horoscope, crystal recs, compatibility takes, and the cosmic updates your group chat has been missing.</p>
            <p style="font-size: 15px; line-height: 1.7; color: #A89BC8; margin-bottom: 32px;">Your first weekly horoscope lands soon. In the meantime, explore your sign:</p>
            <a href="https://signseason.com/#signs" style="display: inline-block; padding: 14px 28px; background: #B89D4A; color: #110B20; text-decoration: none; font-family: -apple-system, sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 4px;">Find Your Sign</a>
            <p style="margin-top: 40px; font-size: 12px; color: #7A6E96;">Sign Season &middot; <a href="https://signseason.com" style="color: #B89D4A; text-decoration: none;">signseason.com</a></p>
          </div>
        `,
      }),
    });

    if (!welcomeRes.ok) {
      const err = await welcomeRes.json();
      console.error('Resend email error:', err);
      return res.status(500).json({ error: 'Failed to send welcome email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
