// Vercel Serverless Function: List subscribers (admin only)
// GET /api/admin/subscribers?key=ADMIN_KEY
// Reads from account-level contacts list (same endpoint subscribe.js writes to)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key } = req.query;
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Read from account-level contact list — same place subscribe.js writes to.
    // (Previously read from audiences/{id}/contacts which nothing ever wrote to.)
    const contactsRes = await fetch('https://api.resend.com/contacts', {
      headers: { Authorization: `Bearer ${RESEND_KEY}` },
    });

    if (!contactsRes.ok) {
      const err = await contactsRes.json();
      console.error('Resend contacts fetch error:', err);
      return res.status(500).json({ error: 'Failed to fetch contacts', detail: err });
    }

    const contacts = await contactsRes.json();
    const OWNER_EMAILS = [
      'tara.c.fung@gmail.com',
      'tara@cocreate.ink',
      'mybotpetunia@gmail.com',
    ];
    const TEST_PATTERNS = ['@example.com', 'petunia.', 'test-petunia', 'capturetest'];

    const active = (contacts.data || []).filter((c) => {
      const email = c.email.toLowerCase();
      if (c.unsubscribed) return false;
      if (OWNER_EMAILS.includes(email)) return false;
      if (TEST_PATTERNS.some((p) => email.includes(p))) return false;
      return true;
    });

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
