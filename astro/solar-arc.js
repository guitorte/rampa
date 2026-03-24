// solar-arc.js — Solar Arc Directions for rectification
// All chart points advance at the same rate as the Sun's progression (~0.9856°/year)
'use strict';

const SolarArc = (() => {

  const ORBE = 1.0; // degrees — standard orb for rectification

  // Which natal angles are most relevant for each event type
  const EVENT_ANGLE_MAP = {
    familia:        ['ic', 'mc', 'asc'],      // IC = family, roots
    carreira:       ['mc', 'asc'],              // MC = career, public status
    saude:          ['asc', 'mc'],              // ASC = body, self
    moradia:        ['ic', 'asc'],              // IC = home
    educacao:       ['mc', 'asc'],              // MC = achievement
    relacionamento: ['dsc', 'asc'],             // DSC = partnerships
    outro:          ['asc', 'mc', 'dsc', 'ic']  // check all
  };

  // Planet-to-event-type affinity (for scoring bonus)
  const PLANET_AFFINITY = {
    sun:    ['carreira', 'saude', 'identidade'],
    moon:   ['familia', 'moradia', 'saude'],
    mercury: ['educacao', 'comunicacao'],
    venus:  ['relacionamento', 'carreira'],
    mars:   ['saude', 'carreira', 'moradia'],
    jupiter: ['educacao', 'carreira', 'viagem'],
    saturn: ['carreira', 'familia', 'saude', 'moradia'],
    northNode: ['familia', 'carreira', 'relacionamento']
  };

  /**
   * Calculate the solar arc in degrees for a given number of elapsed years.
   * More precise: uses the actual Sun position difference between natal and progressed date.
   * Simplified: ~0.9856° per year (mean solar motion).
   */
  function calcArc(elapsedYears) {
    return elapsedYears * 0.9856;
  }

  /**
   * Calculate precise arc using actual Sun positions.
   * @param {number} natalJD - Julian Day of birth
   * @param {number} elapsedYears - years since birth
   */
  function calcPreciseArc(natalJD, elapsedYears) {
    const T0 = Ephemeris.toT(natalJD);
    const progressedJD = natalJD + elapsedYears; // 1 day = 1 year in progressions
    const T1 = Ephemeris.toT(progressedJD);
    const sunNatal = Ephemeris.sunLongitude(T0);
    const sunProgressed = Ephemeris.sunLongitude(T1);
    let arc = sunProgressed - sunNatal;
    // Handle wrap-around
    if (arc < -180) arc += 360;
    if (arc > 180) arc -= 360;
    return arc;
  }

  /**
   * Check all possible solar arc activations between directed planets and natal angles.
   *
   * @param {NatalChart} chart - natal chart for the candidate time
   * @param {Date} eventDate - when the event occurred
   * @param {Date} birthDate - date of birth
   * @param {string} eventType - event category (familia, carreira, etc.)
   * @returns {{ score: number, activations: Array }}
   */
  function checkActivations(chart, eventDate, birthDate, eventType) {
    const elapsedYears = (eventDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000);
    const arc = calcArc(elapsedYears);

    const relevantAngles = EVENT_ANGLE_MAP[eventType] || EVENT_ANGLE_MAP.outro;
    const activations = [];

    // Get natal angle longitudes
    const angleLons = {
      asc: chart.angles.asc.longitude,
      mc: chart.angles.mc.longitude,
      dsc: chart.angles.dsc.longitude,
      ic: chart.angles.ic.longitude
    };

    // Check each planet directed to each relevant natal angle
    const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

    for (const planet of planets) {
      const natalPlanetLon = chart.planets[planet].longitude;
      const directedLon = Ephemeris.norm360(natalPlanetLon + arc);

      for (const angleKey of relevantAngles) {
        const angleLon = angleLons[angleKey];
        const diff = Math.abs(Ephemeris.norm180(directedLon - angleLon));

        if (diff <= ORBE) {
          const closeness = 1 - (diff / ORBE); // 1.0 = exact, 0.0 = at orb boundary
          const affinityBonus = hasAffinity(planet, eventType) ? 0.15 : 0;
          const score = closeness + affinityBonus;

          activations.push({
            type: 'planet_to_angle',
            planet,
            angle: angleKey,
            directedLon,
            angleLon,
            orb: diff,
            score: Math.min(score, 1.0)
          });
        }
      }
    }

    // Also check: natal angles directed to natal planets
    for (const angleKey of ['asc', 'mc']) {
      const directedAngle = Ephemeris.norm360(angleLons[angleKey] + arc);

      for (const planet of planets) {
        const natalPlanetLon = chart.planets[planet].longitude;
        const diff = Math.abs(Ephemeris.norm180(directedAngle - natalPlanetLon));

        if (diff <= ORBE) {
          const closeness = 1 - (diff / ORBE);
          const affinityBonus = hasAffinity(planet, eventType) ? 0.15 : 0;
          const score = closeness + affinityBonus;

          activations.push({
            type: 'angle_to_planet',
            angle: angleKey,
            planet,
            directedLon: directedAngle,
            planetLon: natalPlanetLon,
            orb: diff,
            score: Math.min(score, 1.0)
          });
        }
      }
    }

    // Overall score: best activation score (not average, since one strong hit is significant)
    const bestScore = activations.length > 0
      ? Math.max(...activations.map(a => a.score))
      : 0;

    return { score: bestScore, activations };
  }

  function hasAffinity(planet, eventType) {
    const affinities = PLANET_AFFINITY[planet];
    return affinities ? affinities.includes(eventType) : false;
  }

  return { checkActivations, calcArc, ORBE };
})();
