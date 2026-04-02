// Quick test for the ephemeris engine
// Run: node api/lib/test-ephemeris.mjs

import { getSunSign, calculateMoonSign, calculateRisingSign, getCityCoords } from './ephemeris.js';

const tests = [
  {
    label: 'April 15, 1990 2:30 PM — New York (Aries sun)',
    date: '1990-04-15',
    time: '14:30',
    city: 'New York',
    expectedSun: 'Aries',
  },
  {
    label: 'December 25, 1985 midnight — London (Capricorn sun)',
    date: '1985-12-25',
    time: '00:00',
    city: 'London',
    expectedSun: 'Capricorn',
  },
  {
    label: 'July 4, 1776 5:10 PM — Philadelphia (Cancer sun)',
    date: '1776-07-04',
    time: '17:10',
    city: 'Philadelphia',
    expectedSun: 'Cancer',
  },
];

console.log('=== Sign Season Ephemeris Test ===\n');

for (const t of tests) {
  console.log(`--- ${t.label} ---`);
  const sun = getSunSign(t.date);
  console.log(`Sun:    ${sun} ${sun === t.expectedSun ? '✓' : `EXPECTED ${t.expectedSun} — GOT ${sun}`}`);

  const coords = getCityCoords(t.city);
  if (!coords) {
    console.log(`City lookup failed for: ${t.city}`);
    continue;
  }
  console.log(`City:   ${t.city} → lat=${coords.lat}, lon=${coords.lon}, UTC${coords.utcOffset >= 0 ? '+' : ''}${coords.utcOffset}`);

  const moon = calculateMoonSign(t.date, t.time, coords.utcOffset);
  console.log(`Moon:   ${moon.sign} (${moon.degree}°)${moon.note ? '\n        NOTE: ' + moon.note : ''}`);

  const rising = calculateRisingSign(t.date, t.time, coords.lat, coords.lon, coords.utcOffset);
  console.log(`Rising: ${rising ? `${rising.sign} (${rising.degree}°)` : 'null'}`);

  console.log();
}

// Extra: no birth time case
console.log('--- Moon only, no birth time (should include note if sign changes) ---');
const moonNoTime = calculateMoonSign('1990-04-15', null, -5);
console.log(`Moon (no time): ${moonNoTime.sign} (${moonNoTime.degree}°)${moonNoTime.note ? '\n  NOTE: ' + moonNoTime.note : ''}`);
console.log();

console.log('--- City lookup tests ---');
const cities = ['New York', 'los angeles', 'TOKYO', 'Nonexistent City XYZ'];
for (const c of cities) {
  const r = getCityCoords(c);
  console.log(`"${c}" → ${r ? `lat=${r.lat}, lon=${r.lon}` : 'not found'}`);
}
