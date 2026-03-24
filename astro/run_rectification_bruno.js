// run_rectification_bruno.js — Bruno, 23/07/1995, Pelotas/RS, 11:05
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

// ── Birth data ─────────────────────────────────────────────────────────────
const lat = -31.7654;
const lon = -52.3376;

const birthData = {
  day: 23, month: 7, year: 1995,
  hour: 11, minute: 5,
  estado: 'RS',
  lat, lon,
  source: 'familia'   // time from family memory → ±60 min window
};

// ── Events (all with exact dates) ─────────────────────────────────────────
const events = [
  {
    descricao: 'Morte do avô paterno',
    data_inferida: '2011-11-20',
    tipo: 'familia',
    peso: 0.75,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Primeira relação íntima oficial',
    data_inferida: '2014-02-20',
    tipo: 'relacionamento',
    peso: 0.65,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Primeiro namoro (pedido pela 3ª vez)',
    data_inferida: '2014-07-14',
    tipo: 'relacionamento',
    peso: 0.65,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Conclusão do ensino médio',
    data_inferida: '2015-07-20',
    tipo: 'educacao',
    peso: 0.60,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Entrou na PUCRS (39º do vestibular)',
    data_inferida: '2016-03-08',
    tipo: 'educacao',
    peso: 0.70,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Morte da avó (figura materna)',
    data_inferida: '2017-10-23',
    tipo: 'familia',
    peso: 0.85,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Aprovação na Brigada Militar',
    data_inferida: '2017-12-17',
    tipo: 'carreira',
    peso: 0.75,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Conheceu Eduarda (companheira)',
    data_inferida: '2018-11-18',
    tipo: 'relacionamento',
    peso: 0.75,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Pediu alguém em namoro pela 1ª vez',
    data_inferida: '2018-12-08',
    tipo: 'relacionamento',
    peso: 0.60,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Nascimento do filho Heitor',
    data_inferida: '2021-02-24',
    tipo: 'familia',
    peso: 0.85,
    precisao: 'dia_exato'
  }
];

// ── Natal chart at stated time ─────────────────────────────────────────────
console.log('── Natal chart at stated time (11:05 civil / 14:05 UT) ──');
const natal = ChartCalc.calculateFromCivil(23, 7, 1995, 11, 5, 'RS', lat, lon);
console.log(`  Sun:    ${natal.planets.sun.formatted}`);
console.log(`  Moon:   ${natal.planets.moon.formatted}`);
console.log(`  ASC:    ${natal.angles.asc.formatted}`);
console.log(`  MC:     ${natal.angles.mc.formatted}`);
console.log(`  DSC:    ${natal.angles.dsc.formatted}`);
console.log(`  IC:     ${natal.angles.ic.formatted}`);
console.log('');

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
console.log(`   ${result.metadata.totalCandidates} horários testados, ${result.metadata.totalEvents} eventos avaliados`);
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

// ── Distribuição de scores ────────────────────────────────────────────────
console.log('\n── Distribuição de scores ──');
const maxS = Math.max(...result.allScores.map(s => s.score));
[...result.allScores].sort((a, b) => b.score - a.score).slice(0, 10).forEach((s, i) => {
  const bar = '█'.repeat(Math.round((s.score / maxS) * 20)).padEnd(20, '░');
  const marker = i < 3 ? ' ◀ TOP' + (i + 1) : '';
  console.log(`  ${s.time}  [${bar}]  ${s.score.toFixed(4)}${marker}`);
});
