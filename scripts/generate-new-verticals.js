#!/usr/bin/env node
// Generates 4 new content verticals × 12 signs = 48 pages
// Run: node scripts/generate-new-verticals.js

const fs = require('fs');
const path = require('path');

const SIGNS = [
  { slug: 'aries',       name: 'Aries',       sym: '♈', symbol_ref: '&#9800;&#xFE0E;', ruling: 'Mars',   element: 'fire',  dates: 'March 21 – April 19',      animal: 'ram' },
  { slug: 'taurus',      name: 'Taurus',      sym: '♉', symbol_ref: '&#9801;&#xFE0E;', ruling: 'Venus',  element: 'earth', dates: 'April 20 – May 20',         animal: 'bull' },
  { slug: 'gemini',      name: 'Gemini',      sym: '♊', symbol_ref: '&#9802;&#xFE0E;', ruling: 'Mercury',element: 'air',   dates: 'May 21 – June 20',          animal: 'twins' },
  { slug: 'cancer',      name: 'Cancer',      sym: '♋', symbol_ref: '&#9803;&#xFE0E;', ruling: 'Moon',   element: 'water', dates: 'June 21 – July 22',         animal: 'crab' },
  { slug: 'leo',         name: 'Leo',         sym: '♌', symbol_ref: '&#9804;&#xFE0E;', ruling: 'Sun',    element: 'fire',  dates: 'July 23 – August 22',       animal: 'lion' },
  { slug: 'virgo',       name: 'Virgo',       sym: '♍', symbol_ref: '&#9805;&#xFE0E;', ruling: 'Mercury',element: 'earth', dates: 'August 23 – September 22',  animal: 'maiden' },
  { slug: 'libra',       name: 'Libra',       sym: '♎', symbol_ref: '&#9806;&#xFE0E;', ruling: 'Venus',  element: 'air',   dates: 'September 23 – October 22', animal: 'scales' },
  { slug: 'scorpio',     name: 'Scorpio',     sym: '♏', symbol_ref: '&#9807;&#xFE0E;', ruling: 'Pluto',  element: 'water', dates: 'October 23 – November 21',  animal: 'scorpion' },
  { slug: 'sagittarius', name: 'Sagittarius', sym: '♐', symbol_ref: '&#9808;&#xFE0E;', ruling: 'Jupiter',element: 'fire',  dates: 'November 22 – December 21', animal: 'archer' },
  { slug: 'capricorn',   name: 'Capricorn',   sym: '♑', symbol_ref: '&#9809;&#xFE0E;', ruling: 'Saturn', element: 'earth', dates: 'December 22 – January 19',  animal: 'sea-goat' },
  { slug: 'aquarius',    name: 'Aquarius',    sym: '♒', symbol_ref: '&#9810;&#xFE0E;', ruling: 'Uranus', element: 'air',   dates: 'January 20 – February 18',  animal: 'water-bearer' },
  { slug: 'pisces',      name: 'Pisces',      sym: '♓', symbol_ref: '&#9811;&#xFE0E;', ruling: 'Neptune',element: 'water', dates: 'February 19 – March 20',    animal: 'fish' },
];

// ─── CONTENT DATA ─────────────────────────────────────────────────────────────

const ATTRACT_DATA = {
  aries: {
    tagline: "You don't chase an Aries. You make them chase you.",
    desc: "How to attract an Aries — what actually works, what backfires, and why being too available is the fastest way to lose them.",
    intro: `Attracting an Aries sounds simple until you try it. They're loud, confident, and magnetic — but the same fire that makes them exciting makes them fickle. What worked on other signs will actively repel an Aries. So let's talk about what actually gets their attention and, more importantly, keeps it.`,
    irresistible: `Aries is ruled by Mars, the planet of desire and pursuit. They are, at their core, a predator who loves the hunt. The single most attractive thing you can be to an Aries is someone they're not quite sure they've won yet. Confidence reads as irresistible. Neediness reads as game over. Walk into a room knowing you're interesting and let them figure that out on their own timeline. They will notice. Aries always notices the person who isn't trying to impress them.`,
    irresistible2: `Physical presence matters a lot to Aries — they're a body sign. Energy, posture, how you move. You don't need to be conventionally attractive, but you need to take up space unapologetically. Meekness bores them. A slight edge of "I could take you or leave you" will keep an Aries orbiting you for weeks.`,
    kills: `Being too easy. The second Aries feels like the chase is over, they're mentally already onto the next thing. Don't respond to every text within three seconds. Don't be available every time they suggest plans. Not as a game — genuinely build a life so full that you can't always drop everything. That's actually attractive. Canceling on an Aries because you have other things going on is more appealing to them than canceling your life to accommodate them.`,
    kills2: `Being passive. Aries wants someone who pushes back, disagrees occasionally, calls them on their stuff. If you agree with everything they say and mirror their every move, they'll get bored and think something's wrong with you. Have opinions. Defend them. Let Aries win some arguments (they need to), but not all of them.`,
    texting: `Text Aries like you have somewhere to be. Short, direct, occasionally witty. Match their energy without completely matching their response times. If they double-text, don't triple-text back. Initiate first sometimes — Aries likes knowing someone wants them — but don't be the one always initiating. The moment they feel like you need them more than they need you, the power dynamic shifts and not in your favor. Also, never send long paragraphs of feelings over text. Aries cannot process it. Save real conversations for in person.`,
    longGame: `The long game with Aries is actually a short game played well. You don't want them to pine forever — they'll eventually redirect that energy. What you want is to stay interesting. Bring them new experiences, new challenges, things they haven't done before. Be slightly unpredictable. The moment Aries can fully map you out, the novelty fades. Keep at least one quality of yours as a mystery they're still trying to solve.`,
    notDo: `Don't compete with them directly. Aries hates losing more than almost anything, and if they feel outclassed by someone they're trying to attract, it curdles into resentment. Be impressive but not threatening. Don't bring up exes. Don't be passive-aggressive — Aries can't decode it and will just assume you're annoying. And do not, under any circumstances, give them the silent treatment expecting them to chase. Aries interprets silence as disinterest and moves on instantly.`,
    faq: [
      { q: "How do you get an Aries to chase you?", a: "Stop chasing them. The moment you pull back your energy and focus on your own life, Aries will come looking. They're hardwired for pursuit. The best thing you can do is be genuinely unavailable sometimes, have a full social life, and be confident enough that losing any one person — including them — wouldn't devastate you. They can smell desperation, and it kills their interest immediately." },
      { q: "What does Aries find most attractive?", a: "Confidence, independence, and a little bit of challenge. Aries is drawn to people who know who they are and don't apologize for it. Physical boldness also matters — how you carry yourself, how you enter a room. They want someone who could have anyone and chose them, not someone who chose them by default." },
      { q: "How quickly do Aries fall for someone?", a: "Extremely fast. Aries doesn't do slow burns — they either feel something immediately or they don't. The danger is that they can fall out just as fast. The goal isn't just to attract an Aries quickly but to keep them genuinely engaged once they're in, which requires ongoing novelty and independence on your part." },
      { q: "What pushes an Aries away?", a: "Clinginess, passivity, and being too predictable. Aries needs someone with their own identity and momentum. If they feel like your whole world revolves around them, they'll panic and pull back. They want a partner, not a fan. Also: being too agreeable. Aries respects someone who can hold their own in a disagreement." }
    ],
    related: [
      { href: '/signs/aries-in-love', text: 'Aries in Love' },
      { href: '/signs/dating-a-aries', text: 'Dating an Aries' },
      { href: '/signs/aries-soulmate', text: 'Aries Soulmate' },
      { href: '/signs/aries-love-language', text: 'Aries Love Language' },
      { href: '/signs/how-to-tell-if-aries-likes-you', text: 'Does Aries Like You?' },
      { href: '/compatibility/', text: 'Aries Compatibility' }
    ]
  },
  taurus: {
    tagline: "Patience isn't optional. It's the whole strategy.",
    desc: "How to attract a Taurus — the slow burn approach, what they actually want in a partner, and why rushing them guarantees failure.",
    intro: `Attracting a Taurus is a long game. They don't fall fast, they don't fall easily, and they definitely don't fall for anyone who seems like they're trying too hard. But once a Taurus decides you're worth their energy, they are all in — loyal, devoted, and genuinely there for the long haul. Here's how to get to that point without making all the classic mistakes.`,
    irresistible: `Taurus is ruled by Venus, which means beauty, comfort, and sensory pleasure are at the center of everything. You don't have to be conventionally beautiful, but you should look like you take care of yourself. Taurus notices clothes, scent, how you eat, the quality of things you own. They're drawn to people who seem comfortable in their own skin — not performatively beautiful but genuinely at ease.`,
    irresistible2: `Stability is the ultimate aphrodisiac for Taurus. Not wealth necessarily, but the vibe of someone who has their life together. A nice home, a reliable routine, good taste. Taurus is not attracted to chaos, even exciting chaos. They want someone whose life looks sustainable and warm. Show them who you are in your natural environment — cooking a meal, tending a space you've made your own — and you'll do more than any date to impress them.`,
    kills: `Pressure. Anything that feels like rushing, forcing, or pushing a Taurus to move faster than their internal timeline will make them dig in and resist. Don't give ultimatums. Don't push for labels before they're ready. Don't try to accelerate intimacy with intensity — Taurus gets there through repetition and time, not grand gestures. Grand gestures actually make them suspicious.`,
    kills2: `Inconsistency. Taurus needs to be able to build a mental model of who you are. If your behavior changes dramatically between interactions — hot one day, cold the next — they'll pull back to reassess. They interpret inconsistency as instability, and instability is the thing they most want to avoid in a partner.`,
    texting: `Steady, warm, no drama. Taurus doesn't need constant contact but they notice patterns — if you text every evening and then go quiet for two days, they'll register that. Keep your communication reliable without being overwhelming. Send things that make them think of comfort: a photo of something beautiful, a recommendation for something sensory, a calm check-in. Don't ghost, don't overload, don't text at 1 AM about your feelings. Morning texts are their love language.`,
    longGame: `Taurus falls for someone they've seen in many contexts over time. Be patient enough to let them see you across seasons, moods, and settings. Go to the same places. Become familiar. Familiarity is not boring to Taurus — it's the thing they're looking for. Once you're part of their comfortable routine, you have them.`,
    notDo: `Don't flirt aggressively early on — Taurus finds it tacky and a little threatening. Don't be flashy just to impress them; they can tell when something is performative. Don't make them compete with your schedule, your other dates, or your drama. Taurus doesn't compete. They simply decide you're not worth the hassle and move on quietly. And never, ever rush the physical connection. Let it develop naturally. When Taurus is ready, you'll know. Forcing it earlier than that will permanently set you back.`,
    faq: [
      { q: "How long does it take to attract a Taurus?", a: "Longer than you'd like. Taurus operates on their own timeline, which is often weeks or months of consistent, low-pressure presence before they make a real move. Don't mistake their slowness for disinterest — they're watching, processing, and deciding. The best thing you can do is be reliably present without pushing." },
      { q: "What does Taurus find most attractive?", a: "Physical warmth, comfort, and stability. Taurus is viscerally attracted to people who feel good to be around — calming, capable, pleasurable in a sensory way. Good taste, a nice home, how you smell, the quality of your cooking. They're not intellectual in their attraction; they feel it in their body first." },
      { q: "Does Taurus like to be chased?", a: "Not particularly. They don't need a chase the way Aries does, but they also don't want someone who seems desperate. The ideal energy is mutual, unhurried warmth. Show consistent interest without urgency. Taurus responds to being gently pursued by someone who isn't making them feel pressured." },
      { q: "What turns a Taurus off immediately?", a: "Chaos, flakiness, and aggression. If you're unreliable, dramatic, or hard to read, Taurus will quietly close the door and you'll never even know it happened. They don't ghost loudly. They just stop engaging and eventually you realize they've been gone for a while." }
    ],
    related: [
      { href: '/signs/taurus-in-love', text: 'Taurus in Love' },
      { href: '/signs/dating-a-taurus', text: 'Dating a Taurus' },
      { href: '/signs/taurus-soulmate', text: 'Taurus Soulmate' },
      { href: '/signs/taurus-love-language', text: 'Taurus Love Language' },
      { href: '/signs/how-to-tell-if-taurus-likes-you', text: 'Does Taurus Like You?' },
      { href: '/compatibility/', text: 'Taurus Compatibility' }
    ]
  },
  gemini: {
    tagline: "Keep them curious. The moment they've figured you out, you've lost them.",
    desc: "How to attract a Gemini — why intellect is foreplay, how to stay interesting, and why emotional intensity will send them running.",
    intro: `Gemini is the most mentally-driven sign in the zodiac. Attracting them is less about how you look and more about how you talk, what you know, and whether you can surprise them. They fall for people who feel like a good conversation that never quite ends. Here's what that actually looks like in practice.`,
    irresistible: `Be interesting. Not performed interesting — genuinely interesting. Have opinions. Read things. Know things about obscure topics. Have a story. Gemini is attracted to people who make them feel like they're always learning something. If every conversation with you ends with them thinking "huh, I didn't know that," you're doing it right. Wit is particularly magnetic — a well-timed one-liner will do more than any compliment.`,
    irresistible2: `Gemini also has two sides (hence the twins), and they're attracted to people who seem to as well. Multidimensionality is compelling to them. Don't be one thing. Show them you have different modes — serious and silly, adventurous and contemplative, confident and occasionally uncertain. They don't want consistency of personality; they want someone with layers to discover.`,
    kills: `Emotional intensity delivered too soon. Gemini is a master at connection but gets easily overwhelmed by deep feelings before they're ready. Declarations of love before they've sorted out whether they like you yet, heavy conversations about the future, pushing for emotional vulnerability — all of these will spook them. They process feelings through distance and time, not through more conversation about the feelings.`,
    kills2: `Being boring or predictable. If Gemini can predict exactly what you'll say, what you'll do, what you think about any given topic, they will mentally check out mid-conversation. Surprise them. Change your mind sometimes. Go somewhere unexpected. Have a phase they haven't seen yet.`,
    texting: `Gemini was born for texting. They're quick, playful, and love banter. Match their energy — keep it light and fast. Send them things: memes, articles, weird facts, questions that don't have easy answers. Banter is better than information. Don't send paragraphs; send punchlines. Voice memos are especially effective with Gemini because they love hearing tone and inflection. Don't be too serious over text — save the depth for in-person when Gemini is actually present enough to absorb it.`,
    longGame: `The long game with Gemini is a revolving door of novelty. Keep doing new things together. Keep having new conversations. Don't let yourself become a known quantity they've fully solved. Reinvention — even small versions of it — will keep a Gemini engaged far longer than comfort and stability will. And give them space. A Gemini who feels trapped or overly tied down will flee, even if they actually like you.`,
    notDo: `Don't try to pin them down early. Don't demand consistency when they're not ready to give it. Don't take their friendly flirtation with others personally — Gemini is social by nature and it doesn't mean what you think it means. And don't be passive when they go quiet. They're not always processing deep feelings; sometimes they're just distracted. Check in lightly and move on.`,
    faq: [
      { q: "What attracts a Gemini most?", a: "Intelligence and humor, in that order. Gemini wants someone who can hold a conversation, pivot quickly, make them laugh, and surprise them with their knowledge or perspective. Physical attraction matters but it's secondary. You can win a Gemini with your mind before they've fully registered what you look like." },
      { q: "How do you keep a Gemini interested?", a: "Keep evolving. Gemini's interest fades when they feel like they've fully figured someone out. Stay curious about the world and bring that curiosity into the relationship. Try new things. Have new conversations. Don't become a routine — even a comfortable one." },
      { q: "Do Geminis like being chased?", a: "They like being stimulated more than chased. Pure pursuit without intellectual engagement won't hold them. What they respond to is someone who's clearly interested but also has their own compelling inner world. Show them you want them; also show them you have a life that doesn't depend on their response." },
      { q: "What does Gemini look for in a partner?", a: "A best friend they're also attracted to. Someone they can talk to about anything, who makes them laugh, who doesn't take themselves too seriously, and who gives them breathing room. Gemini needs a partner who understands that closeness and independence aren't opposites." }
    ],
    related: [
      { href: '/signs/gemini-in-love', text: 'Gemini in Love' },
      { href: '/signs/dating-a-gemini', text: 'Dating a Gemini' },
      { href: '/signs/gemini-soulmate', text: 'Gemini Soulmate' },
      { href: '/signs/gemini-love-language', text: 'Gemini Love Language' },
      { href: '/signs/how-to-tell-if-gemini-likes-you', text: 'Does Gemini Like You?' },
      { href: '/compatibility/', text: 'Gemini Compatibility' }
    ]
  },
  cancer: {
    tagline: "Make them feel safe first. Everything else follows.",
    desc: "How to attract a Cancer — why emotional security is the foundation, what makes them lower their guard, and how to get past the shell.",
    intro: `Cancer is the hardest sign to attract on purpose. They don't respond well to strategy, to manufactured intrigue, or to people who are clearly trying. What they respond to is genuine warmth, real vulnerability, and the feeling that you're someone they could actually trust. The good news is that if you can create that — they'll fall hard and stay there.`,
    irresistible: `Emotional intelligence is the most attractive thing you can have around Cancer. Not performing emotional availability, but actually being the kind of person who asks how someone's doing and listens to the answer. Cancer is hypervigilant about inauthenticity — they can feel it immediately. What they can't resist is someone who seems genuinely kind, who treats service staff well, who remembers small details about conversations from weeks ago.`,
    irresistible2: `Family and home energy is deeply attractive to Cancer, even if they don't consciously articulate it. Someone who talks warmly about their family, who has a cozy space, who cooks or nurtures in any way — that activates Cancer's sense of "this person is safe." They're not looking for perfection. They're looking for someone who feels like home.`,
    kills: `Coldness. If you're emotionally unavailable, dismissive of feelings, or give off the vibe that vulnerability is weakness, Cancer will never let you in. They'll be perfectly pleasant from behind a very thick wall. They've been hurt before — usually badly — and they've built sophisticated defenses. Anything that confirms those defenses exist for a reason will shut the whole thing down.`,
    kills2: `Moving too fast. Cancer doesn't rush into intimacy, even when they're attracted. They need time to trust before they open up. Pushing for emotional closeness before they've offered it, or trying to skip the friendship phase to get to the relationship phase, will make them retreat.`,
    texting: `Warm, consistent, and personal. Cancer notices if you remember what they told you — mention it. "How did that thing go that you mentioned last week?" is worth ten witty openers. Don't text at odd hours, don't disappear for days without explanation, don't be hot-cold. Cancer thrives on consistency and reads irregular contact as a sign that something's wrong. Voice notes are particularly effective — Cancer is very attuned to tone.`,
    longGame: `Cancer loves in layers. The longer they know you and the more history you build together, the more attached they become. Create rituals. Go to the same restaurant more than once. Have inside references. Let them make you soup when you're sick. Cancer falls in love in the quiet repeated moments, not the grand ones.`,
    notDo: `Don't be sarcastic in a way that reads as dismissive. Don't joke about things they care about. Don't cancel plans without a good reason — Cancer reads cancellations as rejection. And never, ever make them feel foolish for being emotional. The moment Cancer feels mocked or minimized for their feelings, they close up and you'll spend months trying to get back to zero.`,
    faq: [
      { q: "How do you make a Cancer fall for you?", a: "Make them feel safe. That's it. Everything else is downstream of that. Be consistent, be warm, remember what they tell you, and never make them feel foolish for caring. Cancer falls for people who create emotional safety without even trying to. The moment they believe you won't hurt them, they'll love you fiercely." },
      { q: "What does Cancer find most attractive?", a: "Genuine warmth and emotional intelligence. Someone who listens, who's kind to people who can't do anything for them, who has a sense of home about them. Cancer is also secretly attracted to people who seem capable of protecting them — not physically, but emotionally. Someone who feels solid and trustworthy." },
      { q: "How do you get a Cancer to open up?", a: "Open up first. Cancer responds to vulnerability by slowly offering their own. If you share something real about yourself — something you're actually uncertain about or struggling with — Cancer will feel safe to do the same. Don't push. Just model the openness and wait." },
      { q: "What makes Cancer pull away?", a: "Feeling unseen, dismissed, or like they care more than you do. If Cancer senses an imbalance in emotional investment, they'll start protecting themselves by pulling back. The way to prevent this is simple consistency: show up, remember things, be present when you're present." }
    ],
    related: [
      { href: '/signs/cancer-in-love', text: 'Cancer in Love' },
      { href: '/signs/dating-a-cancer', text: 'Dating a Cancer' },
      { href: '/signs/cancer-soulmate', text: 'Cancer Soulmate' },
      { href: '/signs/cancer-love-language', text: 'Cancer Love Language' },
      { href: '/signs/how-to-tell-if-cancer-likes-you', text: 'Does Cancer Like You?' },
      { href: '/compatibility/', text: 'Cancer Compatibility' }
    ]
  },
  leo: {
    tagline: "Admire them genuinely and they're yours. Fake it and they'll know.",
    desc: "How to attract a Leo — why admiration is the key, what it means to make Leo feel truly seen, and how to hold your own without being upstaged.",
    intro: `Leo runs on admiration the way the rest of us run on coffee. To attract a Leo, you need to make them feel genuinely seen, celebrated, and worthy of your attention. But here's the catch: it has to be real. Leo has a finely tuned detector for flattery versus authentic appreciation. Hollow compliments will make them suspicious. Genuine admiration for something specific they've actually done? That's the direct line to their heart.`,
    irresistible: `Enthusiasm is magnetic to Leo. They want someone who gets excited about things, who's fun to be around, who brings energy to the room. Leo is a performer and they want an audience, yes — but more than that, they want a co-lead. Someone who can match their charisma, hold their own in a crowd, and add to the performance rather than diminish it. Don't shrink yourself around Leo. They want a worthy partner, not a sidekick.`,
    irresistible2: `Genuine, specific compliments land better than general ones. "You're so charismatic" means less than "The way you handled that conversation was incredible — you made everyone feel comfortable." Leo is acutely aware of their own performance and they love when someone notices the specific craft of it. Pay attention and tell them exactly what you saw.`,
    kills: `Competing with them for attention in the wrong way. There's a difference between being confident and vivacious — which Leo loves — and trying to upstage them at their own story, which Leo cannot forgive. Know when to let them have the spotlight. You can shine brightly, just not brighter than them at their moment.`,
    kills2: `Ignoring them. Leo would rather be argued with than ignored. If you go cold and quiet as a way of gaining power, Leo will interpret it as disinterest and move on to someone who actually shows up. Indifference — even strategic indifference — reads as a complete lack of appreciation, and that's the one thing Leo cannot sustain.`,
    texting: `Enthusiastic, warm, and with some genuine praise sprinkled in. Text Leo like you're genuinely glad they exist. Affirm something specific they said or did. Ask about things they're passionate about and actually engage with the answer. Leo lights up when someone seems genuinely curious about their world. Don't play it cool to seem less interested — Leo will take you at your word.`,
    longGame: `The long game with Leo is all about making them feel like you chose them specifically, not as a placeholder. Compliment the things others overlook. Defend them when they're not in the room. Show them loyalty early and consistently. Leo is incredibly loyal in return, but they need to see proof that they matter to you before they'll go all in.`,
    notDo: `Don't take credit for their ideas. Don't laugh at them in public, even gently. Don't make them feel ordinary or unremarkable — that's the deepest wound you can give a Leo. And don't compare them unfavorably to anyone, ever. Leo's pride is real and their memory for slights is long.`,
    faq: [
      { q: "What attracts Leo most?", a: "Genuine admiration paired with your own confidence. Leo doesn't want someone who's bowled over by them to the point of having no personality of their own. They want someone who appreciates them AND brings their own light. The combination of 'I see how great you are' and 'I'm also pretty great' is perfect for Leo." },
      { q: "How do you make a Leo chase you?", a: "Be genuinely enthusiastic and then occasionally let your attention go elsewhere. Leo wants to be the center of someone's attention, but they're most engaged when that attention isn't guaranteed. Show real warmth and then have your own life that doesn't revolve around them. They'll want more." },
      { q: "What does Leo look for in a partner?", a: "Someone who makes them feel special AND respected. Leo wants admiration but not sycophancy. They want a partner they can be proud of — someone interesting, capable, warm, and ideally a little impressive. They're also looking for loyalty above almost everything else." },
      { q: "What turns Leo off?", a: "Dismissiveness, public criticism, and anyone who tries to take the spotlight without earning it. Also: being cheap or uninspired on dates. Leo associates generosity with love and stinginess with indifference. You don't have to spend a lot, but whatever you do should feel chosen and special." }
    ],
    related: [
      { href: '/signs/leo-in-love', text: 'Leo in Love' },
      { href: '/signs/dating-a-leo', text: 'Dating a Leo' },
      { href: '/signs/leo-soulmate', text: 'Leo Soulmate' },
      { href: '/signs/leo-love-language', text: 'Leo Love Language' },
      { href: '/signs/how-to-tell-if-leo-likes-you', text: 'Does Leo Like You?' },
      { href: '/compatibility/', text: 'Leo Compatibility' }
    ]
  },
  virgo: {
    tagline: "Show them you have your life together. The rest follows naturally.",
    desc: "How to attract a Virgo — why competence is the ultimate turn-on, what they're actually analyzing when they pull back, and how to earn their trust.",
    intro: `Virgo is the sign most likely to have a mental spreadsheet about you before the first date. They notice everything — your grammar, your punctuality, whether you've read the menu before the waiter arrives, how you treat service staff. Attracting a Virgo means passing a series of evaluations they'll never explicitly announce. Here's what they're looking for.`,
    irresistible: `Competence. Nothing is more attractive to Virgo than someone who is genuinely good at something. They're drawn to mastery, to people who take their craft seriously, to anyone who seems to have worked hard to become capable. Show them what you're good at — not to brag, but matter-of-factly. "I've been doing this for years, I know it well." That low-key confidence in your own capabilities is deeply compelling.`,
    irresistible2: `Intellectual engagement without ego. Virgo is Mercury-ruled and craves good conversation, but they're put off by people who perform intelligence without having it. Ask them questions and actually listen to the answer. Offer an unexpected observation. Show them you think carefully and can hold nuance. Virgo doesn't need you to be the smartest person in the room — they need you to think before you speak.`,
    kills: `Messiness, in all its forms. Not just physical clutter — though that matters — but messy emotions, messy finances, messy communication. If you're chronically late, cancel plans on impulse, live in chaos, or deflect personal responsibility with excuses, Virgo will write you off quietly and thoroughly. They're not judging you maliciously. They just have very clear standards for what they want near them.`,
    kills2: `Pushing through their resistance. Virgo needs time and they'll give hints that they're warming up before they actually declare anything. If you push for more than they're ready to offer — more intimacy, more labels, more presence — they'll feel crowded and retreat further. Patience is mandatory.`,
    texting: `Clear, correct, and thoughtful. Don't send typo-ridden texts. Don't go three days without contact. Don't send overly casual messages that read as careless. Virgo appreciates a well-formed sentence and notices when you've put thought into what you say. References to previous conversations go over very well. Updates on your life that show your life is moving forward also appeal — Virgo likes to track that the people they care about are progressing.`,
    longGame: `Virgo falls in love in the details. They notice the way you remember their coffee order. They notice when you read the thing they recommended. They notice when you show up five minutes early. Accumulate these moments deliberately and consistently. By the time Virgo realizes they're attached, they've been quietly in love for a while already.`,
    notDo: `Don't criticize them. Even gentle teasing can land badly with Virgo because they're already their own harshest critic. Don't be sloppy with your promises — if you say you'll do something, do it. Don't ask for their advice and then ignore it. And definitely don't tell them to "relax" or "stop overthinking." They experience that as a fundamental rejection of who they are.`,
    faq: [
      { q: "What does Virgo find attractive?", a: "Capability and thoughtfulness. Someone who has their life together, treats people with respect, and takes things seriously. Virgo is also attracted to people who are clearly good at something — expertise is very sexy to them. Bonus points if you're organized, punctual, and can hold a real conversation." },
      { q: "How do you win a Virgo over?", a: "Be reliable over time. Virgo falls for people who show up consistently, keep their word, and demonstrate through actions rather than declarations that they're trustworthy. They're watching to see if you're as good as you seem. Give them evidence that you are." },
      { q: "Why does Virgo pull back when they like someone?", a: "Because they're scared of being wrong. Virgo analyzes before they commit, and when their feelings are real, the stakes feel higher. The pulling back is often them processing, not rejecting. Give them space and stay consistent. They'll come back." },
      { q: "What do Virgos want in a relationship?", a: "Partnership with someone reliable, intelligent, and emotionally mature. Someone who doesn't require constant management and who respects Virgo's need for order and quality. They want someone they can actually depend on — not just someone who shows up when it's convenient." }
    ],
    related: [
      { href: '/signs/virgo-in-love', text: 'Virgo in Love' },
      { href: '/signs/dating-a-virgo', text: 'Dating a Virgo' },
      { href: '/signs/virgo-soulmate', text: 'Virgo Soulmate' },
      { href: '/signs/virgo-love-language', text: 'Virgo Love Language' },
      { href: '/signs/how-to-tell-if-virgo-likes-you', text: 'Does Virgo Like You?' },
      { href: '/compatibility/', text: 'Virgo Compatibility' }
    ]
  },
  libra: {
    tagline: "Be the most beautiful version of yourself and let them deliberate.",
    desc: "How to attract a Libra — why aesthetics are actually about values, how to charm without overwhelming, and why Libra takes so long to decide.",
    intro: `Libra is the most sociable sign in the zodiac and, paradoxically, one of the hardest to actually win. They're charming to everyone — it's just how they're built. The challenge is figuring out when they're genuinely interested versus when they're just being Libra. Here's how to move from pleasant acquaintance to the person they actually want.`,
    irresistible: `Aesthetics matter deeply to Libra, and this goes beyond surface beauty. They're drawn to people who seem curated — not fussy, but intentional. Good taste in music, food, interiors, fashion. Someone who seems to have thought about the life they're building. Libra is attracted to the whole picture: how you dress, how you talk, what you care about, what your home looks like, the company you keep. Make that picture coherent and appealing.`,
    irresistible2: `Social grace. Libra watches how you interact with other people, especially at parties or in groups. Are you good at conversation? Do you make people feel comfortable? Can you work a room without being obnoxious about it? Libra is deeply attracted to social competence because they value it so highly in themselves. Being graceful, inclusive, and effortlessly charming is genuinely irresistible to them.`,
    kills: `Aggression or intensity. Libra is allergic to confrontation and is put off by anyone who seems to create friction for sport. If you're argumentative, combative, or carry a chip on your shoulder, Libra will find the interaction unpleasant and step away from it. They want everything to feel easy, smooth, and pleasant, especially in early attraction.`,
    kills2: `Pressuring them to decide. Libra has legendarily terrible decision-making because they genuinely see all sides and want to choose correctly. If you force them to define things before they're ready, they'll either make a decision they don't mean yet or flee from the pressure entirely. Let them arrive at their conclusions at their own pace.`,
    texting: `Charming, light, and quality-over-quantity. Libra appreciates a clever message over a constant stream of mediocre ones. Compliment them genuinely and specifically. Ask for their opinion — Libra loves being consulted, even on small decisions. Keep the vibe pleasant and interesting. Don't send anything aggressive or emotionally heavy over text; Libra needs to be in the right setting for real conversation.`,
    longGame: `Libra falls for people who make their life more beautiful. Not just romantically — intellectually, aesthetically, socially. Show them a world through your eyes that's slightly more interesting than the one they already inhabit. Take them to places they haven't been. Introduce them to things they didn't know they'd love. Become associated in their mind with expansion and beauty.`,
    notDo: `Don't be crude or abrasive, especially early on. Don't skip the courtship phase — Libra genuinely appreciates being wooed. Don't force a decision about what you are before they've had time to process. And don't be fake. For all their polish, Libra is very good at detecting people who are performing a version of themselves. Be the real version, just the best one.`,
    faq: [
      { q: "What attracts a Libra?", a: "Beauty, social grace, and intellectual charm. Libra is drawn to people who seem aesthetically intentional and who are good at being around other people. They want someone who makes the world feel more balanced and pleasant — someone whose presence is a net positive on the vibe." },
      { q: "How do you know if Libra likes you?", a: "They find reasons to be near you. They ask for your opinion. They laugh at things that aren't that funny. They make eye contact slightly longer than necessary. Libra is subtle and charming with everyone, so watch for the specific things they do only with you." },
      { q: "Why does Libra take so long to commit?", a: "They're weighing everything. It's genuinely how they process — they consider all angles, all outcomes, all alternatives. It's not indifference or ambivalence about you specifically. It's just Libra's process. The best response is patience and continued low-pressure presence." },
      { q: "What does Libra want in a partner?", a: "Partnership in the truest sense: balance, mutual respect, beauty in daily life, and someone who makes them feel like the relationship is an upgrade on being single. They're not interested in a relationship that costs them more than it gives them." }
    ],
    related: [
      { href: '/signs/libra-in-love', text: 'Libra in Love' },
      { href: '/signs/dating-a-libra', text: 'Dating a Libra' },
      { href: '/signs/libra-soulmate', text: 'Libra Soulmate' },
      { href: '/signs/libra-love-language', text: 'Libra Love Language' },
      { href: '/signs/how-to-tell-if-libra-likes-you', text: 'Does Libra Like You?' },
      { href: '/compatibility/', text: 'Libra Compatibility' }
    ]
  },
  scorpio: {
    tagline: "They don't fall for everyone. Which is exactly why everyone wants to be the one.",
    desc: "How to attract a Scorpio — why mystery matters, what they're actually testing for, and how to survive the intensity without losing yourself.",
    intro: `Attracting a Scorpio is a test. They will probe your psychological edges, watch how you handle pressure, assess whether you're real or performing, and decide quietly whether you're worth the full force of their attention. Most people don't pass. Here's how to be the exception — and what it means when you are.`,
    irresistible: `Depth. Scorpio is viscerally uninterested in surface-level people. They want someone who has actually thought about hard things — death, power, transformation, what they really want. You don't need to be dark or dramatic, but you need to be real. Share something true about yourself early, something that isn't flattering but is honest. Scorpio responds to authenticity the way other signs respond to beauty.`,
    irresistible2: `Hold your own. Scorpio will test your boundaries — not maliciously, but because they need to know what you're made of. If you fold under pressure, change your position to please them, or let them walk over you without comment, they lose interest. Hold your ground respectfully. Disagree. Have a line and keep it. Scorpio is attracted to psychological strength more than almost anything.`,
    kills: `Dishonesty, even small dishonesty. Scorpio has a near-supernatural ability to detect when someone isn't being straight with them. A half-truth, an exaggeration, a socially convenient omission — they'll catch it, file it, and it will color everything that comes after. Start completely honest, even about things that don't show you in your best light. Especially about those things.`,
    kills2: `Shallowness or an inability to go deep. If your version of intimacy is talking about your Netflix queue, Scorpio will be bored within the first thirty minutes and you'll never know why they stopped responding. They need to go somewhere real with people they're interested in. Be willing to go there.`,
    texting: `Scorpio texts with intention. They don't send filler. Don't send filler back. Quality over volume. Say something real. Ask a question that doesn't have a trivial answer. Don't play games with response times — Scorpio finds it transparent and tedious. Respond when you're ready, but don't strategize about it. Also: if you're going to flirt, be bold. Half-hearted flirtation reads as cowardice.`,
    longGame: `Scorpio loyalty is extraordinary when it's activated, and it's activated slowly. Show them that you're consistent across contexts — that who you are in public is who you are in private. Let them see you in difficult moments. Be trustworthy with information they share. Once Scorpio decides you're safe, they give you access to parts of themselves almost no one else gets to see. That's the prize.`,
    notDo: `Never lie. Never try to manipulate them — they'll see it immediately. Don't play games with access or attention as a strategy. Don't be flaky or inconsistent. And don't pry into their emotional history before they're ready to share it. Scorpio shares on their timeline. Trying to accelerate that will get you shut out permanently.`,
    faq: [
      { q: "How do you get a Scorpio to chase you?", a: "Be genuinely interesting and slightly unknowable. Scorpio is drawn to mysteries they can't immediately solve. Don't overshare everything up front. Keep some things close. Show depth without showing all of it at once. The sense that there's more to discover will keep them engaged." },
      { q: "What does Scorpio find most attractive?", a: "Authenticity, psychological depth, and the ability to hold your own under pressure. Scorpio doesn't fall for pretty faces without substance behind them. They want someone who is real — who can handle intensity, who doesn't flinch at difficult truths, who has a genuine interior life." },
      { q: "Are Scorpios hard to attract?", a: "Yes, and they know it. They don't fall for everyone and they're proud of that. What they're really looking for is someone who doesn't need them to fall — someone so self-possessed that they're genuinely fine either way. Counterintuitively, needing Scorpio's approval less makes them more interested." },
      { q: "What makes a Scorpio obsessed with someone?", a: "Feeling like you're a mystery they haven't fully solved yet, combined with genuine emotional resonance. Scorpio becomes obsessed when they feel a deep pull toward someone but still feel like there are layers to uncover. Stay authentic, stay somewhat complex, and they'll keep coming back." }
    ],
    related: [
      { href: '/signs/scorpio-in-love', text: 'Scorpio in Love' },
      { href: '/signs/dating-a-scorpio', text: 'Dating a Scorpio' },
      { href: '/signs/scorpio-soulmate', text: 'Scorpio Soulmate' },
      { href: '/signs/scorpio-love-language', text: 'Scorpio Love Language' },
      { href: '/signs/how-to-tell-if-scorpio-likes-you', text: 'Does Scorpio Like You?' },
      { href: '/compatibility/', text: 'Scorpio Compatibility' }
    ]
  },
  sagittarius: {
    tagline: "The only way to keep their attention is to never fully have it.",
    desc: "How to attract a Sagittarius — why freedom is non-negotiable, what genuinely excites them, and how to avoid the trap of becoming their comfort zone.",
    intro: `Sagittarius is the most commitment-phobic sign in the zodiac — not because they're incapable of love, but because they associate love with restriction and restriction with death. Attracting a Sagittarius means making them feel like choosing you expands their world rather than shrinks it. That's actually a solvable problem. Here's how.`,
    irresistible: `Adventurousness and genuine curiosity about life. Sagittarius is ruled by Jupiter, the planet of expansion, and they're attracted to people who are actively growing — who are learning things, going places, developing ideas. Show them your world is interesting. Be someone who has experiences to talk about, plans on the horizon, a general sense that life is enormous and you're exploring it. Sagittarius cannot resist someone who makes them feel like there's more to discover.`,
    irresistible2: `Humor, specifically the kind that comes from a big-picture view of life. Sagittarius has a philosophical, cosmic sense of humor — they find absurdity everywhere and love people who can see it too. Being funny in a lightweight, ironic way (not mean-spirited) is enormously attractive to them. Lightness is attractive. Sagittarius is suspicious of people who take everything too seriously.`,
    kills: `Possessiveness. Any hint that you're keeping score, that you'd clip their wings, that you'd be upset about their independence — Sagittarius will sense it like a trap and leave before the door closes. Don't ask where they've been. Don't show jealousy early on. Don't suggest limiting any of their freedom. This doesn't mean you have to have no needs — it means lead with your own freedom first.`,
    kills2: `Heaviness. Sagittarius will run from someone who feels like a responsibility. Emotional drama, high maintenance, needy — they're not equipped for it and won't try to be. Keep early interactions light, expansive, and low-stakes. Let intensity develop naturally and slowly.`,
    texting: `Spontaneous and interesting. Sagittarius appreciates the unexpected text — a question they haven't thought about, a random observation about something weird, a meme about something they mentioned in passing. They don't love being texted "what are you doing" seventeen times. Contact should feel like it adds something. Initiate adventures over text — suggest something fun and surprising. They'll show up.`,
    longGame: `The long game is about becoming an adventure in themselves rather than an obstacle to adventure. Be the person who's down for things. Say yes to more than you normally would. Make them feel like being with you is an upgrade on being alone — more fun, more interesting, more alive. Sagittarius will choose someone who expands them over someone who anchors them every single time.`,
    notDo: `Don't try to make them jealous — it will usually work but then backfire messily. Don't push for commitment before they're ready; they'll agree and then sabotage it. Don't be predictable. Don't make them feel guilty for wanting space. And don't compete with their friends, their travel plans, or their independence. Be the thing they want to come back to, not the thing they're trying to get away from.`,
    faq: [
      { q: "How do you make a Sagittarius fall for you?", a: "Be interesting, be free, and never make them feel trapped. Show them your life is full of things worth exploring. Be someone they associate with expansion and good energy rather than obligation. The way to Sagittarius's heart is through their sense of adventure." },
      { q: "What does Sagittarius find attractive?", a: "Independence, intellectual curiosity, and a sense of humor. They're attracted to people who have their own exciting lives and don't need Sagittarius to complete them. Confidence is attractive. Lightness is attractive. Being easily fascinated by the world is very attractive." },
      { q: "Will Sagittarius ever commit?", a: "Yes, when they find someone who doesn't feel like a limitation. Sagittarius commits when they believe the relationship will take them further than they'd go alone — not when they feel obligated. If they're with you, it's a genuine choice they keep making." },
      { q: "What pushes Sagittarius away?", a: "Clinginess, jealousy, and anyone who talks about the future too soon. Also: being boring or predictable, emotionally heavy early on, or giving them the sense that choosing you means choosing a smaller life. Sagittarius needs to feel like they're gaining something, not giving something up." }
    ],
    related: [
      { href: '/signs/sagittarius-in-love', text: 'Sagittarius in Love' },
      { href: '/signs/dating-a-sagittarius', text: 'Dating a Sagittarius' },
      { href: '/signs/sagittarius-soulmate', text: 'Sagittarius Soulmate' },
      { href: '/signs/sagittarius-love-language', text: 'Sagittarius Love Language' },
      { href: '/signs/how-to-tell-if-sagittarius-likes-you', text: 'Does Sagittarius Like You?' },
      { href: '/compatibility/', text: 'Sagittarius Compatibility' }
    ]
  },
  capricorn: {
    tagline: "They're not hard to impress. They're just paying attention to different things.",
    desc: "How to attract a Capricorn — why ambition and reliability are the real currency, what Capricorn is secretly looking for, and how to earn their guarded heart.",
    intro: `Capricorn is not going to fall for you because of a grand gesture. They're not going to be swept off their feet by charm or chemistry alone. What they're evaluating — always, even when they seem relaxed — is whether you're someone worth their limited time. Capricorn takes the long view on everything, including romance. Here's how to make the cut.`,
    irresistible: `Ambition and direction. Capricorn is attracted to people who are building something, who have a clear sense of where they're going. You don't need to be rich or already successful — but you need to be moving. Talking about your goals, your work, what you're trying to create — this is foreplay for Capricorn. They want someone they can respect professionally and personally.`,
    irresistible2: `Reliability demonstrated through action. Say you'll be somewhere and be there. Follow up when you say you will. Deliver on small promises. Capricorn tracks this obsessively because they know that small commitments predict big ones. Someone who can't be trusted with a dinner reservation can't be trusted with a heart. Pass the small tests and the bigger ones follow.`,
    kills: `Laziness or lack of direction. Someone who seems to be drifting, who doesn't take their responsibilities seriously, who brags about working as little as possible — Capricorn finds this both unimpressive and vaguely threatening. They've worked hard to build their stability and they want someone who respects that value, not someone who thinks it's unnecessary.`,
    kills2: `Being performative rather than substantive. Capricorn can spot someone who's all talk instantly. Dropping names, exaggerating achievements, social status signaling — Capricorn has a forensic ability to see through it. They respect what's real, what's earned, what exists without needing to be announced.`,
    texting: `Purposeful and not excessive. Capricorn doesn't chat for chatting's sake. Text when you have something to say. Ask substantive questions. Don't send "hey" with no follow-up. Don't double text. Don't text at midnight. Capricorn appreciates someone who seems to manage their communication the way they manage everything else — with intention. Checking in during the workday with something brief and warm goes over well; it signals that you respect their schedule while also caring.`,
    longGame: `Capricorn is a slow unlock. The more they see of your actual character over time — how you handle setbacks, whether you keep your word, whether you have real substance behind the surface — the more they invest. Be patient. Be consistent. Let them see you in contexts that reveal character, not just personality. The person who becomes genuinely trusted by a Capricorn has earned something rare.`,
    notDo: `Don't be flaky. Don't overpromise and underdeliver. Don't ask for more time and emotional investment than you're currently earning. Don't make them feel like they have to parent you through your life decisions. And don't interpret their reserved demeanor as disinterest — Capricorn is often most engaged when they seem least demonstrative.`,
    faq: [
      { q: "How do you attract a Capricorn man or woman?", a: "Show them you have your life together and you're actively improving it. Be reliable in small ways before you're reliable in big ones. Have genuine ambition and be able to talk about it without needing validation. Capricorn is attracted to people who seem like they'd be a net asset in a life partnership, not a liability." },
      { q: "What does Capricorn find attractive?", a: "Competence, ambition, and reliability. Someone who takes their responsibilities seriously, follows through, and is clearly building something real. Also: discretion. Capricorn is very private and attracted to people who understand the value of keeping things close." },
      { q: "Does Capricorn fall in love easily?", a: "No. They're cautious and protective of their time and energy. When they do fall, though, they fall deeply and with full commitment. The slow start is not a bug — it's how Capricorn ensures they're making a real choice." },
      { q: "How do you know a Capricorn is interested in you?", a: "They make time for you in a schedule that's usually packed. They ask about your work and your goals. They might not say much romantically but they show up reliably. Capricorn expresses interest through presence and practical investment, not declarations." }
    ],
    related: [
      { href: '/signs/capricorn-in-love', text: 'Capricorn in Love' },
      { href: '/signs/dating-a-capricorn', text: 'Dating a Capricorn' },
      { href: '/signs/capricorn-soulmate', text: 'Capricorn Soulmate' },
      { href: '/signs/capricorn-love-language', text: 'Capricorn Love Language' },
      { href: '/signs/how-to-tell-if-capricorn-likes-you', text: 'Does Capricorn Like You?' },
      { href: '/compatibility/', text: 'Capricorn Compatibility' }
    ]
  },
  aquarius: {
    tagline: "Don't try to understand them. Try to intrigue them.",
    desc: "How to attract an Aquarius — why being interesting beats being attractive, how to get past their emotional distance, and what they actually want in a partner.",
    intro: `Aquarius is the hardest sign to attract in the traditional sense because traditional attraction strategies don't work on them. Compliments bore them. Conventional romance makes them uncomfortable. What they want is someone who genuinely fascinates them — mentally, philosophically, creatively. Here's how to be that person.`,
    irresistible: `Originality. Aquarius is attracted to people who think differently, who hold unusual opinions, who are doing things with their life that most people aren't. You don't need to be eccentric, but you need to have your own perspective. Generic people in generic situations are invisible to Aquarius. Stand out by being unapologetically yourself, especially in the ways that don't quite fit conventional templates.`,
    irresistible2: `Intelligence about things they actually care about. Aquarius has passions — often around ideas, social systems, technology, or the future. Show genuine interest in their obsessions and engage with them on that level. Ask about what they think is wrong with the world and what they'd do about it. An Aquarius who gets to talk about their ideas with someone who actually follows the conversation is in their happiest state.`,
    kills: `Jealousy or possessiveness. Even the hint of it. Aquarius is deeply suspicious of anyone who wants to limit their freedom or own their time, and they'll categorize someone as "too much work" remarkably quickly. Make it clear that you have your own life, your own people, your own priorities. Aquarius needs to feel chosen freely, not possessed.`,
    kills2: `Emotional manipulation. Aquarius has exceptional radar for anyone trying to engineer their feelings. Guilt trips, manufactured urgency, playing the victim — Aquarius will see through it and find it deeply unattractive. They respect directness enormously. Just say what you want.`,
    texting: `Interesting over frequent. Send them something they've never thought about. A weird question. An observation about something they mentioned three weeks ago that you've been thinking about. An article that's genuinely relevant to their interests. Aquarius would rather get one fascinating text a week than five mundane ones a day. They also respond well to the unexpected — texting them about a cause you just learned about or something happening in the world will get more engagement than "how was your day."`,
    longGame: `Aquarius falls for friends. The romantic trajectory almost always goes: interesting person, interesting conversations, growing respect and genuine care, then eventually a realization that this person matters in a specific way. Don't rush the romantic framing. Build the friendship with full investment and let the rest emerge. Aquarius doesn't separate love from deep friendship — they're the same thing.`,
    notDo: `Don't be conventional in your approach to them. Don't send flowers and chocolates without knowing them well. Don't express romantic interest before you've established genuine connection. Don't push for emotional intimacy before they offer it — Aquarius will share their feelings when they trust you, which takes real time. And don't take their need for distance personally. It's not rejection, it's just how they're built.`,
    faq: [
      { q: "What does Aquarius find attractive?", a: "Originality, intelligence, and genuine independence. Someone who has unusual ideas, lives by their own code, and doesn't need Aquarius's approval to feel good about themselves. Also: someone who gets excited about ideas and can have a real conversation about the world." },
      { q: "How do you make an Aquarius fall in love?", a: "Be genuinely interesting and give them real intellectual stimulation. Become their friend first — someone they look forward to talking to. Let the romantic layer develop after the connection is already real. Aquarius can't separate love from deep intellectual and personal connection." },
      { q: "Why is Aquarius so hard to attract?", a: "Because they're genuinely selective and not particularly motivated by conventional attraction cues. They need someone who does something for their mind, not just their eyes. Once you find the right channel — their ideas, their passions, their curiosity — they're much more accessible than they appear." },
      { q: "Does Aquarius fall in love?", a: "Yes, deeply — but it often catches them by surprise. They'll be certain they don't have feelings and then realize they've been thinking about someone constantly for months. When Aquarius loves, it's usually someone they genuinely respect as a mind and a person." }
    ],
    related: [
      { href: '/signs/aquarius-in-love', text: 'Aquarius in Love' },
      { href: '/signs/dating-a-aquarius', text: 'Dating an Aquarius' },
      { href: '/signs/aquarius-soulmate', text: 'Aquarius Soulmate' },
      { href: '/signs/aquarius-love-language', text: 'Aquarius Love Language' },
      { href: '/signs/how-to-tell-if-aquarius-likes-you', text: 'Does Aquarius Like You?' },
      { href: '/compatibility/', text: 'Aquarius Compatibility' }
    ]
  },
  pisces: {
    tagline: "Make them feel like they've finally found the person they've been dreaming about.",
    desc: "How to attract a Pisces — what they're actually longing for, how to make them feel truly seen, and why romantic fantasy matters more than you think.",
    intro: `Pisces is the dreamiest sign in the zodiac, which means attracting them is less about strategy and more about creating the right feeling. They're not evaluating your resume. They're not tracking whether you texted back in the right amount of time. They're asking, on a deep intuitive level: does this person make me feel something? Here's how to be the answer to that question.`,
    irresistible: `Emotional depth and sensitivity. Pisces is drawn to people who feel things fully — who have been moved by art, by music, by a good book, by a conversation that went somewhere unexpected. If you can share something emotionally true about yourself in an early conversation — a formative experience, something that still affects you — you'll do more to attract Pisces than any amount of wit or status signaling could.`,
    irresistible2: `Creativity, in any form. Making things, appreciating beauty, having an aesthetic sense — these are enormously attractive to Pisces. Share something you've created or care about deeply. Ask about their creative life. Show them you live in the dimension where feeling and imagination matter, not just utility. Pisces is looking for a kindred spirit, and they find them in people who are in some relationship with beauty.`,
    kills: `Cynicism. If you're someone who flattens everything — who explains away emotion as biochemistry, who finds sentimentality embarrassing, who rolls their eyes at earnestness — Pisces will feel misunderstood before you've even started. Their whole world runs on meaning, feeling, and imagination. Someone who dismisses all that dismisses them.`,
    kills2: `Being too real, too fast. Pisces lives partly in a world of romantic possibility. Early on, they want the dream as much as the reality. Don't aggressively shatter the illusion with grounding pragmatism before they're ready for it. Let the romantic haze have its moment.`,
    texting: `Beautiful and personal. Pisces loves a text that feels like it was written specifically for them. References to something they said before, something that made you think of them, something that's a little poetic or unexpected. Voice notes work beautifully — Pisces is very attuned to tone and can hear the feeling behind words. Don't be relentlessly practical in your communication. Include some wonder. Some feeling. Something that's just a little bit more than information.`,
    longGame: `Pisces falls for people who make them feel uniquely understood. The long game is about being the one person who really gets them — who sees their inner world, who doesn't try to fix their sensitivity or logic away their intuition. Be the safe place for their feelings. Let them tell you their dreams. Take seriously the things they care about even if they're intangible. Pisces loves with their whole heart and they give that to people who feel like home.`,
    notDo: `Don't be dismissive of anything emotional or intuitive. Don't push them for straightforward, logical explanations of how they're feeling — Pisces often doesn't have that. Don't create drama or chaos — Pisces absorbs other people's energy and chaos is genuinely destabilizing for them. And don't ignore the things they create or share with you. They're telling you who they are through those things.`,
    faq: [
      { q: "What does Pisces find attractive?", a: "Emotional depth, creativity, and kindness. Someone who feels things and isn't ashamed of it. Someone with an imaginative inner life. Pisces is drawn to people who seem to live in the same soulful dimension they inhabit — where art and feeling and intuition matter as much as facts." },
      { q: "How do you make a Pisces fall for you?", a: "Make them feel truly seen and understood. Share something emotionally true. Appreciate what they create. Be gentle with their sensitivity rather than impatient with it. Pisces falls for people who feel like they were made specifically to understand them." },
      { q: "Does Pisces fall in love easily?", a: "They fall into infatuation easily — Pisces can get lost in someone very quickly. But real love, the kind that stays, comes from feeling genuinely safe and understood. They can tell the difference between the feeling and the real thing, even if it takes time." },
      { q: "What pushes Pisces away?", a: "Emotional coldness, cynicism about things they care about, and anyone who makes them feel embarrassed for being sensitive. Also: chaos, instability, or someone who consistently disappoints them. Pisces holds hope for people longer than most, but when they give up, they really let go." }
    ],
    related: [
      { href: '/signs/pisces-in-love', text: 'Pisces in Love' },
      { href: '/signs/dating-a-pisces', text: 'Dating a Pisces' },
      { href: '/signs/pisces-soulmate', text: 'Pisces Soulmate' },
      { href: '/signs/pisces-love-language', text: 'Pisces Love Language' },
      { href: '/signs/how-to-tell-if-pisces-likes-you', text: 'Does Pisces Like You?' },
      { href: '/compatibility/', text: 'Pisces Compatibility' }
    ]
  }
};

// ─── HTML BOILERPLATE ──────────────────────────────────────────────────────────

const CSS = `
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    :root {
      --void: #1E1528;
      --plum: #2A1F33;
      --plum-mid: #352840;
      --plum-lift: #3D2E4A;
      --gold-dim: #B09A6E;
      --gold: #C9AD6F;
      --gold-light: #D4BC7C;
      --gold-pale: #E2D4A7;
      --display: 'Fondamento', cursive;
      --serif: 'EB Garamond', 'Garamond', 'Georgia', serif;
      --sans: 'DM Sans', -apple-system, sans-serif;
      --mono: 'Space Mono', monospace;
    }
    body { background: var(--plum); color: var(--gold); font-family: var(--serif); font-size: 17px; line-height: 1.8; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
    body > *:not(canvas) { position: relative; z-index: 1; }
    ::selection { background: rgba(201,173,111,0.25); color: var(--gold-pale); }
    .nav { max-width: 680px; margin: 0 auto; padding: 20px 24px; display: flex; align-items: center; gap: 8px; font-family: var(--sans); font-size: 0.6rem; }
    .nav a { color: var(--gold-dim); text-decoration: none; transition: color 0.3s; }
    .nav a:first-child { font-family: var(--display); font-style: italic; font-size: 1rem; color: var(--gold); }
    .nav a:hover { color: var(--gold-light); }
    .nav .sep { color: var(--gold-dim); opacity: 0.25; }
    .nav span:last-child { color: var(--gold-dim); }
    .sign-hero { max-width: 680px; margin: 0 auto; padding: 48px 24px 0; text-align: center; }
    .sign-name { font-family: var(--display); font-style: italic; font-size: clamp(2.5rem, 7vw, 3.8rem); color: var(--gold-pale); font-weight: 400; margin-bottom: 12px; }
    .sign-tagline { font-family: var(--serif); font-size: 1.15rem; font-style: italic; color: var(--gold-dim); margin-bottom: 40px; }
    article { max-width: 680px; margin: 0 auto; padding: 0 24px; }
    .section { padding: 24px 0 0; }
    .section h2 { font-family: var(--serif); font-size: 1.5rem; font-weight: 600; color: var(--gold-light); margin-bottom: 18px; line-height: 1.2; }
    .section h3 { font-family: var(--sans); font-size: 0.6rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; color: var(--gold-dim); margin-top: 28px; margin-bottom: 14px; }
    .section p { margin-bottom: 16px; line-height: 1.85; }
    .section a { color: var(--gold-light); text-decoration: underline; text-decoration-color: rgba(201,173,111,0.3); text-underline-offset: 2px; transition: text-decoration-color 0.3s; }
    .section a:hover { text-decoration-color: var(--gold-light); }
    .highlight-box { background: linear-gradient(135deg, var(--plum-mid), var(--plum-lift)); border: 1px solid rgba(201,173,111,0.12); border-radius: 2px; padding: 28px 24px; margin: 32px 0; }
    .highlight-box .hb-label { font-family: var(--sans); font-size: 0.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gold); margin-bottom: 12px; }
    .highlight-box p { font-size: 1.05rem; color: var(--gold-light); margin-bottom: 0; line-height: 1.7; }
    .pull-quote { border-left: 2px solid var(--gold-dim); padding: 4px 0 4px 24px; margin: 36px 0; font-family: var(--serif); font-size: 1.25rem; font-style: italic; color: var(--gold-light); line-height: 1.6; }
    .div { text-align: center; padding: 32px 0; color: var(--gold-dim); opacity: 0.3; font-size: 6px; letter-spacing: 16px; }
    .mid-cta { background: var(--plum-mid); border: 1px solid rgba(201,173,111,0.1); border-radius: 2px; padding: 32px 28px; margin: 48px 0; text-align: center; }
    .mid-cta p { font-family: var(--serif); font-size: 1.05rem; font-style: italic; color: var(--gold-dim); margin-bottom: 16px; }
    .mid-cta-row { display: flex; flex-direction: column; gap: 8px; max-width: 380px; margin: 0 auto; }
    .mid-cta-input { width: 100%; padding: 12px 14px; background: var(--plum-lift); color: var(--gold-pale); border: 1px solid var(--gold-dim); border-radius: 2px; font-family: var(--serif); font-size: 0.92rem; outline: none; transition: border-color 0.3s; }
    .mid-cta-input::placeholder { color: var(--gold-dim); }
    .mid-cta-input:focus { border-color: var(--gold); }
    .mid-cta-btn { padding: 12px; background: var(--gold); color: var(--void); border: none; border-radius: 2px; font-family: var(--sans); font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; cursor: pointer; transition: background 0.3s; }
    .mid-cta-btn:hover { background: var(--gold-light); }
    .mid-cta-success { display: none; font-family: var(--serif); font-size: 1rem; font-style: italic; color: var(--gold-light); padding: 8px 0; }
    .fw.done .mid-cta-row { display: none; }
    .fw.done p { display: none; }
    .fw.done .mid-cta-success { display: block; }
    @media (min-width: 481px) { .mid-cta-row { flex-direction: row; gap: 0; } .mid-cta-input { border-radius: 2px 0 0 2px; border-right: none; } .mid-cta-btn { width: auto; padding: 12px 20px; border-radius: 0 2px 2px 0; white-space: nowrap; } }
    .bottom-cta { border: 1px solid rgba(201,173,111,0.1); border-radius: 2px; padding: 40px 28px; margin: 56px 0 0; text-align: center; }
    .bottom-cta .cta-title { font-family: var(--serif); font-size: 1.4rem; font-weight: 500; color: var(--gold-light); margin-bottom: 8px; }
    .bottom-cta .cta-sub { font-family: var(--serif); font-size: 0.92rem; font-style: italic; color: var(--gold-dim); margin-bottom: 20px; }
    .faq-section { max-width: 680px; margin: 0 auto; padding: 48px 24px 0; }
    .faq-section h2 { font-family: var(--serif); font-size: 1.5rem; font-weight: 600; color: var(--gold-light); margin-bottom: 24px; line-height: 1.2; }
    .faq-item { border-bottom: 1px solid rgba(201,173,111,0.08); padding: 20px 0; }
    .faq-item:first-of-type { border-top: 1px solid rgba(201,173,111,0.08); }
    .faq-item h3 { font-family: var(--serif); font-size: 1.1rem; font-weight: 600; color: var(--gold-light); margin-bottom: 8px; line-height: 1.4; text-transform: none; letter-spacing: normal; }
    .faq-item p { font-family: var(--serif); font-size: 0.95rem; color: var(--gold); line-height: 1.75; margin: 0; }
    .keep-reading { max-width: 680px; margin: 0 auto; padding: 40px 24px 0; }
    .keep-reading-label { font-family: var(--sans); font-size: 0.55rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gold-dim); margin-bottom: 8px; }
    .keep-reading-title { font-family: var(--serif); font-size: 1.3rem; font-weight: 500; color: var(--gold-light); margin-bottom: 20px; }
    .keep-reading-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .keep-reading-grid a { background: var(--plum-mid); border: 1px solid rgba(201,173,111,0.08); border-radius: 2px; padding: 14px 18px; color: var(--gold); text-decoration: none; font-family: var(--serif); font-size: 0.95rem; transition: border-color 0.3s, color 0.3s; }
    .keep-reading-grid a:hover { border-color: rgba(201,173,111,0.25); color: var(--gold-light); }
    .foot { max-width: 680px; margin: 0 auto; padding: 32px 24px; text-align: center; border-top: 1px solid rgba(201,173,111,0.06); }
    .foot a { font-family: var(--sans); font-size: 0.58rem; color: var(--gold-dim); text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; transition: color 0.3s; }
    .foot a:hover { color: var(--gold-light); }
    @media (max-width: 480px) { .sign-name { font-size: 2.2rem; } .keep-reading-grid { grid-template-columns: 1fr; } }
    .callout { border-left: 3px solid var(--gold-dim); padding: 20px 24px; margin: 32px 0; background: rgba(42,31,51,0.5); border-radius: 0 4px 4px 0; font-style: italic; color: var(--gold-pale); font-size: 1.1rem; line-height: 1.6; }
`;

const NAV_HTML = `  <nav class="site-nav" role="navigation" aria-label="Main navigation">
  <div class="site-nav-inner">
    <a href="/" class="site-nav-brand">Sign Season</a>
    <ul class="site-nav-links">
      <li>
        <button type="button">Signs <span class="nav-arrow">&#9662;</span></button>
        <div class="nav-dropdown">
          <div class="nav-signs-grid">
            <a href="/signs/aries"><span class="sign-sym">&#9800;&#xFE0E;</span> Aries</a>
            <a href="/signs/taurus"><span class="sign-sym">&#9801;&#xFE0E;</span> Taurus</a>
            <a href="/signs/gemini"><span class="sign-sym">&#9802;&#xFE0E;</span> Gemini</a>
            <a href="/signs/cancer"><span class="sign-sym">&#9803;&#xFE0E;</span> Cancer</a>
            <a href="/signs/leo"><span class="sign-sym">&#9804;&#xFE0E;</span> Leo</a>
            <a href="/signs/virgo"><span class="sign-sym">&#9805;&#xFE0E;</span> Virgo</a>
            <a href="/signs/libra"><span class="sign-sym">&#9806;&#xFE0E;</span> Libra</a>
            <a href="/signs/scorpio"><span class="sign-sym">&#9807;&#xFE0E;</span> Scorpio</a>
            <a href="/signs/sagittarius"><span class="sign-sym">&#9808;&#xFE0E;</span> Sagittarius</a>
            <a href="/signs/capricorn"><span class="sign-sym">&#9809;&#xFE0E;</span> Capricorn</a>
            <a href="/signs/aquarius"><span class="sign-sym">&#9810;&#xFE0E;</span> Aquarius</a>
            <a href="/signs/pisces"><span class="sign-sym">&#9811;&#xFE0E;</span> Pisces</a>
          </div>
        </div>
      </li>
      <li>
        <button type="button">Topics <span class="nav-arrow">&#9662;</span></button>
        <div class="nav-dropdown">
          <div class="nav-topics-list">
            <a href="/signs/#in-love">Love &amp; Dating</a>
            <a href="/signs/#moon-signs">Moon Signs</a>
            <a href="/signs/#rising-signs">Rising Signs</a>
            <a href="/signs/#career">Career</a>
            <a href="/signs/#toxic-traits">Toxic Traits</a>
            <a href="/signs/#mercury-retrograde">Mercury Retrograde</a>
            <a href="/signs/#horoscopes-2026">Horoscopes 2026</a>
          </div>
        </div>
      </li>
      <li><a href="/compatibility">Compatibility</a></li>
      <li><a href="/crystals">Crystals</a></li>
      <li><a href="/#subscribe">Subscribe</a></li>
    </ul>
    <button class="site-nav-hamburger" aria-label="Menu">&#9776;</button>
  </div>
</nav>
<div class="site-nav-mobile">
  <button class="site-nav-mobile-close" aria-label="Close menu">&times;</button>
  <div class="mobile-nav-section">
    <div class="mobile-nav-section-title">Signs</div>
    <div class="mobile-nav-signs-grid">
      <a href="/signs/aries">&#9800;&#xFE0E; Aries</a>
      <a href="/signs/taurus">&#9801;&#xFE0E; Taurus</a>
      <a href="/signs/gemini">&#9802;&#xFE0E; Gemini</a>
      <a href="/signs/cancer">&#9803;&#xFE0E; Cancer</a>
      <a href="/signs/leo">&#9804;&#xFE0E; Leo</a>
      <a href="/signs/virgo">&#9805;&#xFE0E; Virgo</a>
      <a href="/signs/libra">&#9806;&#xFE0E; Libra</a>
      <a href="/signs/scorpio">&#9807;&#xFE0E; Scorpio</a>
      <a href="/signs/sagittarius">&#9808;&#xFE0E; Sagittarius</a>
      <a href="/signs/capricorn">&#9809;&#xFE0E; Capricorn</a>
      <a href="/signs/aquarius">&#9810;&#xFE0E; Aquarius</a>
      <a href="/signs/pisces">&#9811;&#xFE0E; Pisces</a>
    </div>
  </div>
  <div class="mobile-nav-section">
    <div class="mobile-nav-section-title">Explore</div>
    <div class="mobile-nav-links">
      <a href="/compatibility">Compatibility</a>
      <a href="/crystals">Crystals</a>
      <a href="/signs/">All Signs</a>
      <a href="/#subscribe">Subscribe</a>
    </div>
  </div>
</div>`;

const FOOTER_JS = `<script src="/js/stars.js"></script>
<script>
async function submitForm(fwId, inputId) {
  const input = document.getElementById(inputId);
  const email = input.value;
  if (!email || !input.checkValidity()) { input.reportValidity(); return; }
  const btn = input.parentElement.querySelector('button');
  btn.textContent = '...';
  btn.disabled = true;
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    document.getElementById(fwId).classList.add('done');
    if (!res.ok) fallbackSave(email);
  } catch {
    fallbackSave(email);
    document.getElementById(fwId).classList.add('done');
  }
}
function fallbackSave(email) {
  const s = JSON.parse(localStorage.getItem('ss_emails') || '[]');
  s.push({ email, t: Date.now() });
  localStorage.setItem('ss_emails', JSON.stringify(s));
}
</script>
<script src="/js/analytics.js" defer></script>
<script src="/js/nav.js"></script>
<script src="/js/back-to-top.js" defer></script>`;

// ─── PAGE GENERATORS ──────────────────────────────────────────────────────────

function schemaArticle(title, desc, url) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": desc,
    "url": url,
    "publisher": { "@type": "Organization", "name": "Sign Season", "url": "https://signseason.com" },
    "author": { "@type": "Organization", "name": "Sign Season" },
    "datePublished": "2026-07-06",
    "dateModified": "2026-07-06",
    "image": "https://signseason.com/assets/og-default.png"
  });
}

function schemaBreadcrumb(pageName, url) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Sign Season", "item": "https://signseason.com/" },
      { "@type": "ListItem", "position": 2, "name": "Signs", "item": "https://signseason.com/signs/" },
      { "@type": "ListItem", "position": 3, "name": pageName, "item": url }
    ]
  });
}

function schemaFaq(faqs) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  });
}

function emailCta(id1, id2, sign) {
  return `    <div class="mid-cta">
      <div class="fw" id="${id1}">
        <p>Your weekly horoscope, plus what the stars have planned for ${sign}.</p>
        <div class="mid-cta-row">
          <input type="email" class="mid-cta-input" placeholder="your@email.com" required autocomplete="email" id="email${id1}">
          <button type="button" class="mid-cta-btn" onclick="submitForm('${id1}','email${id1}')">Send Me the Tea</button>
        </div>
        <div class="mid-cta-success">Your reading is on the way. Check your inbox (and spam, we're new here).</div>
      </div>
    </div>`;
}

function bottomCta(id, sign) {
  return `    <div class="bottom-cta">
      <div class="fw" id="${id}">
        <div class="cta-title">${sign} forecasts, weekly.</div>
        <div class="cta-sub">What the stars are actually saying. No sugarcoating.</div>
        <div class="mid-cta-row">
          <input type="email" class="mid-cta-input" placeholder="your@email.com" required autocomplete="email" id="email${id}">
          <button type="button" class="mid-cta-btn" onclick="submitForm('${id}','email${id}')">Yes, Read Me</button>
        </div>
        <div class="mid-cta-success">Welcome to the season. Check your inbox.</div>
      </div>
    </div>`;
}

// ─── GENERATE: HOW TO ATTRACT ─────────────────────────────────────────────────

function generateAttract(sign) {
  const d = ATTRACT_DATA[sign.slug];
  const title = `How to Attract a ${sign.name}: What Actually Works`;
  const url = `https://signseason.com/signs/how-to-attract-${sign.slug}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="google-site-verification" content="google53a81f31582ee8d7" />
    <meta name="p:domain_verify" content="621b0e7155899f63b4676e823d77759b"/>
  <meta charset="UTF-8">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${d.desc}">
  <meta name="theme-color" content="#2A1F33">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${d.desc}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="https://signseason.com/assets/og-default.png">
  <meta property="og:site_name" content="Sign Season">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@signseasonco">
  <link rel="canonical" href="${url}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Fondamento:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">${schemaArticle(title, d.desc, url)}</script>
  <script type="application/ld+json">${schemaBreadcrumb(`How to Attract ${sign.name}`, url)}</script>
  <script type="application/ld+json">${schemaFaq(d.faq)}</script>
  <style>${CSS}</style>
  <link rel="stylesheet" href="/css/nav.css">
  <link rel="stylesheet" href="/css/global-fixes.css">
</head>
<body class="has-site-nav">
<a href="#main-content" class="skip-nav">Skip to content</a>
${NAV_HTML}
  <nav class="nav breadcrumb-nav">
    <a href="/">Sign Season</a>
    <span class="sep">/</span>
    <a href="/signs/">Signs</a>
    <span class="sep">/</span>
    <span>How to Attract ${sign.name}</span>
  </nav>

  <header class="sign-hero">
    <h1 class="sign-name">How to Attract a ${sign.name}</h1>
    <p class="sign-tagline">${d.tagline}</p>
  </header>

  <div class="div">&#10038;&ensp;&#10038;&ensp;&#10038;</div>

  <article id="main-content">
    <div class="section">
      <h2>The ${sign.name} Attraction Blueprint</h2>
      <p>${d.intro}</p>
      <p>The thing about <a href="/signs/${sign.slug}">${sign.name}</a> is that what makes them attractive to other people is also what makes attracting them complicated. They know what they're worth. They have specific things they're looking for. And they have very little patience for someone who doesn't match their frequency. The good news: once you understand their actual frequency, getting on it isn't that hard.</p>
    </div>

    <div class="section">
      <h2>What ${sign.name} Finds Irresistible</h2>
      <p>${d.irresistible}</p>
      <p>${d.irresistible2}</p>

      <div class="highlight-box">
        <div class="hb-label">The core principle</div>
        <p>Every sign has a primary currency — the thing that matters most in attraction. For ${sign.name}, it's ${sign.slug === 'aries' ? 'the thrill of not being certain they have you' : sign.slug === 'taurus' ? 'the feeling of comfort and quality you create around them' : sign.slug === 'gemini' ? 'the sense that you\'ll never be fully predictable' : sign.slug === 'cancer' ? 'feeling emotionally safe without having to ask for it' : sign.slug === 'leo' ? 'genuine appreciation paired with your own confident presence' : sign.slug === 'virgo' ? 'demonstrated reliability and real competence' : sign.slug === 'libra' ? 'beauty, social grace, and the feeling that everything is easier with you' : sign.slug === 'scorpio' ? 'depth, honesty, and psychological resilience' : sign.slug === 'sagittarius' ? 'the sense that choosing you means more freedom, not less' : sign.slug === 'capricorn' ? 'evidence that you\'re building something real and you keep your word' : sign.slug === 'aquarius' ? 'genuine intellectual originality and full independence' : 'emotional resonance and the feeling of being truly seen'}. Lead with that and you're halfway there.</p>
      </div>
    </div>

    <div class="section">
      <h2>What Kills ${sign.name}'s Interest</h2>
      <p>${d.kills}</p>
      <p>${d.kills2}</p>
    </div>

    <div class="div">&#10038;&ensp;&#10038;&ensp;&#10038;</div>

    <div class="section">
      <h2>How to Text a ${sign.name} You Like</h2>
      <p>${d.texting}</p>

      <div class="pull-quote">The goal with ${sign.name} is never to seem desperate. It's to seem genuinely interested while also being genuinely fine on your own.</div>
    </div>

${emailCta(`fw1_${sign.slug}`, `fw2_${sign.slug}`, sign.name)}

    <div class="section">
      <h2>Playing the Long Game with ${sign.name}</h2>
      <p>${d.longGame}</p>
      <p>It also helps to understand how <a href="/signs/${sign.slug}-in-love">${sign.name} behaves when they're in love</a> — because that's the state you're trying to trigger. Their love behaviors are usually an amplified version of their attraction behaviors. Once you see them moving in that direction, you'll know the groundwork is working.</p>
    </div>

    <div class="section">
      <h2>What Not to Do</h2>
      <p>${d.notDo}</p>

      <div class="highlight-box">
        <div class="hb-label">The pattern to avoid</div>
        <p>Most people who fail to attract ${sign.name} make the same mistake: they optimize for what they think ${sign.name} wants instead of being genuinely themselves. ${sign.name} can detect inauthenticity almost instantly. The best move is to be the best, most real version of yourself and let ${sign.name} decide if that's their person. It works more reliably than any strategy.</p>
      </div>
    </div>

    <div class="section">
      <h2>When You Know It's Working</h2>
      <p>You'll know a ${sign.name} is genuinely interested when they ${sign.slug === 'aries' ? 'start initiating contact and creating reasons to see you' : sign.slug === 'taurus' ? 'start including you in their routines and making space in their carefully managed schedule' : sign.slug === 'gemini' ? 'text you unprompted about something they thought you\'d find interesting' : sign.slug === 'cancer' ? 'open up about something personal and ask your opinion on things that matter to them' : sign.slug === 'leo' ? 'introduce you to their inner circle and publicly claim you with obvious pride' : sign.slug === 'virgo' ? 'do something helpful for you without being asked and start trusting you with real information about their life' : sign.slug === 'libra' ? 'start asking for your opinion on things and find reasons to spend time near you specifically' : sign.slug === 'scorpio' ? 'share something real about themselves, ask probing questions about you, and start creating private jokes' : sign.slug === 'sagittarius' ? 'start suggesting adventures that include you and talk about future plans as if you\'re part of them' : sign.slug === 'capricorn' ? 'make time for you in a schedule that doesn\'t have much of it and start keeping track of things you\'ve mentioned' : sign.slug === 'aquarius' ? 'start treating you as a real intellectual equal, sharing their actual opinions, and showing up consistently in your world' : 'become dreamy and attentive in conversation, remember emotional details you\'ve shared, and start creating a world of references just for you'}. These aren't accidents. They're the signs.</p>
      <p>Check out our full guide on <a href="/signs/how-to-tell-if-${sign.slug}-likes-you">how to tell if ${sign.name} likes you</a> for the more specific signals — because this sign in particular has tells that you might miss if you're not watching for them.</p>
    </div>

${bottomCta(`fw3_${sign.slug}`, sign.name)}
  </article>

  <div class="faq-section">
    <h2>Frequently Asked Questions</h2>
    ${d.faq.map(f => `<div class="faq-item"><h3>${f.q}</h3><p>${f.a}</p></div>`).join('\n    ')}
  </div>

  <div class="keep-reading">
    <p class="keep-reading-label">Keep Reading</p>
    <h2 class="keep-reading-title">More on ${sign.name}</h2>
    <div class="keep-reading-grid">
      ${d.related.map(r => `<a href="${r.href}">${r.text}</a>`).join('\n      ')}
    </div>
  </div>

  <footer class="foot">
    <a href="/signs/${sign.slug}">${sign.name}</a> &ensp;&middot;&ensp; <a href="/signs/">All Signs</a> &ensp;&middot;&ensp; <a href="/">Sign Season</a> &ensp;&middot;&ensp; <a href="/privacy">Privacy</a> &ensp;&middot;&ensp; <a href="/terms">Terms</a> &ensp;&middot;&ensp; <a href="/disclosure">Disclosure</a>
    <p style="margin-top:10px;font-family:Georgia,serif;font-size:0.75rem;font-style:italic;color:rgba(201,173,111,0.35);">written by Stella</p>
  </footer>

${FOOTER_JS}
</body>
</html>`;
}

// ─── WRITE FILES ──────────────────────────────────────────────────────────────

const outDir = path.join(__dirname, '../signs');

let count = 0;
for (const sign of SIGNS) {
  // Vertical 1: How to Attract
  const attractHtml = generateAttract(sign);
  const attractFile = path.join(outDir, `how-to-attract-${sign.slug}.html`);
  fs.writeFileSync(attractFile, attractHtml);
  console.log(`✓ how-to-attract-${sign.slug}.html`);
  count++;
}

console.log(`\nDone. Generated ${count} pages.`);
