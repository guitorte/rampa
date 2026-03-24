// rectifier.js — Scoring engine and rectification orchestrator
// Generates candidate birth times, scores them against biographical events,
// and returns the top candidates with confidence levels.
'use strict';

const Rectifier = (() => {

  // Technique weights in the final score
  const TECHNIQUE_WEIGHTS = {
    solarArc: 0.45,
    profections: 0.30,
    progressions: 0.25
  };

  // Date precision weights (how much to trust the event date)
  const PRECISION_WEIGHTS = {
    exata: 1.00,      // Exact date with documentation
    dia_exato: 0.85,  // Exact day remembered
    mes_ano: 0.60,    // Month and year
    so_ano: 0.25,     // Year only
    aproximada: 0.10  // Very vague
  };

  // Search window based on time source reliability
  const SEARCH_WINDOWS = {
    certidao:     { spread: 15,  step: 1 },   // ±15 min, 1-min steps (31 candidates)
    hospital:     { spread: 30,  step: 2 },   // ±30 min, 2-min steps (31)
    familia:      { spread: 60,  step: 3 },   // ±1h, 3-min steps (41)
    aprox:        { spread: 120, step: 5 },   // ±2h, 5-min steps (49)
    desconhecido: { spread: 720, step: 10 }   // ±12h (full day), 10-min steps (145)
  };

  /**
   * Generate candidate birth times as minute offsets from the stated time.
   * @param {string} source - time source (certidao, hospital, etc.)
   * @returns {number[]} array of minute offsets
   */
  function generateCandidates(source) {
    const cfg = SEARCH_WINDOWS[source] || SEARCH_WINDOWS.aprox;
    const candidates = [];
    for (let offset = -cfg.spread; offset <= cfg.spread; offset += cfg.step) {
      candidates.push(offset);
    }
    return candidates;
  }

  /**
   * Convert a base time + minute offset to hour:minute.
   */
  function applyOffset(baseHour, baseMinute, offsetMinutes) {
    let totalMinutes = baseHour * 60 + baseMinute + offsetMinutes;
    // Wrap around midnight
    while (totalMinutes < 0) totalMinutes += 1440;
    while (totalMinutes >= 1440) totalMinutes -= 1440;
    return {
      hour: Math.floor(totalMinutes / 60),
      minute: totalMinutes % 60
    };
  }

  /**
   * Score a single candidate birth time against all events.
   *
   * @param {object} birthData - { day, month, year, hour, minute, estado, lat, lon }
   * @param {object[]} events - array of { descricao, data_inferida, tipo, peso, precisao }
   * @param {number} offsetMinutes - offset from stated birth time
   * @returns {{ score, chart, details, offsetMinutes, candidateTime }}
   */
  function scoreCandidate(birthData, events, offsetMinutes) {
    const { hour, minute } = applyOffset(birthData.hour, birthData.minute, offsetMinutes);
    const chart = ChartCalc.calculateFromCivil(
      birthData.day, birthData.month, birthData.year,
      hour, minute,
      birthData.estado, birthData.lat, birthData.lon
    );

    const birthDate = new Date(birthData.year, birthData.month - 1, birthData.day);
    let totalScore = 0;
    let totalWeight = 0;
    const details = [];

    for (const evt of events) {
      const eventDate = parseEventDate(evt.data_inferida, birthData.year);
      if (!eventDate) continue;

      const precisionWeight = PRECISION_WEIGHTS[evt.precisao] || evt.peso || 0.5;

      // Run three techniques
      const saResult = SolarArc.checkActivations(chart, eventDate, birthDate, evt.tipo);
      const pfResult = Profections.checkCompatibility(chart, birthDate, eventDate, evt.tipo);
      const prResult = Progressions.checkProgressions(chart, birthDate, eventDate, evt.tipo);

      // Combined score for this event
      const eventScore = (
        saResult.score * TECHNIQUE_WEIGHTS.solarArc +
        pfResult.score * TECHNIQUE_WEIGHTS.profections +
        prResult.score * TECHNIQUE_WEIGHTS.progressions
      ) * precisionWeight;

      totalScore += eventScore;
      totalWeight += precisionWeight;

      details.push({
        evento: evt.descricao,
        data: evt.data_inferida,
        tipo: evt.tipo,
        solarArc: saResult.score,
        profections: pfResult.score,
        progressions: prResult.score,
        combined: eventScore / precisionWeight,
        weighted: eventScore,
        profectionHouse: pfResult.activeHouse,
        profectionLord: pfResult.lordOfYear,
        solarArcActivations: saResult.activations.length,
        progressionActivations: prResult.activations.length
      });
    }

    const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    return {
      score: normalizedScore,
      offsetMinutes,
      candidateTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      chart,
      details
    };
  }

  /**
   * Parse an event date string into a Date object.
   * Supports: "DD/MM/YYYY", "MM/YYYY", "YYYY", or null
   */
  function parseEventDate(dateStr, birthYear) {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else if (parts.length === 2) {
      return new Date(parseInt(parts[1]), parseInt(parts[0]) - 1, 15); // middle of month
    } else if (parts.length === 1 && /^\d{4}$/.test(parts[0])) {
      return new Date(parseInt(parts[0]), 6, 1); // middle of year
    }
    return null;
  }

  /**
   * Run the full rectification process.
   *
   * @param {object} birthData - { day, month, year, hour, minute, estado, lat, lon, source }
   * @param {object[]} events - biographical events
   * @param {function} onProgress - optional callback(percentComplete)
   * @returns {{ top3: Array, allScores: Array, metadata: object }}
   */
  function rectify(birthData, events, onProgress) {
    // For unknown time, default to noon
    if (birthData.source === 'desconhecido' && (birthData.hour === undefined || birthData.hour === null)) {
      birthData.hour = 12;
      birthData.minute = 0;
    }

    const candidateOffsets = generateCandidates(birthData.source);
    const results = [];

    for (let i = 0; i < candidateOffsets.length; i++) {
      const result = scoreCandidate(birthData, events, candidateOffsets[i]);
      results.push(result);

      if (onProgress) {
        onProgress(Math.round(((i + 1) / candidateOffsets.length) * 100));
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Top 3 candidates
    const top3 = results.slice(0, 3);

    // Convergence analysis: if top candidates cluster together, confidence is higher
    const convergence = analyzeConvergence(top3);

    return {
      top3,
      allScores: results.map(r => ({ offset: r.offsetMinutes, score: r.score, time: r.candidateTime })),
      metadata: {
        totalCandidates: candidateOffsets.length,
        totalEvents: events.length,
        convergence,
        source: birthData.source
      }
    };
  }

  /**
   * Analyze convergence of top results.
   * If top candidates are clustered within 5 minutes, confidence is high.
   */
  function analyzeConvergence(top3) {
    if (top3.length < 2) return { level: 'baixa', spread: Infinity, description: 'Poucos dados para convergência' };

    const offsets = top3.map(r => r.offsetMinutes);
    const spread = Math.max(...offsets) - Math.min(...offsets);
    const scoreDiff = top3[0].score - top3[top3.length - 1].score;

    if (spread <= 5 && scoreDiff < 0.1) {
      return { level: 'alta', spread, description: 'Candidatos convergem dentro de 5 minutos — alta confiança' };
    } else if (spread <= 15) {
      return { level: 'media', spread, description: 'Candidatos próximos (±15 min) — confiança moderada' };
    } else if (spread <= 30) {
      return { level: 'baixa-media', spread, description: 'Candidatos com dispersão moderada — considere mais eventos' };
    } else {
      return { level: 'baixa', spread, description: 'Candidatos dispersos — mais eventos biográficos podem ajudar' };
    }
  }

  return {
    rectify, scoreCandidate, generateCandidates, applyOffset,
    parseEventDate, TECHNIQUE_WEIGHTS, PRECISION_WEIGHTS, SEARCH_WINDOWS
  };
})();
