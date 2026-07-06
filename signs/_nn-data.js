// North Node content data for all 12 signs
const { buildPage } = require('./_generate');
const fs = require('fs');
const path = require('path');

const signs = [
  {
    sign: 'aries', Sign: 'Aries', opposite: 'Libra',
    tagline: 'Your soul came here to stop asking for permission and start leading.',
    mission: 'independence, self-advocacy, and courage',
    shadow: 'codependency, people-pleasing, and chronic indecision',
    celebs: [
      { name: 'Leonardo DiCaprio', note: 'built an entire career on fearless creative choices and environmental advocacy that required standing alone' },
      { name: 'Beyonce', note: 'the ultimate example of self-authorization, from Destiny\'s Child consensus to a solo brand that answers to no one' },
      { name: 'Steve Jobs', note: 'relentlessly pursued his individual vision even when the entire industry told him he was wrong' }
    ],
    faqs: [
      { q: 'What does North Node in Aries mean?', a: 'North Node in Aries means your soul is learning to prioritize yourself, develop courage, and take independent action. Your past-life patterns (South Node in Libra) involved excessive compromise and defining yourself through relationships. This lifetime is about discovering who you are when you stop asking everyone else first.' },
      { q: 'What is the South Node in Libra shadow?', a: 'South Node in Libra shows up as chronic people-pleasing, inability to make decisions without consensus, and defining your worth through partnership. You may find yourself automatically deferring to others, avoiding conflict at all costs, and losing track of your own desires in the process of keeping everyone else comfortable.' },
      { q: 'How do I work with my North Node in Aries?', a: 'Practice saying what you want without polling the group first. Take action before you feel ready. Pursue goals that serve your individual growth even if they make others uncomfortable. Start things. Be first. Get comfortable with the discomfort of prioritizing yourself.' },
      { q: 'What careers suit North Node in Aries?', a: 'Entrepreneurship, athletics, leadership roles, emergency services, anything that requires decisive individual action. Roles where you set the direction rather than following consensus. The key is choosing work that requires you to trust your own instincts and act on them.' }
    ]
  },
  {
    sign: 'taurus', Sign: 'Taurus', opposite: 'Scorpio',
    tagline: 'Your soul came here to build something real and learn to stay in your body.',
    mission: 'stability, groundedness, and embodied presence',
    shadow: 'intensity addiction, crisis-seeking, and emotional extremes',
    celebs: [
      { name: 'Oprah Winfrey', note: 'transformed from survival mode into a media empire built on stability, abundance, and tangible impact' },
      { name: 'Albert Einstein', note: 'channeled his revolutionary insights into sustained, patient scientific work that required methodical building' },
      { name: 'Bob Dylan', note: 'despite his revolutionary spirit, built a body of work through patient, consistent creative output over decades' }
    ],
    faqs: [
      { q: 'What does North Node in Taurus mean?', a: 'North Node in Taurus means your soul is learning to value stability, simplicity, and the physical world. Your South Node in Scorpio gave you comfort with intensity and crisis, but this lifetime asks you to find peace in the ordinary and build something lasting rather than constantly transforming.' },
      { q: 'What is the South Node in Scorpio shadow?', a: 'South Node in Scorpio shows up as addiction to drama, intensity, and emotional extremes. You may unconsciously create crisis because calm feels boring or suspicious. You might be drawn to power dynamics, obsessive attachments, and the belief that everything needs to be deep and transformative all the time.' },
      { q: 'How do I work with my North Node in Taurus?', a: 'Practice being still. Build routines. Invest in your physical environment. Cook a meal slowly. Garden. Save money. Choose the steady path over the dramatic one. Learn to find richness in simplicity rather than only in extremes.' },
      { q: 'What careers suit North Node in Taurus?', a: 'Finance, agriculture, culinary arts, physical therapy, music, anything that involves building tangible value over time. Careers that reward patience and consistency rather than crisis management or emotional intensity.' }
    ]
  },
  {
    sign: 'gemini', Sign: 'Gemini', opposite: 'Sagittarius',
    tagline: 'Your soul came here to ask questions instead of preaching answers.',
    mission: 'curiosity, flexibility, and genuine listening',
    shadow: 'rigid belief systems, self-righteousness, and the need to be right',
    celebs: [
      { name: 'Barack Obama', note: 'succeeded through communication, bridge-building, and the ability to hold multiple perspectives simultaneously' },
      { name: 'Meryl Streep', note: 'built her career on the ability to inhabit completely different perspectives and voices' },
      { name: 'Pablo Picasso', note: 'reinvented his artistic approach repeatedly, always curious about new forms of expression' }
    ],
    faqs: [
      { q: 'What does North Node in Gemini mean?', a: 'North Node in Gemini means your soul is learning to be curious, flexible, and open to multiple perspectives. Your South Node in Sagittarius gave you strong convictions, but this lifetime asks you to listen more than you lecture and to gather information before forming conclusions.' },
      { q: 'What is the South Node in Sagittarius shadow?', a: 'South Node in Sagittarius manifests as intellectual arrogance, the belief that your worldview is the correct one, and a tendency to preach rather than listen. You may dismiss details as unimportant, avoid local engagement in favor of big-picture thinking, and struggle to stay present in everyday interactions.' },
      { q: 'How do I work with my North Node in Gemini?', a: 'Practice genuine curiosity. Ask questions you don\'t already know the answer to. Read widely. Talk to people who disagree with you and actually listen. Stay local. Pay attention to the details and the small conversations that hold surprising wisdom.' },
      { q: 'What careers suit North Node in Gemini?', a: 'Writing, journalism, teaching, communications, marketing, social media, translation. Any role that requires gathering and sharing information, facilitating dialogue, and connecting different perspectives rather than promoting a single truth.' }
    ]
  },
  {
    sign: 'cancer', Sign: 'Cancer', opposite: 'Capricorn',
    tagline: 'Your soul came here to feel everything it spent lifetimes avoiding.',
    mission: 'emotional intimacy, vulnerability, and creating genuine home',
    shadow: 'workaholism, emotional suppression, and hiding behind achievement',
    celebs: [
      { name: 'Princess Diana', note: 'broke through the cold institutional walls of the monarchy to lead with emotional authenticity and genuine care' },
      { name: 'John Lennon', note: 'evolved from a tough, competitive persona to publicly embracing vulnerability, peace, and domestic life' },
      { name: 'Frida Kahlo', note: 'channeled profound emotional and physical pain into art that was unapologetically intimate and personal' }
    ],
    faqs: [
      { q: 'What does North Node in Cancer mean?', a: 'North Node in Cancer means your soul is learning to prioritize emotional connection, family, and the creation of genuine safety. Your South Node in Capricorn gave you professional competence, but this lifetime asks you to build your inner home with as much care as you build your career.' },
      { q: 'What is the South Node in Capricorn shadow?', a: 'South Node in Capricorn shows up as hiding behind work, using achievement as a substitute for emotional connection, and believing that vulnerability is weakness. You may prioritize status over intimacy and struggle to let people see you without your professional armor on.' },
      { q: 'How do I work with my North Node in Cancer?', a: 'Practice receiving care. Create a home that nourishes you. Let people in emotionally. Cook for people. Spend time with family or chosen family. Allow yourself to need things from the people you love rather than always being the strong, self-sufficient one.' },
      { q: 'What careers suit North Node in Cancer?', a: 'Counseling, social work, childcare, food industry, interior design, real estate, healthcare. Roles where emotional attunement and nurturing are assets rather than liabilities. Work that allows you to care for people as your primary contribution.' }
    ]
  },
  {
    sign: 'leo', Sign: 'Leo', opposite: 'Aquarius',
    tagline: 'Your soul came here to stop hiding in the crowd and start shining on its own.',
    mission: 'self-expression, creative joy, and the courage to be seen',
    shadow: 'hiding behind the group, emotional detachment, and fear of standing out',
    celebs: [
      { name: 'Marilyn Monroe', note: 'stepped out of anonymity into a spotlight that demanded she own her individual magnetism completely' },
      { name: 'Taylor Swift', note: 'repeatedly chose personal creative expression over industry convention, making her individual story the art' },
      { name: 'Vincent van Gogh', note: 'pursued his unique artistic vision with total commitment despite receiving almost no recognition during his lifetime' }
    ],
    faqs: [
      { q: 'What does North Node in Leo mean?', a: 'North Node in Leo means your soul is learning to express itself, create from the heart, and accept being seen as an individual. Your South Node in Aquarius gave you comfort in groups and causes, but this lifetime asks you to step forward as yourself, not as a representative of something larger.' },
      { q: 'What is the South Node in Aquarius shadow?', a: 'South Node in Aquarius shows up as hiding behind groups, causes, or collective identity to avoid individual visibility. You may intellectualize your feelings, detach when things get personal, and feel safer being one of many than standing alone as someone who can be seen and judged.' },
      { q: 'How do I work with my North Node in Leo?', a: 'Create things. Perform. Put your name on your work. Take credit when you deserve it. Express your emotions rather than analyzing them. Let people celebrate you. Practice being the center of attention without deflecting.' },
      { q: 'What careers suit North Node in Leo?', a: 'Performing arts, creative direction, leadership, entrepreneurship, teaching with personal flair, entertainment, coaching. Any role where your individual presence and creative expression are the value you bring.' }
    ]
  },
  {
    sign: 'virgo', Sign: 'Virgo', opposite: 'Pisces',
    tagline: 'Your soul came here to be useful, not just inspired.',
    mission: 'practical service, discernment, and meaningful daily contribution',
    shadow: 'escapism, martyrdom, and avoiding the practical details of life',
    celebs: [
      { name: 'Mother Teresa', note: 'channeled spiritual devotion into concrete, practical daily service to the most vulnerable' },
      { name: 'Warren Buffett', note: 'applied meticulous analysis and disciplined process to create extraordinary results over decades' },
      { name: 'Serena Williams', note: 'combined natural talent with relentless technical refinement and disciplined practice' }
    ],
    faqs: [
      { q: 'What does North Node in Virgo mean?', a: 'North Node in Virgo means your soul is learning to be practical, discerning, and of genuine service. Your South Node in Pisces gave you spiritual sensitivity and creative imagination, but this lifetime asks you to ground those gifts in real, useful work that makes a tangible difference.' },
      { q: 'What is the South Node in Pisces shadow?', a: 'South Node in Pisces shows up as escapism, addiction, boundary issues, and the belief that being inspired is the same as being productive. You may avoid practical responsibilities, lose yourself in fantasy or substances, and struggle with the mundane requirements of daily life.' },
      { q: 'How do I work with my North Node in Virgo?', a: 'Develop systems. Clean your space. Build healthy routines. Focus on the details. Choose practical contribution over inspiration without action. Learn a craft. Be useful in specific, measurable ways rather than offering vague spiritual support.' },
      { q: 'What careers suit North Node in Virgo?', a: 'Healthcare, data analysis, editing, nutrition, veterinary work, quality assurance, accounting, organizing. Roles that require attention to detail, practical skill, and measurable contribution to improving something specific.' }
    ]
  },
  {
    sign: 'libra', Sign: 'Libra', opposite: 'Aries',
    tagline: 'Your soul came here to learn that partnership isn\'t weakness, it\'s the assignment.',
    mission: 'partnership, fairness, and genuine consideration of others',
    shadow: 'excessive self-focus, impulsiveness, and bulldozing through without considering impact',
    celebs: [
      { name: 'Martin Luther King Jr.', note: 'channeled his passion into collaborative, partnership-based movements built on justice and collective action' },
      { name: 'Ruth Bader Ginsburg', note: 'devoted her career to fairness, balance, and creating systemic equity through partnership with the law' },
      { name: 'Amal Clooney', note: 'built a career on international justice, diplomacy, and representing the interests of those who need a voice' }
    ],
    faqs: [
      { q: 'What does North Node in Libra mean?', a: 'North Node in Libra means your soul is learning to partner, compromise, and consider others as genuinely as you consider yourself. Your South Node in Aries gave you independence and self-reliance, but this lifetime asks you to develop the ability to share power, listen to others, and build something together.' },
      { q: 'What is the South Node in Aries shadow?', a: 'South Node in Aries shows up as selfishness disguised as independence, impulsive action without considering consequences for others, and the belief that going it alone is always better. You may struggle to compromise, listen to feedback, or share decision-making genuinely.' },
      { q: 'How do I work with my North Node in Libra?', a: 'Practice genuine compromise. Ask others what they think and actually incorporate their input. Learn to negotiate rather than dictate. Develop patience with collaborative processes. Choose partnership even when solo action feels faster.' },
      { q: 'What careers suit North Node in Libra?', a: 'Law, mediation, diplomacy, counseling, design, art curation, wedding planning, HR. Roles that require balancing multiple perspectives, creating harmony, and working with others toward shared beautiful outcomes.' }
    ]
  },
  {
    sign: 'scorpio', Sign: 'Scorpio', opposite: 'Taurus',
    tagline: 'Your soul came here to go deep, even when staying comfortable would be easier.',
    mission: 'depth, emotional honesty, and transformative intimacy',
    shadow: 'comfort addiction, resistance to change, and material attachment',
    celebs: [
      { name: 'Nelson Mandela', note: 'underwent profound personal transformation through decades of imprisonment and emerged to transform an entire nation' },
      { name: 'Sigmund Freud', note: 'dedicated his life to exploring the hidden depths of the human psyche despite enormous professional resistance' },
      { name: 'Marie Curie', note: 'pursued transformative scientific discovery at great personal cost, literally changing our understanding of matter' }
    ],
    faqs: [
      { q: 'What does North Node in Scorpio mean?', a: 'North Node in Scorpio means your soul is learning to embrace depth, transformation, and genuine intimacy. Your South Node in Taurus gave you comfort in the material world, but this lifetime asks you to go beyond surface security and engage with the things that scare you.' },
      { q: 'What is the South Node in Taurus shadow?', a: 'South Node in Taurus shows up as clinging to comfort, accumulating possessions as security, resisting change because it threatens stability, and staying in situations that have stopped serving you because leaving feels too disruptive.' },
      { q: 'How do I work with my North Node in Scorpio?', a: 'Practice letting go. Give away things you don\'t need. Have the hard conversations. Go to therapy. Look at the parts of yourself you\'ve been avoiding. Allow transformation even when it means losing something comfortable.' },
      { q: 'What careers suit North Node in Scorpio?', a: 'Psychology, research, investigative journalism, surgery, financial management, crisis counseling, hospice work. Roles that require going beneath the surface, handling intensity, and facilitating transformation.' }
    ]
  },
  {
    sign: 'sagittarius', Sign: 'Sagittarius', opposite: 'Gemini',
    tagline: 'Your soul came here to believe in something bigger than the data.',
    mission: 'faith, philosophical expansion, and the courage to commit to a vision',
    shadow: 'overthinking, information hoarding, and avoiding belief',
    celebs: [
      { name: 'Walt Disney', note: 'turned a grand vision into an empire by believing in something that seemed impossible to everyone around him' },
      { name: 'Winston Churchill', note: 'led through conviction and philosophical clarity when the facts alone would have suggested surrender' },
      { name: 'Tina Turner', note: 'reinvented herself through spiritual practice, traveling from survival into genuine philosophical understanding' }
    ],
    faqs: [
      { q: 'What does North Node in Sagittarius mean?', a: 'North Node in Sagittarius means your soul is learning to see the big picture, develop a personal philosophy, and take leaps of faith. Your South Node in Gemini gave you mental agility and information-gathering skills, but this lifetime asks you to synthesize that information into wisdom and act on it.' },
      { q: 'What is the South Node in Gemini shadow?', a: 'South Node in Gemini shows up as overthinking, analysis paralysis, gossip, scattered attention, and the inability to commit to a single direction. You may gather information endlessly without ever forming a conclusion or taking a meaningful stand.' },
      { q: 'How do I work with my North Node in Sagittarius?', a: 'Travel. Study philosophy or religion. Commit to a big vision even when you can\'t see all the steps. Stop researching and start experiencing. Develop opinions and defend them. Choose depth of understanding over breadth of information.' },
      { q: 'What careers suit North Node in Sagittarius?', a: 'Education, publishing, travel industry, ministry, philosophy, international relations, coaching. Roles that require big-picture thinking, teaching from experience, and inspiring others toward growth.' }
    ]
  },
  {
    sign: 'capricorn', Sign: 'Capricorn', opposite: 'Cancer',
    tagline: 'Your soul came here to build something that outlasts your feelings about it.',
    mission: 'ambition, integrity, and mature responsibility',
    shadow: 'emotional avoidance of responsibility, hiding in family dynamics, and fear of public accountability',
    celebs: [
      { name: 'Abraham Lincoln', note: 'rose from humble emotional origins to shoulder the heaviest public responsibility in American history' },
      { name: 'Angela Merkel', note: 'led through steady, disciplined governance rather than emotional appeal, building structures that endured' },
      { name: 'Jeff Bezos', note: 'built one of the largest enterprises in history through relentless long-term ambition and structural thinking' }
    ],
    faqs: [
      { q: 'What does North Node in Capricorn mean?', a: 'North Node in Capricorn means your soul is learning to take responsibility, build lasting structures, and earn authority through integrity. Your South Node in Cancer gave you emotional depth and family orientation, but this lifetime asks you to step into the public world and be accountable for something bigger.' },
      { q: 'What is the South Node in Cancer shadow?', a: 'South Node in Cancer shows up as using emotional needs or family obligations to avoid professional responsibility. You may retreat into domestic comfort when challenged, use caretaking as an excuse to avoid your own ambitions, or rely on emotional manipulation when direct authority would serve better.' },
      { q: 'How do I work with my North Node in Capricorn?', a: 'Set long-term goals and work toward them consistently. Take on leadership roles. Hold yourself accountable publicly. Build something you can point to. Step out of the emotional safety of home and family into the structured challenge of career and public contribution.' },
      { q: 'What careers suit North Node in Capricorn?', a: 'Executive leadership, government, law, architecture, engineering, finance, project management. Roles that require long-term planning, public accountability, and the ability to build systems that work beyond personal emotional investment.' }
    ]
  },
  {
    sign: 'aquarius', Sign: 'Aquarius', opposite: 'Leo',
    tagline: 'Your soul came here to serve the collective, not just the spotlight.',
    mission: 'innovation, community contribution, and thinking beyond the self',
    shadow: 'ego attachment, need for personal recognition, and creative self-absorption',
    celebs: [
      { name: 'Nikola Tesla', note: 'prioritized innovation for humanity over personal fame and fortune, living the Aquarian ideal of collective service' },
      { name: 'Malala Yousafzai', note: 'channeled personal courage into a movement that served millions, making her individual story a vehicle for collective change' },
      { name: 'Elon Musk', note: 'directs his ambitions toward collective-scale problems like sustainable energy and space exploration rather than personal comfort' }
    ],
    faqs: [
      { q: 'What does North Node in Aquarius mean?', a: 'North Node in Aquarius means your soul is learning to contribute to the collective, innovate for the greater good, and release the need for personal recognition. Your South Node in Leo gave you creative confidence, but this lifetime asks you to use that confidence in service of something larger than yourself.' },
      { q: 'What is the South Node in Leo shadow?', a: 'South Node in Leo shows up as needing to be the star, taking things personally that are not personal, and struggling to let others shine. You may unconsciously dominate group settings, require constant admiration, and feel threatened when attention goes to someone else.' },
      { q: 'How do I work with my North Node in Aquarius?', a: 'Join groups and contribute without needing to lead. Support other people\'s projects. Think about systemic solutions rather than personal ones. Practice anonymity. Contribute to causes where the work matters more than who gets credit.' },
      { q: 'What careers suit North Node in Aquarius?', a: 'Technology, social enterprise, nonprofit leadership, science, community organizing, activism, systems design. Roles where the impact is collective and the innovation serves something beyond individual recognition.' }
    ]
  },
  {
    sign: 'pisces', Sign: 'Pisces', opposite: 'Virgo',
    tagline: 'Your soul came here to surrender the clipboard and trust the current.',
    mission: 'surrender, compassion, and spiritual trust',
    shadow: 'over-control, perfectionism, and the belief that being useful earns love',
    celebs: [
      { name: 'George Harrison', note: 'moved from the structured world of the Beatles into spiritual exploration, meditation, and devotional art' },
      { name: 'Rumi', note: 'the ultimate example of surrendering intellectual control in favor of divine love and poetic spiritual expression' },
      { name: 'Billie Holiday', note: 'channeled raw emotional and spiritual experience into art that transcended technical perfection' }
    ],
    faqs: [
      { q: 'What does North Node in Pisces mean?', a: 'North Node in Pisces means your soul is learning to trust, surrender, and find meaning beyond practical utility. Your South Node in Virgo gave you analytical ability and a strong work ethic, but this lifetime asks you to let go of control and open to the mystery, beauty, and compassion that exist beyond what you can measure.' },
      { q: 'What is the South Node in Virgo shadow?', a: 'South Node in Virgo shows up as compulsive organizing, using productivity as a coping mechanism, criticizing yourself and others relentlessly, and believing that you must be useful to be worthy of love. You may struggle to rest, to receive, and to trust anything you cannot analyze.' },
      { q: 'How do I work with my North Node in Pisces?', a: 'Practice meditation. Make art without purpose. Sit with emotions without trying to fix them. Spend time near water. Develop a spiritual practice. Let things be imperfect. Trust your intuition even when it contradicts your analysis. Learn to receive without earning it.' },
      { q: 'What careers suit North Node in Pisces?', a: 'Art, music, spiritual counseling, hospice care, film, photography, healing arts, marine biology. Roles that require surrender to something larger, creative intuition, and the ability to hold space for mystery rather than resolving it.' }
    ]
  }
];

// Generate all North Node pages
for (const s of signs) {
  const data = {
    title: `North Node in ${s.Sign}: Your Soul's True Direction`,
    desc: `North Node in ${s.Sign} points toward ${s.mission}. Here's what your soul is actually trying to learn this lifetime and what you need to leave behind.`,
    canonical: `https://signseason.com/signs/north-node-in-${s.sign}`,
    breadcrumbName: `North Node in ${s.Sign}`,
    tagline: s.tagline,
    ctaId: `nn_${s.sign}`,
    footSign: s.sign,
    sections: [
      {
        heading: 'What the North Node Actually Is',
        paragraphs: [
          'The North Node isn\'t a planet. It\'s a mathematical point where the Moon\'s orbit crosses the ecliptic, the apparent path of the Sun across the sky. In astrology, it represents your soul\'s growth direction: the qualities, experiences, and ways of being that you\'re here to develop in this lifetime. It\'s not where you\'re comfortable. It\'s where you\'re headed.',
          'The South Node sits directly opposite the North Node and represents what you already know, the skills, patterns, and comfort zones you brought into this life. Think of the South Node as your default setting and the North Node as the upgrade you\'re working toward. The South Node isn\'t bad, but staying there exclusively means you\'re not growing. The North Node isn\'t easy, but moving toward it is the whole point.',
          'Most people spend their twenties operating almost entirely from their South Node. It feels natural, it works well enough, and it doesn\'t require them to stretch. Then somewhere around the Saturn return, the North Node starts calling louder. The things that used to work stop working. The comfort zone starts feeling like a trap. That discomfort is the growth signal, and learning to follow it rather than retreat from it is the central task of the North Node.'
        ],
        highlight: { label: 'The key insight', text: 'Your North Node isn\'t about becoming someone different. It\'s about becoming someone more complete. The South Node skills don\'t disappear. They get integrated into a larger, more balanced version of who you\'re becoming.' }
      },
      {
        heading: `North Node in ${s.Sign}: The Core Mission`,
        paragraphs: [
          `North Node in ${s.Sign} is learning ${s.mission}. This doesn't come naturally to you. In fact, it might feel actively uncomfortable when you first encounter it. That discomfort is the signal that you're moving in the right direction. Your soul chose this placement because these are the qualities that will make your life genuinely meaningful, not just functional.`,
          `The people, situations, and opportunities that keep showing up in your life are trying to teach you this lesson. When you look at the recurring themes of your experience, the challenges that won't go away, the desires that won't quiet down, they almost always point toward your North Node. ${s.Sign} energy is what your soul is reaching for, even when your personality resists it.`,
          `Living your North Node in ${s.Sign} doesn't mean abandoning everything you know. It means building on your existing strengths while developing new capacities. The goal is integration: bringing the wisdom of your South Node into the service of your North Node direction. When this clicks, your life starts to feel aligned in a way that's hard to describe but unmistakable when you experience it.`
        ],
        pullQuote: `North Node in ${s.Sign} isn't about perfecting these qualities. It's about having the courage to practice them when everything inside you wants to default to what's familiar.`
      },
      {
        heading: `The South Node Shadow (What You're Leaving Behind)`,
        paragraphs: [
          `Your South Node in ${s.opposite} represents ${s.shadow}. These aren't character flaws. They're overdeveloped strengths. You were so good at ${s.opposite} energy in past lives, or earlier in this one, that you defaulted to it as your primary operating system. The problem isn't that you have these skills. The problem is that relying on them exclusively prevents you from growing.`,
          `The South Node shadow shows up most clearly in moments of stress. When things get difficult, you instinctively reach for ${s.opposite} patterns because they feel safe and familiar. But the relief is temporary. The same patterns that once served you are now the exact things holding you back from the life your North Node is pointing toward.`,
          `Releasing the South Node shadow doesn't mean rejecting it entirely. Some of the healthiest people with this nodal axis learn to use their ${s.opposite} skills consciously and strategically while keeping their primary direction pointed toward ${s.Sign}. The goal is choice rather than compulsion. You want to use your South Node tools when they serve you, not default to them because you're afraid of the alternative.`
        ]
      },
      {
        heading: 'How This Node Shows Up in Real Life',
        paragraphs: [
          `In relationships, North Node in ${s.Sign} often manifests as being drawn to partners who embody ${s.Sign} qualities. You might find yourself attracted to people who have what you're developing. This isn't just attraction. It's your soul recognizing the energy it needs to integrate. The healthiest version of this pattern is using those relationships as mirrors for your own growth rather than outsourcing the ${s.Sign} energy to someone else.`,
          `Career-wise, North Node in ${s.Sign} people often feel pulled between what they're good at (South Node skills) and what calls to them (North Node direction). The tension is real and it's productive. The career that ultimately satisfies you will require you to stretch into your North Node territory, even if your South Node skills got you in the door.`,
          `The nodal axis also shows up in your relationship with fear. The things you're most afraid of attempting are usually North Node activities. The fear isn't a stop sign. It's a compass. When you feel the specific resistance that comes from being asked to operate in your North Node sign, that resistance is worth examining rather than obeying.`,
          `Many people with North Node in ${s.Sign} report that their lives divided into "before" and "after" once they started consciously working with their node. The shift isn't always dramatic from the outside, but internally, the sense of alignment is transformative. Things stop feeling like they're working against you and start feeling like they're working with you.`
        ]
      },
      {
        heading: 'The Challenges of This North Node',
        paragraphs: [
          `The biggest challenge of North Node in ${s.Sign} is that ${s.Sign} energy feels genuinely foreign to you. It's not just uncomfortable, it can feel like you're pretending when you first practice it. The person who has been defaulting to ${s.opposite} patterns their whole life doesn't suddenly wake up as a natural ${s.Sign}. The development is gradual, awkward, and sometimes humbling. That's normal and that's the process.`,
          `External validation can work against you. The world around you may reward your South Node behavior because it's polished and effective. People who know you may actively resist your growth because they're used to the version of you that operates from ${s.opposite}. Moving toward your North Node sometimes means disappointing the people who are comfortable with who you've been.`,
          `The nodal return, which happens approximately every 18.6 years, can bring major life events that push you toward your North Node. These periods (around ages 18-19, 37-38, 56-57) often involve circumstances that make it impossible to stay in your South Node comfort zone. They can feel disruptive at the time but usually prove to be pivotal growth moments when viewed in retrospect.`
        ]
      },
      {
        heading: `Famous People with North Node in ${s.Sign}`,
        paragraphs: [
          ...s.celebs.map(c => `<strong>${c.name}</strong> is a compelling example of this nodal axis. ${c.name} ${c.note}. The North Node in ${s.Sign} energy is visible in how they channeled their gifts toward ${s.mission}.`),
          `These examples illustrate that working with your North Node doesn't mean becoming someone entirely different. It means finding the specific way that ${s.Sign} energy can serve your unique path and having the courage to follow it even when the ${s.opposite} default feels safer and more familiar.`
        ]
      }
    ],
    faqs: s.faqs,
    keepReading: {
      title: `More on ${s.Sign}`,
      links: [
        { href: `/signs/${s.sign}`, text: `${s.Sign} Overview` },
        { href: `/signs/${s.sign}-strengths`, text: `${s.Sign} Strengths` },
        { href: `/chart`, text: 'Your Birth Chart' },
        { href: `/signs/venus-in-${s.sign}`, text: `Venus in ${s.Sign}` }
      ]
    }
  };

  const html = buildPage(data);
  const filePath = path.join(__dirname, `north-node-in-${s.sign}.html`);
  fs.writeFileSync(filePath, html);
  console.log(`wrote ${filePath} (${html.length} bytes)`);
}

console.log('All 12 North Node pages generated.');
