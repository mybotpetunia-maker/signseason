// Vercel Serverless Function: Return drip email HTML by ID
// GET /api/drip-template?id=compatibility

// Inline the email templates since Vercel serverless doesn't support ESM imports easily

function wrapEmail({ headline, subtitle, bodyHtml, ctaText, ctaUrl, preheader }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${headline}</title>
  ${preheader ? `<span style="display:none;font-size:1px;color:#1A1320;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
</head>
<body style="margin:0;padding:0;background-color:#1A1320;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1320;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
        <tr><td align="center" style="padding-bottom:32px;">
          <a href="https://signseason.com" style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-style:italic;color:#C9AD6F;text-decoration:none;letter-spacing:0.05em;">sign season</a>
        </td></tr>
        <tr><td style="border:1px solid rgba(201,173,111,0.25);padding:48px 32px;background-color:#2A1F33;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:32px;">
            <div style="width:60px;height:1px;background-color:rgba(138,125,112,0.5);"></div>
          </td></tr></table>
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:bold;color:#F0E8D8;margin:0 0 12px 0;text-align:center;letter-spacing:-0.02em;line-height:1.3;">${headline}</h1>
          ${subtitle ? `<p style="font-family:Georgia,'Times New Roman',serif;font-size:17px;font-style:italic;color:#B09A6E;margin:0 0 36px 0;text-align:center;">${subtitle}</p>` : '<div style="height:24px;"></div>'}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:28px;">
            <div style="width:40px;height:1px;background-color:rgba(138,125,112,0.3);"></div>
          </td></tr></table>
          ${bodyHtml}
          ${ctaText ? `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:36px 0 8px;">
            <a href="${ctaUrl}" style="display:inline-block;padding:16px 32px;background-color:#C9AD6F;color:#1A1320;text-decoration:none;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;border-radius:4px;">${ctaText}</a>
          </td></tr></table>` : ''}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 0 16px;">
            <div style="width:60px;height:1px;background-color:rgba(138,125,112,0.3);"></div>
          </td></tr></table>
          <p style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:12px;color:#8A7D70;margin:0;text-align:center;">Sign Season &middot; <a href="https://signseason.com" style="color:#C9AD6F;text-decoration:none;">signseason.com</a></p>
          <p style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;color:#6B6058;margin:8px 0 0;text-align:center;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#6B6058;text-decoration:underline;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const P = (t) => `<p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 20px 0;">${t}</p>`;
const B = (t) => `<strong style="color:#E2D4A7;">${t}</strong>`;
const A = (t, u) => `<a href="${u}" style="color:#C9AD6F;text-decoration:underline;">${t}</a>`;
const H2 = (t) => `<h2 style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:bold;color:#E2D4A7;margin:32px 0 12px 0;">${t}</h2>`;
const DIV = () => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 0;"><div style="width:30px;height:1px;background-color:rgba(138,125,112,0.25);"></div></td></tr></table>`;
const CARD = (title, desc, url) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td style="padding:16px 20px;background-color:rgba(30,21,40,0.6);border:1px solid rgba(201,173,111,0.1);border-radius:4px;"><a href="${url}" style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#C9AD6F;text-decoration:none;font-weight:bold;">${title}</a><p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#B09A6E;margin:4px 0 0;line-height:1.5;">${desc}</p></td></tr></table>`;

const TEMPLATES = {
  welcome: {
    subject: '✨ Welcome to Sign Season',
    headline: 'Welcome to Sign Season.',
    subtitle: "It's always somebody's season. Now it's yours.",
    preheader: "It's always somebody's season. Now it's yours.",
    body: [
      P("You're in. Every week, we'll drop compatibility takes, crystal recs, and the kind of zodiac content your group chat has been missing."),
      P(`No fluff. No "today is a good day for love, Libra." Just the real stuff: ${B('who you should date')}, ${B('who you should avoid')}, and ${B('why your Scorpio ex still haunts your dreams')}.`),
      P("Your first drop lands in a couple days. In the meantime, go find your sign and see what we've got for you."),
    ],
    ctaText: 'Find Your Sign',
    ctaUrl: 'https://signseason.com/signs/',
  },
  compatibility: {
    subject: "Who's your worst match? (be honest)",
    headline: "Let's talk compatibility.",
    subtitle: "The matches that work, the ones that don't, and the ones that are just chaos.",
    preheader: "The zodiac pairings that almost never work. Somebody had to say it.",
    body: [
      P("Compatibility is the thing everyone wants to know about but nobody wants to hear the truth about."),
      P(`We broke down every zodiac pairing. ${B('Love, trust, communication, the whole thing.')} Not the sugar-coated version. The real one.`),
      H2("Start here"),
      CARD("♈ Aries + Leo: The Power Couple?", "Two fire signs, one explosive pairing. 88% compatible.", "https://signseason.com/compatibility/aries-leo"),
      CARD("♏ Scorpio + Pisces: Deep End", "The most emotionally intense pairing in the zodiac.", "https://signseason.com/compatibility/scorpio-pisces"),
      CARD("♊ Gemini + Virgo: It's Complicated", "Both Mercury-ruled. Both overthinkers. Both exhausting.", "https://signseason.com/compatibility/gemini-virgo"),
      DIV(),
      P(`Or skip straight to the drama: ${A('find your worst match', 'https://signseason.com/signs/#worst-matches')}.`),
    ],
    ctaText: 'Check Your Compatibility',
    ctaUrl: 'https://signseason.com/compatibility/',
  },
  toolkit: {
    subject: "Your moon sign matters more than you think",
    headline: 'Beyond your Sun sign.',
    subtitle: "The parts of your chart that actually explain why you're like this.",
    preheader: "Sun sign = who you are. Moon sign = who you are at 2am.",
    body: [
      P("Your sun sign is the headline. But the real story? That's your moon sign, your rising sign, and the crystals that keep your energy in check."),
      H2("Your Moon Sign"),
      P(`Your moon sign is your emotional core. It's why two Leos can feel completely different. ${A('Find your moon sign breakdown', 'https://signseason.com/signs/#moon-signs')}.`),
      H2("Your Rising Sign"),
      P(`Your rising sign is the mask you wear. First impressions, your vibe when you walk into a room. ${A('Read your rising sign guide', 'https://signseason.com/signs/#rising-signs')}.`),
      H2("Your Crystals"),
      P(`Every sign has crystals that match their energy. Not the woo-woo version. The practical one: which stones to wear, carry, or keep on your nightstand. ${A('Find your crystals', 'https://signseason.com/crystals/')}.`),
    ],
    ctaText: 'Explore Your Full Chart',
    ctaUrl: 'https://signseason.com/signs/',
  },
  deepcuts: {
    subject: "The stuff your sign won't tell you about yourself",
    headline: 'The deep cuts.',
    subtitle: "The unfiltered zodiac content nobody asked for (but everyone needs).",
    preheader: "Toxic traits, red flags, and love languages. The unfiltered zodiac.",
    body: [
      P("We saved the best stuff for week two. This is where it gets personal."),
      H2("Toxic Traits"),
      P(`Every sign has them. Yours too. We wrote the honest version: no sugarcoating, no astrology excuses. Just the truth about why you're like that. ${A('Read yours', 'https://signseason.com/signs/#toxic-traits')}.`),
      H2("Red Flags"),
      P(`The warning signs you should never ignore, broken down by zodiac sign. Some of these will feel like a personal attack. That's the point. ${A('Check the red flags', 'https://signseason.com/signs/#red-flags')}.`),
      H2("Love Languages"),
      P(`How each sign gives love, receives love, and what happens when their love language gets ignored. The cheat code to actually making it work. ${A('Find yours', 'https://signseason.com/signs/#love-language')}.`),
      DIV(),
      P("Fair warning: this content gets screenshotted and sent to group chats. Don't say we didn't warn you."),
    ],
    ctaText: 'Read the Deep Cuts',
    ctaUrl: 'https://signseason.com/signs/',
  },
  stay: {
    subject: "Still here? Good. Here's what's new.",
    headline: "You stuck around.",
    subtitle: "That says something about you. (Probably something your chart predicted.)",
    preheader: "New content dropping every week. Here's what you might have missed.",
    body: [
      P("Two weeks in. You're one of us now."),
      P("We're adding new content every week. Soulmate guides, life path numbers, turn ons, worst matches, communication styles. The kind of stuff you read at midnight and then text your friends about."),
      H2("In case you missed it"),
      CARD("Soulmate Guides", "Who your zodiac soulmate actually is. (It's not who you think.)", "https://signseason.com/signs/#soulmates"),
      CARD("Life Path Numbers", "Your numerology breakdown. A whole other layer of cosmic insight.", "https://signseason.com/signs/#numerology"),
      CARD("Communication Styles", "How each sign texts, argues, and says I love you.", "https://signseason.com/signs/#communication"),
      DIV(),
      P("We'll keep showing up in your inbox with the good stuff. No spam, no filler. Just the content your group chat needs."),
      P(`Follow us on ${A('TikTok', 'https://tiktok.com/@sign_season')}, ${A('Instagram', 'https://instagram.com/signseasonco')}, and ${A('Pinterest', 'https://pinterest.com/signseason')} for daily zodiac content.`),
    ],
    ctaText: "See What's New",
    ctaUrl: 'https://signseason.com/',
  },
};

export default async function handler(req, res) {
  // Simple auth
  const dripSecret = process.env.DRIP_SECRET;
  if (dripSecret && req.headers['x-drip-key'] !== dripSecret && req.query.key !== dripSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  const template = TEMPLATES[id];

  if (!template) {
    return res.status(404).json({ error: `Template '${id}' not found`, available: Object.keys(TEMPLATES) });
  }

  const html = wrapEmail({
    headline: template.headline,
    subtitle: template.subtitle,
    preheader: template.preheader,
    bodyHtml: template.body.join(''),
    ctaText: template.ctaText,
    ctaUrl: template.ctaUrl,
  });

  // Allow preview in browser
  if (req.query.preview === '1') {
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }

  return res.status(200).json({
    id,
    subject: template.subject,
    html,
  });
}
