// progressions.js — Secondary Progressions
// "Day-for-year" method: each day after birth = 1 year of life.
// Progressed Moon is the primary timing indicator (~12-13° per year in progressed time).
'use strict';

const Progressions = (() => {

  const ORBE_MOON = 1.5;  // degrees — orb for progressed Moon to angles
  const ORBE_SUN = 1.0;   // degrees — orb for progressed Sun to angles

  // Major aspects to check (in degrees)
  const ASPECTS = [
    { name: 'conjunção', angle: 0 },
    { name: 'sextil', angle: 60 },
    { name: 'quadratura', angle: 90 },
    { name: 'trígono', angle: 120 },
    { name: 'oposição', angle: 180 }
  ];

  // Aspect strength multiplier (conjunction strongest, sextil weakest)
  const ASPECT_WEIGHT = {
    0: 1.0,
    60: 0.5,
    90: 0.75,
    120: 0.65,
    180: 0.85
  };

  /**
   * Calculate the progressed Julian Day for a given event date.
   * Progressed JD = natal JD + (elapsed years in days)
   * Since 1 day = 1 year, elapsed years = elapsed days in progression
   */
  function getProgressedJD(natalJD, birthDate, eventDate) {
    const elapsedYears = (eventDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000);
    return natalJD + elapsedYears; // 1 day per year
  }

  /**
   * Check if any aspect exists between two longitudes within a given orb.
   * @returns {{ match: boolean, aspect: string|null, orb: number, weight: number }}
   */
  function checkAspect(lon1, lon2, maxOrb) {
    let bestMatch = null;

    for (const asp of ASPECTS) {
      const diff = Math.abs(Ephemeris.norm180(lon1 - lon2));
      const orbFromAspect = Math.abs(diff - asp.angle);

      if (orbFromAspect <= maxOrb) {
        const score = (1 - orbFromAspect / maxOrb) * ASPECT_WEIGHT[asp.angle];
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = {
            match: true,
            aspect: asp.name,
            aspectAngle: asp.angle,
            orb: orbFromAspect,
            score
          };
        }
      }
    }

    return bestMatch || { match: false, aspect: null, orb: Infinity, score: 0 };
  }

  /**
   * Check progressed Moon and Sun against natal angles for a candidate chart.
   *
   * @param {NatalChart} chart - natal chart for candidate time
   * @param {Date} birthDate
   * @param {Date} eventDate
   * @param {string} eventType
   * @returns {{ score: number, activations: Array }}
   */
  function checkProgressions(chart, birthDate, eventDate, eventType) {
    const progressedJD = getProgressedJD(chart.jd, birthDate, eventDate);
    const T = Ephemeris.toT(progressedJD);

    const progMoonLon = Ephemeris.moonLongitude(T);
    const progSunLon = Ephemeris.sunLongitude(T);

    const activations = [];

    // Natal angles to check
    const angles = [
      { key: 'asc', lon: chart.angles.asc.longitude },
      { key: 'mc', lon: chart.angles.mc.longitude },
      { key: 'dsc', lon: chart.angles.dsc.longitude },
      { key: 'ic', lon: chart.angles.ic.longitude }
    ];

    // Check progressed Moon to each natal angle
    for (const ang of angles) {
      const result = checkAspect(progMoonLon, ang.lon, ORBE_MOON);
      if (result.match) {
        activations.push({
          type: 'prog_moon_to_angle',
          body: 'moon',
          angle: ang.key,
          progLon: progMoonLon,
          angleLon: ang.lon,
          aspect: result.aspect,
          orb: result.orb,
          score: result.score
        });
      }
    }

    // Check progressed Sun to each natal angle
    for (const ang of angles) {
      const result = checkAspect(progSunLon, ang.lon, ORBE_SUN);
      if (result.match) {
        activations.push({
          type: 'prog_sun_to_angle',
          body: 'sun',
          angle: ang.key,
          progLon: progSunLon,
          angleLon: ang.lon,
          aspect: result.aspect,
          orb: result.orb,
          score: result.score * 0.8 // Sun moves slowly, less discriminating
        });
      }
    }

    // Also check progressed Moon to natal planets (secondary importance)
    const importantPlanets = ['sun', 'moon', 'saturn', 'jupiter', 'mars'];
    for (const planet of importantPlanets) {
      const planetLon = chart.planets[planet].longitude;
      const result = checkAspect(progMoonLon, planetLon, ORBE_MOON);
      if (result.match) {
        activations.push({
          type: 'prog_moon_to_planet',
          body: 'moon',
          planet,
          progLon: progMoonLon,
          planetLon,
          aspect: result.aspect,
          orb: result.orb,
          score: result.score * 0.6 // Planet aspects less important than angle aspects
        });
      }
    }

    // Best score from all activations
    const bestScore = activations.length > 0
      ? Math.max(...activations.map(a => a.score))
      : 0;

    return { score: bestScore, activations };
  }

  return { checkProgressions, getProgressedJD, checkAspect, ORBE_MOON, ORBE_SUN };
})();
