// Vercel Serverless Function: List subscribers (admin only)
// GET /api/subscribers?key=ADMIN_KEY

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key } = req.query;
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!RESEND_KEY || !audienceId) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const contactsRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        headers: { Authorization: `Bearer ${RESEND_KEY}` },
      }
    );

    if (!contactsRes.ok) {
      const err = await contactsRes.json();
      return res.status(500).json({ error: 'Failed to fetch contacts', detail: err });
    }

    const contacts = await contactsRes.json();
    const active = (contacts.data || []).filter((c) => !c.unsubscribed);

    return res.status(200).json({
      total: active.length,
      subscribers: active.map((c) => ({
        email: c.email,
        joined: c.created_at,
      })),
    });
  } catch (err) {
    console.error('Subscribers error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
