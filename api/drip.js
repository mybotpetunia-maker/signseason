// Vercel Serverless Function: Process drip email queue
// Called daily by cron job. Checks all contacts, sends due drip emails.
// GET /api/drip?key=<DRIP_SECRET>

export default async function handler(req, res) {
  // Auth check
  const dripSecret = process.env.DRIP_SECRET;
  if (!dripSecret || req.query.key !== dripSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Drip schedule: day -> { subject, id }
  const DRIP_EMAILS = [
    { day: 0, id: 'welcome' },   // handled by subscribe.js
    { day: 2, id: 'compatibility', subject: "Who's your worst match? (be honest)" },
    { day: 4, id: 'toolkit', subject: "Your moon sign matters more than you think" },
    { day: 7, id: 'deepcuts', subject: "The stuff your sign won't tell you about yourself" },
    { day: 14, id: 'stay', subject: "Still here? Good. Here's what's new." },
  ];

  try {
    // 1. Get all contacts from Resend
    let allContacts = [];
    let cursor = null;
    let hasMore = true;
    
    while (hasMore) {
      const url = new URL('https://api.resend.com/contacts');
      url.searchParams.set('limit', '100');
      if (cursor) url.searchParams.set('after', cursor);
      
      const resp = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${RESEND_KEY}` },
      });
      const data = await resp.json();
      allContacts = allContacts.concat(data.data || []);
      hasMore = data.has_more;
      if (hasMore && data.data?.length) {
        cursor = data.data[data.data.length - 1].id;
      }
    }

    // Filter out unsubscribed and test emails
    const contacts = allContacts.filter(c => 
      !c.unsubscribed && 
      !c.email.includes('test') && 
      !c.email.includes('delete')
    );

    const now = Date.now();
    const results = { sent: [], skipped: [], errors: [] };

    for (const contact of contacts) {
      const signupDate = new Date(contact.created_at);
      const daysSinceSignup = Math.floor((now - signupDate.getTime()) / (1000 * 60 * 60 * 24));

      // Check which drip emails are due
      for (const drip of DRIP_EMAILS) {
        if (drip.day === 0) continue; // Welcome handled by subscribe.js
        if (daysSinceSignup < drip.day) continue; // Not due yet
        if (daysSinceSignup > drip.day + 3) continue; // Too late (3-day window)

        // Check if already sent (Redis)
        const redisKey = `drip:${contact.email}:${drip.id}`;
        
        if (REDIS_URL && REDIS_TOKEN) {
          const checkResp = await fetch(`${REDIS_URL}/get/${encodeURIComponent(redisKey)}`, {
            headers: { 'Authorization': `Bearer ${REDIS_TOKEN}` },
          });
          const checkData = await checkResp.json();
          if (checkData.result) {
            results.skipped.push(`${contact.email}:${drip.id} (already sent)`);
            continue;
          }
        }

        // Fetch email HTML from our templates endpoint
        const templateResp = await fetch(
          `https://signseason.com/api/drip-template?id=${drip.id}`,
          { headers: { 'x-drip-key': dripSecret } }
        );
        
        if (!templateResp.ok) {
          results.errors.push(`${contact.email}:${drip.id} (template fetch failed)`);
          continue;
        }
        
        const template = await templateResp.json();

        // Send via Resend
        const sendResp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Sign Season <stars@signseason.com>',
            to: [contact.email],
            subject: template.subject,
            html: template.html,
          }),
        });

        if (sendResp.ok) {
          results.sent.push(`${contact.email}:${drip.id}`);
          
          // Mark as sent in Redis
          if (REDIS_URL && REDIS_TOKEN) {
            await fetch(`${REDIS_URL}/set/${encodeURIComponent(redisKey)}/1`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${REDIS_TOKEN}` },
            });
          }
        } else {
          const err = await sendResp.text();
          results.errors.push(`${contact.email}:${drip.id} (${err})`);
        }

        // Rate limit: small delay between sends
        await new Promise(r => setTimeout(r, 500));
      }
    }

    return res.status(200).json({
      contacts: contacts.length,
      ...results,
    });
  } catch (err) {
    console.error('Drip processor error:', err);
    return res.status(500).json({ error: err.message });
  }
}
