// chart-calc.js — Natal chart calculator
// Combines ephemeris calculations into a complete natal chart
'use strict';

const ChartCalc = (() => {

  /**
   * Calculate a complete natal chart.
   * @param {number} year, month, day - UT date
   * @param {number} hour, minute - UT time
   * @param {number} lat - latitude (negative for south)
   * @param {number} lon - longitude (negative for west)
   * @returns {NatalChart}
   */
  function calculate(year, month, day, hour, minute, lat, lon) {
    const jd = Ephemeris.toJD(year, month, day, hour, minute);
    const angles = Ephemeris.getAngles(jd, lat, lon);
    const planets = Ephemeris.getAllPositions(jd);
    const houseCusps = Ephemeris.wholeSignHouses(angles.asc);

    // Build planet details with house placement
    const planetDetails = {};
    for (const [name, lon_deg] of Object.entries(planets)) {
      planetDetails[name] = {
        longitude: lon_deg,
        sign: Ephemeris.getSign(lon_deg),
        house: Ephemeris.getHouse(lon_deg, angles.asc),
        formatted: Ephemeris.formatDegree(lon_deg)
      };
    }

    // Angle details
    const angleDetails = {
      asc: {
        longitude: angles.asc,
        sign: Ephemeris.getSign(angles.asc),
        formatted: Ephemeris.formatDegree(angles.asc)
      },
      mc: {
        longitude: angles.mc,
        sign: Ephemeris.getSign(angles.mc),
        formatted: Ephemeris.formatDegree(angles.mc)
      },
      dsc: {
        longitude: angles.dsc,
        sign: Ephemeris.getSign(angles.dsc),
        formatted: Ephemeris.formatDegree(angles.dsc)
      },
      ic: {
        longitude: angles.ic,
        sign: Ephemeris.getSign(angles.ic),
        formatted: Ephemeris.formatDegree(angles.ic)
      }
    };

    return {
      jd,
      year, month, day, hour, minute,
      lat, lon,
      angles: angleDetails,
      planets: planetDetails,
      houseCusps,
      ascSign: Ephemeris.getSign(angles.asc).index
    };
  }

  /**
   * Calculate chart for a candidate birth time (civil time + state).
   * Handles timezone conversion automatically.
   */
  function calculateFromCivil(day, month, year, hour, minute, estado, lat, lon) {
    const ut = BrazilTZ.civilToUT(day, month, year, hour, minute, estado);
    return calculate(ut.utYear, ut.utMonth, ut.utDay, ut.utHour, ut.utMinute, lat, lon);
  }

  return { calculate, calculateFromCivil };
})();
