// run_rectification_rj2005.js — 14/10/2005, 00:20, Rio de Janeiro/RJ
'use strict';

const fs = require('fs');
const path = require('path');

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
  code = code.replace(/^const (\w+) = \(\(\) =>/m, 'global.$1 = (() =>');
  (new Function('global', '"use strict";\n' + code))(global);
});

const lat = -22.9068;
const lon = -43.1729;

const birthData = {
  day: 14, month: 10, year: 2005,
  hour: 0, minute: 20,
  estado: 'RJ',
  lat, lon,
  source: 'familia'
};

// ── DST check ─────────────────────────────────────────────────────────────
console.log('── Fuso horário ──');
const tzInfo = BrazilTZ.getOffset('RJ', 14, 10, 2005, 0, 20);
console.log(`  14/10/2005 00:20 RJ → UTC${tzInfo.offset >= 0 ? '+' : ''}${tzInfo.offset}  (DST: ${tzInfo.dst})`);
console.log('');

// ── Natal chart ────────────────────────────────────────────────────────────
console.log('── Carta natal no horário declarado (00:20) ──');
const natal = ChartCalc.calculateFromCivil(14, 10, 2005, 0, 20, 'RJ', lat, lon);
console.log(`  Sol:    ${natal.planets.sun.formatted}`);
console.log(`  Lua:    ${natal.planets.moon.formatted}`);
console.log(`  ASC:    ${natal.angles.asc.formatted}`);
console.log(`  MC:     ${natal.angles.mc.formatted}`);
console.log(`  DSC:    ${natal.angles.dsc.formatted}`);
console.log(`  IC:     ${natal.angles.ic.formatted}`);
console.log('');

// ── Events ────────────────────────────────────────────────────────────────
const events = [
  {
    descricao: 'Morte do melhor amigo',
    data_inferida: '2020-04-29',
    tipo: 'saude',        // proxy: casas 8 (morte) + 12 (luto)
    peso: 0.85,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Abertura de empresa',
    data_inferida: '2026-01-13',
    tipo: 'carreira',
    peso: 0.75,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Primeiro mês com R$5k (01/01/2026)',
    data_inferida: '2026-01-01',
    tipo: 'carreira',
    peso: 0.65,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Término de namoro',
    data_inferida: '2026-02-13',
    tipo: 'relacionamento',
    peso: 0.75,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Mudança para casa maior',
    data_inferida: '2026-03-08',
    tipo: 'moradia',
    peso: 0.70,
    precisao: 'dia_exato'
  }
];

// ── Run rectification ──────────────────────────────────────────────────────
console.log('── Rodando retificação (±60 min, passo 3 min = 41 candidatos) ──');
const result = Rectifier.rectify(birthData, events, pct => {
  if (pct % 25 === 0) process.stdout.write(`  ${pct}%\r`);
});
console.log('  100% — concluído                                    ');
console.log('');

// ── Convergência ───────────────────────────────────────────────────────────
const conv = result.metadata.convergence;
console.log(`── Convergência: ${conv.level.toUpperCase()} (spread: ${conv.spread} min) ──`);
console.log(`   ${conv.description}`);
console.log(`   ${result.metadata.totalCandidates} horários, ${result.metadata.totalEvents} eventos`);
console.log('');

// ── Top 3 ──────────────────────────────────────────────────────────────────
console.log('── Top 3 candidatos ──');
result.top3.forEach((c, i) => {
  console.log(`\n  ${i + 1}. ${c.candidateTime}  (score: ${c.score.toFixed(4)}, offset: ${c.offsetMinutes > 0 ? '+' : ''}${c.offsetMinutes} min)`);
  console.log(`     ASC: ${c.chart.angles.asc.formatted}   MC: ${c.chart.angles.mc.formatted}`);
  console.log('     Eventos:');
  c.details.forEach(d => {
    const bar = '█'.repeat(Math.round(d.combined * 10)).padEnd(10, '░');
    console.log(`       [${bar}] ${d.combined.toFixed(2)} — ${d.evento}`);
    console.log(`              ArcoS:${d.solarArc.toFixed(2)} Prof:${d.profections.toFixed(2)} Prog:${d.progressions.toFixed(2)} | Casa${d.profectionHouse}`);
  });
});

// ── Score distribution ────────────────────────────────────────────────────
console.log('\n── Distribuição de scores ──');
const maxS = Math.max(...result.allScores.map(s => s.score));
[...result.allScores].sort((a, b) => b.score - a.score).slice(0, 10).forEach((s, i) => {
  const bar = '█'.repeat(Math.round((s.score / maxS) * 20)).padEnd(20, '░');
  const marker = i < 3 ? ' ◀ TOP' + (i + 1) : '';
  console.log(`  ${s.time}  [${bar}]  ${s.score.toFixed(4)}${marker}`);
});
