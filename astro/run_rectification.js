// run_rectification.js — Node.js test runner for K's chart
'use strict';

// Load all modules in order (they use global 'const' IIFEs)
const fs = require('fs');
const path = require('path');

// eval with const → global: replace 'const ModuleName =' with global assignment
const dir = __dirname;
[
  'ephemeris.js',
  'brazil-tz.js',
  'chart-calc.js',
  'solar-arc.js',
  'profections.js',
  'progressions.js',
  'rectifier.js'
].forEach(f => {
  let code = fs.readFileSync(path.join(dir, f), 'utf8');
  // Hoist module-level const declarations to global scope
  code = code.replace(/^const (\w+) = \(\(\) =>/m, 'global.$1 = (() =>');
  (new Function('global', '"use strict";\n' + code))(global);
});

// ── Birth data from the chart image ──────────────────────────────────────────
// Name: K
// Born: Monday, 30 August 1993, 6:37 p.m. civil time
// Location: Caxias do Sul, Rio Grande do Sul, Brazil
// Coordinates: 29°10'05"S  51°10'46"W
// Chart shows Univ.Time 21:37 → confirms UTC-3, no DST in August 1993

const lat = -(29 + 10/60 + 5/3600);   // -29.1681° (south)
const lon = -(51 + 10/60 + 46/3600);  // -51.1794° (west)

const birthData = {
  day: 30, month: 8, year: 1993,
  hour: 18, minute: 37,
  estado: 'RS',
  lat, lon,
  source: 'familia'  // time likely from family memory — ±60 min window
};

// ── Events from the timeline screenshot ──────────────────────────────────────
// Dates shown in ISO YYYY-MM format (the bug we just fixed)
const events = [
  {
    descricao: 'Primeiro date com Lucas',
    data_inferida: '2021-09',
    tipo: 'relacionamento',
    peso: 0.60,
    precisao: 'mes_ano'
  },
  {
    descricao: 'Mudança para Florianópolis',
    data_inferida: '2023-11',
    tipo: 'moradia',
    peso: 0.60,
    precisao: 'mes_ano'
  },
  {
    descricao: 'Divórcio / Separação',
    data_inferida: '2025-07',
    tipo: 'relacionamento',
    peso: 0.60,
    precisao: 'mes_ano'
  },
  {
    descricao: 'Início de novo emprego',
    data_inferida: '2026-01',
    tipo: 'carreira',
    peso: 0.60,
    precisao: 'mes_ano'
  },
  {
    descricao: 'Aguardando acontecimento',
    data_inferida: '2026-04',
    tipo: 'relacionamento',
    peso: 0.35,
    precisao: 'so_ano'
  }
];

// ── Validate date parsing (test the fix) ─────────────────────────────────────
console.log('── Date parsing validation ──');
events.forEach(e => {
  const d = Rectifier.parseEventDate(e.data_inferida, 1993);
  console.log(`  ${e.data_inferida} → ${d ? d.toISOString().slice(0, 10) : 'NULL ← BUG!'}`);
});
console.log('');

// ── Verify natal chart matches the image ─────────────────────────────────────
console.log('── Natal chart at stated time (18:37 civil / 21:37 UT) ──');
const natal = ChartCalc.calculateFromCivil(30, 8, 1993, 18, 37, 'RS', lat, lon);
console.log(`  Sun:    ${natal.planets.sun.formatted}`);
console.log(`  Moon:   ${natal.planets.moon.formatted}`);
console.log(`  ASC:    ${natal.angles.asc.formatted}`);
console.log(`  MC:     ${natal.angles.mc.formatted}`);
console.log(`  DSC:    ${natal.angles.dsc.formatted}`);
console.log(`  IC:     ${natal.angles.ic.formatted}`);
console.log('');
console.log('  Expected from chart image:');
console.log('  Sun:  7°30\' Virgem   Moon: 24°04\' Aquário');
console.log('  ASC:  14°22\' Peixes  MC:   13°33\' Sagitário');
console.log('');

// ── Run rectification ─────────────────────────────────────────────────────────
console.log('── Running rectification (±60 min, 3-min steps = 41 candidates) ──');
const result = Rectifier.rectify(birthData, events, pct => {
  if (pct % 25 === 0) process.stdout.write(`  ${pct}%\r`);
});
console.log('  100% — done                                        ');
console.log('');

// ── Results ───────────────────────────────────────────────────────────────────
const conv = result.metadata.convergence;
console.log(`── Convergência: ${conv.level.toUpperCase()} (spread: ${conv.spread} min) ──`);
console.log(`   ${conv.description}`);
console.log(`   ${result.metadata.totalCandidates} horários testados, ${result.metadata.totalEvents} eventos avaliados`);
console.log('');

console.log('── Top 3 candidatos ──');
result.top3.forEach((c, i) => {
  console.log(`\n  ${i + 1}. ${c.candidateTime}  (score: ${c.score.toFixed(4)}, offset: ${c.offsetMinutes > 0 ? '+' : ''}${c.offsetMinutes} min)`);
  console.log(`     ASC: ${c.chart.angles.asc.formatted}`);
  console.log(`     MC:  ${c.chart.angles.mc.formatted}`);
  console.log(`     DSC: ${c.chart.angles.dsc.formatted}`);
  console.log(`     IC:  ${c.chart.angles.ic.formatted}`);
  console.log('     Eventos:');
  c.details.forEach(d => {
    const bar = '█'.repeat(Math.round(d.combined * 10)).padEnd(10, '░');
    console.log(`       [${bar}] ${d.combined.toFixed(2)} — ${d.evento}`);
    console.log(`              ArcoS:${d.solarArc.toFixed(2)} Prof:${d.profections.toFixed(2)} Prog:${d.progressions.toFixed(2)} | Casa${d.profectionHouse}`);
  });
});

// ── Score distribution summary ─────────────────────────────────────────────────
console.log('\n── Distribuição de scores ──');
const scores = result.allScores;
const maxS = Math.max(...scores.map(s => s.score));
const sorted = [...scores].sort((a, b) => b.score - a.score).slice(0, 8);
sorted.forEach((s, i) => {
  const bar = '█'.repeat(Math.round((s.score / maxS) * 20)).padEnd(20, '░');
  const marker = i < 3 ? ' ◀ TOP' + (i + 1) : '';
  console.log(`  ${s.time}  [${bar}]  ${s.score.toFixed(4)}${marker}`);
});
