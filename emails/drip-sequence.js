// Sign Season — 5-Email Welcome Drip Sequence
// Each email is a function that returns { subject, html, preheader }

import { wrapEmail, p, b, link, h2, divider, linkCard } from './template.js';

// ═══════════════════════════════════════════════
// EMAIL 1: Welcome (sent immediately on signup)
// ═══════════════════════════════════════════════
export function email1_welcome() {
  return {
    subject: '✨ Welcome to Sign Season',
    preheader: "It's always somebody's season. Now it's yours.",
    html: wrapEmail({
      headline: 'Welcome to Sign Season.',
      subtitle: "It's always somebody's season. Now it's yours.",
      preheader: "It's always somebody's season. Now it's yours.",
      bodyHtml: [
        p("You're in. Every week, we'll drop compatibility takes, crystal recs, and the kind of zodiac content your group chat has been missing."),
        p(`No fluff. No "today is a good day for love, Libra." Just the real stuff: ${b('who you should date')}, ${b('who you should avoid')}, and ${b('why your Scorpio ex still haunts your dreams')}.`),
        p("Your first drop lands in a couple days. In the meantime, go find your sign and see what we've got for you."),
      ].join(''),
      ctaText: 'Find Your Sign',
      ctaUrl: 'https://signseason.com/signs/',
    }),
  };
}

// ═══════════════════════════════════════════════
// EMAIL 2: The Compatibility Drop (Day 2)
// ═══════════════════════════════════════════════
export function email2_compatibility() {
  return {
    subject: "Who's your worst match? (be honest)",
    preheader: "The zodiac pairings that almost never work. Somebody had to say it.",
    html: wrapEmail({
      headline: "Let's talk compatibility.",
      subtitle: "The matches that work, the ones that don't, and the ones that are just chaos.",
      preheader: "The zodiac pairings that almost never work. Somebody had to say it.",
      bodyHtml: [
        p("Compatibility is the thing everyone wants to know about but nobody wants to hear the truth about."),
        p(`We broke down every zodiac pairing. ${b('Love, trust, communication, the whole thing.')} Not the sugar-coated version. The real one.`),
        h2("Start here"),
        linkCard(
          "♈ Aries + Leo: The Power Couple?",
          "Two fire signs, one explosive pairing. 88% compatible.",
          "https://signseason.com/compatibility/aries-leo"
        ),
        linkCard(
          "♏ Scorpio + Pisces: Deep End",
          "The most emotionally intense pairing in the zodiac.",
          "https://signseason.com/compatibility/scorpio-pisces"
        ),
        linkCard(
          "♊ Gemini + Virgo: It's Complicated",
          "Both Mercury-ruled. Both overthinkers. Both exhausting.",
          "https://signseason.com/compatibility/gemini-virgo"
        ),
        divider(),
        p(`Or skip straight to the drama: ${link('find your worst match', 'https://signseason.com/signs/')}.`),
      ].join(''),
      ctaText: 'Check Your Compatibility',
      ctaUrl: 'https://signseason.com/compatibility/',
    }),
  };
}

// ═══════════════════════════════════════════════
// EMAIL 3: The Cosmic Toolkit (Day 4)
// ═══════════════════════════════════════════════
export function email3_toolkit() {
  return {
    subject: "Your moon sign matters more than you think",
    preheader: "Sun sign = who you are. Moon sign = who you are at 2am.",
    html: wrapEmail({
      headline: 'Beyond your Sun sign.',
      subtitle: "The parts of your chart that actually explain why you're like this.",
      preheader: "Sun sign = who you are. Moon sign = who you are at 2am.",
      bodyHtml: [
        p("Your sun sign is the headline. But the real story? That's your moon sign, your rising sign, and the crystals that keep your energy in check."),
        h2("Your Moon Sign"),
        p(`Your moon sign is your emotional core. It's why two Leos can feel completely different. ${link('Find your moon sign breakdown', 'https://signseason.com/signs/#moon-signs')}.`),
        h2("Your Rising Sign"),
        p(`Your rising sign is the mask you wear. First impressions, your vibe when you walk into a room. ${link('Read your rising sign guide', 'https://signseason.com/signs/#rising-signs')}.`),
        h2("Your Crystals"),
        p(`Every sign has crystals that match their energy. Not the woo-woo version. The practical one: which stones to wear, carry, or keep on your nightstand. ${link('Find your crystals', 'https://signseason.com/crystals/')}.`),
      ].join(''),
      ctaText: 'Explore Your Full Chart',
      ctaUrl: 'https://signseason.com/signs/',
    }),
  };
}

// ═══════════════════════════════════════════════
// EMAIL 4: The Deep Cuts (Day 7)
// ═══════════════════════════════════════════════
export function email4_deepcuts() {
  return {
    subject: "The stuff your sign won't tell you about yourself",
    preheader: "Toxic traits, red flags, and love languages. The unfiltered zodiac.",
    html: wrapEmail({
      headline: 'The deep cuts.',
      subtitle: "The unfiltered zodiac content nobody asked for (but everyone needs).",
      preheader: "Toxic traits, red flags, and love languages. The unfiltered zodiac.",
      bodyHtml: [
        p("We saved the best stuff for week two. This is where it gets personal."),
        h2("Toxic Traits"),
        p(`Every sign has them. Yours too. We wrote the honest version: no sugarcoating, no astrology excuses. Just the truth about why you're like that. ${link('Read yours', 'https://signseason.com/signs/#toxic-traits')}.`),
        h2("Red Flags"),
        p(`The warning signs you should never ignore, broken down by zodiac sign. Some of these will feel like a personal attack. That's the point. ${link('Check the red flags', 'https://signseason.com/signs/#red-flags')}.`),
        h2("Love Languages"),
        p(`How each sign gives love, receives love, and what happens when their love language gets ignored. The cheat code to actually making it work. ${link('Find yours', 'https://signseason.com/signs/#love-language')}.`),
        divider(),
        p("Fair warning: this content gets screenshotted and sent to group chats. Don't say we didn't warn you."),
      ].join(''),
      ctaText: 'Read the Deep Cuts',
      ctaUrl: 'https://signseason.com/signs/',
    }),
  };
}

// ═══════════════════════════════════════════════
// EMAIL 5: Stay Connected (Day 14)
// ═══════════════════════════════════════════════
export function email5_stay() {
  return {
    subject: "Still here? Good. Here's what's new.",
    preheader: "New content dropping every week. Here's what you might have missed.",
    html: wrapEmail({
      headline: "You stuck around.",
      subtitle: "That says something about you. (Probably something your chart predicted.)",
      preheader: "New content dropping every week. Here's what you might have missed.",
      bodyHtml: [
        p("Two weeks in. You're one of us now."),
        p("We're adding new content every week. Soulmate guides, life path numbers, turn ons, worst matches, communication styles. The kind of stuff you read at midnight and then text your friends about."),
        h2("In case you missed it"),
        linkCard(
          "♡ Soulmate Guides",
          "Who your zodiac soulmate actually is. (It's not who you think.)",
          "https://signseason.com/signs/#soulmates"
        ),
        linkCard(
          "🔢 Life Path Numbers",
          "Your numerology breakdown. A whole other layer of cosmic insight.",
          "https://signseason.com/signs/#numerology"
        ),
        linkCard(
          "💬 Communication Styles",
          "How each sign texts, argues, and says I love you.",
          "https://signseason.com/signs/#communication"
        ),
        divider(),
        p("We'll keep showing up in your inbox with the good stuff. No spam, no filler. Just the content your group chat needs."),
        p(`Follow us on ${link('TikTok', 'https://tiktok.com/@sign_season')}, ${link('Instagram', 'https://instagram.com/signseasonco')}, and ${link('Pinterest', 'https://pinterest.com/signseason')} for daily zodiac content.`),
      ].join(''),
      ctaText: "See What's New",
      ctaUrl: 'https://signseason.com/',
    }),
  };
}

// Drip schedule: [daysSinceSignup, emailFunction, emailId]
export const DRIP_SCHEDULE = [
  { day: 0, fn: email1_welcome, id: 'welcome' },
  { day: 2, fn: email2_compatibility, id: 'compatibility' },
  { day: 4, fn: email3_toolkit, id: 'toolkit' },
  { day: 7, fn: email4_deepcuts, id: 'deepcuts' },
  { day: 14, fn: email5_stay, id: 'stay' },
];
