# Plano de Execução — App de Retificação de Mapa Astral
> Documento para execução via Claude Code em sessão única.
> Leia este plano inteiro antes de escrever qualquer linha de código.

---

## Visão Geral do Produto

Um app web que retifica o horário de nascimento de um usuário através de:
1. Coleta de dados de nascimento com conversão automática para UT (considerando fusos históricos e horário de verão brasileiro)
2. Entrevista em texto livre processada por IA para extração de eventos biográficos
3. Motor de retificação que testa eventos contra janelas de horário candidato usando Arco Solar, Profecções Anuais e Progressões Secundárias
4. Relatório final com horário retificado e intervalo de confiança

---

## Stack Técnica

```
Backend:   Node.js 20+ com Express
Frontend:  HTML/CSS/JS vanilla (sem framework)
Banco:     SQLite via better-sqlite3
Efêmero:   swisseph (Swiss Ephemeris para Node.js)
IA:        @anthropic-ai/sdk (extração de eventos + perguntas de refinamento)
Fusos:     Dados históricos embutidos em JSON (não depende de API externa)
```

---

## Estrutura de Diretórios a Criar

```
retificacao-app/
├── package.json
├── server.js                    # Express + rotas da API
├── .env.example
├── data/
│   ├── brazil-timezones.json    # Fusos históricos brasileiros
│   ├── brazil-dst.json          # Tabela histórica de horário de verão
│   └── cities-br.json           # Cidades brasileiras com lat/lon/estado
├── src/
│   ├── engine/
│   │   ├── time-converter.js    # Módulo 1: TCL → UT
│   │   ├── ephemeris.js         # Módulo 2: wrapper Swiss Ephemeris
│   │   ├── chart-calculator.js  # Módulo 3: cálculo de ASC, MC, casas
│   │   ├── solar-arc.js         # Módulo 4: Arco Solar
│   │   ├── profections.js       # Módulo 5: Profecções Anuais
│   │   ├── progressions.js      # Módulo 6: Progressões Secundárias
│   │   ├── scorer.js            # Módulo 7: score de correspondência evento×horário
│   │   └── rectifier.js         # Módulo 8: orquestrador principal
│   ├── ai/
│   │   ├── event-extractor.js   # Extração de eventos via Claude
│   │   └── guided-questions.js  # Geração de perguntas dirigidas
│   └── db/
│       └── store.js             # Operações SQLite
├── public/
│   ├── index.html               # SPA principal
│   ├── style.css
│   └── app.js                   # Lógica do frontend
└── tests/
    ├── time-converter.test.js   # Casos de teste obrigatórios
    └── solar-arc.test.js
```

---

## Passo 1 — Inicialização do Projeto

```bash
mkdir retificacao-app && cd retificacao-app
npm init -y
npm install express better-sqlite3 swisseph @anthropic-ai/sdk dotenv cors
npm install --save-dev jest
```

Criar `.env.example`:
```
ANTHROPIC_API_KEY=your_key_here
PORT=3000
```

`package.json` deve ter:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "test": "jest"
  }
}
```

---

## Passo 2 — Dados: `data/brazil-dst.json`

Este é o arquivo mais crítico do projeto. Criar com a estrutura abaixo, preenchida com dados históricos reais e verificados.

```json
{
  "metadata": {
    "fonte": "Decreto federal + ACS International Atlas",
    "regioes_sem_dst": ["AC", "AM", "AP", "PA", "RO", "RR", "TO", "MA", "PI", "CE", "RN", "PB", "PE", "AL", "SE", "BA"]
  },
  "periodos": [
    {
      "inicio": "1931-10-03",
      "fim": "1932-04-01",
      "offset_adicional": 1,
      "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","RN","PB","PE","AL","SE","BA","PI","CE","MA","DF"]
    },
    {
      "inicio": "1932-10-03",
      "fim": "1933-04-01",
      "offset_adicional": 1,
      "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"]
    },
    { "inicio": "1949-12-01", "fim": "1950-04-16", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1950-12-01", "fim": "1951-04-01", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1951-12-01", "fim": "1952-04-01", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1952-12-01", "fim": "1953-03-01", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1963-10-23", "fim": "1964-03-01", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1964-11-01", "fim": "1965-03-01", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1965-11-01", "fim": "1966-03-01", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1966-11-01", "fim": "1967-03-01", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1967-11-01", "fim": "1968-03-01", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1985-11-02", "fim": "1986-03-15", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1986-10-25", "fim": "1987-02-14", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1987-10-25", "fim": "1988-02-07", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1988-10-16", "fim": "1989-01-29", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1989-10-15", "fim": "1990-02-11", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1990-10-21", "fim": "1991-02-17", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1991-10-20", "fim": "1992-02-09", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1992-10-25", "fim": "1993-01-31", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1993-10-17", "fim": "1994-02-20", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1994-10-16", "fim": "1995-02-19", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1995-10-15", "fim": "1996-02-11", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1996-10-06", "fim": "1997-02-16", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1997-10-06", "fim": "1998-03-01", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1998-10-11", "fim": "1999-03-01", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "1999-10-03", "fim": "2000-02-27", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2000-10-08", "fim": "2001-02-18", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2001-10-14", "fim": "2002-02-17", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2002-11-03", "fim": "2003-03-16", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2003-10-19", "fim": "2004-02-15", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2004-11-07", "fim": "2005-03-27", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2005-11-06", "fim": "2006-03-05", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2006-11-05", "fim": "2007-02-25", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2007-10-14", "fim": "2008-02-17", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2008-10-19", "fim": "2009-02-15", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2009-10-18", "fim": "2010-02-28", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2010-10-17", "fim": "2011-02-27", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2011-10-16", "fim": "2012-02-26", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2012-10-21", "fim": "2013-02-17", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2013-10-20", "fim": "2014-02-16", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2014-10-19", "fim": "2015-02-22", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2015-10-25", "fim": "2016-02-21", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2016-10-16", "fim": "2017-02-19", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2017-10-15", "fim": "2018-02-18", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] },
    { "inicio": "2018-11-04", "fim": "2019-02-17", "offset_adicional": 1, "regioes": ["SP","RJ","MG","RS","PR","SC","GO","MT","MS","ES","DF"] }
  ]
}
```

---

## Passo 3 — `data/brazil-timezones.json`

Mapeamento de estados para offset UTC, com suporte a períodos históricos pré-1914 (offsets de meridiano local).

```json
{
  "estados": {
    "AC": { "offset": -5, "nome": "Acre" },
    "AM": { "offset": -4, "nome": "Amazonas" },
    "AP": { "offset": -3, "nome": "Amapá" },
    "PA": { "offset": -3, "nome": "Pará" },
    "RO": { "offset": -4, "nome": "Rondônia" },
    "RR": { "offset": -4, "nome": "Roraima" },
    "TO": { "offset": -3, "nome": "Tocantins" },
    "MA": { "offset": -3, "nome": "Maranhão" },
    "PI": { "offset": -3, "nome": "Piauí" },
    "CE": { "offset": -3, "nome": "Ceará" },
    "RN": { "offset": -3, "nome": "Rio Grande do Norte" },
    "PB": { "offset": -3, "nome": "Paraíba" },
    "PE": { "offset": -3, "nome": "Pernambuco" },
    "AL": { "offset": -3, "nome": "Alagoas" },
    "SE": { "offset": -3, "nome": "Sergipe" },
    "BA": { "offset": -3, "nome": "Bahia" },
    "MG": { "offset": -3, "nome": "Minas Gerais" },
    "ES": { "offset": -3, "nome": "Espírito Santo" },
    "RJ": { "offset": -3, "nome": "Rio de Janeiro" },
    "SP": { "offset": -3, "nome": "São Paulo" },
    "PR": { "offset": -3, "nome": "Paraná" },
    "SC": { "offset": -3, "nome": "Santa Catarina" },
    "RS": { "offset": -3, "nome": "Rio Grande do Sul" },
    "MS": { "offset": -4, "nome": "Mato Grosso do Sul" },
    "MT": { "offset": -4, "nome": "Mato Grosso" },
    "GO": { "offset": -3, "nome": "Goiás" },
    "DF": { "offset": -3, "nome": "Distrito Federal" }
  },
  "historico_pre1914": {
    "SP": { "offset_decimal": -3.1076, "meridiano_graus": -46.614 },
    "RJ": { "offset_decimal": -2.8727, "meridiano_graus": -43.172 },
    "RS": { "offset_decimal": -3.3833, "meridiano_graus": -51.183 }
  }
}
```

---

## Passo 4 — `src/engine/time-converter.js`

Implementar com precisão. Todos os casos de teste abaixo devem passar.

```javascript
// src/engine/time-converter.js
const dstData = require('../../data/brazil-dst.json');
const tzData  = require('../../data/brazil-timezones.json');

/**
 * Verifica se o horário de verão estava ativo para um estado numa data.
 * @param {string} estado - UF (ex: "SP")
 * @param {Date}   date   - objeto Date em UTC (use parseDate abaixo)
 * @returns {boolean}
 */
function isDST(estado, date) { /* implementar */ }

/**
 * Retorna o offset UTC em horas para um estado numa data histórica.
 * Usa meridiano local para datas anteriores a 1914.
 * @returns {number} ex: -3 ou -3.1076
 */
function getHistoricalOffset(estado, date) { /* implementar */ }

/**
 * Converte horário civil local para UT.
 * @param {object} params
 * @param {string} params.hora     - "HH:MM"
 * @param {string} params.data     - "DD/MM/AAAA"
 * @param {string} params.estado   - "SP"
 * @returns {{ horaUT: string, dataUT: string, offsetAplicado: number, dstAtivo: boolean, aviso?: string }}
 */
function civilToUT({ hora, data, estado }) { /* implementar */ }

module.exports = { civilToUT, isDST, getHistoricalOffset };
```

**Casos de teste obrigatórios em `tests/time-converter.test.js`:**

```javascript
const { civilToUT, isDST } = require('../src/engine/time-converter');

test('SP jan/1985 tem DST ativo', () => {
  expect(isDST('SP', new Date('1985-01-15'))).toBe(true);
});

test('SP jul/1985 não tem DST', () => {
  expect(isDST('SP', new Date('1985-07-15'))).toBe(false);
});

test('AM nunca tem DST', () => {
  expect(isDST('AM', new Date('1990-01-15'))).toBe(false);
});

test('SP 14:30 civil jan/1985 → 16:30 UT (offset -3, DST +1 = -2 efetivo)', () => {
  const r = civilToUT({ hora: '14:30', data: '15/01/1985', estado: 'SP' });
  expect(r.horaUT).toBe('16:30');
  expect(r.dstAtivo).toBe(true);
});

test('SP 14:30 civil jul/1985 → 17:30 UT (offset -3, sem DST)', () => {
  const r = civilToUT({ hora: '14:30', data: '15/07/1985', estado: 'SP' });
  expect(r.horaUT).toBe('17:30');
  expect(r.dstAtivo).toBe(false);
});

test('Hora com overflow de dia (23:30 SP jul/1985 → 02:30 UT do dia seguinte)', () => {
  const r = civilToUT({ hora: '23:30', data: '15/07/1985', estado: 'SP' });
  expect(r.horaUT).toBe('02:30');
  expect(r.dataUT).toBe('16/07/1985');
});

test('Após 2019: sem DST em nenhum estado', () => {
  expect(isDST('SP', new Date('2020-01-15'))).toBe(false);
});
```

---

## Passo 5 — `src/engine/ephemeris.js`

Wrapper limpo sobre o pacote `swisseph`. Expõe apenas o que o resto do app precisa.

```javascript
// src/engine/ephemeris.js
// NOTA: swisseph requer os arquivos de efêmero .se1
// Usar: npm install swisseph
// Os arquivos de efêmero são incluídos automaticamente pelo pacote.

const swisseph = require('swisseph');

// Constantes de planetas usadas no app
const PLANETS = {
  SUN: swisseph.SE_SUN,
  MOON: swisseph.SE_MOON,
  MERCURY: swisseph.SE_MERCURY,
  VENUS: swisseph.SE_VENUS,
  MARS: swisseph.SE_MARS,
  JUPITER: swisseph.SE_JUPITER,
  SATURN: swisseph.SE_SATURN,
  URANUS: swisseph.SE_URANUS,
  NEPTUNE: swisseph.SE_NEPTUNE,
  PLUTO: swisseph.SE_PLUTO,
};

/**
 * Converte data/hora UT para Julian Day Number.
 */
function toJulianDay(ano, mes, dia, horaUT) { /* implementar via swisseph.swe_julday */ }

/**
 * Calcula posição de um planeta em graus da eclíptica.
 * @returns { longitude: number, latitude: number, speed: number }
 */
function getPlanetPosition(jd, planet) { /* implementar via swisseph.swe_calc_ut */ }

/**
 * Calcula o Ascendente e Meio do Céu para um JD e coordenadas geográficas.
 * @param {number} jd
 * @param {number} lat - latitude em graus decimais
 * @param {number} lon - longitude em graus decimais (negativo para Oeste)
 * @param {string} houseSystem - 'P' para Placidus (padrão), 'K' Koch, 'W' Whole Sign
 * @returns {{ asc: number, mc: number, casas: number[] }}
 */
function getAngles(jd, lat, lon, houseSystem = 'P') { /* implementar via swisseph.swe_houses */ }

/**
 * Retorna todas as posições planetárias de um mapa natal.
 */
function getNatalPlanets(jd) { /* implementar */ }

module.exports = { toJulianDay, getPlanetPosition, getAngles, getNatalPlanets, PLANETS };
```

---

## Passo 6 — `src/engine/chart-calculator.js`

Calcula o mapa completo dado um horário candidato.

```javascript
// src/engine/chart-calculator.js
// Recebe dados de nascimento já convertidos para UT + coordenadas geográficas.
// Retorna o mapa completo com todos os ângulos, planetas e casas.

const { toJulianDay, getAngles, getNatalPlanets } = require('./ephemeris');

/**
 * Calcula o mapa natal completo.
 * @param {object} params
 * @param {number} params.ano, mes, dia - data UT
 * @param {number} params.horaUT        - horas decimais (ex: 16.5 = 16:30)
 * @param {number} params.lat, lon      - coordenadas
 * @param {string} params.houseSystem
 * @returns {NatalChart}
 */
function calculateChart({ ano, mes, dia, horaUT, lat, lon, houseSystem }) { /* implementar */ }

module.exports = { calculateChart };
```

---

## Passo 7 — `src/engine/solar-arc.js`

Técnica principal de retificação. Para cada evento biográfico, verifica se algum planeta/ponto em Arco Solar estava em aspecto exato com um ângulo natal (ASC, MC, DSC, FC) ou vice-versa, dentro de uma orbe de 1 grau.

```javascript
// src/engine/solar-arc.js
// Arco Solar: todos os pontos do mapa avançam na mesma velocidade do Sol Progressado.
// Taxa: ~1 grau por ano (~0.9856°/ano).
// Fórmula: posição_direcionada = posição_natal + (anos_decorridos × 0.9856)

const ORBE_RETIFICACAO = 1.0; // graus

/**
 * Calcula o arco solar para um número de anos.
 * @param {number} anosDecorridos
 * @returns {number} arco em graus
 */
function calcularArco(anosDecorridos) {
  return anosDecorridos * 0.9856;
}

/**
 * Para um mapa natal e uma data de evento, verifica se há
 * ativações de Arco Solar relevantes para retificação.
 *
 * Ativações relevantes:
 * - Arco Solar ao ASC/MC natal: eventos de identidade, visibilidade
 * - Arco Solar ao DSC/FC natal: eventos relacionais, familiares
 * - Arco Solar de ASC/MC para planetas natais: idem
 * - Arco Solar de planetas para ângulos: conforme natureza do planeta
 *
 * @param {NatalChart} mapaCandiato - mapa calculado para horário candidato
 * @param {Date} dataEvento
 * @param {Date} dataNascimento
 * @param {string} tipoEvento - categoria do evento (familia, carreira, etc)
 * @returns {{ score: number, ativacoes: Ativacao[] }}
 */
function verificarAtivacoes(mapaCandiato, dataEvento, dataNascimento, tipoEvento) { /* implementar */ }

module.exports = { verificarAtivacoes, calcularArco };
```

---

## Passo 8 — `src/engine/profections.js`

Profecções Anuais (técnica helenística). A cada aniversário, a "casa ativa" avança uma casa. O regente dessa casa torna-se o Senhor do Ano e eventos relacionados ao tema dessa casa tornam-se mais prováveis.

```javascript
// src/engine/profections.js
// Fórmula: casa_ativa = ((anos_de_vida) % 12) + 1
// Ano 0-1: 1ª casa | Ano 1-2: 2ª casa | ... | Ano 12-13: 1ª casa novamente

const TEMAS_CASA = {
  1: ['saude', 'identidade', 'aparencia', 'inicio'],
  2: ['dinheiro', 'posses', 'valores'],
  3: ['comunicacao', 'irmaos', 'viagens_curtas', 'educacao_basica'],
  4: ['familia', 'moradia', 'pais', 'origens'],
  5: ['filhos', 'criatividade', 'romance', 'prazer'],
  6: ['saude', 'trabalho', 'rotina', 'servico'],
  7: ['casamento', 'parcerias', 'relacionamento', 'contratos'],
  8: ['morte', 'transformacao', 'heranca', 'sexualidade'],
  9: ['educacao_superior', 'filosofia', 'viagens_longas', 'espiritualidade'],
  10: ['carreira', 'status', 'reputacao', 'autoridade'],
  11: ['amigos', 'grupos', 'esperancas', 'beneficios'],
  12: ['reclusao', 'inimigos_ocultos', 'espiritualidade', 'perdas'],
};

/**
 * Calcula a casa ativa por profecção numa data específica.
 * @param {Date} dataNascimento
 * @param {Date} dataEvento
 * @returns {{ casaAtiva: number, temas: string[], anosDecorridos: number }}
 */
function getCasaAtiva(dataNascimento, dataEvento) { /* implementar */ }

/**
 * Verifica se um evento é compatível com a casa ativa por profecção.
 * @returns {{ compativel: boolean, score: number, justificativa: string }}
 */
function verificarCompatibilidade(casaAtiva, tipoEvento, subtipo) { /* implementar */ }

module.exports = { getCasaAtiva, verificarCompatibilidade, TEMAS_CASA };
```

---

## Passo 9 — `src/engine/progressions.js`

Progressões Secundárias. Foco na Lua Progressada (muda de signo a cada ~2.5 anos) e no Sol Progressado.

```javascript
// src/engine/progressions.js
// Método "dia por ano": cada dia após o nascimento = 1 ano de vida.
// Para calcular as progressões para X anos após o nascimento:
// → Calcular o mapa do dia (dataNascimento + X dias)

const { toJulianDay, getPlanetPosition, getAngles } = require('./ephemeris');

/**
 * Calcula as posições progressadas para uma data específica.
 * @param {NatalChart} mapaNatal
 * @param {Date} dataNascimento
 * @param {Date} dataProgressao - data para a qual calcular as progressões
 * @returns {{ luaProgressada: number, solProgressado: number, venusProgressado: number }}
 */
function calcularProgressoes(mapaNatal, dataNascimento, dataProgressao) { /* implementar */ }

/**
 * Verifica se a Lua Progressada está em aspecto significativo
 * com os ângulos do mapa candidato numa data de evento.
 * Aspectos: conjunção (0°), oposição (180°), quadratura (90°), trígono (120°), sextil (60°)
 * Orbe para retificação: 1.5°
 */
function verificarLuaProgressada(mapaCandiato, dataNascimento, dataEvento) { /* implementar */ }

module.exports = { calcularProgressoes, verificarLuaProgressada };
```

---

## Passo 10 — `src/engine/scorer.js`

Coração do algoritmo. Para cada horário candidato e cada evento biográfico, combina os scores das três técnicas em um score unificado.

```javascript
// src/engine/scorer.js

const { verificarAtivacoes } = require('./solar-arc');
const { getCasaAtiva, verificarCompatibilidade } = require('./profections');
const { verificarLuaProgressada } = require('./progressions');
const { calculateChart } = require('./chart-calculator');

// Pesos de cada técnica no score final
const PESOS_TECNICA = {
  arco_solar: 0.45,
  profeccao: 0.30,
  lua_progressada: 0.25,
};

// Pesos de confiabilidade da data do evento (vindos do extrator de IA)
const PESOS_PRECISAO = {
  documento:   1.00,
  data_exata:  0.85,
  mes_ano:     0.60,
  so_ano:      0.25,
  vago:        0.10,
};

/**
 * Calcula o score total de correspondência entre um horário candidato
 * e um conjunto de eventos biográficos.
 *
 * @param {object} horarioCandidato - { hora: "HH:MM", ... dados de nascimento }
 * @param {object[]} eventos - array de eventos extraídos pela IA
 * @param {{ lat, lon }} coords - coordenadas de nascimento
 * @returns {{ score: number, detalhes: object[], mapaCalculado: NatalChart }}
 */
function scoreHorario(horarioCandidato, eventos, coords) {
  // 1. Calcular o mapa para este horário candidato
  // 2. Para cada evento, aplicar as três técnicas
  // 3. Multiplicar cada resultado pelo peso de precisão do evento
  // 4. Combinar com os pesos de técnica
  // 5. Retornar score final (0-1) + detalhes para o relatório
}

module.exports = { scoreHorario, PESOS_TECNICA, PESOS_PRECISAO };
```

---

## Passo 11 — `src/engine/rectifier.js`

Orquestrador principal. Recebe os dados do usuário, gera janelas candidatas, testa cada uma, e retorna os top 3 horários com scores.

```javascript
// src/engine/rectifier.js

const { civilToUT } = require('./time-converter');
const { scoreHorario } = require('./scorer');

/**
 * Largura da janela de busca baseada na fonte do horário.
 * Retorna array de offsets em minutos a testar.
 */
function getJanelaDeBusca(fonteHorario) {
  const janelas = {
    certidao:     { spread: 15, step: 2 },   // ±15 min, passo de 2 min
    hospital:     { spread: 30, step: 4 },
    familia:      { spread: 60, step: 5 },
    aprox:        { spread: 90, step: 10 },
    desconhecido: { spread: 720, step: 15 }, // busca o dia inteiro
  };
  const cfg = janelas[fonteHorario] || janelas.aprox;
  const candidatos = [];
  for (let offset = -cfg.spread; offset <= cfg.spread; offset += cfg.step) {
    candidatos.push(offset);
  }
  return candidatos;
}

/**
 * Executa a retificação completa.
 * @param {object} dadosNascimento - { data, hora, estado, cidade, lat, lon, fonteHorario }
 * @param {object[]} eventos - eventos extraídos e ponderados
 * @returns {{ top3: Candidato[], metadados: object }}
 */
async function retificar(dadosNascimento, eventos) {
  // 1. Gerar horários candidatos baseado na janela de busca
  // 2. Para cada candidato, calcular score via scoreHorario()
  // 3. Ordenar por score descendente
  // 4. Retornar top 3 com detalhes completos
}

module.exports = { retificar, getJanelaDeBusca };
```

---

## Passo 12 — `src/ai/event-extractor.js`

Extração de eventos do texto livre via Claude. Reutilizar e refinar a lógica já desenvolvida no protótipo HTML.

```javascript
// src/ai/event-extractor.js
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic();

const SYSTEM_PROMPT = `Você é um motor de extração de eventos biográficos para retificação astrológica.

Dado o relato livre de um usuário, extraia TODOS os eventos de vida mencionados ou inferíveis.

Para cada evento, retorne um objeto com:
- descricao: string (frase curta e clara, em português)
- data_inferida: string ou null ("DD/MM/AAAA", "MM/AAAA", "AAAA", ou null)
- tipo: enum ["familia", "carreira", "saude", "moradia", "educacao", "relacionamento", "outro"]
- subtipo: string (ex: "nascimento_filho", "casamento", "demissao", "cirurgia", "mudanca_cidade")
- precisao_data: enum ["documento", "data_exata", "mes_ano", "so_ano", "vago"]
- peso: number 0-1 (baseado na precisao_data acima)
- nota: string (contexto adicional relevante para astrologia)

Regras:
- Se o usuário mencionar idade, calcule o ano a partir do ano de nascimento informado
- Separe eventos compostos em eventos distintos
- Extraia também eventos NEGATIVOS ou menores ("não aconteceu nada demais mas...")
- Ignore sentimentos e avaliações; extraia apenas fatos datáveis
- Retorne APENAS JSON array válido, sem markdown`;

/**
 * @param {string} texto - relato livre do usuário
 * @param {object} dadosNascimento - { dia, mes, ano, cidade, estado }
 * @returns {Promise<Evento[]>}
 */
async function extractEvents(texto, dadosNascimento) { /* implementar */ }

module.exports = { extractEvents };
```

---

## Passo 13 — `src/ai/guided-questions.js`

Quando o motor retorna 2–3 candidatos com scores próximos, gerar perguntas dirigidas para o usuário.

```javascript
// src/ai/guided-questions.js
// Recebe os top 3 candidatos com seus detalhes de ativação.
// Identifica o período onde candidato A e B divergem mais.
// Gera UMA pergunta neutra sobre aquele período.

async function generateGuidedQuestion(candidatoA, candidatoB, eventosJaColetados) {
  // Prompt para Claude: dado dois mapas com ASC/MC diferentes,
  // qual período histórico da vida do usuário deveria ter
  // ativações distintas segundo cada candidato?
  // Formular pergunta sem revelar a hipótese astrológica.
}

module.exports = { generateGuidedQuestion };
```

---

## Passo 14 — `src/db/store.js`

SQLite para persistência de sessões entre requisições.

```javascript
// src/db/store.js
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../rectification.db'));

// Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    dados_nascimento TEXT,
    eventos TEXT,
    resultados TEXT,
    criado_em INTEGER,
    atualizado_em INTEGER
  );
`);

function createSession(id, dadosNascimento) { /* implementar */ }
function updateEvents(id, eventos) { /* implementar */ }
function updateResults(id, resultados) { /* implementar */ }
function getSession(id) { /* implementar */ }

module.exports = { createSession, updateEvents, updateResults, getSession };
```

---

## Passo 15 — `server.js`

API Express com as seguintes rotas:

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// POST /api/session
// Body: { dia, mes, ano, hora, estado, cidade, lat, lon, fonteHorario }
// Cria uma sessão, converte para UT, retorna sessionId + dados convertidos
app.post('/api/session', async (req, res) => { /* implementar */ });

// POST /api/session/:id/events
// Body: { texto: "relato livre do usuário" }
// Extrai eventos via IA, salva na sessão, retorna eventos estruturados
app.post('/api/session/:id/events', async (req, res) => { /* implementar */ });

// POST /api/session/:id/rectify
// Executa o motor de retificação com os eventos da sessão
// Retorna top 3 horários candidatos com scores e detalhes
app.post('/api/session/:id/rectify', async (req, res) => { /* implementar */ });

// GET /api/session/:id/question
// Gera pergunta dirigida para refinar entre os top candidatos
app.get('/api/session/:id/question', async (req, res) => { /* implementar */ });

// GET /api/cities?q=sao+paulo
// Busca cidades no banco local para o autocomplete do frontend
app.get('/api/cities', (req, res) => { /* implementar */ });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Retificação app rodando em http://localhost:${PORT}`));
```

---

## Passo 16 — `public/index.html` + `public/style.css` + `public/app.js`

Frontend baseado no protótipo já desenvolvido (`retificacao-app.html`), agora conectado à API real.

### Fluxo de telas (SPA com 4 estados):

```
ESTADO 1: #birth
  - Formulário de dados de nascimento
  - Autocomplete de cidade via GET /api/cities
  - Pills de fonte do horário
  - CTA: "Continuar" → POST /api/session → guarda sessionId → ESTADO 2

ESTADO 2: #interview
  - Chips de domínio que inserem snippet de texto
  - Textarea de texto livre (tipografia serifada, convidativa)
  - CTA: "Extrair eventos" → POST /api/session/:id/events
  - Loading com animação de ondas
  - → ESTADO 3 ao receber resposta

ESTADO 3: #events
  - Lista de eventos extraídos com cards coloridos por categoria
  - Barra de qualidade do conjunto de dados
  - Contador de eventos
  - Botão "Adicionar mais informações" (scroll back para textarea)
  - Botão "Retificar agora" → POST /api/session/:id/rectify → ESTADO 4

ESTADO 4: #results
  - Top 3 horários candidatos com scores visuais
  - Para cada candidato: ASC resultante, MC, e principais ativações encontradas
  - Caixa de pergunta dirigida (se candidatos estiverem próximos em score)
  - Botão "Responder pergunta" → reprocessa com informação adicional
  - Relatório final quando convergência atingida (score gap > 15%)
```

### Critério de convergência para exibir resultado definitivo:

```javascript
// Se o score do #1 for pelo menos 15% maior que o #2:
// → exibir resultado como "Horário retificado com alta confiança"
// Se gap for 5-15%:
// → exibir como "Horário mais provável" + gerar pergunta dirigida
// Se gap < 5%:
// → exibir como "Inconclusivo — mais dados necessários"
```

---

## Passo 17 — Tratamento de Edge Cases Obrigatórios

Implementar e testar os seguintes casos antes de considerar o app pronto:

```
1. Horário desconhecido (busca em 96 candidatos ao longo do dia inteiro)
2. Usuário com menos de 5 eventos válidos → aviso de precisão reduzida
3. Usuário com menos de 25 anos → ativar técnica da Lua Progressada prioritariamente
4. Evento com data apenas como ano → peso 0.25, usar janela de ±6 meses na verificação
5. Estado AM/AC/PA/AP e outros sem DST → nunca aplicar horário de verão
6. Nascimento anterior a 1914 em SP/RJ/RS → usar offset de meridiano local
7. Nascimento em Fernando de Noronha → UTC-2
8. Overflow de dia ao converter para UT (ex: 23h00 SP → 02h00 UT do dia seguinte)
9. Underflow de dia (ex: 01h00 com offset +4 → dia anterior)
10. Cidade não encontrada no banco → pedir UF do estado manualmente
```

---

## Passo 18 — Testes de Integração

Criar `tests/integration.test.js` com pelo menos 3 casos de ponta a ponta:

```javascript
// Caso 1: Nascimento com muitos eventos, resultado convergente esperado
// Caso 2: Usuário jovem (~20 anos), poucos eventos, resultado inconclusivo esperado  
// Caso 3: Horário completamente desconhecido, busca ampla
```

---

## Passo 19 — README.md

Criar com:
- Pré-requisitos (Node 20+, ANTHROPIC_API_KEY)
- Instalação em 3 comandos
- Como rodar (`npm start`)
- Como rodar os testes (`npm test`)
- Descrição de cada rota da API
- Arquitetura resumida em diagrama ASCII

---

## Ordem de Implementação Recomendada

```
1.  package.json + estrutura de diretórios
2.  data/*.json (arquivos de dados históricos)
3.  src/engine/time-converter.js + testes (VALIDAR ANTES DE PROSSEGUIR)
4.  src/engine/ephemeris.js
5.  src/engine/chart-calculator.js
6.  src/engine/solar-arc.js + testes básicos
7.  src/engine/profections.js
8.  src/engine/progressions.js
9.  src/engine/scorer.js
10. src/engine/rectifier.js
11. src/ai/event-extractor.js
12. src/ai/guided-questions.js
13. src/db/store.js
14. server.js (rotas)
15. public/ (frontend conectado à API)
16. Edge cases + testes de integração
17. README.md
```

**Critério de conclusão:** `npm test` passa com 0 falhas e o fluxo completo funciona em `http://localhost:3000` com uma sessão de exemplo usando dados de nascimento reais (ex: 15/01/1985, 14h30, São Paulo, SP).

---

## Notas Críticas para o Claude Code

- **Não inventar dados históricos de DST.** O JSON do Passo 2 contém os dados reais — usar exatamente esses períodos.
- **Swiss Ephemeris é síncrono.** O pacote `swisseph` para Node.js usa callbacks ou é síncrono dependendo da versão. Verificar a API do pacote após instalação.
- **Nunca armazenar a ANTHROPIC_API_KEY no código.** Sempre via `.env`.
- **O scorer não precisa ser perfeito na v1.** O critério de sucesso é que o motor elimine janelas incorretas, não que acerte o minuto exato. Precisão de ±10 minutos é suficiente para v1.
- **O frontend pode reusar integralmente o CSS do protótipo** (`retificacao-app.html` já entregue). Adaptar para conectar com a API em vez de chamar a Anthropic diretamente do browser.
```
