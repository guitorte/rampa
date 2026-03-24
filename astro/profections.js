// profections.js — Annual Profections (Hellenistic technique)
// Each birthday, the "active house" advances one house.
// House 1 at year 0-1, House 2 at year 1-2, ... House 1 again at year 12-13.
'use strict';

const Profections = (() => {

  // Themes associated with each house
  const HOUSE_THEMES = {
    1:  ['saude', 'identidade', 'aparencia', 'inicio'],
    2:  ['dinheiro', 'posses', 'valores'],
    3:  ['comunicacao', 'irmaos', 'viagens_curtas', 'educacao'],
    4:  ['familia', 'moradia', 'pais', 'origens'],
    5:  ['filhos', 'criatividade', 'romance', 'prazer'],
    6:  ['saude', 'trabalho', 'rotina', 'servico'],
    7:  ['casamento', 'parcerias', 'relacionamento', 'contratos'],
    8:  ['morte', 'transformacao', 'heranca', 'sexualidade'],
    9:  ['educacao', 'filosofia', 'viagens_longas', 'espiritualidade'],
    10: ['carreira', 'status', 'reputacao', 'autoridade'],
    11: ['amigos', 'grupos', 'esperancas', 'beneficios'],
    12: ['reclusao', 'inimigos_ocultos', 'espiritualidade', 'perdas']
  };

  // Map event types to house numbers that are relevant
  const EVENT_TO_HOUSES = {
    familia:        [4, 5, 10],       // 4=family/home, 5=children, 10=parent figure
    carreira:       [10, 6, 2],       // 10=career, 6=work, 2=money
    saude:          [1, 6, 8, 12],    // 1=body, 6=health, 8=crisis, 12=hospitals
    moradia:        [4, 3],           // 4=home, 3=neighborhood
    educacao:       [3, 9],           // 3=basic education, 9=higher education
    relacionamento: [7, 5, 8],        // 7=partnerships, 5=romance, 8=intimacy
    outro:          []                 // no specific match
  };

  /**
   * Get the active profection house for an event date.
   * @param {Date} birthDate
   * @param {Date} eventDate
   * @returns {{ activeHouse: number, themes: string[], elapsedYears: number }}
   */
  function getActiveHouse(birthDate, eventDate) {
    const elapsedYears = Math.floor(
      (eventDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000)
    );
    const activeHouse = (elapsedYears % 12) + 1;
    return {
      activeHouse,
      themes: HOUSE_THEMES[activeHouse] || [],
      elapsedYears
    };
  }

  /**
   * Get the Lord of the Year (ruler of the sign on the profected house cusp).
   * @param {NatalChart} chart - natal chart
   * @param {number} activeHouse - which house is active (1-12)
   * @returns {string} planet name (e.g., 'mars', 'venus')
   */
  function getLordOfYear(chart, activeHouse) {
    // In Whole Sign, house N starts at sign (ascSign + N - 1) % 12
    const signIdx = (chart.ascSign + activeHouse - 1) % 12;
    return Ephemeris.SIGN_RULERS[signIdx];
  }

  /**
   * Check compatibility between an event type and the active profection house.
   * @param {NatalChart} chart - natal chart for candidate time
   * @param {Date} birthDate
   * @param {Date} eventDate
   * @param {string} eventType
   * @returns {{ score: number, activeHouse: number, lordOfYear: string, justification: string }}
   */
  function checkCompatibility(chart, birthDate, eventDate, eventType) {
    const { activeHouse, themes, elapsedYears } = getActiveHouse(birthDate, eventDate);
    const lordOfYear = getLordOfYear(chart, activeHouse);
    const relevantHouses = EVENT_TO_HOUSES[eventType] || [];

    let score = 0;
    let justification = '';

    // Primary match: event house matches active profection house
    if (relevantHouses.includes(activeHouse)) {
      score = 0.85;
      justification = `Casa ${activeHouse} ativa (${themes.join(', ')}) corresponde a evento de ${eventType}`;
    }

    // Secondary match: check if adjacent houses match (within profection year theme)
    if (score === 0) {
      const adjacentHouses = [
        ((activeHouse - 2 + 12) % 12) + 1,
        (activeHouse % 12) + 1
      ];
      for (const adjH of adjacentHouses) {
        if (relevantHouses.includes(adjH)) {
          score = 0.35;
          justification = `Casa adjacente ${adjH} tem relação com ${eventType}`;
          break;
        }
      }
    }

    // Bonus: Lord of Year has natural affinity with event type
    const lordAffinity = checkLordAffinity(lordOfYear, eventType);
    if (lordAffinity > 0) {
      score = Math.min(score + lordAffinity, 1.0);
      justification += (justification ? '; ' : '') + `Senhor do Ano (${lordOfYear}) tem afinidade com ${eventType}`;
    }

    // If no match at all but event type is "outro", give small base score
    if (score === 0 && eventType === 'outro') {
      score = 0.15;
      justification = 'Tipo genérico, compatibilidade neutra';
    }

    return {
      score,
      activeHouse,
      lordOfYear,
      themes,
      justification: justification || `Casa ${activeHouse} (${themes.join(', ')}) sem relação direta com ${eventType}`
    };
  }

  function checkLordAffinity(lord, eventType) {
    const affinities = {
      mars:    { carreira: 0.1, saude: 0.1 },
      venus:   { relacionamento: 0.15, carreira: 0.05 },
      mercury: { educacao: 0.15, carreira: 0.05 },
      moon:    { familia: 0.15, moradia: 0.1, saude: 0.05 },
      sun:     { carreira: 0.15, saude: 0.05 },
      jupiter: { educacao: 0.15, carreira: 0.1 },
      saturn:  { carreira: 0.1, moradia: 0.1, saude: 0.1 }
    };
    return (affinities[lord] && affinities[lord][eventType]) || 0;
  }

  return { getActiveHouse, getLordOfYear, checkCompatibility, HOUSE_THEMES, EVENT_TO_HOUSES };
})();
