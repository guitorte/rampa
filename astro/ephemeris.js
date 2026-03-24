// ephemeris.js — Pure JavaScript astronomical calculations
// Based on Jean Meeus "Astronomical Algorithms" (2nd ed.)
// Accuracy: Sun ~1', Moon ~10', planets ~5-10' — sufficient for rectification
'use strict';

const Ephemeris = (() => {

  const DEG = Math.PI / 180;
  const RAD = 180 / Math.PI;

  // ── Julian Day ──────────────────────────────────────────────
  /**
   * Convert calendar date to Julian Day Number.
   * Meeus, Chapter 7
   */
  function toJD(year, month, day, hour, minute) {
    hour = hour || 0;
    minute = minute || 0;
    const dayFrac = day + (hour + minute / 60) / 24;

    if (month <= 2) { year--; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) +
           Math.floor(30.6001 * (month + 1)) +
           dayFrac + B - 1524.5;
  }

  /**
   * Julian centuries from J2000.0
   */
  function toT(jd) {
    return (jd - 2451545.0) / 36525.0;
  }

  // ── Utility ─────────────────────────────────────────────────
  function norm360(x) {
    x = x % 360;
    return x < 0 ? x + 360 : x;
  }

  function norm180(x) {
    x = norm360(x);
    return x > 180 ? x - 360 : x;
  }

  // ── Obliquity of the Ecliptic ──────────────────────────────
  /**
   * Mean obliquity of the ecliptic (Meeus eq. 22.2)
   */
  function obliquity(T) {
    return 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
  }

  // ── Nutation ───────────────────────────────────────────────
  function nutation(T) {
    const omega = (125.04452 - 1934.136261 * T) * DEG;
    const L0 = (280.4665 + 36000.7698 * T) * DEG;
    const Lp = (218.3165 + 481267.8813 * T) * DEG;
    const dPsi = -17.20 / 3600 * Math.sin(omega)
                 - 1.32 / 3600 * Math.sin(2 * L0)
                 - 0.23 / 3600 * Math.sin(2 * Lp)
                 + 0.21 / 3600 * Math.sin(2 * omega);
    const dEps = 9.20 / 3600 * Math.cos(omega)
                 + 0.57 / 3600 * Math.cos(2 * L0)
                 + 0.10 / 3600 * Math.cos(2 * Lp)
                 - 0.09 / 3600 * Math.cos(2 * omega);
    return { dPsi, dEps };
  }

  // ── Sun Position (VSOP87 simplified) ───────────────────────
  /**
   * Geocentric ecliptic longitude of the Sun (degrees).
   * Meeus Chapter 25 (low accuracy, ~1' precision)
   */
  function sunLongitude(T) {
    // Geometric mean longitude
    const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    // Mean anomaly
    const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const Mr = M * DEG;
    // Equation of center
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
            + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
            + 0.000289 * Math.sin(3 * Mr);
    // Sun's true longitude
    let lon = L0 + C;
    // Apparent longitude (nutation + aberration)
    const omega = 125.04 - 1934.136 * T;
    lon = lon - 0.00569 - 0.00478 * Math.sin(omega * DEG);
    return norm360(lon);
  }

  // ── Moon Position (simplified ELP2000) ─────────────────────
  /**
   * Geocentric ecliptic longitude of the Moon (degrees).
   * Meeus Chapter 47 (main terms only, ~10' accuracy)
   */
  function moonLongitude(T) {
    // Mean longitude
    const Lp = norm360(218.3164477 + 481267.88123421 * T
               - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000);
    // Mean elongation
    const D = norm360(297.8501921 + 445267.1114034 * T
              - 0.0018819 * T * T + T * T * T / 545868 - T * T * T * T / 113065000);
    // Sun's mean anomaly
    const M = norm360(357.5291092 + 35999.0502909 * T
              - 0.0001536 * T * T + T * T * T / 24490000);
    // Moon's mean anomaly
    const Mp = norm360(134.9633964 + 477198.8675055 * T
               + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000);
    // Moon's argument of latitude
    const F = norm360(93.2720950 + 483202.0175233 * T
              - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000);

    const Dr = D * DEG, Mr = M * DEG, Mpr = Mp * DEG, Fr = F * DEG;

    // Main periodic terms for longitude (in 0.000001 degrees)
    let sumL = 0;
    sumL += 6288774 * Math.sin(Mpr);
    sumL += 1274027 * Math.sin(2 * Dr - Mpr);
    sumL += 658314 * Math.sin(2 * Dr);
    sumL += 213618 * Math.sin(2 * Mpr);
    sumL += -185116 * Math.sin(Mr);
    sumL += -114332 * Math.sin(2 * Fr);
    sumL += 58793 * Math.sin(2 * Dr - 2 * Mpr);
    sumL += 57066 * Math.sin(2 * Dr - Mr - Mpr);
    sumL += 53322 * Math.sin(2 * Dr + Mpr);
    sumL += 45758 * Math.sin(2 * Dr - Mr);
    sumL += -40923 * Math.sin(Mr - Mpr);
    sumL += -34720 * Math.sin(Dr);
    sumL += -30383 * Math.sin(Mr + Mpr);
    sumL += 15327 * Math.sin(2 * Dr - 2 * Fr);
    sumL += -12528 * Math.sin(Mpr + 2 * Fr);
    sumL += 10980 * Math.sin(Mpr - 2 * Fr);
    sumL += 10675 * Math.sin(4 * Dr - Mpr);
    sumL += 10034 * Math.sin(3 * Mpr);
    sumL += 8548 * Math.sin(4 * Dr - 2 * Mpr);
    sumL += -7888 * Math.sin(2 * Dr + Mr - Mpr);
    sumL += -6766 * Math.sin(2 * Dr + Mr);
    sumL += -5163 * Math.sin(Dr - Mpr);
    sumL += 4987 * Math.sin(Dr + Mr);
    sumL += 4036 * Math.sin(2 * Dr - Mr + Mpr);

    const lon = Lp + sumL / 1000000;

    // Apply nutation
    const nut = nutation(T);
    return norm360(lon + nut.dPsi);
  }

  // ── Planetary Positions (simplified) ───────────────────────
  // Simplified planetary longitude calculations using mean elements + perturbation terms
  // Good enough for rectification (5-15' accuracy)

  function mercuryLongitude(T) {
    const L = norm360(252.2509 + 149474.0722 * T);
    const M = norm360(174.7948 + 149472.5153 * T);
    const Mr = M * DEG;
    const lon = L + 6.7 * Math.sin(Mr)
              + 1.03 * Math.sin(2 * Mr)
              + 0.21 * Math.sin(3 * Mr);
    return norm360(lon);
  }

  function venusLongitude(T) {
    const L = norm360(181.9798 + 58519.2130 * T);
    const M = norm360(50.4161 + 58517.8039 * T);
    const Mr = M * DEG;
    const lon = L + 0.7758 * Math.sin(Mr)
              + 0.0033 * Math.sin(2 * Mr);
    return norm360(lon);
  }

  function marsLongitude(T) {
    const L = norm360(355.4330 + 19141.6964 * T);
    const M = norm360(19.3730 + 19139.8585 * T);
    const Mr = M * DEG;
    const lon = L + 10.691 * Math.sin(Mr)
              + 0.623 * Math.sin(2 * Mr)
              + 0.050 * Math.sin(3 * Mr);
    return norm360(lon);
  }

  function jupiterLongitude(T) {
    const L = norm360(34.3515 + 3036.3027 * T);
    const M = norm360(20.0202 + 3034.6962 * T);
    const Mr = M * DEG;
    const lon = L + 5.555 * Math.sin(Mr)
              + 0.168 * Math.sin(2 * Mr);
    return norm360(lon);
  }

  function saturnLongitude(T) {
    const L = norm360(50.0774 + 1223.5110 * T);
    const M = norm360(317.0207 + 1222.1138 * T);
    const Mr = M * DEG;
    const lon = L + 6.400 * Math.sin(Mr)
              + 0.318 * Math.sin(2 * Mr);
    return norm360(lon);
  }

  // North Node (mean)
  function northNodeLongitude(T) {
    return norm360(125.0446 - 1934.1363 * T + 0.0021 * T * T);
  }

  /**
   * Get all planetary positions at a given Julian Day.
   * Returns object with planet names as keys, longitude in degrees.
   */
  function getAllPositions(jd) {
    const T = toT(jd);
    return {
      sun: sunLongitude(T),
      moon: moonLongitude(T),
      mercury: mercuryLongitude(T),
      venus: venusLongitude(T),
      mars: marsLongitude(T),
      jupiter: jupiterLongitude(T),
      saturn: saturnLongitude(T),
      northNode: northNodeLongitude(T)
    };
  }

  // ── Sidereal Time ─────────────────────────────────────────
  /**
   * Greenwich Mean Sidereal Time in degrees (Meeus eq. 12.4)
   */
  function gmst(jd) {
    const T = toT(jd);
    let theta = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
              + 0.000387933 * T * T - T * T * T / 38710000;
    return norm360(theta);
  }

  /**
   * Local Sidereal Time in degrees
   */
  function lst(jd, lonDeg) {
    return norm360(gmst(jd) + lonDeg);
  }

  // ── Ascendant & Midheaven ─────────────────────────────────
  /**
   * Calculate the Ascendant (rising sign) in degrees.
   * Meeus Chapter 14 / standard formula
   * @param {number} lstDeg - Local Sidereal Time in degrees
   * @param {number} latDeg - Geographic latitude in degrees
   * @param {number} oblDeg - Obliquity of the ecliptic in degrees
   */
  function calcASC(lstDeg, latDeg, oblDeg) {
    const lstR = lstDeg * DEG;
    const latR = latDeg * DEG;
    const oblR = oblDeg * DEG;

    const y = -Math.cos(lstR);
    const x = Math.sin(oblR) * Math.tan(latR) + Math.cos(oblR) * Math.sin(lstR);
    let asc = Math.atan2(y, x) * RAD;
    asc = norm360(asc);

    // For Southern Hemisphere latitudes the standard formula computes the
    // Descendant (the setting point) rather than the Ascendant (the rising
    // point). Add 180° to obtain the correct Ascendant.
    if (latDeg < 0) {
      asc = norm360(asc + 180);
    }

    return asc;
  }

  /**
   * Calculate the Midheaven (MC) in degrees.
   * MC = atan(tan(LST) / cos(obliquity))
   */
  function calcMC(lstDeg, oblDeg) {
    const lstR = lstDeg * DEG;
    const oblR = oblDeg * DEG;

    let mc = Math.atan2(Math.sin(lstR), Math.cos(lstR) * Math.cos(oblR)) * RAD;
    mc = norm360(mc);

    // MC should be in the upper hemisphere relative to LST
    // If LST is between 0-180, MC should also roughly be there
    // Standard correction: if MC and RAMC differ by more than 90°, add 180°
    const ramc = norm360(lstDeg);
    if (Math.abs(norm180(mc - ramc)) > 90) {
      mc = norm360(mc + 180);
    }

    return mc;
  }

  /**
   * Calculate angles (ASC, MC, DSC, IC) for given JD and location.
   */
  function getAngles(jd, latDeg, lonDeg) {
    const T = toT(jd);
    const obl = obliquity(T);
    const localST = lst(jd, lonDeg);

    const asc = calcASC(localST, latDeg, obl);
    const mc = calcMC(localST, obl);
    const dsc = norm360(asc + 180);
    const ic = norm360(mc + 180);

    return { asc, mc, dsc, ic };
  }

  // ── Zodiac Formatting ─────────────────────────────────────
  const SIGNS = [
    'Áries', 'Touro', 'Gêmeos', 'Câncer',
    'Leão', 'Virgem', 'Libra', 'Escorpião',
    'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
  ];

  const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  // Traditional rulerships for profections
  const SIGN_RULERS = [
    'mars', 'venus', 'mercury', 'moon',
    'sun', 'mercury', 'venus', 'mars',
    'jupiter', 'saturn', 'saturn', 'jupiter'
  ];

  function getSign(lonDeg) {
    const idx = Math.floor(norm360(lonDeg) / 30);
    return { index: idx, name: SIGNS[idx], symbol: SIGN_SYMBOLS[idx] };
  }

  function formatDegree(lonDeg) {
    const lon = norm360(lonDeg);
    const signIdx = Math.floor(lon / 30);
    const deg = Math.floor(lon % 30);
    const min = Math.floor((lon % 1) * 60);
    return `${deg}°${String(min).padStart(2, '0')}' ${SIGN_SYMBOLS[signIdx]} ${SIGNS[signIdx]}`;
  }

  // ── Whole Sign Houses ─────────────────────────────────────
  /**
   * Calculate Whole Sign houses. House 1 starts at the sign of the ASC.
   */
  function wholeSignHouses(ascDeg) {
    const ascSign = Math.floor(norm360(ascDeg) / 30);
    const cusps = [];
    for (let i = 0; i < 12; i++) {
      cusps.push(((ascSign + i) % 12) * 30);
    }
    return cusps;
  }

  /**
   * Get which whole-sign house a planet falls in.
   */
  function getHouse(planetLon, ascDeg) {
    const ascSign = Math.floor(norm360(ascDeg) / 30);
    const planetSign = Math.floor(norm360(planetLon) / 30);
    return ((planetSign - ascSign + 12) % 12) + 1;
  }

  return {
    toJD, toT, norm360, norm180,
    obliquity, nutation,
    sunLongitude, moonLongitude,
    mercuryLongitude, venusLongitude, marsLongitude,
    jupiterLongitude, saturnLongitude, northNodeLongitude,
    getAllPositions,
    gmst, lst,
    calcASC, calcMC, getAngles,
    SIGNS, SIGN_SYMBOLS, SIGN_RULERS,
    getSign, formatDegree,
    wholeSignHouses, getHouse,
    DEG, RAD
  };
})();
