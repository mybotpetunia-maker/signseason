// Vercel Serverless Function: Dynamic OG meta tags for Compatibility Quiz
// GET /api/quiz-og?signs=scorpio-pisces
//
// Usage: Set <meta property="og:url" content="/api/quiz-og?signs=..."> on the quiz page
// for social crawlers. Static clients get the HTML page directly.

const SIGN_NAMES = {
  aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer',
  leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio',
  sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces'
};

const SIGNS_ORDER = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];

const SCORES = {
  'aries-taurus': 52, 'aries-gemini': 74, 'aries-cancer': 48, 'aries-leo': 83,
  'aries-virgo': 45, 'aries-libra': 68, 'aries-scorpio': 58, 'aries-sagittarius': 86,
  'aries-capricorn': 48, 'aries-aquarius': 72, 'aries-pisces': 55,
  'taurus-gemini': 55, 'taurus-cancer': 80, 'taurus-leo': 54, 'taurus-virgo': 78,
  'taurus-libra': 70, 'taurus-scorpio': 63, 'taurus-sagittarius': 43, 'taurus-capricorn': 80,
  'taurus-aquarius': 45, 'taurus-pisces': 80,
  'gemini-cancer': 56, 'gemini-leo': 79, 'gemini-virgo': 50, 'gemini-libra': 85,
  'gemini-scorpio': 50, 'gemini-sagittarius': 66, 'gemini-capricorn': 44, 'gemini-aquarius': 82,
  'gemini-pisces': 52,
  'cancer-leo': 58, 'cancer-virgo': 74, 'cancer-libra': 55, 'cancer-scorpio': 87,
  'cancer-sagittarius': 47, 'cancer-capricorn': 58, 'cancer-aquarius': 44, 'cancer-pisces': 88,
  'leo-virgo': 51, 'leo-libra': 81, 'leo-scorpio': 52, 'leo-sagittarius': 84,
  'leo-capricorn': 60, 'leo-aquarius': 62, 'leo-pisces': 60,
  'virgo-libra': 55, 'virgo-scorpio': 77, 'virgo-sagittarius': 47, 'virgo-capricorn': 79,
  'virgo-aquarius': 46, 'virgo-pisces': 59,
  'libra-scorpio': 53, 'libra-sagittarius': 78, 'libra-capricorn': 50, 'libra-aquarius': 83,
  'libra-pisces': 67,
  'scorpio-sagittarius': 49, 'scorpio-capricorn': 82, 'scorpio-aquarius': 48, 'scorpio-pisces': 89,
  'sagittarius-capricorn': 55, 'sagittarius-aquarius': 83, 'sagittarius-pisces': 55,
  'capricorn-aquarius': 50, 'capricorn-pisces': 76,
  'aquarius-pisces': 60,
};

function getCategory(score) {
  if (score >= 90) return 'Soulmates';
  if (score >= 75) return 'Strong Match';
  if (score >= 50) return 'Worth the Work';
  return 'Cosmic Clash';
}

function getKey(s1, s2) {
  return SIGNS_ORDER.indexOf(s1) < SIGNS_ORDER.indexOf(s2) ? `${s1}-${s2}` : `${s2}-${s1}`;
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

  const { signs } = req.query;
  const pageUrl = 'https://signseason.com/quiz/compatibility';
  const ogImage = 'https://signseason.com/assets/og-default.png';

  let title = 'Zodiac Compatibility Quiz | Sign Season';
  let description = 'Find out how compatible you really are. Pick your signs, get a compatibility score, and share the result with your person. No filter.';
  let canonicalUrl = pageUrl;

  if (signs) {
    const parts = signs.toLowerCase().split('-');
    if (parts.length === 2 && SIGN_NAMES[parts[0]] && SIGN_NAMES[parts[1]] && parts[0] !== parts[1]) {
      const [s1, s2] = parts;
      const key = getKey(s1, s2);
      const score = SCORES[key];
      if (score !== undefined) {
        const n1 = SIGN_NAMES[s1], n2 = SIGN_NAMES[s2];
        const category = getCategory(score);
        title = `${n1} + ${n2}: ${score}% Compatible | Sign Season`;
        description = `${n1} and ${n2} score ${score}% overall compatibility — ${category}. Get your full cosmic reading on Sign Season.`;
        canonicalUrl = `${pageUrl}?signs=${s1}-${s2}`;
      }
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(title)}</title>
  <meta name="description" content="${escHtml(description)}">
  <meta property="og:title" content="${escHtml(title)}">
  <meta property="og:description" content="${escHtml(description)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escHtml(canonicalUrl)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@signseasonco">
  <meta name="twitter:title" content="${escHtml(title)}">
  <meta name="twitter:description" content="${escHtml(description)}">
  <meta name="twitter:image" content="${ogImage}">
  <link rel="canonical" href="${escHtml(canonicalUrl)}">
  <meta http-equiv="refresh" content="0;url=${escHtml(canonicalUrl)}">
</head>
<body>
  <p>Redirecting to <a href="${escHtml(canonicalUrl)}">Sign Season Compatibility Quiz</a>...</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
