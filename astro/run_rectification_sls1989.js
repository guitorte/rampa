// run_rectification_sls1989.js — 16/02/1989, 10:40, São Lourenço do Sul/RS
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

const lat = -31.3564;
const lon = -51.9715;

const birthData = {
  day: 16, month: 2, year: 1989,
  hour: 10, minute: 40,
  estado: 'RS',
  lat, lon,
  source: 'hospital'   // ±30 min, passo 2 min = 31 candidatos
};

// ── Natal chart ────────────────────────────────────────────────────────────
console.log('── Carta natal no horário declarado (10:40) ──');
const natal = ChartCalc.calculateFromCivil(16, 2, 1989, 10, 40, 'RS', lat, lon);
console.log(`  Sol:    ${natal.planets.sun.formatted}`);
console.log(`  Lua:    ${natal.planets.moon.formatted}`);
console.log(`  ASC:    ${natal.angles.asc.formatted}`);
console.log(`  MC:     ${natal.angles.mc.formatted}`);
console.log(`  DSC:    ${natal.angles.dsc.formatted}`);
console.log(`  IC:     ${natal.angles.ic.formatted}`);
console.log('');

// ── Events ─────────────────────────────────────────────────────────────────
//
// Notas:
//  - Morte da mãe:  certidão 23h59/15/10, mas usuária acredita que foi após
//    meia-noite → 16/10/2017, dia_exato
//  - Morte do pai:  certidão confirma 08/11/2019, dia_exato (peso alto)
//  - Florianópolis atrás de ex: final jan/início fev 2016, mes_ano
//  - Início tarô/TikTok profissional: fev/2024, mes_ano
//  - Término de namoro: mai/jun 2024, mes_ano
//  - Graduação em comunicação: nov/dez 2010, mes_ano
//  - Conclusão ensino médio: dez/2006, mes_ano
//  - Ex namorada: mar/2025, mes_ano
//  - Namorada atual: 06/01/2026, dia_exato
//  - Início curso comunicação: 2007, so_ano
//  - Início trabalho empresa propaganda: 2014, so_ano
//  - Freelance escândalo nacional: dez/2025, mes_ano
//
const events = [
  {
    descricao: 'Conclusão do ensino médio (dez/2006)',
    data_inferida: '2006-12-15',
    tipo: 'educacao',
    peso: 0.60,
    precisao: 'mes_ano'
  },
  {
    descricao: 'Início do curso de comunicação (2007)',
    data_inferida: '2007-03-01',
    tipo: 'educacao',
    peso: 0.65,
    precisao: 'so_ano'
  },
  {
    descricao: 'Graduação em comunicação (nov/dez 2010)',
    data_inferida: '2010-11-20',
    tipo: 'educacao',
    peso: 0.70,
    precisao: 'mes_ano'
  },
  {
    descricao: 'Início em empresa de propaganda (2014)',
    data_inferida: '2014-07-01',
    tipo: 'carreira',
    peso: 0.70,
    precisao: 'so_ano'
  },
  {
    descricao: 'Morte da mãe (certidão 23h59/15/10 → provável 16/10/2017)',
    data_inferida: '2017-10-16',
    tipo: 'familia',
    peso: 0.90,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Foi atrás de ex em Florianópolis (final jan / início fev 2016)',
    data_inferida: '2016-02-01',
    tipo: 'relacionamento',
    peso: 0.60,
    precisao: 'mes_ano'
  },
  {
    descricao: 'Morte do pai (certidão: 08/11/2019)',
    data_inferida: '2019-11-08',
    tipo: 'familia',
    peso: 0.90,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Início profissional no tarô/TikTok (fev/2024)',
    data_inferida: '2024-02-15',
    tipo: 'carreira',
    peso: 0.70,
    precisao: 'mes_ano'
  },
  {
    descricao: 'Término de namoro (mai/jun 2024)',
    data_inferida: '2024-05-15',
    tipo: 'relacionamento',
    peso: 0.65,
    precisao: 'mes_ano'
  },
  {
    descricao: 'Conheceu ex namorada (mar/2025)',
    data_inferida: '2025-03-15',
    tipo: 'relacionamento',
    peso: 0.55,
    precisao: 'mes_ano'
  },
  {
    descricao: 'Conheceu namorada atual (06/01/2026)',
    data_inferida: '2026-01-06',
    tipo: 'relacionamento',
    peso: 0.75,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Freelance em escândalo nacional (dez/2025)',
    data_inferida: '2025-12-15',
    tipo: 'carreira',
    peso: 0.75,
    precisao: 'mes_ano'
  }
];

// ── Run rectification ──────────────────────────────────────────────────────
console.log('── Rodando retificação (±30 min, passo 2 min = 31 candidatos, 12 eventos) ──');
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
  const off = c.offsetMinutes;
  console.log(`\n  ${i + 1}. ${c.candidateTime}  (score: ${c.score.toFixed(4)}, offset: ${off > 0 ? '+' : ''}${off} min)`);
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
[...result.allScores].sort((a, b) => b.score - a.score).slice(0, 12).forEach((s, i) => {
  const bar = '█'.repeat(Math.round((s.score / maxS) * 20)).padEnd(20, '░');
  const marker = i < 3 ? ' ◀ TOP' + (i + 1) : '';
  console.log(`  ${s.time}  [${bar}]  ${s.score.toFixed(4)}${marker}`);
});

// ── Notas sobre incerteza das datas ──────────────────────────────────────
console.log('\n── Notas ──');
console.log('  Morte da mãe: Se 15/10 vs 16/10, arco solar varia ~0.003° — desprezível.');
console.log('  Morte do pai: Confirmado 08/11/2019 pela certidão.');
