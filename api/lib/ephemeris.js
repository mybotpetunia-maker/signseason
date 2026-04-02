/**
 * ephemeris.js - Astronomical calculation engine for Sign Season
 *
 * Sun, Moon, and Rising sign calculations.
 * Moon: Jean Meeus "Astronomical Algorithms" Ch. 47 (low-precision lunar longitude)
 * Rising: Standard ascendant formula from Meeus Ch. 14
 *
 * Pure JS, no native modules, no external API calls.
 * Accurate for dates 1920-2100+.
 */

// ─── Math Helpers ────────────────────────────────────────────────────

function d2r(deg) { return deg * Math.PI / 180; }
function r2d(rad) { return rad * 180 / Math.PI; }
function norm360(deg) { return ((deg % 360) + 360) % 360; }

/**
 * Gregorian date + UTC time to Julian Date
 */
function dateToJulian(year, month, day, hourUTC = 12, minute = 0, second = 0) {
  let y = year;
  let m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716))
       + Math.floor(30.6001 * (m + 1))
       + day + B - 1524.5
       + (hourUTC + minute / 60 + second / 3600) / 24;
}

/**
 * Map ecliptic longitude [0,360) to zodiac sign + degree within sign
 */
function longitudeToSign(lon) {
  const SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];
  const normalized = norm360(lon);
  const index = Math.floor(normalized / 30);
  const degree = parseFloat((normalized % 30).toFixed(2));
  return { sign: SIGNS[index], degree };
}

// ─── Meeus Ch. 47 — Moon Longitude Periodic Terms ────────────────────
// Columns: [D, M, M', F, coeffL (×10^-6 deg)]
// M terms ±1 → multiply by eccentricity e; ±2 → e²
const MOON_LNG_TERMS = [
  [0,  0,  1,  0,  6288774],
  [2,  0, -1,  0,  1274027],
  [2,  0,  0,  0,   658314],
  [0,  0,  2,  0,   213618],
  [0,  1,  0,  0,  -185116],
  [0,  0,  0,  2,  -114332],
  [2,  0, -2,  0,    58793],
  [2, -1, -1,  0,    57066],
  [2,  0,  1,  0,    53322],
  [2, -1,  0,  0,    45758],
  [0,  1, -1,  0,   -40923],
  [1,  0,  0,  0,   -34720],
  [0,  1,  1,  0,   -30383],
  [2,  0,  0, -2,    15327],
  [0,  0,  1,  2,   -12528],
  [0,  0,  1, -2,    10980],
  [4,  0, -1,  0,    10675],
  [0,  0,  3,  0,    10034],
  [4,  0, -2,  0,     8548],
  [2,  1, -1,  0,    -7888],
  [2,  1,  0,  0,    -6766],
  [1,  0, -1,  0,    -5163],
  [1,  1,  0,  0,     4987],
  [2, -1,  1,  0,     4036],
  [2,  0,  2,  0,     3994],
  [4,  0,  0,  0,     3861],
  [2,  0, -3,  0,     3665],
  [0,  1, -2,  0,    -2689],
  [2,  0, -1,  2,    -2602],
  [2, -1, -2,  0,     2390],
  [1,  0,  1,  0,    -2348],
  [2, -2,  0,  0,     2236],
  [0,  1,  2,  0,    -2120],
  [0,  2,  0,  0,    -2069],
  [2, -2, -1,  0,     2048],
  [2,  0,  1, -2,    -1773],
  [2,  0,  0,  2,    -1595],
  [4, -1, -1,  0,     1215],
  [0,  0,  2,  2,    -1110],
  [3,  0, -1,  0,     -892],
  [2,  1,  1,  0,     -810],
  [4, -1, -2,  0,      759],
  [0,  2, -1,  0,     -713],
  [2,  2, -1,  0,     -700],
  [2,  1, -2,  0,      691],
  [2, -1,  0, -2,      596],
  [4,  0,  1,  0,      549],
  [0,  0,  4,  0,      537],
  [4, -1,  0,  0,      520],
  [1,  0, -2,  0,     -487],
  [2,  1,  0, -2,     -399],
  [0,  0,  2, -2,     -381],
  [1,  1,  1,  0,      351],
  [3,  0, -2,  0,     -340],
  [4,  0, -3,  0,      330],
  [2, -1,  2,  0,      327],
  [0,  2,  1,  0,     -323],
  [1,  1, -1,  0,      299],
  [2,  0,  3,  0,      294],
  [2,  0, -1, -2,        0],
];

/**
 * Moon's ecliptic longitude (degrees) at a Julian Date.
 * Meeus Chapter 47 — accurate to ~1°.
 */
function moonLongitude(jde) {
  const T  = (jde - 2451545.0) / 36525;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  // Fundamental arguments (degrees)
  const L_ = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841     - T4 / 65194000);
  const D  = norm360(297.8501921 + 445267.1114034  * T - 0.0018819 * T2 + T3 / 545868     - T4 / 113065000);
  const M  = norm360(357.5291092 +  35999.0502909  * T - 0.0001536 * T2 + T3 / 24490000);
  const M_ = norm360(134.9633964 + 477198.8675055  * T + 0.0087414 * T2 + T3 / 69699      - T4 / 14712000);
  const F  = norm360( 93.2720950 + 483202.0175233  * T - 0.0036539 * T2 - T3 / 3526000    + T4 / 863310000);

  // Eccentricity correction for terms involving M
  const e  = 1 - 0.002516 * T - 0.0000074 * T2;
  const e2 = e * e;

  let sumL = 0;
  for (const [d, m, mp, f, cl] of MOON_LNG_TERMS) {
    let E = 1;
    if (Math.abs(m) === 1) E = e;
    if (Math.abs(m) === 2) E = e2;
    sumL += E * cl * Math.sin(d2r(d * D + m * M + mp * M_ + f * F));
  }

  // Additive terms
  const A1 = norm360(119.75 + 131.849     * T);
  const A2 = norm360( 53.09 + 479264.290  * T);

  sumL += 3958 * Math.sin(d2r(A1))
        + 1962 * Math.sin(d2r(L_ - F))
        +  318 * Math.sin(d2r(A2));

  return norm360(L_ + sumL / 1000000);
}

// ─── Mean Obliquity of the Ecliptic (Meeus Ch. 22) ───────────────────

function meanObliquity(jde) {
  const T = (jde - 2451545.0) / 36525;
  const U = T / 100;
  return 23 + 26 / 60 + 21.448 / 3600
    - (4680.93  / 3600) * U
    - (   1.55  / 3600) * U ** 2
    + (1999.25  / 3600) * U ** 3
    - (  51.38  / 3600) * U ** 4
    - ( 249.67  / 3600) * U ** 5
    - (  39.05  / 3600) * U ** 6
    + (   7.12  / 3600) * U ** 7
    + (  27.87  / 3600) * U ** 8
    + (   5.79  / 3600) * U ** 9
    + (   2.45  / 3600) * U ** 10;
}

// ─── Greenwich Sidereal Time (Meeus Eq. 12.4) ────────────────────────

function greenwichSiderealTime(jde) {
  const T = (jde - 2451545.0) / 36525;
  return norm360(
    280.46061837
    + 360.98564736629 * (jde - 2451545)
    + 0.000387933 * T * T
    - T * T * T / 38710000
  );
}

// ─── Ascendant Formula ───────────────────────────────────────────────

/**
 * Compute ecliptic longitude of the Ascendant.
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} lat - Geographic latitude in degrees
 * @param {number} obliquity - Obliquity in degrees
 * @returns {number} ecliptic longitude [0, 360)
 */
function ascendantLongitude(lst, lat, obliquity) {
  const lstR = d2r(lst);
  const latR = d2r(lat);
  const epsR = d2r(obliquity);
  const y = -Math.cos(lstR);
  const x = Math.sin(lstR) * Math.cos(epsR) + Math.tan(latR) * Math.sin(epsR);
  return norm360(r2d(Math.atan2(y, x)));
}

// ─── City Lookup Table ───────────────────────────────────────────────
// Format: 'City Name': [latitude, longitude, standardUtcOffset]
// ~500 major world cities
const CITY_COORDS = {
  // United States
  'New York': [40.7128, -74.006, -5],
  'Los Angeles': [34.0522, -118.2437, -8],
  'Chicago': [41.8781, -87.6298, -6],
  'Houston': [29.7604, -95.3698, -6],
  'Phoenix': [33.4484, -112.074, -7],
  'Philadelphia': [39.9526, -75.1652, -5],
  'San Antonio': [29.4241, -98.4936, -6],
  'San Diego': [32.7157, -117.1611, -8],
  'Dallas': [32.7767, -96.797, -6],
  'San Jose': [37.3382, -121.8863, -8],
  'Austin': [30.2672, -97.7431, -6],
  'Jacksonville': [30.3322, -81.6557, -5],
  'San Francisco': [37.7749, -122.4194, -8],
  'Columbus': [39.9612, -82.9988, -5],
  'Indianapolis': [39.7684, -86.1581, -5],
  'Fort Worth': [32.7555, -97.3308, -6],
  'Charlotte': [35.2271, -80.8431, -5],
  'Seattle': [47.6062, -122.3321, -8],
  'Denver': [39.7392, -104.9903, -7],
  'Nashville': [36.1627, -86.7816, -6],
  'Baltimore': [39.2904, -76.6122, -5],
  'Louisville': [38.2527, -85.7585, -5],
  'Portland': [45.5051, -122.675, -8],
  'Las Vegas': [36.1699, -115.1398, -8],
  'Milwaukee': [43.0389, -87.9065, -6],
  'Albuquerque': [35.0844, -106.6504, -7],
  'Tucson': [32.2226, -110.9747, -7],
  'Fresno': [36.7378, -119.7871, -8],
  'Mesa': [33.4152, -111.8315, -7],
  'Sacramento': [38.5816, -121.4944, -8],
  'Kansas City': [39.0997, -94.5786, -6],
  'Atlanta': [33.749, -84.388, -5],
  'Omaha': [41.2565, -95.9345, -6],
  'Colorado Springs': [38.8339, -104.8214, -7],
  'Raleigh': [35.7796, -78.6382, -5],
  'Minneapolis': [44.9778, -93.265, -6],
  'Tampa': [27.9506, -82.4572, -5],
  'New Orleans': [29.9511, -90.0715, -6],
  'Wichita': [37.6872, -97.3301, -6],
  'Aurora': [39.7294, -104.8319, -7],
  'Anaheim': [33.8366, -117.9143, -8],
  'Santa Ana': [33.7455, -117.8677, -8],
  'Corpus Christi': [27.8006, -97.3964, -6],
  'Riverside': [33.9806, -117.3755, -8],
  'Lexington': [38.0406, -84.5037, -5],
  'St. Louis': [38.627, -90.1994, -6],
  'Pittsburgh': [40.4406, -79.9959, -5],
  'Anchorage': [61.2181, -149.9003, -9],
  'Stockton': [37.9577, -121.2908, -8],
  'Cincinnati': [39.1031, -84.512, -5],
  'St. Paul': [44.9537, -93.09, -6],
  'Greensboro': [36.0726, -79.792, -5],
  'Toledo': [41.6528, -83.5379, -5],
  'Newark': [40.7357, -74.1724, -5],
  'Plano': [33.0198, -96.6989, -6],
  'Henderson': [36.0395, -114.9817, -8],
  'Lincoln': [40.8136, -96.7026, -6],
  'Buffalo': [42.8864, -78.8784, -5],
  'Fort Wayne': [41.0793, -85.1394, -5],
  'Jersey City': [40.7178, -74.0431, -5],
  'Chula Vista': [32.6401, -117.0842, -8],
  'Orlando': [28.5383, -81.3792, -5],
  'St. Petersburg': [27.7676, -82.6403, -5],
  'Norfolk': [36.8508, -76.2859, -5],
  'Chandler': [33.3062, -111.8413, -7],
  'Laredo': [27.5306, -99.4803, -6],
  'Madison': [43.0731, -89.4012, -6],
  'Durham': [35.994, -78.8986, -5],
  'Lubbock': [33.5779, -101.8552, -6],
  'Winston-Salem': [36.0999, -80.2442, -5],
  'Garland': [32.9126, -96.6389, -6],
  'Glendale': [33.5387, -112.186, -7],
  'Hialeah': [25.8576, -80.2781, -5],
  'Reno': [39.5296, -119.8138, -8],
  'Baton Rouge': [30.4515, -91.1871, -6],
  'Irvine': [33.6846, -117.8265, -8],
  'Chesapeake': [36.7682, -76.2875, -5],
  'Scottsdale': [33.4942, -111.9261, -7],
  'Fremont': [37.5485, -121.9886, -8],
  'Gilbert': [33.3528, -111.789, -7],
  'San Bernardino': [34.1083, -117.2898, -8],
  'Birmingham': [33.5186, -86.8104, -6],
  'Rochester': [43.1566, -77.6088, -5],
  'Richmond': [37.5407, -77.436, -5],
  'Spokane': [47.6588, -117.426, -8],
  'Des Moines': [41.5868, -93.625, -6],
  'Montgomery': [32.3668, -86.3, -6],
  'Modesto': [37.6391, -120.9969, -8],
  'Tacoma': [47.2529, -122.4443, -8],
  'Shreveport': [32.5252, -93.7502, -6],
  'Fontana': [34.0922, -117.435, -8],
  'Akron': [41.0814, -81.519, -5],
  'Yonkers': [40.9312, -73.8988, -5],
  'Huntington Beach': [33.6595, -117.9988, -8],
  'Little Rock': [34.7465, -92.2896, -6],
  'Grand Rapids': [42.9634, -85.6681, -5],
  'Salt Lake City': [40.7608, -111.891, -7],
  'Tallahassee': [30.4518, -84.2807, -5],
  'Huntsville': [34.7304, -86.5861, -6],
  'Worcester': [42.2626, -71.8023, -5],
  'Knoxville': [35.9606, -83.9207, -5],
  'Providence': [41.824, -71.4128, -5],
  'Brownsville': [25.9017, -97.4975, -6],
  'Fort Lauderdale': [26.1224, -80.1373, -5],
  'Tempe': [33.4255, -111.94, -7],
  'Cape Coral': [26.5629, -81.9495, -5],
  'Eugene': [44.0521, -123.0868, -8],
  'Peoria': [40.6936, -89.589, -6],
  'Cary': [35.7915, -78.7811, -5],
  'Salem': [44.9429, -123.0351, -8],
  'Hayward': [37.6688, -122.0808, -8],
  'Clarksville': [36.5298, -87.3595, -6],
  'Lakewood': [39.7047, -105.0814, -7],
  'Palmdale': [34.5794, -118.1165, -8],
  'Sunnyvale': [37.3688, -122.0363, -8],
  'Pomona': [34.0551, -117.75, -8],
  'Escondido': [33.1192, -117.0864, -8],
  'Savannah': [32.0809, -81.0912, -5],
  'Torrance': [33.8358, -118.3406, -8],
  'Surprise': [33.6292, -112.3679, -7],
  'Pasadena': [34.1478, -118.1445, -8],
  'Roseville': [38.7521, -121.288, -8],
  'Bridgeport': [41.1865, -73.1952, -5],
  'Paterson': [40.9176, -74.1719, -5],
  'Jackson': [32.2988, -90.1848, -6],
  'Syracuse': [43.0481, -76.1474, -5],
  'Fort Collins': [40.5853, -105.0844, -7],
  'Macon': [32.8407, -83.6324, -5],
  'Mesquite': [32.7668, -96.5992, -6],
  'Fullerton': [33.8704, -117.9243, -8],
  'Olathe': [38.8814, -94.8191, -6],
  'Dayton': [39.7589, -84.1916, -5],
  'Orange': [33.7879, -117.8531, -8],
  'Murfreesboro': [35.8456, -86.3903, -6],
  'Killeen': [31.1171, -97.7278, -6],
  'Bellevue': [47.6101, -122.2015, -8],
  'Hampton': [37.0299, -76.3452, -5],
  'West Valley City': [40.6916, -112.001, -7],
  'Warren': [42.4775, -83.0277, -5],
  'Columbia': [34.0007, -81.0348, -5],
  'Sterling Heights': [42.5803, -83.0302, -5],
  'New Haven': [41.3082, -72.9282, -5],
  'Miramar': [25.986, -80.3326, -5],
  'Cedar Rapids': [41.9779, -91.6656, -6],
  'Elizabeth': [40.664, -74.2107, -5],
  'Coral Springs': [26.2712, -80.2706, -5],
  'Stamford': [41.0534, -73.5387, -5],
  'Hartford': [41.7658, -72.6851, -5],
  'Concord': [37.978, -122.0311, -8],
  'Hollywood': [26.0112, -80.1495, -5],
  'Abilene': [32.4487, -99.7331, -6],
  'Thousand Oaks': [34.1705, -118.8376, -8],
  'Arvada': [39.8028, -105.0875, -7],
  'Provo': [40.2338, -111.6585, -7],
  'Clearwater': [27.9659, -82.8001, -5],
  'Independence': [39.0911, -94.4155, -6],
  'Ann Arbor': [42.2808, -83.743, -5],
  'West Palm Beach': [26.7153, -80.0534, -5],
  'Costa Mesa': [33.6411, -117.9187, -8],
  'Manchester': [42.9956, -71.4548, -5],
  'Downey': [33.9401, -118.1332, -8],
  'Miami': [25.7617, -80.1918, -5],
  'Boston': [42.3601, -71.0589, -5],
  'Detroit': [42.3314, -83.0458, -5],
  'Memphis': [35.1495, -90.049, -6],
  'El Paso': [31.7619, -106.485, -7],
  // Canada
  'Toronto': [43.6532, -79.3832, -5],
  'Montreal': [45.5017, -73.5673, -5],
  'Vancouver': [49.2827, -123.1207, -8],
  'Calgary': [51.0447, -114.0719, -7],
  'Edmonton': [53.5461, -113.4938, -7],
  'Ottawa': [45.4215, -75.6972, -5],
  'Winnipeg': [49.8951, -97.1384, -6],
  'Quebec City': [46.8139, -71.208, -5],
  'Hamilton': [43.2557, -79.8711, -5],
  'Kitchener': [43.4516, -80.4925, -5],
  // Europe
  'London': [51.5074, -0.1278, 0],
  'Paris': [48.8566, 2.3522, 1],
  'Berlin': [52.52, 13.405, 1],
  'Madrid': [40.4168, -3.7038, 1],
  'Rome': [41.9028, 12.4964, 1],
  'Vienna': [48.2082, 16.3738, 1],
  'Amsterdam': [52.3676, 4.9041, 1],
  'Brussels': [50.8503, 4.3517, 1],
  'Zurich': [47.3769, 8.5417, 1],
  'Stockholm': [59.3293, 18.0686, 1],
  'Oslo': [59.9139, 10.7522, 1],
  'Copenhagen': [55.6761, 12.5683, 1],
  'Helsinki': [60.1699, 24.9384, 2],
  'Athens': [37.9838, 23.7275, 2],
  'Warsaw': [52.2297, 21.0122, 1],
  'Budapest': [47.4979, 19.0402, 1],
  'Bucharest': [44.4268, 26.1025, 2],
  'Prague': [50.0755, 14.4378, 1],
  'Sofia': [42.6977, 23.3219, 2],
  'Istanbul': [41.0082, 28.9784, 3],
  'Ankara': [39.9334, 32.8597, 3],
  'Kyiv': [50.4501, 30.5234, 2],
  'Moscow': [55.7558, 37.6173, 3],
  'Minsk': [53.9045, 27.5615, 3],
  'Lisbon': [38.7223, -9.1393, 0],
  'Dublin': [53.3498, -6.2603, 0],
  'Edinburgh': [55.9533, -3.1883, 0],
  'Cardiff': [51.4816, -3.1791, 0],
  'Lyon': [45.764, 4.8357, 1],
  'Marseille': [43.2965, 5.3698, 1],
  'Barcelona': [41.3851, 2.1734, 1],
  'Seville': [37.3891, -5.9845, 1],
  'Valencia': [39.4699, -0.3763, 1],
  'Naples': [40.8518, 14.2681, 1],
  'Milan': [45.4654, 9.1859, 1],
  'Turin': [45.0703, 7.6869, 1],
  'Cologne': [50.9333, 6.95, 1],
  'Frankfurt': [50.1109, 8.6821, 1],
  'Hamburg': [53.5753, 10.0153, 1],
  'Munich': [48.1351, 11.582, 1],
  'Riga': [56.946, 24.1059, 2],
  'Tallinn': [59.437, 24.7536, 2],
  'Vilnius': [54.6872, 25.2797, 2],
  'Bratislava': [48.1486, 17.1077, 1],
  'Ljubljana': [46.0569, 14.5058, 1],
  'Zagreb': [45.815, 15.9785, 1],
  'Belgrade': [44.7866, 20.4489, 1],
  'Sarajevo': [43.8563, 18.4131, 1],
  'Skopje': [41.9965, 21.4314, 1],
  'Tirana': [41.3275, 19.8189, 1],
  'Chisinau': [47.0105, 28.8638, 2],
  'Yerevan': [40.1792, 44.4991, 4],
  'Tbilisi': [41.6938, 44.8015, 4],
  'Baku': [40.4093, 49.8671, 4],
  // Africa
  'Cairo': [30.0444, 31.2357, 2],
  'Casablanca': [33.5731, -7.5898, 0],
  'Rabat': [34.0209, -6.8416, 0],
  'Tunis': [36.8065, 10.1815, 1],
  'Algiers': [36.7372, 3.0865, 1],
  'Tripoli': [32.9029, 13.1875, 2],
  'Lagos': [6.5244, 3.3792, 1],
  'Abuja': [9.0765, 7.3986, 1],
  'Accra': [5.6037, -0.187, 0],
  'Dakar': [14.7167, -17.4677, 0],
  'Nairobi': [-1.2921, 36.8219, 3],
  'Addis Ababa': [9.145, 40.4897, 3],
  'Khartoum': [15.5007, 32.5599, 3],
  'Dar es Salaam': [-6.7924, 39.2083, 3],
  'Kinshasa': [-4.4419, 15.2663, 1],
  'Johannesburg': [-26.2041, 28.0473, 2],
  'Cape Town': [-33.9249, 18.4241, 2],
  'Durban': [-29.8587, 31.0218, 2],
  'Pretoria': [-25.7479, 28.2293, 2],
  'Luanda': [-8.8368, 13.2343, 1],
  'Maputo': [-25.9692, 32.5732, 2],
  'Harare': [-17.8252, 31.0335, 2],
  'Lusaka': [-15.3875, 28.3228, 2],
  'Kampala': [0.3476, 32.5825, 3],
  'Antananarivo': [-18.9137, 47.5361, 3],
  'Mogadishu': [2.0469, 45.3418, 3],
  // Middle East
  'Tehran': [35.6892, 51.389, 3.5],
  'Baghdad': [33.3152, 44.3661, 3],
  'Riyadh': [24.7136, 46.6753, 3],
  'Jeddah': [21.4858, 39.1925, 3],
  'Dubai': [25.2048, 55.2708, 4],
  'Abu Dhabi': [24.4539, 54.3773, 4],
  'Doha': [25.2854, 51.531, 3],
  'Kuwait City': [29.3759, 47.9774, 3],
  'Muscat': [23.588, 58.3829, 4],
  'Manama': [26.2235, 50.5876, 3],
  'Sanaa': [15.3694, 44.191, 3],
  'Beirut': [33.8938, 35.5018, 2],
  'Damascus': [33.5138, 36.2765, 2],
  'Amman': [31.9566, 35.9457, 2],
  'Jerusalem': [31.7683, 35.2137, 2],
  'Tel Aviv': [32.0853, 34.7818, 2],
  // South / Central Asia
  'Kabul': [34.5553, 69.2075, 4.5],
  'Islamabad': [33.6844, 73.0479, 5],
  'Karachi': [24.8607, 67.0011, 5],
  'Lahore': [31.5204, 74.3587, 5],
  'Mumbai': [19.076, 72.8777, 5.5],
  'Delhi': [28.6139, 77.209, 5.5],
  'New Delhi': [28.6139, 77.209, 5.5],
  'Bangalore': [12.9716, 77.5946, 5.5],
  'Hyderabad': [17.385, 78.4867, 5.5],
  'Chennai': [13.0827, 80.2707, 5.5],
  'Kolkata': [22.5726, 88.3639, 5.5],
  'Ahmedabad': [23.0225, 72.5714, 5.5],
  'Pune': [18.5204, 73.8567, 5.5],
  'Surat': [21.1702, 72.8311, 5.5],
  'Jaipur': [26.9124, 75.7873, 5.5],
  'Lucknow': [26.8467, 80.9462, 5.5],
  'Colombo': [6.9271, 79.8612, 5.5],
  'Dhaka': [23.8103, 90.4125, 6],
  'Chittagong': [22.3569, 91.7832, 6],
  'Kathmandu': [27.7172, 85.324, 5.75],
  // Southeast Asia
  'Yangon': [16.8661, 96.1951, 6.5],
  'Bangkok': [13.7563, 100.5018, 7],
  'Phnom Penh': [11.5625, 104.916, 7],
  'Vientiane': [17.9757, 102.6331, 7],
  'Kuala Lumpur': [3.139, 101.6869, 8],
  'Singapore': [1.3521, 103.8198, 8],
  'Jakarta': [-6.2088, 106.8456, 7],
  'Surabaya': [-7.2575, 112.7521, 7],
  'Manila': [14.5995, 120.9842, 8],
  'Ho Chi Minh City': [10.8231, 106.6297, 7],
  'Hanoi': [21.0285, 105.8542, 7],
  // East Asia
  'Taipei': [25.033, 121.5654, 8],
  'Hong Kong': [22.3193, 114.1694, 8],
  'Shanghai': [31.2304, 121.4737, 8],
  'Beijing': [39.9042, 116.4074, 8],
  'Chongqing': [29.563, 106.5516, 8],
  'Shenzhen': [22.5431, 114.0579, 8],
  'Guangzhou': [23.1291, 113.2644, 8],
  'Chengdu': [30.5728, 104.0668, 8],
  'Tianjin': [39.3434, 117.3616, 8],
  'Wuhan': [30.5928, 114.3055, 8],
  'Nanjing': [32.0603, 118.7969, 8],
  "Xi'an": [34.3416, 108.9398, 8],
  'Hangzhou': [30.2741, 120.1551, 8],
  'Shenyang': [41.8057, 123.4315, 8],
  'Harbin': [45.8038, 126.5349, 8],
  'Qingdao': [36.0671, 120.3826, 8],
  'Ulaanbaatar': [47.8864, 106.9057, 8],
  'Seoul': [37.5665, 126.978, 9],
  'Busan': [35.1796, 129.0756, 9],
  'Tokyo': [35.6762, 139.6503, 9],
  'Osaka': [34.6937, 135.5023, 9],
  'Nagoya': [35.1815, 136.9066, 9],
  'Sapporo': [43.0618, 141.3545, 9],
  'Fukuoka': [33.5904, 130.4017, 9],
  'Kyoto': [35.0116, 135.7681, 9],
  'Hiroshima': [34.3853, 132.4553, 9],
  // Oceania
  'Sydney': [-33.8688, 151.2093, 10],
  'Melbourne': [-37.8136, 144.9631, 10],
  'Brisbane': [-27.4698, 153.0251, 10],
  'Perth': [-31.9505, 115.8605, 8],
  'Adelaide': [-34.9285, 138.6007, 9.5],
  'Canberra': [-35.2809, 149.13, 10],
  'Auckland': [-36.8509, 174.7645, 12],
  'Wellington': [-41.2865, 174.7762, 12],
  'Christchurch': [-43.5321, 172.6362, 12],
  // Latin America
  'Mexico City': [19.4326, -99.1332, -6],
  'Guadalajara': [20.6597, -103.3496, -6],
  'Monterrey': [25.6866, -100.3161, -6],
  'Puebla': [19.0414, -98.2063, -6],
  'Tijuana': [32.5149, -117.0382, -8],
  'Havana': [23.1136, -82.3666, -5],
  'Santo Domingo': [18.4861, -69.9312, -4],
  'San Juan': [18.4655, -66.1057, -4],
  'Port-au-Prince': [18.5944, -72.3074, -5],
  'Kingston': [17.9714, -76.7936, -5],
  'Guatemala City': [14.6349, -90.5069, -6],
  'Tegucigalpa': [14.0818, -87.2068, -6],
  'San Salvador': [13.6929, -89.2182, -6],
  'Managua': [12.1149, -86.2362, -6],
  'Panama City': [8.9936, -79.5197, -5],
  'Bogota': [4.711, -74.0721, -5],
  'Medellin': [6.2518, -75.5636, -5],
  'Cali': [3.4516, -76.532, -5],
  'Barranquilla': [10.9685, -74.7813, -5],
  'Caracas': [10.4806, -66.9036, -4],
  'Quito': [-0.1807, -78.4678, -5],
  'Guayaquil': [-2.1709, -79.9224, -5],
  'Lima': [-12.0464, -77.0428, -5],
  'Santiago': [-33.4489, -70.6693, -4],
  'Buenos Aires': [-34.6037, -58.3816, -3],
  'Cordoba': [-31.4201, -64.1888, -3],
  'Rosario': [-32.9442, -60.6505, -3],
  'Mendoza': [-32.8908, -68.8272, -3],
  'Montevideo': [-34.9011, -56.1645, -3],
  'Asuncion': [-25.2867, -57.647, -4],
  'La Paz': [-16.5, -68.1193, -4],
  'Brasilia': [-15.7975, -47.8919, -3],
  'Sao Paulo': [-23.5505, -46.6333, -3],
  'Rio de Janeiro': [-22.9068, -43.1729, -3],
  'Salvador': [-12.9714, -38.5014, -3],
  'Fortaleza': [-3.7172, -38.5434, -3],
  'Belo Horizonte': [-19.9167, -43.9345, -3],
  'Manaus': [-3.119, -60.0217, -4],
  'Curitiba': [-25.4284, -49.2733, -3],
  'Recife': [-8.0476, -34.877, -3],
};

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Get sun sign from YYYY-MM-DD birth date string.
 * @param {string} birthDateStr
 * @returns {string|null}
 */
export function getSunSign(birthDateStr) {
  const parts = birthDateStr.split('-');
  if (parts.length !== 3) return null;
  const month = parseInt(parts[1], 10);
  const day   = parseInt(parts[2], 10);
  if (isNaN(month) || isNaN(day)) return null;

  if ((month === 3  && day >= 21) || (month === 4  && day <= 19)) return 'Aries';
  if ((month === 4  && day >= 20) || (month === 5  && day <= 20)) return 'Taurus';
  if ((month === 5  && day >= 21) || (month === 6  && day <= 20)) return 'Gemini';
  if ((month === 6  && day >= 21) || (month === 7  && day <= 22)) return 'Cancer';
  if ((month === 7  && day >= 23) || (month === 8  && day <= 22)) return 'Leo';
  if ((month === 8  && day >= 23) || (month === 9  && day <= 22)) return 'Virgo';
  if ((month === 9  && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1  && day <= 19)) return 'Capricorn';
  if ((month === 1  && day >= 20) || (month === 2  && day <= 18)) return 'Aquarius';
  if ((month === 2  && day >= 19) || (month === 3  && day <= 20)) return 'Pisces';
  return null;
}

/**
 * Look up city coordinates and standard UTC offset.
 * @param {string} cityName
 * @param {string} [countryName] - unused for now, kept for future disambiguation
 * @returns {{ lat: number, lon: number, utcOffset: number } | null}
 */
export function getCityCoords(cityName, countryName) {
  if (!cityName) return null;
  const normalize = s => s.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const query = normalize(cityName);

  for (const [key, val] of Object.entries(CITY_COORDS)) {
    if (normalize(key) === query) {
      return { lat: val[0], lon: val[1], utcOffset: val[2] };
    }
  }
  // Partial: key starts with query
  for (const [key, val] of Object.entries(CITY_COORDS)) {
    if (normalize(key).startsWith(query) && query.length >= 3) {
      return { lat: val[0], lon: val[1], utcOffset: val[2] };
    }
  }
  // Partial: query starts with key
  for (const [key, val] of Object.entries(CITY_COORDS)) {
    const k = normalize(key);
    if (query.startsWith(k) && k.length >= 4) {
      return { lat: val[0], lon: val[1], utcOffset: val[2] };
    }
  }
  return null;
}

/**
 * Calculate moon sign.
 * @param {string} birthDate   - YYYY-MM-DD
 * @param {string|null} birthTime - HH:MM (local 24h); if null, uses noon
 * @param {number} [utcOffset=0] - standard UTC offset in hours
 * @returns {{ sign: string, degree: number, note?: string }}
 */
export function calculateMoonSign(birthDate, birthTime, utcOffset = 0) {
  const [year, month, day] = birthDate.split('-').map(Number);
  let hour = 12, minute = 0;
  const noTime = !birthTime;

  if (birthTime) {
    const tp = birthTime.split(':');
    hour   = parseInt(tp[0], 10);
    minute = parseInt(tp[1], 10) || 0;
  }

  // Convert local time to UTC
  const hourUTC = hour - utcOffset;
  const jde = dateToJulian(year, month, day, hourUTC, minute, 0);
  const { sign, degree } = longitudeToSign(moonLongitude(jde));

  if (noTime) {
    // Check if moon changed sign during this calendar day (local midnight to midnight)
    const jdeStart = dateToJulian(year, month, day, 0 - utcOffset, 0, 0);
    const jdeEnd   = dateToJulian(year, month, day, 24 - utcOffset, 0, 0);
    const signStart = longitudeToSign(moonLongitude(jdeStart)).sign;
    const signEnd   = longitudeToSign(moonLongitude(jdeEnd)).sign;

    if (signStart !== signEnd) {
      const otherSign = signStart === sign ? signEnd : signStart;
      return {
        sign,
        degree,
        note: `The moon changed signs on your birth date. Without an exact birth time, this uses noon. Your moon might be ${otherSign} instead.`,
      };
    }
  }

  return { sign, degree };
}

/**
 * Calculate rising sign (ascendant).
 * Requires birth time AND location.
 * @param {string} birthDate - YYYY-MM-DD
 * @param {string} birthTime - HH:MM (local 24h) — required
 * @param {number} latitude  - geographic latitude in degrees (+ north)
 * @param {number} longitude - geographic longitude in degrees (+ east)
 * @param {number} [utcOffset=0] - standard UTC offset in hours
 * @returns {{ sign: string, degree: number } | null}
 */
export function calculateRisingSign(birthDate, birthTime, latitude, longitude, utcOffset = 0) {
  if (!birthTime || latitude == null || longitude == null) return null;

  const [year, month, day] = birthDate.split('-').map(Number);
  const tp = birthTime.split(':');
  const hour   = parseInt(tp[0], 10);
  const minute = parseInt(tp[1], 10) || 0;

  const hourUTC = hour - utcOffset;
  const jde = dateToJulian(year, month, day, hourUTC, minute, 0);

  const GST       = greenwichSiderealTime(jde);
  const LST       = norm360(GST + longitude);
  const obliquity = meanObliquity(jde);
  const ascLon    = ascendantLongitude(LST, latitude, obliquity);

  return longitudeToSign(ascLon);
}
