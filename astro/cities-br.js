// cities-br.js — Brazilian cities with coordinates and state
// Top 80+ cities by population + state capitals
'use strict';

const CitiesBR = (() => {
  // [name, state, latitude, longitude]
  const DATA = [
    // São Paulo
    ['São Paulo', 'SP', -23.5505, -46.6333],
    ['Guarulhos', 'SP', -23.4628, -46.5333],
    ['Campinas', 'SP', -22.9099, -47.0626],
    ['São Bernardo do Campo', 'SP', -23.6914, -46.5646],
    ['Santo André', 'SP', -23.6737, -46.5432],
    ['Osasco', 'SP', -23.5325, -46.7917],
    ['São José dos Campos', 'SP', -23.1896, -45.8841],
    ['Ribeirão Preto', 'SP', -21.1783, -47.8067],
    ['Sorocaba', 'SP', -23.5015, -47.4526],
    ['Santos', 'SP', -23.9608, -46.3336],
    ['São José do Rio Preto', 'SP', -20.8113, -49.3758],
    ['Piracicaba', 'SP', -22.7256, -47.6492],
    ['Jundiaí', 'SP', -23.1857, -46.8978],
    ['Bauru', 'SP', -22.3246, -49.0871],
    // Rio de Janeiro
    ['Rio de Janeiro', 'RJ', -22.9068, -43.1729],
    ['São Gonçalo', 'RJ', -22.8269, -43.0634],
    ['Duque de Caxias', 'RJ', -22.7856, -43.3117],
    ['Nova Iguaçu', 'RJ', -22.7592, -43.4510],
    ['Niterói', 'RJ', -22.8833, -43.1036],
    ['Petrópolis', 'RJ', -22.5112, -43.1779],
    // Minas Gerais
    ['Belo Horizonte', 'MG', -19.9167, -43.9345],
    ['Uberlândia', 'MG', -18.9186, -48.2772],
    ['Contagem', 'MG', -19.9320, -44.0539],
    ['Juiz de Fora', 'MG', -21.7642, -43.3503],
    ['Betim', 'MG', -19.9678, -44.1983],
    ['Montes Claros', 'MG', -16.7351, -43.8615],
    ['Uberaba', 'MG', -19.7597, -47.9319],
    // Rio Grande do Sul
    ['Porto Alegre', 'RS', -30.0346, -51.2177],
    ['Caxias do Sul', 'RS', -29.1681, -51.1794],
    ['Pelotas', 'RS', -31.7654, -52.3376],
    ['Canoas', 'RS', -29.9178, -51.1740],
    ['Santa Maria', 'RS', -29.6842, -53.8069],
    // Paraná
    ['Curitiba', 'PR', -25.4284, -49.2733],
    ['Londrina', 'PR', -23.3045, -51.1696],
    ['Maringá', 'PR', -23.4205, -51.9333],
    ['Ponta Grossa', 'PR', -25.0994, -50.1583],
    ['Cascavel', 'PR', -24.9578, -53.4596],
    // Santa Catarina
    ['Florianópolis', 'SC', -27.5954, -48.5480],
    ['Joinville', 'SC', -26.3045, -48.8487],
    ['Blumenau', 'SC', -26.9194, -49.0661],
    // Bahia
    ['Salvador', 'BA', -12.9714, -38.5124],
    ['Feira de Santana', 'BA', -12.2669, -38.9666],
    ['Vitória da Conquista', 'BA', -14.8619, -40.8444],
    // Pernambuco
    ['Recife', 'PE', -8.0476, -34.8770],
    ['Jaboatão dos Guararapes', 'PE', -8.1130, -35.0156],
    ['Olinda', 'PE', -7.9907, -34.8417],
    ['Caruaru', 'PE', -8.2823, -35.9761],
    // Ceará
    ['Fortaleza', 'CE', -3.7319, -38.5267],
    ['Caucaia', 'CE', -3.7283, -38.6533],
    // Pará
    ['Belém', 'PA', -1.4558, -48.5024],
    ['Ananindeua', 'PA', -1.3659, -48.3888],
    ['Santarém', 'PA', -2.4431, -54.7081],
    // Maranhão
    ['São Luís', 'MA', -2.5297, -44.2825],
    ['Imperatriz', 'MA', -5.5264, -47.4919],
    // Amazonas
    ['Manaus', 'AM', -3.1190, -60.0217],
    // Goiás
    ['Goiânia', 'GO', -16.6869, -49.2648],
    ['Aparecida de Goiânia', 'GO', -16.8198, -49.2469],
    ['Anápolis', 'GO', -16.3281, -48.9530],
    // Distrito Federal
    ['Brasília', 'DF', -15.7975, -47.8919],
    // Mato Grosso
    ['Cuiabá', 'MT', -15.6014, -56.0979],
    ['Várzea Grande', 'MT', -15.6458, -56.1325],
    ['Rondonópolis', 'MT', -16.4673, -54.6372],
    // Mato Grosso do Sul
    ['Campo Grande', 'MS', -20.4697, -54.6201],
    ['Dourados', 'MS', -22.2233, -54.8083],
    // Espírito Santo
    ['Vitória', 'ES', -20.3155, -40.3128],
    ['Vila Velha', 'ES', -20.3297, -40.2925],
    ['Serra', 'ES', -20.1209, -40.3075],
    ['Cariacica', 'ES', -20.2631, -40.4164],
    // Rio Grande do Norte
    ['Natal', 'RN', -5.7945, -35.2110],
    ['Mossoró', 'RN', -5.1878, -37.3444],
    // Paraíba
    ['João Pessoa', 'PB', -7.1150, -34.8631],
    ['Campina Grande', 'PB', -7.2306, -35.8811],
    // Alagoas
    ['Maceió', 'AL', -9.6658, -35.7353],
    // Sergipe
    ['Aracaju', 'SE', -10.9095, -37.0748],
    // Piauí
    ['Teresina', 'PI', -5.0892, -42.8019],
    // Tocantins
    ['Palmas', 'TO', -10.1689, -48.3317],
    // Rondônia
    ['Porto Velho', 'RO', -8.7612, -63.9004],
    // Acre
    ['Rio Branco', 'AC', -9.9747, -67.8100],
    // Roraima
    ['Boa Vista', 'RR', 2.8195, -60.6714],
    // Amapá
    ['Macapá', 'AP', 0.0347, -51.0694],
    // Fernando de Noronha
    ['Fernando de Noronha', 'FN', -3.8544, -32.4297]
  ];

  /**
   * Search for a city by name (case-insensitive, accent-insensitive partial match).
   * Returns array of { name, state, lat, lon }
   */
  function search(query) {
    if (!query || query.length < 2) return [];
    const q = normalize(query);
    return DATA
      .filter(([name]) => normalize(name).includes(q))
      .map(([name, state, lat, lon]) => ({ name, state, lat, lon }))
      .slice(0, 10);
  }

  /**
   * Find exact city or best match.
   */
  function find(query) {
    const results = search(query);
    if (results.length === 0) return null;
    // Prefer exact match
    const q = normalize(query);
    const exact = results.find(r => normalize(r.name) === q);
    return exact || results[0];
  }

  /**
   * Get city by name and state.
   */
  function getByNameAndState(name, state) {
    const n = normalize(name);
    const s = state.toUpperCase().trim();
    const match = DATA.find(([cName, cState]) =>
      normalize(cName) === n && cState === s
    );
    if (match) return { name: match[0], state: match[1], lat: match[2], lon: match[3] };
    return find(name);
  }

  function normalize(s) {
    return s.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  /**
   * Get all cities for autocomplete.
   */
  function getAll() {
    return DATA.map(([name, state, lat, lon]) => ({ name, state, lat, lon }));
  }

  return { search, find, getByNameAndState, getAll };
})();
