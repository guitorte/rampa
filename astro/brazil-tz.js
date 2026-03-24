// brazil-tz.js — Historical Brazilian timezone and DST data
// Source: Decreto federal + ACS International Atlas
'use strict';

const BrazilTZ = (() => {

  const ESTADOS = {
    AC: { offset: -5, nome: 'Acre' },
    AM: { offset: -4, nome: 'Amazonas' },
    AP: { offset: -3, nome: 'Amapá' },
    PA: { offset: -3, nome: 'Pará' },
    RO: { offset: -4, nome: 'Rondônia' },
    RR: { offset: -4, nome: 'Roraima' },
    TO: { offset: -3, nome: 'Tocantins' },
    MA: { offset: -3, nome: 'Maranhão' },
    PI: { offset: -3, nome: 'Piauí' },
    CE: { offset: -3, nome: 'Ceará' },
    RN: { offset: -3, nome: 'Rio Grande do Norte' },
    PB: { offset: -3, nome: 'Paraíba' },
    PE: { offset: -3, nome: 'Pernambuco' },
    AL: { offset: -3, nome: 'Alagoas' },
    SE: { offset: -3, nome: 'Sergipe' },
    BA: { offset: -3, nome: 'Bahia' },
    MG: { offset: -3, nome: 'Minas Gerais' },
    ES: { offset: -3, nome: 'Espírito Santo' },
    RJ: { offset: -3, nome: 'Rio de Janeiro' },
    SP: { offset: -3, nome: 'São Paulo' },
    PR: { offset: -3, nome: 'Paraná' },
    SC: { offset: -3, nome: 'Santa Catarina' },
    RS: { offset: -3, nome: 'Rio Grande do Sul' },
    MS: { offset: -4, nome: 'Mato Grosso do Sul' },
    MT: { offset: -4, nome: 'Mato Grosso' },
    GO: { offset: -3, nome: 'Goiás' },
    DF: { offset: -3, nome: 'Distrito Federal' },
    FN: { offset: -2, nome: 'Fernando de Noronha' }
  };

  // Pre-1914 meridian local offsets (decimal hours)
  const PRE_1914 = {
    SP: -3.1076,
    RJ: -2.8727,
    RS: -3.3833
  };

  // Regions that NEVER had DST
  const REGIOES_SEM_DST = ['AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'];

  // Historical DST periods — each entry: [startISO, endISO, regions[]]
  // All DST periods shift +1 hour
  const DST_FULL = ['SP','RJ','MG','RS','PR','SC','GO','MT','MS','ES','DF'];
  const DST_1931 = ['SP','RJ','MG','RS','PR','SC','GO','MT','MS','ES','RN','PB','PE','AL','SE','BA','PI','CE','MA','DF'];

  const DST_PERIODOS = [
    ['1931-10-03', '1932-04-01', DST_1931],
    ['1932-10-03', '1933-04-01', DST_FULL],
    ['1949-12-01', '1950-04-16', DST_FULL],
    ['1950-12-01', '1951-04-01', DST_FULL],
    ['1951-12-01', '1952-04-01', DST_FULL],
    ['1952-12-01', '1953-03-01', DST_FULL],
    ['1963-10-23', '1964-03-01', DST_FULL],
    ['1964-11-01', '1965-03-01', DST_FULL],
    ['1965-11-01', '1966-03-01', DST_FULL],
    ['1966-11-01', '1967-03-01', DST_FULL],
    ['1967-11-01', '1968-03-01', DST_FULL],
    ['1985-11-02', '1986-03-15', DST_FULL],
    ['1986-10-25', '1987-02-14', DST_FULL],
    ['1987-10-25', '1988-02-07', DST_FULL],
    ['1988-10-16', '1989-01-29', DST_FULL],
    ['1989-10-15', '1990-02-11', DST_FULL],
    ['1990-10-21', '1991-02-17', DST_FULL],
    ['1991-10-20', '1992-02-09', DST_FULL],
    ['1992-10-25', '1993-01-31', DST_FULL],
    ['1993-10-17', '1994-02-20', DST_FULL],
    ['1994-10-16', '1995-02-19', DST_FULL],
    ['1995-10-15', '1996-02-11', DST_FULL],
    ['1996-10-06', '1997-02-16', DST_FULL],
    ['1997-10-06', '1998-03-01', DST_FULL],
    ['1998-10-11', '1999-03-01', DST_FULL],
    ['1999-10-03', '2000-02-27', DST_FULL],
    ['2000-10-08', '2001-02-18', DST_FULL],
    ['2001-10-14', '2002-02-17', DST_FULL],
    ['2002-11-03', '2003-03-16', DST_FULL],
    ['2003-10-19', '2004-02-15', DST_FULL],
    ['2004-11-07', '2005-03-27', DST_FULL],
    ['2005-11-06', '2006-03-05', DST_FULL],
    ['2006-11-05', '2007-02-25', DST_FULL],
    ['2007-10-14', '2008-02-17', DST_FULL],
    ['2008-10-19', '2009-02-15', DST_FULL],
    ['2009-10-18', '2010-02-28', DST_FULL],
    ['2010-10-17', '2011-02-27', DST_FULL],
    ['2011-10-16', '2012-02-26', DST_FULL],
    ['2012-10-21', '2013-02-17', DST_FULL],
    ['2013-10-20', '2014-02-16', DST_FULL],
    ['2014-10-19', '2015-02-22', DST_FULL],
    ['2015-10-25', '2016-02-21', DST_FULL],
    ['2016-10-16', '2017-02-19', DST_FULL],
    ['2017-10-15', '2018-02-18', DST_FULL],
    ['2018-11-04', '2019-02-17', DST_FULL]
  ];

  function parseISODate(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  /**
   * Check if DST was active for a given state on a given date.
   */
  function isDST(estado, year, month, day) {
    if (REGIOES_SEM_DST.includes(estado)) return false;
    const dt = Date.UTC(year, month - 1, day);
    for (const [inicio, fim, regioes] of DST_PERIODOS) {
      if (!regioes.includes(estado)) continue;
      const start = parseISODate(inicio).getTime();
      const end = parseISODate(fim).getTime();
      if (dt >= start && dt < end) return true;
    }
    return false;
  }

  /**
   * Get the UTC offset in hours for a state on a given date.
   * Accounts for pre-1914 meridian local offsets and DST.
   */
  function getOffset(estado, year, month, day) {
    const info = ESTADOS[estado];
    if (!info) return -3; // default fallback

    let base;
    if (year < 1914 && PRE_1914[estado] !== undefined) {
      base = PRE_1914[estado];
    } else {
      base = info.offset;
    }

    if (isDST(estado, year, month, day)) {
      base += 1; // DST adds 1 hour (e.g. -3 becomes -2)
    }

    return base;
  }

  /**
   * Convert civil local time to Universal Time.
   * @param {number} day, month, year - date components
   * @param {number} hour, minute - time components (24h format)
   * @param {string} estado - Brazilian state abbreviation (e.g. "SP")
   * @returns {{ utYear, utMonth, utDay, utHour, utMinute, offset, dstActive }}
   */
  function civilToUT(day, month, year, hour, minute, estado) {
    const dstActive = isDST(estado, year, month, day);
    const offset = getOffset(estado, year, month, day);

    // UT = local time - offset (offset is negative, so subtracting a negative adds)
    let utMinute = minute;
    let utHourDec = hour - offset;

    // Handle fractional offsets (pre-1914)
    if (offset !== Math.floor(offset)) {
      const fracMinutes = Math.round((offset - Math.floor(offset)) * 60);
      utMinute -= fracMinutes;
      utHourDec = hour - Math.floor(offset);
    }

    // Normalize minutes
    while (utMinute < 0) { utMinute += 60; utHourDec--; }
    while (utMinute >= 60) { utMinute -= 60; utHourDec++; }

    // Normalize hours and handle day overflow/underflow
    let utDay = day, utMonth = month, utYear = year;
    let utHour = Math.floor(utHourDec);

    while (utHour < 0) {
      utHour += 24;
      utDay--;
    }
    while (utHour >= 24) {
      utHour -= 24;
      utDay++;
    }

    // Normalize day (simple approach using Date)
    const d = new Date(Date.UTC(utYear, utMonth - 1, utDay, utHour, utMinute));
    utYear = d.getUTCFullYear();
    utMonth = d.getUTCMonth() + 1;
    utDay = d.getUTCDate();
    utHour = d.getUTCHours();
    utMinute = d.getUTCMinutes();

    return { utYear, utMonth, utDay, utHour, utMinute, offset, dstActive };
  }

  return { ESTADOS, isDST, getOffset, civilToUT, REGIOES_SEM_DST };
})();
