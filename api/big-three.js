/**
 * big-three.js — Serverless API for "What's Your Big Three?" calculator
 *
 * GET /api/big-three?date=YYYY-MM-DD&time=HH:MM&city=CityName
 *
 * Returns JSON: { sun, moon, rising, sunGlyph, moonGlyph, risingGlyph, moonNote? }
 */

import {
  getSunSign,
  calculateMoonSign,
  calculateRisingSign,
  getCityCoords,
} from './lib/ephemeris.js';

const SIGN_GLYPHS = {
  Aries:       '♈',
  Taurus:      '♉',
  Gemini:      '♊',
  Cancer:      '♋',
  Leo:         '♌',
  Virgo:       '♍',
  Libra:       '♎',
  Scorpio:     '♏',
  Sagittarius: '♐',
  Capricorn:   '♑',
  Aquarius:    '♒',
  Pisces:      '♓',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://signseason.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET')    return res.status(405).json({ error: 'Method not allowed' });

  const { date, time, city } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });
  }

  // ── Sun sign ──────────────────────────────────────────────────────────────
  const sunSign = getSunSign(date);
  if (!sunSign) return res.status(400).json({ error: 'Could not determine sun sign for that date' });

  // ── Moon sign ─────────────────────────────────────────────────────────────
  let utcOffset = 0;
  let cityCoords = null;

  let cityNotFound = false;
  if (city) {
    // Try local lookup first (fast, no network)
    cityCoords = getCityCoords(city);

    // Fallback: geocode via OpenStreetMap Nominatim (free, no API key)
    if (!cityCoords) {
      try {
        const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
        const geoRes = await fetch(geoUrl, {
          headers: { 'User-Agent': 'SignSeason/1.0 (stars@signseason.com)' }
        });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.length > 0) {
            const lat = parseFloat(geoData[0].lat);
            const lon = parseFloat(geoData[0].lon);
            // Estimate UTC offset from longitude (rough but functional)
            const estOffset = Math.round(lon / 15);
            cityCoords = { lat, lon, utcOffset: estOffset };
          }
        }
      } catch (e) {
        // Geocoding failed silently, fall through to cityNotFound
      }
    }

    if (cityCoords) {
      utcOffset = cityCoords.utcOffset;
    } else {
      cityNotFound = true;
    }
  }

  const moonResult = calculateMoonSign(date, time || null, utcOffset);
  const moonSign   = moonResult.sign;
  const moonNote   = moonResult.note || null;

  // ── Rising sign ───────────────────────────────────────────────────────────
  let risingSign = null;
  if (time && cityCoords) {
    const rising = calculateRisingSign(
      date,
      time,
      cityCoords.lat,
      cityCoords.lon,
      cityCoords.utcOffset
    );
    if (rising) risingSign = rising.sign;
  }

  return res.status(200).json({
    sun:        sunSign,
    moon:       moonSign,
    rising:     risingSign,
    sunGlyph:   SIGN_GLYPHS[sunSign]   || '',
    moonGlyph:  SIGN_GLYPHS[moonSign]  || '',
    risingGlyph: risingSign ? (SIGN_GLYPHS[risingSign] || '') : null,
    moonNote,
    ...(cityNotFound ? { cityNotFound: true } : {}),
  });
}
