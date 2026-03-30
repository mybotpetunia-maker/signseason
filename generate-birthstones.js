const fs = require('fs');
const path = require('path');

const months = [
  {
    month: 'January', slug: 'january-birthstone',
    title: 'January Birthstone: Garnet Meaning and Uses',
    desc: 'January birthstone garnet brings protection, passion, and grounding energy. Discover garnet healing properties, zodiac connections to Capricorn and Aquarius, and how to use it.',
    stones: ['Garnet'],
    signs: ['Capricorn', 'Aquarius'],
    signSlugs: ['capricorn', 'aquarius'],
    dates: 'Dec 22 - Jan 19 (Capricorn) and Jan 20 - Feb 18 (Aquarius)',
    content: `
    <h2>Garnet: The January Birthstone</h2>
    <p>Garnet is one of the oldest known gemstones, and for good reason. This deep red crystal has been worn by warriors, royalty, and healers for thousands of years. If you were born in January, garnet is your stone, and it carries a weight that matches the month itself: serious, grounding, and quietly powerful.</p>
    <p>The name comes from the Latin "granatum," meaning pomegranate, because raw garnet clusters look exactly like pomegranate seeds. Ancient Egyptians used garnet as inlays in their jewelry and carvings. Medieval travelers carried it as protection against accidents far from home. The stone has always been associated with safe passage and returning to where you belong.</p>

    <h2>Garnet and the Zodiac: Capricorn and Aquarius</h2>
    <p>January spans two zodiac signs: <a href="/signs/capricorn">Capricorn</a> (December 22 through January 19) and <a href="/signs/aquarius">Aquarius</a> (January 20 through February 18). Garnet serves both signs beautifully, though in different ways.</p>
    <p>For Capricorn, garnet amplifies their natural discipline and ambition. Capricorns already have the drive; garnet gives them the stamina to sustain it. It supports their earthly, goal-oriented nature and helps prevent the burnout that comes from relentless climbing. If you know a Capricorn who works too hard and rests too little, garnet is the stone that reminds them their body needs fuel too. Explore more in our guide to the <a href="/crystals/best-crystals-for-capricorn">best crystals for Capricorn</a>.</p>
    <p>For early Aquarius, garnet brings warmth to a sign that can sometimes live too much in their head. Aquarius energy is innovative and future-focused, but garnet grounds that electric mind in the physical world. It helps Aquarius translate big ideas into real action. See all the <a href="/crystals/best-crystals-for-aquarius">best crystals for Aquarius</a> for more options.</p>

    <h2>Healing Properties of Garnet</h2>
    <p>Garnet is primarily a root chakra stone. It anchors your energy to the earth and creates a foundation of safety and stability. When your root chakra is balanced, everything else builds from solid ground.</p>
    <p>Physically, crystal healers associate garnet with circulation and vitality. It is said to support the blood, boost metabolism, and increase overall energy. People who feel sluggish or drained often reach for garnet first. It is also connected to reproductive health and has been used in healing traditions as a stone of fertility and creative life force.</p>
    <p>Emotionally, garnet works on passion and motivation. Not the impulsive kind, but the deep, sustained fire that keeps you going when the initial excitement fades. It addresses feelings of insecurity and financial anxiety. If you are rebuilding after a loss or starting something new, garnet offers the courage to keep moving forward.</p>
    <p>Garnet also has a protective quality. It creates an energetic shield that is particularly useful for empaths or people who absorb the emotions of others. It does not block connection; it filters what comes in so you do not take on energy that is not yours.</p>

    <h2>How to Use Garnet</h2>
    <p>Wearing garnet as jewelry is the most traditional approach, and it works well. A garnet ring or pendant keeps the stone close to your body throughout the day. January-born people often find that garnet jewelry feels immediately comfortable, like it belongs.</p>
    <p>For meditation, hold a tumbled garnet in your left hand (the receiving hand) and focus on your root chakra at the base of your spine. Visualize red light growing warmer and steadier. This practice is especially helpful during winter months when energy tends to be low.</p>
    <p>Place garnet in your workspace for sustained focus and motivation. It is not a caffeine-like stimulant; it is more like a slow-burning fire that keeps your concentration steady through long tasks. Pair it with clear quartz to amplify its effects.</p>
    <p>Garnet also works beautifully in crystal grids for abundance and protection. Place it at the center of a grid with black tourmaline at the corners for a powerful grounding and shielding layout.</p>

    <h2>Caring for Your Garnet</h2>
    <p>Garnet rates between 6.5 and 7.5 on the Mohs hardness scale, making it durable enough for daily wear. Clean it with warm soapy water and a soft brush. Avoid ultrasonic cleaners, as some garnets have natural inclusions that could be affected.</p>
    <p>To energetically cleanse garnet, place it on the earth overnight or in moonlight during a full moon. Garnet responds well to earth-based cleansing because of its deep connection to the root chakra. Running water also works, but keep it brief.</p>
    `
  },
  {
    month: 'February', slug: 'february-birthstone',
    title: 'February Birthstone: Amethyst Meaning and Uses',
    desc: 'February birthstone amethyst supports intuition, calm, and spiritual growth. Learn amethyst healing properties, its connection to Aquarius and Pisces, and daily uses.',
    stones: ['Amethyst'],
    signs: ['Aquarius', 'Pisces'],
    signSlugs: ['aquarius', 'pisces'],
    dates: 'Jan 20 - Feb 18 (Aquarius) and Feb 19 - Mar 20 (Pisces)',
    content: `
    <h2>Amethyst: The February Birthstone</h2>
    <p>Amethyst is arguably the most recognized crystal in the world, and February gets to claim it. This violet quartz variety has been prized since ancient Greece, where it was believed to prevent intoxication. The name literally comes from "amethystos," meaning "not drunk." Whether or not it keeps you sober, amethyst has a long history of promoting clarity, calm, and spiritual awareness.</p>
    <p>Royal families across Europe treasured amethyst as highly as diamonds. Catherine the Great was obsessed with it. Egyptian royalty wore amethyst amulets for protection in the afterlife. Before large deposits were discovered in Brazil, amethyst was considered as precious as ruby and emerald. Its accessibility today does not diminish its power; it just means more people can benefit from it.</p>

    <h2>Amethyst and the Zodiac: Aquarius and Pisces</h2>
    <p>February bridges <a href="/signs/aquarius">Aquarius</a> (January 20 through February 18) and <a href="/signs/pisces">Pisces</a> (February 19 through March 20). Amethyst speaks the language of both signs fluently.</p>
    <p>For Aquarius, amethyst enhances their already strong intuition and helps them channel their visionary ideas without becoming scattered. Aquarius minds move fast, and amethyst acts as a focusing lens for all that mental energy. It also supports the humanitarian side of Aquarius by deepening empathy without emotional overwhelm. Find more in our <a href="/crystals/best-crystals-for-aquarius">best crystals for Aquarius</a> guide.</p>
    <p>For Pisces, amethyst is practically a soulmate stone. Pisces is already the most spiritually attuned sign in the zodiac, and amethyst amplifies that gift while providing the grounding that Pisces desperately needs. It helps Pisces set boundaries without shutting down their natural sensitivity. Our <a href="/crystals/best-crystals-for-pisces">best crystals for Pisces</a> guide covers additional stones that complement amethyst well.</p>

    <h2>Healing Properties of Amethyst</h2>
    <p>Amethyst works primarily with the third eye and crown chakras. It opens the channels of intuition and spiritual perception while maintaining a calming, protective energy. This dual action makes it one of the most versatile healing crystals available.</p>
    <p>For sleep and relaxation, amethyst is unmatched. Placing an amethyst cluster on your nightstand or under your pillow promotes restful sleep and vivid, meaningful dreams. People with insomnia or anxiety at bedtime often find relief with amethyst nearby. It calms the overthinking mind and creates a sense of peace.</p>
    <p>Emotionally, amethyst addresses grief, sadness, and emotional pain. It does not numb these feelings but helps you process them with greater clarity and acceptance. Therapists and counselors often keep amethyst in their offices for this reason. It creates an environment where difficult emotions can surface safely.</p>
    <p>Mentally, amethyst sharpens focus and supports decision-making. When you are caught between options or overwhelmed by information, amethyst helps you see through the noise to what actually matters. Students and professionals alike use it during intense study or work periods.</p>

    <h2>How to Use Amethyst</h2>
    <p>Amethyst is incredibly versatile. Wear it as jewelry for all-day spiritual protection and mental clarity. Amethyst pendants sit near the heart and throat chakras, while earrings bring the energy closer to the third eye.</p>
    <p>For meditation, amethyst is the go-to crystal. Hold it during practice or place it on your forehead while lying down. Many meditators report that amethyst helps them reach deeper states more quickly and maintain focus throughout their session.</p>
    <p>In your home, amethyst geodes and clusters serve double duty as stunning decor and energy cleansers. They purify the energy of whatever room they are in. A large amethyst geode in your living room or bedroom creates a gentle, calming atmosphere that visitors often notice without being able to name.</p>
    <p>Amethyst also pairs well with other crystals. Combine it with rose quartz for emotional healing, citrine for balanced abundance, or clear quartz for amplified intuition. It plays well with almost everything.</p>

    <h2>Caring for Your Amethyst</h2>
    <p>Amethyst is a 7 on the Mohs hardness scale, making it durable for everyday wear. However, it will fade in direct sunlight over time, so store it away from windows and do not leave it in your car. Clean with warm soapy water. Recharge under moonlight or on a selenite plate.</p>
    `
  },
  {
    month: 'March', slug: 'march-birthstone',
    title: 'March Birthstone: Aquamarine Meaning and Uses',
    desc: 'March birthstone aquamarine brings courage, clarity, and calm communication. Explore aquamarine healing properties, Pisces and Aries connections, and practical uses.',
    stones: ['Aquamarine'],
    signs: ['Pisces', 'Aries'],
    signSlugs: ['pisces', 'aries'],
    dates: 'Feb 19 - Mar 20 (Pisces) and Mar 21 - Apr 19 (Aries)',
    content: `
    <h2>Aquamarine: The March Birthstone</h2>
    <p>Aquamarine captures the color of the sea on a perfect day: clear, blue-green, and endlessly calming. This beryl family gemstone has been associated with sailors and the ocean since ancient times. Roman fishermen called it the "water of the sea" and carried it for safe voyages and abundant catches. March babies inherit this stone of courage and clarity.</p>
    <p>Beyond maritime legend, aquamarine has been used as a meditation stone for centuries. Medieval Europeans believed it could reawaken married love and was the perfect gift for brides. The stone was thought to absorb the atmosphere of young love and radiate it back whenever the wearer needed reminding.</p>

    <h2>Aquamarine and the Zodiac: Pisces and Aries</h2>
    <p>March spans <a href="/signs/pisces">Pisces</a> (February 19 through March 20) and <a href="/signs/aries">Aries</a> (March 21 through April 19). Aquamarine bridges these very different energies gracefully.</p>
    <p>For Pisces, aquamarine is a natural fit. Both are water-connected, and the stone helps Pisces communicate their deep inner world to others. Pisces feels everything but often struggles to articulate those feelings. Aquamarine opens the throat chakra, making it easier to speak emotional truths without drowning in them. See our <a href="/crystals/best-crystals-for-pisces">best crystals for Pisces</a> guide.</p>
    <p>For early Aries, aquamarine provides a cooling balance to fire sign intensity. Aries charges forward; aquamarine whispers "maybe think about this first." It does not dim Aries energy but channels it more thoughtfully. Our <a href="/crystals/best-crystals-for-aries">best crystals for Aries</a> guide has more options for balancing that fire.</p>

    <h2>Healing Properties of Aquamarine</h2>
    <p>Aquamarine resonates with the throat chakra, making it one of the best stones for communication. If you struggle with public speaking, difficult conversations, or expressing your needs, aquamarine can help you find your voice. It promotes honest, compassionate communication rather than aggressive or passive expression.</p>
    <p>Emotionally, aquamarine soothes anxiety and reduces stress. It carries the calming energy of water, which makes sense given its color and name. People going through periods of high stress or emotional turbulence find that aquamarine helps them stay centered. It is particularly useful during times of change or transition.</p>
    <p>Physically, crystal practitioners connect aquamarine to the respiratory system, throat, and immune function. It is also linked to cooling inflammation and supporting the body during allergy season, which makes perfect sense for a March birthstone as spring allergies begin.</p>
    <p>Aquamarine also supports intellectual clarity. It helps you see through confusion, cut through irrelevant information, and get to the core of complex situations. Legal professionals and writers often appreciate its clarifying energy.</p>

    <h2>How to Use Aquamarine</h2>
    <p>Wear aquamarine near your throat for maximum communication benefits. Necklaces and pendants are ideal. Aquamarine rings work well for writers and anyone who communicates primarily through their hands.</p>
    <p>For meditation, hold aquamarine while focusing on your breath. Visualize blue-green light washing through your throat and chest like gentle waves. This practice calms the nervous system remarkably fast.</p>
    <p>Keep aquamarine on your desk during meetings or presentations. Even just touching the stone before you speak can activate its throat chakra connection. Some people keep a small tumbled piece in their pocket for job interviews or difficult conversations.</p>
    <p>Aquamarine makes an excellent addition to bath rituals. Place it beside your bath (not directly in the water if it has natural fractures) and let its calming energy enhance your relaxation.</p>

    <h2>Caring for Your Aquamarine</h2>
    <p>Aquamarine is a 7.5 to 8 on the Mohs hardness scale, making it quite durable. It handles daily wear well and resists scratching. Clean with warm soapy water. Aquamarine tolerates sunlight better than amethyst, but extended direct exposure can still fade lighter specimens. Recharge under moonlight or with running water.</p>
    `
  },
  {
    month: 'April', slug: 'april-birthstone',
    title: 'April Birthstone: Diamond Meaning and Power',
    desc: 'April birthstone diamond symbolizes strength, clarity, and invincibility. Learn diamond healing properties, Aries and Taurus connections, and how to harness diamond energy.',
    stones: ['Diamond'],
    signs: ['Aries', 'Taurus'],
    signSlugs: ['aries', 'taurus'],
    dates: 'Mar 21 - Apr 19 (Aries) and Apr 20 - May 20 (Taurus)',
    content: `
    <h2>Diamond: The April Birthstone</h2>
    <p>Diamond needs no introduction, but it deserves a reintroduction beyond the engagement ring marketing. The hardest natural substance on Earth, diamond has been revered across cultures for millennia. The word comes from the Greek "adamas," meaning unconquerable. Ancient Hindus believed diamonds were created by lightning bolts striking rock. Romans thought they were splinters of fallen stars.</p>
    <p>Before the diamond industry turned them into symbols of romantic commitment, diamonds were worn by warriors and kings for protection and invincibility. They were considered so powerful that ancient people believed simply carrying a diamond could make you unconquerable in battle.</p>

    <h2>Diamond and the Zodiac: Aries and Taurus</h2>
    <p>April spans <a href="/signs/aries">Aries</a> (March 21 through April 19) and <a href="/signs/taurus">Taurus</a> (April 20 through May 20). Diamond matches both signs with striking precision.</p>
    <p>For Aries, diamond amplifies their natural courage and leadership. Aries already believes they are unstoppable; diamond makes that belief feel earned. It channels Aries fire into focused, brilliant clarity rather than scattered intensity. Find more in our <a href="/crystals/best-crystals-for-aries">best crystals for Aries</a> guide.</p>
    <p>For Taurus, diamond connects to their appreciation for lasting value and beauty. Taurus understands quality, and nothing says "built to last" like the hardest substance on Earth. Diamond helps Taurus shine publicly rather than staying comfortable in the background. Our <a href="/crystals/best-crystals-for-taurus">best crystals for Taurus</a> guide has more earthy options.</p>

    <h2>Healing Properties of Diamond</h2>
    <p>Diamond works with the crown chakra, connecting you to higher consciousness and universal truth. It is an amplifier stone, meaning it enhances the energy of everything around it, including other crystals, your intentions, and even your emotional state. This amplification works both ways, so approach diamond with clear, positive intentions.</p>
    <p>Mentally, diamond promotes clarity of thought and fearlessness. It helps you see situations with absolute honesty and act from a place of strength rather than anxiety. People making major life decisions often benefit from diamond energy: it cuts through illusion and shows you what is real.</p>
    <p>Emotionally, diamond supports courage and resilience. It does not soften difficult truths; it gives you the strength to face them. If you are going through a period that requires toughness and determination, diamond energy is your ally.</p>
    <p>Physically, crystal practitioners associate diamond with the brain, nervous system, and overall vitality. It is considered a purifying stone that supports detoxification and strengthens the body at a cellular level.</p>

    <h2>How to Use Diamond</h2>
    <p>Wearing diamond jewelry is the most accessible approach. Even small diamonds carry powerful energy. If a natural diamond is beyond your budget, Herkimer diamonds (a form of double-terminated quartz) carry similar clarity and amplification properties at a fraction of the cost.</p>
    <p>For meditation, place a diamond or Herkimer diamond at your crown chakra (top of the head) while lying down. Focus on white light streaming through the top of your head and filling your entire body. This practice enhances spiritual connection and mental clarity.</p>
    <p>In crystal grids, diamond or Herkimer diamond makes an exceptional center stone. Its amplification properties boost whatever other stones you include in the grid, making the entire layout more powerful.</p>
    <p>Diamond pairs exceptionally well with colored stones. Combine it with amethyst for amplified intuition, with garnet for amplified vitality, or with aquamarine for amplified communication.</p>

    <h2>Caring for Your Diamond</h2>
    <p>Diamond is a 10 on the Mohs hardness scale. Nothing scratches it except another diamond. However, it can chip along its cleavage planes if struck at the right angle, so treat it with respect despite its hardness. Clean with warm soapy water or a professional jewelry cleaning solution. Diamond loves sunlight and can be recharged in direct sun without fading.</p>
    `
  },
  {
    month: 'May', slug: 'may-birthstone',
    title: 'May Birthstone: Emerald Meaning and Healing',
    desc: 'May birthstone emerald is the stone of the heart, wisdom, and renewal. Discover emerald healing properties, Taurus and Gemini zodiac ties, and how to use emerald daily.',
    stones: ['Emerald'],
    signs: ['Taurus', 'Gemini'],
    signSlugs: ['taurus', 'gemini'],
    dates: 'Apr 20 - May 20 (Taurus) and May 21 - Jun 20 (Gemini)',
    content: `
    <h2>Emerald: The May Birthstone</h2>
    <p>Emerald is the stone of spring, and May is its perfect home. This green beryl variety has captivated civilizations for over 4,000 years. Cleopatra was famously obsessed with emeralds, claiming entire mines for herself. The Incas worshipped emerald as a holy stone. Aristotle wrote that emerald ownership calmed storms and prevented epilepsy.</p>
    <p>Unlike many gemstones that prize flawlessness, emeralds are expected to have inclusions. The gem trade calls them "jardin" (garden) because they look like tiny plants growing inside the stone. A perfectly clear emerald is either synthetic or worth more than a diamond of the same size. The inclusions are part of the character.</p>

    <h2>Emerald and the Zodiac: Taurus and Gemini</h2>
    <p>May bridges <a href="/signs/taurus">Taurus</a> (April 20 through May 20) and <a href="/signs/gemini">Gemini</a> (May 21 through June 20). Emerald nurtures both signs in ways they need most.</p>
    <p>For Taurus, emerald is essentially a mirror. Both are connected to spring, growth, and the physical senses. Emerald deepens Taurus's connection to nature and abundance, enhancing their natural ability to attract wealth and beauty. It also opens the heart chakra, helping stubborn Taurus express vulnerability. Check out our <a href="/crystals/best-crystals-for-taurus">best crystals for Taurus</a> guide.</p>
    <p>For Gemini, emerald grounds scattered energy and promotes coherent communication. Gemini has many thoughts competing for attention; emerald helps them focus on what matters and express it clearly. It also enhances memory, which benefits Gemini's constant information intake. See more in our <a href="/crystals/best-crystals-for-gemini">best crystals for Gemini</a> guide.</p>

    <h2>Healing Properties of Emerald</h2>
    <p>Emerald is the quintessential heart chakra stone. It opens, activates, and nurtures the heart center, promoting unconditional love, compassion, and emotional healing. If you are recovering from heartbreak or learning to love yourself, emerald is one of the most powerful allies available.</p>
    <p>Emotionally, emerald promotes unity, loyalty, and domestic bliss. It has been called the stone of successful love because it encourages partnerships that are both passionate and stable. It helps you give and receive love without losing yourself in the process.</p>
    <p>Mentally, emerald enhances memory, focus, and wisdom. Ancient scholars wore emeralds to improve their learning capacity and recall. Modern crystal practitioners use it for the same purpose. If you are studying or processing large amounts of information, emerald supports mental stamina.</p>
    <p>Physically, emerald is associated with the heart, lungs, and spine. Crystal healers use it to support recovery, boost the immune system, and promote overall vitality. Its green color connects it to growth and renewal at every level.</p>

    <h2>How to Use Emerald</h2>
    <p>Wear emerald over your heart for the most direct heart chakra activation. Pendants and brooches are ideal placements. Emerald rings are also traditional and effective, particularly on the little finger of the left hand, which is connected to the heart meridian.</p>
    <p>For meditation, hold emerald at your heart center and breathe into it. Visualize green light expanding from your chest and filling your entire body. This practice is profoundly soothing during emotional distress or relationship challenges.</p>
    <p>Place emerald in your bedroom to promote harmony in relationships. It works as a partnership stone when placed between two pillows or on a shared nightstand. In your office, emerald supports prosperity and clear thinking.</p>
    <p>Emerald pairs beautifully with rose quartz for enhanced love energy, with malachite for deeper heart healing, or with diamond for amplified wisdom.</p>

    <h2>Caring for Your Emerald</h2>
    <p>Emerald is 7.5 to 8 on the Mohs hardness scale but is more fragile than its rating suggests due to natural inclusions. Avoid ultrasonic cleaners and harsh chemicals. Clean gently with warm soapy water. Most emeralds are oil-treated to enhance clarity, so avoid exposing them to heat or solvents. Recharge under moonlight or on green moss in your garden.</p>
    `
  },
  {
    month: 'June', slug: 'june-birthstone',
    title: 'June Birthstone: Pearl and Alexandrite Guide',
    desc: 'June birthstones pearl and alexandrite offer wisdom, transformation, and balance. Learn their healing properties, Gemini and Cancer zodiac ties, and daily uses.',
    stones: ['Pearl', 'Alexandrite'],
    signs: ['Gemini', 'Cancer'],
    signSlugs: ['gemini', 'cancer'],
    dates: 'May 21 - Jun 20 (Gemini) and Jun 21 - Jul 22 (Cancer)',
    content: `
    <h2>Pearl and Alexandrite: June's Birthstones</h2>
    <p>June is one of the lucky months with two birthstones, and they could not be more different. Pearl is organic, ancient, and born from the ocean. Alexandrite is rare, color-changing, and relatively modern. Together they represent the duality that defines June: the transition from spring to summer, from Gemini's mental quicksilver to Cancer's emotional depth.</p>
    <p>Pearls have been treasured for at least 4,000 years. They are the only gemstone created by a living organism. Ancient Romans considered them the ultimate status symbol. In Persian mythology, pearls were formed from the tears of the gods. Alexandrite, discovered in 1830 in Russia's Ural Mountains, appears green in daylight and red under incandescent light, earning it the nickname "emerald by day, ruby by night."</p>

    <h2>June Birthstones and the Zodiac: Gemini and Cancer</h2>
    <p>June hosts <a href="/signs/gemini">Gemini</a> (May 21 through June 20) and <a href="/signs/cancer">Cancer</a> (June 21 through July 22). Both birthstones serve these signs powerfully.</p>
    <p>Pearl is Cancer's natural stone. Cancer is ruled by the Moon and connected to the ocean, making pearl a direct expression of Cancerian energy. It amplifies Cancer's nurturing qualities while providing emotional protection. For Gemini, pearl calms the constant mental chatter and promotes inner wisdom over external information gathering. See our <a href="/crystals/best-crystals-for-gemini">best crystals for Gemini</a> and <a href="/crystals/best-crystals-for-cancer">best crystals for Cancer</a> guides for more.</p>
    <p>Alexandrite's color-shifting nature mirrors Gemini's dual personality perfectly. It helps Gemini integrate their many sides into a coherent whole. For Cancer, alexandrite strengthens intuition and helps them trust their emotional intelligence as the powerful tool it is.</p>

    <h2>Healing Properties of Pearl</h2>
    <p>Pearl works with the sacral and crown chakras simultaneously, connecting emotional wisdom with spiritual awareness. It promotes purity, integrity, and sincerity. Pearl is fundamentally a stone of truth: it helps you be honest with yourself and others.</p>
    <p>Emotionally, pearl soothes and nurtures. It is particularly helpful during times of emotional overwhelm, grief, or transitions. New mothers often find comfort in pearl energy, which makes sense given its connection to the feminine, the moon, and the tides of emotion.</p>
    <p>Pearl also promotes self-worth and confidence without arrogance. It teaches that true beauty comes from within, from the process of transforming irritation (the grain of sand) into something luminous.</p>

    <h2>Healing Properties of Alexandrite</h2>
    <p>Alexandrite works with the heart and crown chakras, promoting transformation and adaptability. Its color-changing nature reflects its core teaching: that you can be different things in different contexts without losing your authentic self.</p>
    <p>Emotionally, alexandrite supports people going through major life changes. Job transitions, relationship shifts, relocations, and identity transformations all benefit from alexandrite's adaptive energy. It teaches that change is not loss; it is evolution.</p>
    <p>Mentally, alexandrite enhances creativity and imagination while maintaining logical thinking. It bridges the analytical and intuitive minds, making it valuable for creative professionals who need both inspiration and execution ability.</p>

    <h2>How to Use June Birthstones</h2>
    <p>Pearl jewelry is classic for a reason. A simple pearl pendant or stud earrings bring gentle, nurturing energy throughout the day. Pearl is especially powerful when worn during emotionally charged situations: family gatherings, therapy sessions, or difficult conversations.</p>
    <p>Alexandrite is rare and expensive in natural form, but lab-created alexandrite carries similar metaphysical properties. Wear it when you need to adapt to new environments or when navigating change. It is excellent for first days: new jobs, new schools, new cities.</p>
    <p>For meditation, hold pearl in your left hand and alexandrite (or a lab-created version) in your right. This creates a bridge between receptivity and transformation. Pearl receives emotional wisdom while alexandrite channels it into positive change.</p>
    <p>Keep pearl near water sources in your home (bathroom, kitchen sink) to amplify its oceanic energy. Alexandrite works best in transitional spaces like hallways and entryways.</p>

    <h2>Caring for Pearl and Alexandrite</h2>
    <p>Pearl is soft (2.5 to 4.5 on the Mohs scale) and requires careful handling. Wipe with a soft damp cloth after wearing. Apply perfume and hairspray before putting on pearls, not after. Store separately from harder gemstones. Alexandrite is much harder at 8.5 and handles daily wear well. Clean both with warm soapy water. Avoid chemicals with pearls. Recharge pearl under moonlight; alexandrite can handle sunlight.</p>
    `
  },
  {
    month: 'July', slug: 'july-birthstone',
    title: 'July Birthstone: Ruby Meaning and Power',
    desc: 'July birthstone ruby is the king of gems, bringing passion, protection, and vitality. Learn ruby healing properties, Cancer and Leo zodiac ties, and practical uses.',
    stones: ['Ruby'],
    signs: ['Cancer', 'Leo'],
    signSlugs: ['cancer', 'leo'],
    dates: 'Jun 21 - Jul 22 (Cancer) and Jul 23 - Aug 22 (Leo)',
    content: `
    <h2>Ruby: The July Birthstone</h2>
    <p>Ruby is the king of gemstones, and that is not hyperbole. For most of human history, ruby was considered the most precious stone on Earth, valued above diamonds and all other gems. Ancient Sanskrit texts called ruby "ratnaraj," literally meaning "king of precious stones." Warriors embedded rubies in their skin, believing the stones made them invincible in battle.</p>
    <p>Rubies are corundum (the same mineral family as sapphire) colored red by chromium. The finest rubies come from Myanmar's Mogok Valley, where "pigeon blood" rubies command prices exceeding those of equivalent diamonds. A ruby's red glow was once believed to come from an internal fire that could never be extinguished.</p>

    <h2>Ruby and the Zodiac: Cancer and Leo</h2>
    <p>July bridges <a href="/signs/cancer">Cancer</a> (June 21 through July 22) and <a href="/signs/leo">Leo</a> (July 23 through August 22). Ruby serves both signs in ways that match their deepest needs.</p>
    <p>For Cancer, ruby provides the boldness that this sensitive sign sometimes lacks. Cancer feels deeply and cares profoundly, but can retreat into their shell when challenged. Ruby gives Cancer the courage to stay present and fight for what they love. See our <a href="/crystals/best-crystals-for-cancer">best crystals for Cancer</a> guide.</p>
    <p>For Leo, ruby is practically their planetary stone. The Sun rules Leo, and ruby carries solar energy in crystallized form. It amplifies Leo's natural charisma, leadership, and creative fire. Ruby helps Leo shine without burning out. Explore more in our <a href="/crystals/best-crystals-for-leo">best crystals for Leo</a> guide.</p>

    <h2>Healing Properties of Ruby</h2>
    <p>Ruby activates the root and heart chakras simultaneously, creating a powerful connection between physical vitality and emotional passion. This dual activation makes ruby one of the most energizing crystals available. It does not just give you energy; it gives you passionate, purposeful energy.</p>
    <p>Emotionally, ruby ignites courage, confidence, and joy. It addresses lethargy, apathy, and lack of motivation at their roots. If you have been going through the motions without feeling alive, ruby reignites that inner fire. It also strengthens loyalty and commitment in relationships.</p>
    <p>Physically, crystal practitioners associate ruby with blood circulation, heart health, and overall vitality. It is considered a stone of life force, connected to the blood and the fire that keeps the body running. Ruby is also linked to sexual energy and reproductive health.</p>
    <p>Mentally, ruby promotes positive dreams and clear visualization. It helps you see your goals vividly and believe in your ability to achieve them. This is not wishful thinking; it is the mental clarity and confidence needed to take real action.</p>

    <h2>How to Use Ruby</h2>
    <p>Wear ruby on your left hand (receiving hand) for maximum energy absorption. Ruby rings are traditional and powerful. Ruby pendants over the heart activate both the heart chakra connection and the stone's passionate energy.</p>
    <p>For meditation, hold ruby at your heart center and visualize red light pulsing with your heartbeat. This practice builds confidence and reconnects you with your core desires. It is especially helpful when you have lost touch with what you actually want.</p>
    <p>Place ruby in the south area of your home or office (the fame and reputation area in feng shui) to boost your public presence and reputation. Ruby in the bedroom enhances passion and intimacy.</p>
    <p>Ruby pairs powerfully with garnet for amplified vitality, with diamond for amplified courage, or with emerald for a balanced heart chakra activation that includes both love and passion.</p>

    <h2>Caring for Your Ruby</h2>
    <p>Ruby is a 9 on the Mohs hardness scale, second only to diamond. It is incredibly durable and handles daily wear beautifully. Clean with warm soapy water or ultrasonic cleaners (unless the stone has significant fracture-filling). Ruby loves sunlight and can be recharged in direct sun. Store separately from softer stones to prevent scratching them.</p>
    `
  },
  {
    month: 'August', slug: 'august-birthstone',
    title: 'August Birthstone: Peridot Meaning and Uses',
    desc: 'August birthstone peridot radiates positivity, abundance, and renewal. Learn peridot healing properties, Leo and Virgo zodiac connections, and how to work with this stone.',
    stones: ['Peridot'],
    signs: ['Leo', 'Virgo'],
    signSlugs: ['leo', 'virgo'],
    dates: 'Jul 23 - Aug 22 (Leo) and Aug 23 - Sep 22 (Virgo)',
    content: `
    <h2>Peridot: The August Birthstone</h2>
    <p>Peridot is sunshine in stone form. This bright yellow-green gem is one of the few stones that comes in only one color, though the shade varies from pale chartreuse to deep olive. Ancient Egyptians called it the "gem of the sun" and mined it on a Red Sea island called Topazios (which is why peridot was historically confused with topaz for centuries).</p>
    <p>What makes peridot genuinely remarkable is its origin story. Some peridot is extraterrestrial, literally. It has been found in meteorites and in comet dust returned by space missions. It also forms deep in the Earth's mantle and reaches the surface through volcanic eruptions. Whether from space or from volcanoes, peridot has dramatic origins.</p>

    <h2>Peridot and the Zodiac: Leo and Virgo</h2>
    <p>August bridges <a href="/signs/leo">Leo</a> (July 23 through August 22) and <a href="/signs/virgo">Virgo</a> (August 23 through September 22). Peridot complements both signs with its warm, clarifying energy.</p>
    <p>For Leo, peridot tempers ego with generosity. Leo loves the spotlight, and peridot ensures that their shine uplifts others rather than overshadowing them. It enhances Leo's natural warmth and helps them lead through inspiration rather than dominance. Find more in our <a href="/crystals/best-crystals-for-leo">best crystals for Leo</a> guide.</p>
    <p>For Virgo, peridot counters their tendency toward self-criticism and perfectionism. Virgo holds themselves to impossible standards; peridot teaches that growth does not require suffering. It lightens Virgo's mental load and promotes self-compassion. See our <a href="/crystals/best-crystals-for-virgo">best crystals for Virgo</a> guide for more.</p>

    <h2>Healing Properties of Peridot</h2>
    <p>Peridot works primarily with the heart and solar plexus chakras, creating a bridge between love and personal power. It promotes abundance, not just financial but abundance in joy, health, and meaningful connection.</p>
    <p>Emotionally, peridot is one of the best stones for releasing jealousy, resentment, and bitterness. It helps you let go of old grudges and patterns that no longer serve you. If you are holding onto anger from past relationships or situations, peridot gently loosens that grip and replaces it with forward-looking optimism.</p>
    <p>Physically, crystal practitioners connect peridot to digestive health, metabolism, and the liver and gallbladder. It is considered a detoxifying stone that supports the body's natural cleansing processes. Peridot is also associated with healthy skin and overall radiance.</p>
    <p>Mentally, peridot enhances confidence and assertiveness without aggression. It helps people who tend to be passive or people-pleasing find their voice and advocate for themselves. This is especially valuable for Virgos who often put everyone else's needs before their own.</p>

    <h2>How to Use Peridot</h2>
    <p>Wear peridot near your heart or solar plexus for the strongest effect. Pendants and brooches are ideal. Peridot earrings bring a lightness and brightness to your energy that others notice, even if they cannot identify why you seem more radiant.</p>
    <p>For meditation, hold peridot at your solar plexus (just above the navel) and breathe into the space. Visualize golden-green light dissolving old resentments and filling you with fresh, clean energy. This practice is particularly powerful during full moons, when emotions and old patterns surface naturally.</p>
    <p>Place peridot in your kitchen or dining area to promote abundance and healthy eating habits. In your office, it supports prosperity and protects against workplace jealousy or competition.</p>
    <p>Peridot pairs beautifully with citrine for amplified abundance energy, with rose quartz for heart healing, or with clear quartz for overall amplification of its sunny properties.</p>

    <h2>Caring for Your Peridot</h2>
    <p>Peridot is 6.5 to 7 on the Mohs hardness scale, making it suitable for most jewelry but requiring more care than harder stones. Avoid extreme temperature changes and harsh chemicals. Clean with warm soapy water and a soft cloth. Peridot can be recharged in sunlight for short periods, but extended direct sun exposure is not recommended. Moonlight and earth burial work beautifully for energetic cleansing.</p>
    `
  },
  {
    month: 'September', slug: 'september-birthstone',
    title: 'September Birthstone: Sapphire Meaning and Uses',
    desc: 'September birthstone sapphire brings wisdom, loyalty, and spiritual insight. Explore sapphire healing properties, Virgo and Libra zodiac links, and practical uses.',
    stones: ['Sapphire'],
    signs: ['Virgo', 'Libra'],
    signSlugs: ['virgo', 'libra'],
    dates: 'Aug 23 - Sep 22 (Virgo) and Sep 23 - Oct 22 (Libra)',
    content: `
    <h2>Sapphire: The September Birthstone</h2>
    <p>Sapphire has been the stone of royalty and wisdom for thousands of years. Ancient Persians believed the sky was painted blue by the reflection of a giant sapphire upon which the earth rested. Kings wore sapphires as protection from envy and harm. The clergy of the Middle Ages wore blue sapphires to symbolize heaven, and the stone became associated with divine truth.</p>
    <p>While most people think of deep blue when they hear "sapphire," this corundum variety actually comes in every color except red (that would be ruby, its sibling). Pink, yellow, orange, green, and the rare padparadscha (salmon pink) sapphires all exist. But blue sapphire remains the September birthstone and the most iconic variety.</p>

    <h2>Sapphire and the Zodiac: Virgo and Libra</h2>
    <p>September spans <a href="/signs/virgo">Virgo</a> (August 23 through September 22) and <a href="/signs/libra">Libra</a> (September 23 through October 22). Sapphire resonates deeply with both signs.</p>
    <p>For Virgo, sapphire enhances their analytical mind while promoting the wisdom to know when analysis becomes paralysis. Virgo can overthink; sapphire helps them trust their conclusions and act on them. It also supports Virgo's service-oriented nature by deepening their understanding of what people truly need. Explore our <a href="/crystals/best-crystals-for-virgo">best crystals for Virgo</a> guide.</p>
    <p>For Libra, sapphire strengthens discernment and commitment. Libra weighs every option endlessly; sapphire cuts through indecision and promotes confident choice-making. It also enhances Libra's natural sense of justice and fairness. See our <a href="/crystals/best-crystals-for-libra">best crystals for Libra</a> guide for complementary stones.</p>

    <h2>Healing Properties of Sapphire</h2>
    <p>Sapphire activates the third eye and throat chakras, creating a powerful combination of clear perception and truthful communication. It promotes wisdom that is not just intellectual but deeply intuitive: the kind of knowing that comes from experience and inner stillness.</p>
    <p>Emotionally, sapphire brings calm and focus during turbulent times. It is sometimes called the stone of mental discipline because it helps you maintain clarity even when emotions are running high. This makes it invaluable during conflict resolution, negotiations, or any situation requiring both empathy and objectivity.</p>
    <p>Physically, crystal healers associate sapphire with eye health, the nervous system, and cellular repair. Blue sapphire specifically is linked to the thyroid and throat. It is considered a cooling stone that reduces fever and inflammation.</p>
    <p>Sapphire also has a strong protective quality, particularly against negative energy and psychic attack. Historically, it was the stone chosen by spiritual seekers and mystics who needed protection during deep meditation and astral work.</p>

    <h2>How to Use Sapphire</h2>
    <p>Wear sapphire on the right hand for outward expression of wisdom and authority. On the left hand, it enhances receptivity and intuition. Sapphire pendants support throat chakra activation, while sapphire earrings bring the energy closer to the third eye.</p>
    <p>For meditation, place sapphire on your third eye (between the eyebrows) while lying down. Breathe slowly and allow visions, insights, or simply deep calm to arise. Sapphire meditation often produces remarkably clear and useful insights.</p>
    <p>In your home, sapphire promotes peace and wisdom in shared spaces. Place it in your living room or study. In the workplace, sapphire on your desk supports fair decision-making and protects against office politics.</p>
    <p>Sapphire combines beautifully with lapis lazuli for enhanced wisdom, with amethyst for deepened spiritual connection, or with diamond for amplified clarity and authority.</p>

    <h2>Caring for Your Sapphire</h2>
    <p>Sapphire is a 9 on the Mohs hardness scale, making it one of the most durable gemstones available. It handles daily wear, ultrasonic cleaning, and most environments without issue. Clean with warm soapy water or professional solutions. Recharge under moonlight or in running water. Sapphire handles sunlight well without fading.</p>
    `
  },
  {
    month: 'October', slug: 'october-birthstone',
    title: 'October Birthstone: Opal and Tourmaline Guide',
    desc: 'October birthstones opal and tourmaline bring creativity, protection, and emotional balance. Learn their healing properties, Libra and Scorpio ties, and how to use them.',
    stones: ['Opal', 'Tourmaline'],
    signs: ['Libra', 'Scorpio'],
    signSlugs: ['libra', 'scorpio'],
    dates: 'Sep 23 - Oct 22 (Libra) and Oct 23 - Nov 21 (Scorpio)',
    content: `
    <h2>Opal and Tourmaline: October's Birthstones</h2>
    <p>October gets two birthstones that together cover an extraordinary range of energy and beauty. Opal is a light-play phenomenon that changes color with every angle, while tourmaline comes in virtually every color on the spectrum. Together, they represent the complexity and depth of the month that bridges autumn's beauty with its intensity.</p>
    <p>Opal has been both worshipped and feared throughout history. Romans considered it the most precious gemstone because it contained the colors of all other stones. Medieval Europeans believed it granted invisibility. Australian Aboriginal creation stories say opal was formed when the creator came down to Earth on a rainbow. Tourmaline's name comes from the Sinhalese word "turmali," meaning mixed gems, because its wide color range caused constant confusion with other stones.</p>

    <h2>October Birthstones and the Zodiac: Libra and Scorpio</h2>
    <p>October spans <a href="/signs/libra">Libra</a> (September 23 through October 22) and <a href="/signs/scorpio">Scorpio</a> (October 23 through November 21). Both birthstones serve these intense signs well.</p>
    <p>For Libra, opal enhances their appreciation for beauty and harmony while adding depth to their emotional expression. Libra can sometimes stay on the surface to keep things pleasant; opal encourages them to explore the full spectrum of their feelings. Tourmaline helps Libra ground their decisions. See our <a href="/crystals/best-crystals-for-libra">best crystals for Libra</a> guide.</p>
    <p>For Scorpio, tourmaline (especially black tourmaline) provides the energetic protection this deeply sensitive sign needs. Scorpio absorbs energy from their environment; tourmaline filters it. Opal amplifies Scorpio's natural intuition and helps them channel their intensity creatively. Explore our <a href="/crystals/best-crystals-for-scorpio">best crystals for Scorpio</a> guide for more.</p>

    <h2>Healing Properties of Opal</h2>
    <p>Opal works with all chakras simultaneously because it contains the full color spectrum. It is an amplifier of emotion: whatever you are feeling, opal intensifies it. This makes opal powerful but also means it works best when you are in a relatively positive emotional state.</p>
    <p>Emotionally, opal promotes spontaneity, creativity, and emotional expression. It helps people who suppress their feelings find safe, beautiful ways to let them out. Artists, writers, and musicians often find opal deeply inspiring because it connects them to the raw material of emotional experience.</p>
    <p>Opal also enhances memory, particularly emotional memory. It helps you access past experiences with clarity, which can be healing when processing old wounds or simply reconnecting with joyful moments you had forgotten.</p>

    <h2>Healing Properties of Tourmaline</h2>
    <p>Tourmaline's healing properties vary by color. Black tourmaline is the premier protection stone, shielding against negative energy, electromagnetic radiation, and psychic attack. Pink tourmaline opens the heart and promotes love and compassion. Green tourmaline supports physical healing and connects to nature energy. Watermelon tourmaline (pink inside, green outside) bridges the heart and higher heart chakras.</p>
    <p>All tourmaline varieties share certain properties: they promote understanding, increase self-confidence, and diminish fear. Tourmaline is also piezoelectric, meaning it generates an electric charge when heated or pressured, which many crystal practitioners believe amplifies its metaphysical properties.</p>
    <p>Tourmaline supports detoxification, the immune system, and the nervous system. Black tourmaline specifically is associated with grounding and the root chakra, while pink tourmaline works with the heart chakra.</p>

    <h2>How to Use October Birthstones</h2>
    <p>Wear opal against your skin for the strongest energetic connection. Opal rings are classic, and the constant movement of your hand creates mesmerizing play-of-color throughout the day. Opal pendants work well when you want to keep the energy closer to your heart.</p>
    <p>Black tourmaline is best worn as a pendant, kept in your pocket, or placed near electronics. Many people keep a piece by their computer or phone. Pink tourmaline makes beautiful and meaningful jewelry for heart-centered energy.</p>
    <p>For meditation, hold opal during creative visualization or emotional exploration. Hold tourmaline when you need grounding or protection. Using both together in a single session creates a beautiful balance of openness and safety.</p>
    <p>Place opal in creative spaces (art studios, writing desks, music rooms) and tourmaline near entryways for protection. Watermelon tourmaline on your nightstand promotes restful, healing sleep.</p>

    <h2>Caring for October Birthstones</h2>
    <p>Opal is 5.5 to 6.5 on the Mohs scale and requires careful handling. It contains water and can crack if it dries out, so store it away from heat and direct sunlight. Clean with a damp cloth. Never use ultrasonic cleaners. Tourmaline is harder at 7 to 7.5 and handles daily wear well. Clean both with warm soapy water. Recharge opal under moonlight only; tourmaline can handle brief sunlight or moonlight.</p>
    `
  },
  {
    month: 'November', slug: 'november-birthstone',
    title: 'November Birthstone: Topaz and Citrine Guide',
    desc: 'November birthstones topaz and citrine bring warmth, abundance, and confidence. Learn their healing properties, Scorpio and Sagittarius zodiac ties, and practical uses.',
    stones: ['Topaz', 'Citrine'],
    signs: ['Scorpio', 'Sagittarius'],
    signSlugs: ['scorpio', 'sagittarius'],
    dates: 'Oct 23 - Nov 21 (Scorpio) and Nov 22 - Dec 21 (Sagittarius)',
    content: `
    <h2>Topaz and Citrine: November's Birthstones</h2>
    <p>November brings two golden-hued birthstones that carry the warmth of autumn's last fires. Topaz, in its prized imperial orange variety, has been treasured by Russian czars and Brazilian royalty. Citrine, the sunny quartz variety, was a favorite of Art Deco designers and Hollywood stars of the 1920s and 1930s. Both stones radiate optimism, abundance, and the kind of confidence that lights up a room.</p>
    <p>Topaz comes in many colors, but imperial topaz (golden to reddish-orange) is the traditional November stone. The name may derive from Topazios, a Red Sea island, or from the Sanskrit "tapas," meaning fire. Citrine gets its name from the French word for lemon, "citron," though natural citrine ranges from pale yellow to deep amber.</p>

    <h2>November Birthstones and the Zodiac: Scorpio and Sagittarius</h2>
    <p>November spans <a href="/signs/scorpio">Scorpio</a> (October 23 through November 21) and <a href="/signs/sagittarius">Sagittarius</a> (November 22 through December 21). Both birthstones complement these signs powerfully.</p>
    <p>For Scorpio, topaz promotes forgiveness and truth. Scorpio holds grudges like nobody else; topaz helps them release resentment without feeling like they are letting someone off the hook. Citrine lightens Scorpio's intensity with genuine joy and optimism. See our <a href="/crystals/best-crystals-for-scorpio">best crystals for Scorpio</a> guide.</p>
    <p>For Sagittarius, citrine matches their natural optimism and amplifies their abundance mindset. Topaz supports Sagittarius's quest for truth and wisdom, helping them discern between genuine insight and shallow philosophy. Explore our <a href="/crystals/best-crystals-for-sagittarius">best crystals for Sagittarius</a> guide for more.</p>

    <h2>Healing Properties of Topaz</h2>
    <p>Topaz works with the solar plexus and sacral chakras, promoting personal power, creativity, and joy. Imperial topaz in particular carries a warm, expansive energy that opens you to receiving abundance in all forms: financial, emotional, and spiritual.</p>
    <p>Emotionally, topaz promotes forgiveness, both of others and yourself. It helps release the tight grip of resentment and replaces it with understanding and compassion. This does not mean excusing harmful behavior; it means freeing yourself from the weight of carrying anger.</p>
    <p>Mentally, topaz enhances confidence, charisma, and the ability to manifest goals. It strengthens faith in your own abilities and helps you present yourself authentically to the world. Public speakers, performers, and leaders often benefit from topaz energy.</p>
    <p>Physically, crystal practitioners associate topaz with digestion, metabolism, and the nervous system. It is considered a warming stone that supports the body during cold months and promotes overall vitality.</p>

    <h2>Healing Properties of Citrine</h2>
    <p>Citrine is known as the "merchant's stone" because of its strong association with wealth and prosperity. It activates the solar plexus chakra, which governs personal power, confidence, and manifestation. Unlike many abundance stones, citrine does not just attract money; it helps you develop the mindset and habits that create sustainable wealth.</p>
    <p>Emotionally, citrine is pure sunshine. It dispels negativity, depression, and fear. It is one of the few crystals that never needs cleansing because it transmutes negative energy rather than absorbing it. If you are going through a dark period, citrine brings light without minimizing your experience.</p>
    <p>Citrine also promotes generosity and sharing wealth. It teaches that abundance flows most freely when it is circulated rather than hoarded. This makes it a powerful stone for business owners and entrepreneurs.</p>

    <h2>How to Use November Birthstones</h2>
    <p>Wear topaz or citrine near your solar plexus for the strongest activation. Pendants that sit at chest level or long necklaces work well. Citrine rings are popular and effective, especially for anyone in sales, business, or creative fields.</p>
    <p>For meditation, hold citrine at your solar plexus and visualize golden light expanding from your center. Feel yourself becoming a magnet for positive opportunities. Topaz meditation works similarly but tends to produce deeper, more introspective results focused on personal truth.</p>
    <p>Place citrine in your cash register, wallet, or the wealth corner of your home (far left from the front door in feng shui). Topaz in the living room promotes warmth and genuine connection among family members.</p>
    <p>Both stones pair well with each other for amplified solar energy. Combine with amethyst for balanced abundance (material and spiritual), or with garnet for warm vitality during cold months.</p>

    <h2>Caring for Topaz and Citrine</h2>
    <p>Topaz is 8 on the Mohs hardness scale and very durable, though it has perfect cleavage (meaning it can split along one plane if struck hard). Citrine is 7 and handles daily wear well. Clean both with warm soapy water. Citrine can fade in prolonged sunlight; topaz handles sun better but should not be left in extreme heat. Recharge both under moonlight or on a selenite plate. Note: most commercial "citrine" is actually heat-treated amethyst. Natural citrine has a softer, more subtle color.</p>
    `
  },
  {
    month: 'December', slug: 'december-birthstone',
    title: 'December Birthstone: Turquoise and Tanzanite',
    desc: 'December birthstones turquoise, tanzanite, and zircon bring protection, transformation, and spiritual growth. Learn their properties and Sagittarius and Capricorn ties.',
    stones: ['Turquoise', 'Tanzanite', 'Zircon'],
    signs: ['Sagittarius', 'Capricorn'],
    signSlugs: ['sagittarius', 'capricorn'],
    dates: 'Nov 22 - Dec 21 (Sagittarius) and Dec 22 - Jan 19 (Capricorn)',
    content: `
    <h2>Turquoise, Tanzanite, and Zircon: December's Birthstones</h2>
    <p>December is the most generous month for birthstones, offering three distinct gems that together span thousands of years of human history. Turquoise is ancient, arguably the oldest gemstone in continuous human use. Tanzanite is modern, discovered only in 1967 near Mount Kilimanjaro. Zircon (not to be confused with cubic zirconia) is actually the oldest mineral on Earth, with specimens dating back 4.4 billion years.</p>
    <p>Turquoise was sacred to virtually every ancient culture that encountered it. Egyptians, Persians, Native Americans, Tibetans, and Aztecs all revered turquoise as a holy stone of protection and power. Tanzanite's violet-blue color is found nowhere else on Earth and can only be mined from a four-kilometer strip in Tanzania. Zircon has been prized since the Middle Ages, when it was believed to promote sleep, prosperity, and honor.</p>

    <h2>December Birthstones and the Zodiac: Sagittarius and Capricorn</h2>
    <p>December bridges <a href="/signs/sagittarius">Sagittarius</a> (November 22 through December 21) and <a href="/signs/capricorn">Capricorn</a> (December 22 through January 19). All three birthstones serve these signs meaningfully.</p>
    <p>For Sagittarius, turquoise is the traditional talisman of the traveler, perfect for the most adventurous sign in the zodiac. It protects during journeys and enhances the wisdom gained from exploration. Tanzanite amplifies Sagittarius's spiritual seeking with its high-vibration energy. See our <a href="/crystals/best-crystals-for-sagittarius">best crystals for Sagittarius</a> guide.</p>
    <p>For Capricorn, zircon supports their practical ambitions with grounding, prosperous energy. Turquoise helps Capricorn communicate with authority while maintaining warmth, countering their tendency to seem cold when they are simply focused. Explore our <a href="/crystals/best-crystals-for-capricorn">best crystals for Capricorn</a> guide for more options.</p>

    <h2>Healing Properties of Turquoise</h2>
    <p>Turquoise is a master healer that works with the throat chakra primarily but influences all energy centers. It promotes honest communication, leadership, and the ability to speak your truth without aggression. Indigenous cultures worldwide have used turquoise as a bridge between earth and sky, physical and spiritual.</p>
    <p>Emotionally, turquoise brings calm, balance, and a sense of serenity. It is particularly helpful for people who tend toward mood swings or emotional instability. Turquoise does not suppress emotions; it helps you experience them with equanimity rather than being overwhelmed.</p>
    <p>Turquoise is also a powerful protection stone. It was traditionally believed to change color to warn its wearer of danger or illness. Whether or not it changes color, its protective energy is well documented across cultures and centuries.</p>

    <h2>Healing Properties of Tanzanite</h2>
    <p>Tanzanite activates the third eye, throat, and crown chakras simultaneously, creating a powerful channel for spiritual communication and psychic awareness. It is considered one of the highest-vibration blue stones available.</p>
    <p>Emotionally, tanzanite promotes deep compassion and understanding. It helps you see situations from multiple perspectives and respond with wisdom rather than reactivity. This makes it excellent for mediators, therapists, and anyone navigating complex interpersonal dynamics.</p>
    <p>Tanzanite also supports transformation at the deepest levels. If you are undergoing a major life shift, tanzanite helps you surrender to the process and trust that you are becoming who you are meant to be.</p>

    <h2>Healing Properties of Zircon</h2>
    <p>Zircon promotes grounding, prosperity, and honor. It helps you build a reputation based on integrity and genuine achievement. Zircon also supports sleep and is traditionally placed under the pillow for restful, dream-filled nights.</p>
    <p>Physically, zircon is associated with bone health, the liver, and overall physical recovery. Its ancient earth energy makes it a powerful grounding stone that connects you to the stability of the planet itself.</p>

    <h2>How to Use December Birthstones</h2>
    <p>Wear turquoise near your throat for maximum communication benefits. Turquoise necklaces and bolo ties are both traditional and effective. Tanzanite jewelry is stunning and brings high-vibration spiritual energy to daily life. Zircon rings and pendants are elegant and bring grounding, prosperous energy.</p>
    <p>For meditation, turquoise promotes calm and connection to earth energy. Hold it during outdoor meditation for an amplified experience. Tanzanite is ideal for spiritual meditation and connecting to higher guidance. Zircon supports deep, restful meditation focused on grounding and presence.</p>
    <p>Place turquoise near your front door for protection. Tanzanite in your meditation space enhances spiritual practice. Zircon in the bedroom promotes sleep and in the office supports reputation and honor.</p>
    <p>All three stones pair well together for a complete December energy grid. Add black tourmaline for enhanced protection or amethyst for amplified spiritual connection.</p>

    <h2>Caring for December Birthstones</h2>
    <p>Turquoise is 5 to 6 on the Mohs scale and requires gentle care. Avoid water, chemicals, and sunlight exposure. Clean with a dry, soft cloth. Tanzanite is 6 to 7 and should avoid ultrasonic cleaners and sudden temperature changes. Clean with warm soapy water. Zircon is 6 to 7.5 and fairly durable but can chip along edges. Clean with warm soapy water. Recharge all three under moonlight. Keep turquoise away from water and chemicals during cleansing.</p>
    `
  }
];

// Template function for individual birthstone pages
function makePage(m) {
  const signLinks = m.signs.map((s, i) => `<a href="/signs/${m.signSlugs[i]}">${s}</a>`).join(' and ');
  const crystalLinks = m.signs.map((s, i) => `<a href="/crystals/best-crystals-for-${m.signSlugs[i]}">best crystals for ${s}</a>`).join(' and ');
  
  const faqItems = [
    { q: `What is the ${m.month} birthstone?`, a: `The ${m.month} birthstone is ${m.stones.join(' and ')}. ${m.stones.length > 1 ? 'These stones have' : 'This stone has'} been associated with ${m.month} for centuries and ${m.stones.length > 1 ? 'carry' : 'carries'} unique healing and protective properties.` },
    { q: `What zodiac signs are connected to ${m.month}?`, a: `${m.month} spans ${m.dates}. Both signs benefit from ${m.stones[0]}'s healing energy in different ways.` },
    { q: `How do you cleanse ${m.stones[0].toLowerCase()}?`, a: `Cleanse ${m.stones[0].toLowerCase()} under moonlight, on selenite, or with gentle running water (if the stone tolerates moisture). Avoid harsh chemicals and prolonged direct sunlight for most gemstones.` },
    { q: `Can you wear ${m.stones[0].toLowerCase()} every day?`, a: `Yes, ${m.stones[0].toLowerCase()} can be worn daily depending on its hardness rating. Set it in protective settings for rings and remove during heavy physical activity to prevent damage.` }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": m.title,
    "description": m.desc,
    "url": `https://signseason.com/signs/${m.slug}`,
    "publisher": { "@type": "Organization", "name": "Sign Season", "url": "https://signseason.com" },
    "author": { "@type": "Organization", "name": "Sign Season" },
    "datePublished": "2026-03-30",
    "dateModified": "2026-03-30",
    "image": "https://signseason.com/assets/og-default.png"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Sign Season", "item": "https://signseason.com/" },
      { "@type": "ListItem", "position": 2, "name": "Signs", "item": "https://signseason.com/signs/" },
      { "@type": "ListItem", "position": 3, "name": `${m.month} Birthstone`, "item": `https://signseason.com/signs/${m.slug}` }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="google-site-verification" content="google53a81f31582ee8d7" />
  <meta charset="UTF-8">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${m.title} | Sign Season</title>
  <meta name="description" content="${m.desc}">
  <meta name="theme-color" content="#2A1F33">
  <meta property="og:title" content="${m.title} | Sign Season">
  <meta property="og:description" content="${m.desc}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://signseason.com/signs/${m.slug}">
  <meta property="og:image" content="https://signseason.com/assets/og-default.png">
  <meta property="og:site_name" content="Sign Season">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@signseasonco">
  <link rel="canonical" href="https://signseason.com/signs/${m.slug}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Fondamento:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">
${JSON.stringify(articleSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(faqSchema, null, 2)}
  </script>
  <style>
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
    .nav { max-width: 680px; margin: 0 auto; padding: 20px 24px; display: flex; align-items: center; gap: 8px; font-family: var(--sans); font-size: 0.75rem; }
    .nav a { color: var(--gold-dim); text-decoration: none; transition: color 0.3s; }
    .nav a:first-child { font-family: var(--display); font-style: italic; font-size: 1rem; color: var(--gold); }
    .nav a:hover { color: var(--gold-light); }
    .nav .sep { color: var(--gold-dim); opacity: 0.25; }
    .hero { max-width: 680px; margin: 0 auto; padding: 60px 24px 20px; text-align: center; }
    .hero h1 { font-family: var(--display); font-style: italic; font-size: clamp(2rem, 5vw, 2.8rem); color: var(--gold-pale); font-weight: 400; margin-bottom: 12px; }
    .hero p { font-family: var(--serif); font-size: 1.05rem; font-style: italic; color: var(--gold-dim); max-width: 520px; margin: 0 auto; }
    .content { max-width: 680px; margin: 0 auto; padding: 20px 24px 60px; }
    .content h2 { font-family: var(--display); font-style: italic; font-size: clamp(1.4rem, 3vw, 1.8rem); color: var(--gold-pale); font-weight: 400; margin: 40px 0 12px; }
    .content h2:first-child { margin-top: 0; }
    .content p { margin-bottom: 16px; color: var(--gold); }
    .content a { color: var(--gold-light); text-decoration: underline; text-decoration-color: rgba(201,173,111,0.3); text-underline-offset: 2px; transition: color 0.3s; }
    .content a:hover { color: var(--gold-pale); }
    .faq { max-width: 680px; margin: 0 auto; padding: 0 24px 60px; }
    .faq h2 { font-family: var(--display); font-style: italic; font-size: clamp(1.4rem, 3vw, 1.8rem); color: var(--gold-pale); font-weight: 400; margin-bottom: 20px; }
    .faq details { border-bottom: 1px solid rgba(201,173,111,0.1); padding: 16px 0; }
    .faq summary { cursor: pointer; font-family: var(--serif); font-size: 1.05rem; color: var(--gold-light); list-style: none; }
    .faq summary::-webkit-details-marker { display: none; }
    .faq details p { margin-top: 12px; color: var(--gold-dim); font-size: 0.95rem; }
    .div { text-align: center; color: var(--gold-dim); opacity: 0.3; padding: 40px 0; font-size: 1.2rem; letter-spacing: 0.3em; }
    .back { max-width: 680px; margin: 0 auto; padding: 0 24px 40px; text-align: center; }
    .back a { color: var(--gold-dim); text-decoration: none; font-family: var(--sans); font-size: 0.85rem; transition: color 0.3s; }
    .back a:hover { color: var(--gold-light); }
    .foot { text-align: center; padding: 40px 24px; font-family: var(--sans); font-size: 0.75rem; color: var(--gold-dim); border-top: 1px solid rgba(201,173,111,0.06); }
    .foot a { color: var(--gold-dim); text-decoration: none; }
    .foot a:hover { color: var(--gold-light); }
  </style>
</head>
<body>
<canvas id="stars" style="position:fixed;inset:0;z-index:0;pointer-events:none;"></canvas>

  <nav class="nav">
    <a href="/">Sign Season</a>
    <span class="sep">/</span>
    <a href="/signs/">Signs</a>
    <span class="sep">/</span>
    <span>${m.month} Birthstone</span>
  </nav>

  <header class="hero">
    <h1>${m.stones.join(' & ')}: The ${m.month} Birthstone${m.stones.length > 1 ? 's' : ''}</h1>
    <p>${m.desc}</p>
  </header>

  <article class="content">
    ${m.content.trim()}
  </article>

  <div class="div">&#10038;&ensp;&#10038;&ensp;&#10038;</div>

  <section class="faq">
    <h2>Frequently Asked Questions</h2>
    ${faqItems.map(f => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n    ')}
  </section>

  <div class="back">
    <a href="/signs/birthstones">&larr; All Birthstones by Month</a> &ensp;&middot;&ensp; <a href="/signs/">All Signs</a>
  </div>

  <footer class="foot">
    <a href="/">Sign Season</a> &ensp;&middot;&ensp; <a href="/compatibility">Compatibility</a> &ensp;&middot;&ensp; <a href="/crystals">Crystals</a> &ensp;&middot;&ensp; <a href="/privacy">Privacy</a>
    <br><br>
    <a href="#">TikTok</a> &ensp;&middot;&ensp; <a href="#">Instagram</a> &ensp;&middot;&ensp; <a href="#">Pinterest</a>
  </footer>

<script src="/js/stars.js"></script>
<script src="/js/analytics.js" defer></script>
</body>
</html>`;
}

// Generate hub page
function makeHub() {
  const monthData = months.map(m => ({
    month: m.month,
    slug: m.slug,
    stones: m.stones,
    signs: m.signs,
    signSlugs: m.signSlugs,
  }));

  const rows = monthData.map(m => {
    const stoneStr = m.stones.join(', ');
    const signLinks = m.signs.map((s, i) => `<a href="/signs/${m.signSlugs[i]}">${s}</a>`).join(', ');
    return `<a href="/signs/${m.slug}" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:16px 20px;background:var(--plum-mid);border:1px solid rgba(201,173,111,0.1);border-radius:2px;text-decoration:none;color:var(--gold-light);font-family:var(--serif);font-size:1rem;transition:all 0.3s;align-items:center;"><span style="color:var(--gold-pale);font-weight:500;">${m.month}</span><span>${stoneStr}</span><span style="color:var(--gold-dim);font-size:0.9rem;">${m.signs.join(' / ')}</span></a>`;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="google-site-verification" content="google53a81f31582ee8d7" />
  <meta charset="UTF-8">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zodiac Birthstones by Month: Complete Guide | Sign Season</title>
  <meta name="description" content="Every month's birthstone and its zodiac connection. Garnet to turquoise, January to December. Healing properties, crystal pairings, and how to use each stone.">
  <meta name="theme-color" content="#2A1F33">
  <meta property="og:title" content="Zodiac Birthstones by Month | Sign Season">
  <meta property="og:description" content="Every month's birthstone and its zodiac connection. Healing properties, crystal pairings, and how to use each stone.">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://signseason.com/signs/birthstones">
  <meta property="og:image" content="https://signseason.com/assets/og-default.png">
  <meta property="og:site_name" content="Sign Season">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@signseasonco">
  <link rel="canonical" href="https://signseason.com/signs/birthstones">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Fondamento:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Zodiac Birthstones by Month: Complete Guide",
    "description": "Every month's birthstone and its zodiac connection. Garnet to turquoise, January to December.",
    "url": "https://signseason.com/signs/birthstones",
    "publisher": { "@type": "Organization", "name": "Sign Season", "url": "https://signseason.com" },
    "author": { "@type": "Organization", "name": "Sign Season" },
    "datePublished": "2026-03-30",
    "dateModified": "2026-03-30",
    "image": "https://signseason.com/assets/og-default.png"
  }
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Sign Season","item":"https://signseason.com/"},{"@type":"ListItem","position":2,"name":"Signs","item":"https://signseason.com/signs/"},{"@type":"ListItem","position":3,"name":"Birthstones by Month","item":"https://signseason.com/signs/birthstones"}]}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What birthstone is associated with each zodiac sign?","acceptedAnswer":{"@type":"Answer","text":"Each month has one or more birthstones tied to its zodiac signs. For example, January's garnet connects to Capricorn and Aquarius, while July's ruby connects to Cancer and Leo. Each stone amplifies different qualities of its associated signs."}},{"@type":"Question","name":"Can you wear a birthstone that is not your birth month?","acceptedAnswer":{"@type":"Answer","text":"Absolutely. While your birth month stone has a special resonance, any birthstone can be worn and used for its healing properties. Many people choose stones based on the energy they need rather than their birthday."}},{"@type":"Question","name":"What is the difference between zodiac stones and birthstones?","acceptedAnswer":{"@type":"Answer","text":"Birthstones are assigned by birth month and have been standardized since 1912. Zodiac stones are assigned by astrological sign and come from older astrological traditions. There is significant overlap, but they are not identical systems."}}]}
  </script>
  <style>
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
    .nav { max-width: 680px; margin: 0 auto; padding: 20px 24px; display: flex; align-items: center; gap: 8px; font-family: var(--sans); font-size: 0.75rem; }
    .nav a { color: var(--gold-dim); text-decoration: none; transition: color 0.3s; }
    .nav a:first-child { font-family: var(--display); font-style: italic; font-size: 1rem; color: var(--gold); }
    .nav a:hover { color: var(--gold-light); }
    .nav .sep { color: var(--gold-dim); opacity: 0.25; }
    .hero { max-width: 680px; margin: 0 auto; padding: 60px 24px 20px; text-align: center; }
    .hero h1 { font-family: var(--display); font-style: italic; font-size: clamp(2rem, 5vw, 2.8rem); color: var(--gold-pale); font-weight: 400; margin-bottom: 12px; }
    .hero p { font-family: var(--serif); font-size: 1.05rem; font-style: italic; color: var(--gold-dim); max-width: 520px; margin: 0 auto; }
    .content { max-width: 680px; margin: 0 auto; padding: 20px 24px 40px; }
    .content h2 { font-family: var(--display); font-style: italic; font-size: clamp(1.4rem, 3vw, 1.8rem); color: var(--gold-pale); font-weight: 400; margin: 40px 0 12px; }
    .content p { margin-bottom: 16px; color: var(--gold); }
    .content a { color: var(--gold-light); text-decoration: underline; text-decoration-color: rgba(201,173,111,0.3); text-underline-offset: 2px; transition: color 0.3s; }
    .content a:hover { color: var(--gold-pale); }
    .grid { display: grid; grid-template-columns: 1fr; gap: 8px; max-width: 680px; margin: 0 auto; padding: 0 24px 40px; }
    .grid a:hover { background: var(--plum-lift) !important; border-color: rgba(201,173,111,0.25) !important; }
    .faq { max-width: 680px; margin: 0 auto; padding: 0 24px 60px; }
    .faq h2 { font-family: var(--display); font-style: italic; font-size: clamp(1.4rem, 3vw, 1.8rem); color: var(--gold-pale); font-weight: 400; margin-bottom: 20px; }
    .faq details { border-bottom: 1px solid rgba(201,173,111,0.1); padding: 16px 0; }
    .faq summary { cursor: pointer; font-family: var(--serif); font-size: 1.05rem; color: var(--gold-light); list-style: none; }
    .faq summary::-webkit-details-marker { display: none; }
    .faq details p { margin-top: 12px; color: var(--gold-dim); font-size: 0.95rem; }
    .div { text-align: center; color: var(--gold-dim); opacity: 0.3; padding: 40px 0; font-size: 1.2rem; letter-spacing: 0.3em; }
    .foot { text-align: center; padding: 40px 24px; font-family: var(--sans); font-size: 0.75rem; color: var(--gold-dim); border-top: 1px solid rgba(201,173,111,0.06); }
    .foot a { color: var(--gold-dim); text-decoration: none; }
    .foot a:hover { color: var(--gold-light); }
    @media (max-width: 600px) { .grid a { grid-template-columns: 1fr !important; gap: 4px !important; } }
  </style>
</head>
<body>
<canvas id="stars" style="position:fixed;inset:0;z-index:0;pointer-events:none;"></canvas>

  <nav class="nav">
    <a href="/">Sign Season</a>
    <span class="sep">/</span>
    <a href="/signs/">Signs</a>
    <span class="sep">/</span>
    <span>Birthstones</span>
  </nav>

  <header class="hero">
    <h1>Zodiac Birthstones by Month</h1>
    <p>Every month has a stone. Every stone has a story. Find yours and learn what it actually does.</p>
  </header>

  <article class="content">
    <p>Birthstones are more than jewelry tradition. Each month's gemstone carries specific healing properties, zodiac connections, and thousands of years of cultural significance. Whether you wear your birthstone for its beauty or its energy, understanding the stone deepens the relationship.</p>
    <p>Below you will find every month's birthstone with its zodiac sign connections. Click through to the full guide for healing properties, practical uses, and crystal pairings that complement your stone.</p>
  </article>

  <div class="grid">
    ${rows.join('\n    ')}
  </div>

  <div class="div">&#10038;&ensp;&#10038;&ensp;&#10038;</div>

  <section class="faq">
    <h2>Frequently Asked Questions</h2>
    <details><summary>What birthstone is associated with each zodiac sign?</summary><p>Each month has one or more birthstones tied to its zodiac signs. For example, January's garnet connects to Capricorn and Aquarius, while July's ruby connects to Cancer and Leo. Each stone amplifies different qualities of its associated signs.</p></details>
    <details><summary>Can you wear a birthstone that is not your birth month?</summary><p>Absolutely. While your birth month stone has a special resonance, any birthstone can be worn and used for its healing properties. Many people choose stones based on the energy they need rather than their birthday.</p></details>
    <details><summary>What is the difference between zodiac stones and birthstones?</summary><p>Birthstones are assigned by birth month and have been standardized since 1912. Zodiac stones are assigned by astrological sign and come from older astrological traditions. There is significant overlap, but they are not identical systems.</p></details>
  </section>

  <footer class="foot">
    <a href="/">Sign Season</a> &ensp;&middot;&ensp; <a href="/compatibility">Compatibility</a> &ensp;&middot;&ensp; <a href="/crystals">Crystals</a> &ensp;&middot;&ensp; <a href="/privacy">Privacy</a>
    <br><br>
    <a href="#">TikTok</a> &ensp;&middot;&ensp; <a href="#">Instagram</a> &ensp;&middot;&ensp; <a href="#">Pinterest</a>
  </footer>

<script src="/js/stars.js"></script>
<script src="/js/analytics.js" defer></script>
</body>
</html>`;
}

// Write all files
const dir = path.join(__dirname, 'signs');

// Hub page
fs.writeFileSync(path.join(dir, 'birthstones.html'), makeHub());
console.log('Created signs/birthstones.html');

// Individual pages
for (const m of months) {
  fs.writeFileSync(path.join(dir, `${m.slug}.html`), makePage(m));
  console.log(`Created signs/${m.slug}.html`);
}

console.log('\nDone! 13 birthstone pages created.');
