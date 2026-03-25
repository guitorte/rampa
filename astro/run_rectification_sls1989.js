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
// Nota sobre incertezas:
//  - Morte da mãe:  certidão diz 23h59 de 15/10, mas usuária acredita que foi
//    depois da meia-noite → usamos 16/10/2017 com peso "dia_exato"
//  - Morte do pai:  dia 3 ou 8 de novembro/2019 → usamos ponto médio (6/11)
//    com precisão "mes_ano" (menor confiança)
//  - Término de namoro: maio/junho 2024 → usamos 15/05/2024, "mes_ano"
//  - Ex namorada: março 2025 → 15/03/2025, "mes_ano"
//  - Namorada atual: 06/01/2026, "dia_exato"
//
const events = [
  {
    descricao: 'Morte da mãe (certidão 23h59 de 15/10, provavelmente 16/10)',
    data_inferida: '2017-10-16',
    tipo: 'familia',     // Casa 4 = mãe/pais/raízes; Casa 8 = morte
    peso: 0.90,
    precisao: 'dia_exato'
  },
  {
    descricao: 'Morte do pai (dia 3 ou 8/nov/2019 — ponto médio)',
    data_inferida: '2019-11-06',
    tipo: 'familia',
    peso: 0.70,
    precisao: 'mes_ano'  // incerteza de ±5 dias → mes_ano é mais honesto
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
  }
];

// ── Run rectification ──────────────────────────────────────────────────────
console.log('── Rodando retificação (±30 min, passo 2 min = 31 candidatos) ──');
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
console.log('\n── Notas sobre eventos com incerteza de data ──');
console.log('  Morte da mãe: Se ocorreu às 23h59 de 15/10 (certidão), o arco solar');
console.log('    muda ~0.003° — diferença desprezível para retificação.');
console.log('  Morte do pai: Incerteza de 5 dias (3–8/nov). O arco solar entre');
console.log('    ambas as datas varia ~0.014°, também desprezível.');
