// Vercel Serverless Function: Birth chart submission
// POST /api/chart-submit
// { name, email, birth_date, birth_time, birth_city, birth_country }

import { getSunSign, calculateMoonSign, calculateRisingSign, getCityCoords } from './lib/ephemeris.js';

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

  const { name, email, birth_date, birth_time, birth_city, birth_country } = req.body || {};

  // Validate required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (!birth_date) {
    return res.status(400).json({ error: 'Birth date is required.' });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_TOKEN;

  try {
    // 1. Calculate sun sign
    const sunSign = getSunSign(birth_date);
    if (!sunSign) {
      return res.status(400).json({ error: 'Could not determine sun sign from birth date. Please check the date format.' });
    }

    // 2. Resolve city coordinates / timezone
    const cityCoords = getCityCoords(birth_city, birth_country);
    const utcOffset  = cityCoords ? cityCoords.utcOffset : 0;

    // 3. Calculate moon sign
    let moonResult = null;
    try {
      moonResult = calculateMoonSign(birth_date, birth_time || null, utcOffset);
    } catch (err) {
      console.error('Moon calculation error:', err);
    }

    // 4. Calculate rising sign (requires time + located city)
    let risingResult = null;
    if (birth_time && cityCoords) {
      try {
        risingResult = calculateRisingSign(
          birth_date,
          birth_time,
          cityCoords.lat,
          cityCoords.lon,
          utcOffset
        );
      } catch (err) {
        console.error('Rising calculation error:', err);
      }
    }

    const moonSign   = moonResult   ? moonResult.sign   : null;
    const risingSign = risingResult ? risingResult.sign : null;

    // 5. Store birth data in Redis
    if (REDIS_URL && REDIS_TOKEN) {
      const chartData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        birthDate: birth_date,
        birthTime: birth_time || null,
        birthCity: birth_city || null,
        birthCountry: birth_country || null,
        sunSign,
        moonSign,
        risingSign,
        moonNote: moonResult && moonResult.note ? moonResult.note : null,
        cityResolved: cityCoords ? true : false,
        createdAt: new Date().toISOString(),
      };

      try {
        await fetch(`${REDIS_URL}/set/${encodeURIComponent(`birthchart:${email.trim().toLowerCase()}`)}/${encodeURIComponent(JSON.stringify(chartData))}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${REDIS_TOKEN}` },
        });
      } catch (redisErr) {
        console.error('Redis store error:', redisErr);
        // Non-fatal, continue
      }
    }

    // 6. Add contact to Resend
    try {
      await fetch('https://api.resend.com/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          first_name: name.trim(),
          unsubscribed: false,
        }),
      });
    } catch (contactErr) {
      console.error('Resend contact error:', contactErr);
      // Non-fatal, continue
    }

    // 7. Generate and send the chart reading email
    const emailHtml = buildChartEmail(
      name.trim(),
      sunSign,
      moonSign,
      risingSign,
      birth_time,
      birth_city,
      cityCoords,
      moonResult && moonResult.note ? moonResult.note : null
    );

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Stella from Sign Season <stars@signseason.com>',
        to: [email.trim().toLowerCase()],
        subject: buildSubject(name.trim(), sunSign, moonSign, risingSign),
        html: emailHtml,
      }),
    });

    if (!emailRes.ok) {
      const emailErr = await emailRes.json();
      console.error('Resend email error:', emailErr);
      return res.status(500).json({ error: 'Failed to send your reading. Please try again.' });
    }

    // 8. Mark welcome drip as sent
    if (REDIS_URL && REDIS_TOKEN) {
      try {
        await fetch(`${REDIS_URL}/set/${encodeURIComponent(`drip:${email.trim().toLowerCase()}:welcome`)}/1`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${REDIS_TOKEN}` },
        });
      } catch (dripErr) {
        console.error('Redis drip mark error:', dripErr);
      }
    }

    // 9. Notify Tara via Telegram
    const TG_TOKEN = process.env.TG_BOT_TOKEN;
    const TG_CHAT  = process.env.TG_CHAT_ID;
    if (TG_TOKEN && TG_CHAT) {
      try {
        const bigThree = [sunSign, moonSign, risingSign].filter(Boolean).join(' / ');
        await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TG_CHAT,
            text: `✨ New birth chart signup!\n${name.trim()} — ${bigThree}\n${email.trim().toLowerCase()}`,
          }),
        });
      } catch (tgErr) {
        console.error('Telegram notify error:', tgErr);
      }
    }

    return res.status(200).json({ success: true, sunSign, moonSign, risingSign });

  } catch (err) {
    console.error('Chart submit error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

// ─── Email Subject ────────────────────────────────────────────────────
function buildSubject(name, sunSign, moonSign, risingSign) {
  if (moonSign && risingSign) {
    return `Your big three, ${name}. Sun, moon, rising.`;
  }
  if (moonSign) {
    return `Your chart, ${name}. Sun in ${sunSign}, moon in ${moonSign}.`;
  }
  return `Your chart, ${name}. Let's talk about being a ${sunSign}.`;
}

// ─── Zodiac Glyphs ────────────────────────────────────────────────────
function getGlyph(sign) {
  const glyphs = {
    Aries: '&#9800;&#xFE0E;',
    Taurus: '&#9801;&#xFE0E;',
    Gemini: '&#9802;&#xFE0E;',
    Cancer: '&#9803;&#xFE0E;',
    Leo: '&#9804;&#xFE0E;',
    Virgo: '&#9805;&#xFE0E;',
    Libra: '&#9806;&#xFE0E;',
    Scorpio: '&#9807;&#xFE0E;',
    Sagittarius: '&#9808;&#xFE0E;',
    Capricorn: '&#9809;&#xFE0E;',
    Aquarius: '&#9810;&#xFE0E;',
    Pisces: '&#9811;&#xFE0E;',
  };
  return glyphs[sign] || '';
}

// ─── Sun Sign Readings ────────────────────────────────────────────────
function getSunReading(sign) {
  const readings = {
    Aries: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You don't lack courage. You lack patience for people who think before they act, and honestly, you have made peace with that. Your strength is momentum. You're the person in the group chat who's already booked the trip while everyone else is still "thinking about it." That is genuinely great. The thing that trips you up is what happens after the victory lap: the next thing has to be bigger, faster, louder. The crash after the high catches you off guard every single time, even though it has happened every single time.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">The work for you isn't becoming less bold. It's learning to let things finish before you're already onto the next one. You run headfirst and figure out if there was a wall later. That's not always a problem. But some walls are worth knowing about in advance. You already know how to start. The practice is staying.</p>
    `,
    Taurus: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You are the most underestimated sign in the zodiac. People clock the stubbornness and stop there, which means they miss the part where you are also the most loyal, most sensory, most quietly devastating person in any room. Taurus energy is about building things of actual quality, slowly, deliberately, the way good things get built. You don't rush because you know what rushed things look like. You'd rather wait for the real version.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">The problem is that this same instinct applies to endings. You'll stay in a thing that's clearly done because leaving requires admitting it's done, and you hate waste. You're not delusional. You just believe in things. Your gift is that you make people feel held. Your challenge is figuring out what you need to release to keep your hands free for what's worth holding.</p>
    `,
    Gemini: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">Everyone acts like Gemini is the villain of the zodiac. You've heard the two-faced jokes. Here's what's actually happening: you contain multitudes and most people only have room for one version of you at a time. You are genuinely curious in a way that is rare. You can hold ten perspectives at once, track seventeen conversations, and synthesize information faster than almost anyone in the room.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">The reputation for flakiness comes from the fact that when you're interested, you're ALL in, and when you're not, you're gone. That's not two-faced. That's just honest. What you're learning: depth is not the opposite of breadth. You don't have to choose between being interested in everything and going somewhere with it. The two things can coexist.</p>
    `,
    Cancer: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You feel everything and then act like you don't. The shell is famous; the softness underneath it is the actual story. Cancer is the sign most likely to be the backbone of something: the family, the friend group, the office. You hold the emotional weight of every room you're in, usually without anyone noticing, and definitely without anyone asking if that's okay.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You give care like it's a renewable resource. It's not. The thing you're working on is receiving. You're excellent at giving and deeply suspicious of anyone trying to give back. Let people take care of you sometimes. You built a shell, not a fortress. There's a difference, even if it hasn't always felt like one.</p>
    `,
    Leo: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You are not vain. You understand that presentation is a form of respect, and there's a meaningful difference between those two things. Leo rules the heart, which means you love loudly and get hurt more quietly than you let on. You want to be seen, and you want what you give to be matched. When it's not, you don't always say so. You make it into a performance instead.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">What people miss about you: the warmth. Your reputation is big energy and dramatic entrance. The actual thing is that you are genuinely, tenderly invested in the people you love. You're not performing for the room. You're performing for the specific people in it. Confidence is your language; vulnerability is the thing you're still getting comfortable enough to use.</p>
    `,
    Virgo: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You are not a perfectionist. You are someone who can see the gap between what exists and what's possible, and you cannot stop seeing it. That's different. Virgo is the sign of discernment, which means you catch the things other people miss: the typo, the off note, the thing that's almost right but not quite. This is a genuine skill. It's also exhausting to live inside of, because your brain applies it to everything, including yourself. Especially yourself.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">The same standard you hold for your work does not need to apply to your worth. You are not a project. You are not something to be improved until you've earned rest. Virgo's actual lesson is learning to leave some things good enough, including the version of yourself you're living in right now.</p>
    `,
    Libra: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">The indecision is not a character flaw. It is a feature running as a bug. Libra is wired to weigh. You genuinely see all sides. You feel the weight of every option. You are constitutionally opposed to harm, which means you avoid decisions that could hurt anyone, including yourself, which sometimes means you end up nowhere because nowhere felt the safest. That is the trap.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">What you're actually great at: fairness, aesthetics, making things beautiful, making peace feel possible. What you're working on: understanding that no decision is also a decision, and that your comfort matters as much as everyone else's you've been carefully balancing. The scales are yours too. You're allowed to put something on them.</p>
    `,
    Scorpio: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You are not intense. You are just paying attention, and most people aren't used to being paid that kind of attention. Scorpio sees through things. That's not mysticism; it's pattern recognition and a low tolerance for surface. You pick up what people don't say. You feel the subtext of every room. This makes you excellent at reading people and deeply suspicious of being read yourself, which means you share selectively, trust slowly, and hold your cards close.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">The sting reputation is real but incomplete. What it leaves out is the loyalty. Once someone is in, they are IN, and you will show up for them in ways they didn't know to ask for. You just have to decide they've earned it first. That bar is high. You're fine with that.</p>
    `,
    Sagittarius: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You're the one who booked a flight somewhere you'd never been because the price was right and why not, and then had the best week of your life. This is both your superpower and your defense mechanism. Sagittarius is the sign of expansion, which means you need space the way other people need air. Small rooms, small thinking, small plans: you feel the ceiling and push against it. This makes you genuinely exciting to be around.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">It also means you sometimes mistake escape for freedom. There's a difference. Your question to sit with: what would you run toward if you weren't running from anything? Because the arrow has to point somewhere specific, not just away from wherever you currently are.</p>
    `,
    Capricorn: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You've been building something for longer than most people even think about building anything. That's not ambition for its own sake. That's because you actually believe things worth having take time. Capricorn is misread as cold. You're not cold; you're careful. You've learned that effort compounds, that reputation matters, that shortcuts are usually longer. This gives you a patience and a long-view that most people genuinely cannot access.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">It also means you sometimes defer joy until later without noticing that later keeps moving. You've earned rest. You've earned pleasure. You don't have to justify either of those things with productivity. What you're working on: letting yourself want things for reasons that have nothing to do with what they'll produce.</p>
    `,
    Aquarius: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You've been five years ahead of the conversation your whole life. That's not arrogance; it's just that you're wired for pattern recognition at a systems level and you got there first. Aquarius is the sign of the future, which means you're comfortable with ideas that don't have a home yet. You think in abstractions, in collectives, in what could be. The paradox is that you're a humanitarian who can be surprisingly detached from actual individual humans.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You care about people as a concept more fluently than you care about the specific person sitting next to you, sometimes. Your work is closing the gap between vision and intimacy. The ideas are genuinely good. The people around you need to know they matter specifically, not just collectively. Those two things can coexist.</p>
    `,
    Pisces: `
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You absorb everything. You feel the mood of a room before you've taken your coat off. You finish sentences, read subtext, notice when someone's energy is off. This is not a skill you learned; it's just how you're built. Pisces lives at the border between what is and what could be, which means your imagination is extraordinary and your relationship to reality is sometimes a negotiation.</p>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You're drawn to things that feel like escape: art, sleep, fantasy, certain people who feel like a whole other world. Some of that is beautiful. Some of it is avoidance wearing a velvet coat. The thing you're practicing: staying present in the life you have while you dream about the life you want. You don't have to choose between them. But you do have to show up for one of them.</p>
    `,
  };
  return readings[sign] || '';
}

// ─── Moon Sign Readings ───────────────────────────────────────────────
function getMoonReading(sign) {
  const readings = {
    Aries: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">Your inner life runs at full speed. You feel things fast and fully, and you're done with them just as fast, which means you've already moved on from an emotion while other people are still processing that something happened. The work is slowing down enough to let the feeling actually land before you're onto the next one.</p>`,
    Taurus: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">Your emotional security lives in comfort, routine, and the things that feel like home, and you will defend those things with a calm, immovable certainty. You're not dramatic; you're consistent, which is rarer than it sounds. The work is knowing the difference between "I need this to stay the same because it's genuinely good" and "I need this to stay the same because change is scary."</p>`,
    Gemini: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">Your feelings don't sit still long enough to analyze, and you have made a certain peace with that. You process by talking, by narrating your own experience back to yourself, by turning it over until it makes sense. The catch is that emotions don't always want to be explained; sometimes they just need to be felt without commentary.</p>`,
    Cancer: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">Moon in Cancer is the moon at home, which means you feel everything at full volume. You absorb the moods of every room you're in and carry the emotional weight of the people you love, usually without anyone noticing and definitely without anyone asking if that's okay. Learning to put down what isn't yours to carry is the ongoing work.</p>`,
    Leo: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You need to feel seen and appreciated by the people who matter to you, and there's nothing wrong with that. Where it gets tricky is interpreting "not showered with praise" as "doesn't care," because those two things are usually not the same. You give warmth generously. The practice is receiving it without suspicion.</p>`,
    Virgo: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">Your emotional processing looks like problem-solving. You feel better when you understand what went wrong and how to fix it, which is actually a skill. The limit is when analyzing the feeling becomes a way to avoid actually having it. Not everything can be optimized. Some things just need to be sat with.</p>`,
    Libra: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You would rather keep the peace than say the uncomfortable thing, and you have made this choice so many times you sometimes can't locate what you actually feel underneath all the diplomacy. Your emotional north star is harmony, which is genuinely beautiful. The work is remembering that your needs count in the balance you're always trying to strike for everyone else.</p>`,
    Scorpio: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">Your emotional life is deep, private, and considerably more intense than your face gives away. You feel things at a frequency most people can't access, and you've learned to keep the volume internal. The work: trusting someone enough to let them all the way in, even when every instinct is telling you not to.</p>`,
    Sagittarius: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You need emotional freedom the way other people need air. When things get too heavy, too claustrophobic, too much, you go looking for an exit, and sometimes that's wisdom and sometimes it's just running. The practice is staying with the thing long enough to find out which one it is before you decide.</p>`,
    Capricorn: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You are better at managing emotions than expressing them, and you have convinced yourself this is the same as being strong. Staying in control is a skill. But some feelings need to be said out loud, not managed. You are allowed to need things. You are allowed to not be fine. The people who matter want to know.</p>`,
    Aquarius: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You process feelings intellectually, which means you understand your emotions in theory before you've fully experienced them in practice. You're not cold; you're working at altitude. The work is getting out of your head and into the actual feeling long enough to know what it needs from you.</p>`,
    Pisces: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You are the most empathic moon sign in the zodiac, which sounds like a gift and is also a lot to carry. You absorb other people's feelings so naturally that you sometimes lose track of which ones are actually yours. Boundaries are not walls. They are how you stay in the room without losing yourself in it.</p>`,
  };
  return readings[sign] || '';
}

// ─── Rising Sign Readings ─────────────────────────────────────────────
function getRisingReading(sign) {
  const readings = {
    Aries: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You make an entrance without trying to. You come across as bold, direct, and energetic, and people form an opinion quickly: interested or slightly on guard. The first impression is sharp. The ones who stay long enough find out there's more underneath, and they're never disappointed.</p>`,
    Taurus: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You're slow to show up but genuinely hard to forget. There's a steadiness to you that people notice immediately: unhurried, grounded, like you know exactly where you're standing. That quality draws people in. They trust you before they've found a reason to, and they're usually right to.</p>`,
    Gemini: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You're the person who talks to strangers at parties and ends up with three new friends and a story by the end of the night. You come across as curious, quick, and lighter than you actually are, which means people are sometimes surprised by how much depth is underneath. You run fast on the surface. They just have to wait to see the rest.</p>`,
    Cancer: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You seem warm and a little guarded at the same time, which is accurate. You give people a softness that makes them want to open up, and then you tuck yourself back behind the shell. The facade isn't armor exactly; trust just takes time, and you're skilled at making people feel held while they're earning it.</p>`,
    Leo: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You walk in and the room notices. You're not necessarily doing anything special; it's just presence, and it's real. People want to know your name before the end of the night. The first impression is lit from within, which is not a performance. You actually are.</p>`,
    Virgo: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You seem put-together in a way that people find either reassuring or slightly intimidating, sometimes both. You don't broadcast; you're precise and observant, and people sense you're tracking everything in the room. They're right. The first impression is careful and capable. The rest is for people who've earned it.</p>`,
    Libra: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You are almost impossibly easy to be around, which is your superpower and also, occasionally, your trap. You're charming, pleasant, and skilled at making everyone feel like the most interesting person in the room. People like you immediately. You're still figuring out which ones you actually like back.</p>`,
    Scorpio: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">People look at you twice. They're not always sure why. There's something in your presence that suggests you're tracking more than you're letting on, which you are. First impressions run hot or cold: drawn in or slightly unsettled, and there is rarely a neutral response. Both are valid.</p>`,
    Sagittarius: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You feel like an adventure that hasn't quite started yet. You come in warm, enthusiastic, and slightly more honest than people expect, which they find either refreshing or jarring. They never wonder what you think. You're going to tell them either way.</p>`,
    Capricorn: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You come across as someone who has their life together even in years when that is objectively not the full picture. You present serious, capable, no-nonsense, and people treat you accordingly, which sometimes means they skip asking how you actually are. The competence is real. So is the person underneath it.</p>`,
    Aquarius: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You seem like you're from somewhere slightly to the left of everyone else, because in some ways you are. You give off an unpredictable frequency: interesting and hard to place. People aren't always sure what to make of you, but they keep thinking about you after you've left, which is exactly the right outcome.</p>`,
    Pisces: `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.8;color:#D4C8B4;margin:0 0 18px;">You're hard to read and easy to project onto, which means people sometimes decide who you are before you've told them. You come across as soft, dreamy, and a little elsewhere, which is sometimes true and sometimes just how your face works. The ones who stick around find out there's a lot more to the picture.</p>`,
  };
  return readings[sign] || '';
}

// ─── Email Builder ────────────────────────────────────────────────────
function buildChartEmail(name, sunSign, moonSign, risingSign, birthTime, birthCity, cityCoords, moonNote) {
  const hasMoon   = !!moonSign;
  const hasRising = !!risingSign;
  const hasBigThree = hasMoon && hasRising;

  const sunGlyph    = getGlyph(sunSign);
  const signUrl     = `https://signseason.com/signs/${sunSign.toLowerCase()}`;

  // Build the sign display section
  let signDisplay;
  if (hasBigThree) {
    signDisplay = buildBigThreeDisplay(sunSign, moonSign, risingSign);
  } else if (hasMoon) {
    signDisplay = buildTwoSignDisplay(sunSign, moonSign);
  } else {
    signDisplay = buildSingleSignDisplay(sunSign, sunGlyph);
  }

  // Build readings section
  const sunReadingBlock = `
    <p style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#C9AD6F;margin:0 0 16px;">Sun in ${sunSign}</p>
    ${getSunReading(sunSign)}
  `;

  const moonReadingBlock = hasMoon ? `
    <p style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#C9AD6F;margin:32px 0 16px;">Moon in ${moonSign}</p>
    ${getMoonReading(moonSign)}
    ${moonNote ? `<p style="font-family:Georgia,serif;font-size:14px;line-height:1.7;color:#8A7D70;font-style:italic;margin:0 0 18px;">Note: ${moonNote}</p>` : ''}
  ` : '';

  const risingReadingBlock = hasRising ? `
    <p style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#C9AD6F;margin:32px 0 16px;">Rising in ${risingSign}</p>
    ${getRisingReading(risingSign)}
  ` : '';

  // Footer prompt based on what we have
  let footerPrompt;
  if (hasBigThree) {
    footerPrompt = ''; // everything calculated
  } else if (hasMoon && !hasRising && birthTime) {
    // Had time but city not found
    const cityMsg = birthCity
      ? `I didn't have coordinates for ${birthCity} in my database.`
      : 'No birth city was provided.';
    footerPrompt = `<p style="font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#B09A6E;font-style:italic;margin:0 0 32px;">${cityMsg} Reply with your city and I'll calculate your rising sign.</p>`;
  } else if (!hasMoon && !hasRising) {
    // Sun only
    footerPrompt = birthTime
      ? `<p style="font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#B09A6E;font-style:italic;margin:0 0 32px;">Moon and rising calculations are coming soon. I'll email you when your full chart is ready.</p>`
      : `<p style="font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#B09A6E;font-style:italic;margin:0 0 32px;">Want your moon and rising signs too? Reply with your birth time and city and I'll update your chart.</p>`;
  } else {
    footerPrompt = '';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>Your chart, ${name}.</title>
</head>
<body style="margin:0;padding:0;background-color:#1A1320;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1320;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="border:1px solid rgba(201,173,111,0.2);padding:48px 36px;background-color:#2A1F33;">

  <!-- Divider top -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding-bottom:28px;">
      <div style="width:60px;height:1px;background-color:rgba(138,125,112,0.4);"></div>
    </td></tr>
  </table>

  <!-- Greeting -->
  <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:bold;color:#F0E8D8;margin:0 0 8px;text-align:left;">Hey ${name}.</h1>
  ${hasBigThree
    ? `<p style="font-family:Georgia,serif;font-size:16px;color:#B09A6E;margin:0 0 28px;">Your big three are in. Here's what the chart says.</p>`
    : hasMoon
    ? `<p style="font-family:Georgia,serif;font-size:16px;color:#B09A6E;margin:0 0 28px;">Your sun and moon are in. Here's what the chart says.</p>`
    : `<p style="font-family:Georgia,serif;font-size:16px;color:#B09A6E;margin:0 0 28px;">Your chart is in. Here's what it says.</p>`
  }

  <!-- Sign display -->
  ${signDisplay}

  <!-- Readings -->
  ${sunReadingBlock}
  ${moonReadingBlock}
  ${risingReadingBlock}

  <!-- Footer prompt (if applicable) -->
  ${footerPrompt}

  <!-- Divider -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding-bottom:28px;">
      <div style="width:40px;height:1px;background-color:rgba(138,125,112,0.3);"></div>
    </td></tr>
  </table>

  <!-- CTA Button -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding-bottom:36px;">
      <a href="${signUrl}" style="display:inline-block;padding:16px 36px;background-color:#C9AD6F;color:#1A1320;text-decoration:none;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;border-radius:2px;">Explore ${sunSign}</a>
    </td></tr>
  </table>

  <!-- Sign-off -->
  <p style="font-family:Georgia,serif;font-size:17px;font-style:italic;color:#B09A6E;margin:0 0 36px;text-align:center;">&#10024; Stella</p>

  <!-- Footer divider -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding-bottom:16px;">
      <div style="width:60px;height:1px;background-color:rgba(138,125,112,0.25);"></div>
    </td></tr>
  </table>

  <!-- Footer -->
  <p style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:12px;color:#8A7D70;margin:0;text-align:center;">
    Sign Season &middot; <a href="https://signseason.com" style="color:#C9AD6F;text-decoration:none;">signseason.com</a>
  </p>
  <p style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;color:#6A5D60;margin:8px 0 0;text-align:center;">
    You're receiving this because you requested a birth chart reading at signseason.com.
  </p>
  <p style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;color:#6B6058;margin:4px 0 0;text-align:center;">
    <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#6B6058;text-decoration:underline;">Unsubscribe</a>
  </p>

</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Sign Display Components ──────────────────────────────────────────

function buildSingleSignDisplay(sunSign, glyph) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
    <tr>
      <td style="background-color:rgba(201,173,111,0.08);border:1px solid rgba(201,173,111,0.2);padding:20px 24px;border-radius:2px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:32px;line-height:1;color:#C9AD6F;padding-right:16px;vertical-align:middle;">${glyph}</td>
            <td style="vertical-align:middle;">
              <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.2em;color:#B09A6E;margin-bottom:4px;">Your Sun Sign</div>
              <div style="font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#E2D4A7;line-height:1;">${sunSign}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

function buildTwoSignDisplay(sunSign, moonSign) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
    <tr>
      <td width="48%" style="background-color:rgba(201,173,111,0.08);border:1px solid rgba(201,173,111,0.2);padding:16px 20px;border-radius:2px;vertical-align:top;">
        <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#B09A6E;margin-bottom:6px;">&#9728;&#xFE0E; Sun</div>
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#E2D4A7;">${sunSign}</div>
      </td>
      <td width="4%"></td>
      <td width="48%" style="background-color:rgba(138,125,112,0.08);border:1px solid rgba(138,125,112,0.2);padding:16px 20px;border-radius:2px;vertical-align:top;">
        <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#8A7D70;margin-bottom:6px;">&#9790;&#xFE0E; Moon</div>
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#D4C8B4;">${moonSign}</div>
      </td>
    </tr>
  </table>`;
}

function buildBigThreeDisplay(sunSign, moonSign, risingSign) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
    <tr>
      <td width="31%" style="background-color:rgba(201,173,111,0.08);border:1px solid rgba(201,173,111,0.2);padding:14px 16px;border-radius:2px;vertical-align:top;text-align:center;">
        <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#C9AD6F;margin-bottom:8px;">&#9728;&#xFE0E; Sun</div>
        <div style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#E2D4A7;line-height:1.2;">${sunSign}</div>
      </td>
      <td width="3%"></td>
      <td width="31%" style="background-color:rgba(138,125,112,0.08);border:1px solid rgba(138,125,112,0.2);padding:14px 16px;border-radius:2px;vertical-align:top;text-align:center;">
        <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#8A7D70;margin-bottom:8px;">&#9790;&#xFE0E; Moon</div>
        <div style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#D4C8B4;line-height:1.2;">${moonSign}</div>
      </td>
      <td width="3%"></td>
      <td width="31%" style="background-color:rgba(100,90,110,0.1);border:1px solid rgba(100,90,110,0.3);padding:14px 16px;border-radius:2px;vertical-align:top;text-align:center;">
        <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#7A6D8A;margin-bottom:8px;">&#8593; Rising</div>
        <div style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#C4B8D4;line-height:1.2;">${risingSign}</div>
      </td>
    </tr>
  </table>`;
}
