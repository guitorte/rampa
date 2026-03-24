// app.js — Main application logic for Retificação de Mapa Natal
'use strict';

(function() {

  // ── State ─────────────────────────────────────────────
  let currentSource = 'certidao';
  let extractedEvents = [];
  let selectedCity = null;
  let rectificationResult = null;

  // ── Init ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    buildStars();
    loadState();
    setupApiKey();
    setupSourcePills();
    setupPromptChips();
    setupCityAutocomplete();
    setupTextarea();
    setupExtractBtn();
    setupAddMore();
    setupRectifyBtn();
  });

  // ── Stars ─────────────────────────────────────────────
  function buildStars() {
    var c = document.getElementById('stars');
    for (var i = 0; i < 80; i++) {
      var s = document.createElement('div');
      s.className = 'star';
      var sz = Math.random() * 1.6 + 0.4;
      s.style.cssText =
        'width:' + sz + 'px;height:' + sz + 'px;' +
        'top:' + (Math.random() * 100) + '%;left:' + (Math.random() * 100) + '%;' +
        '--d:' + (3 + Math.random() * 5) + 's;' +
        'animation-delay:' + (Math.random() * 6) + 's;' +
        'opacity:' + (0.1 + Math.random() * 0.4) + ';';
      c.appendChild(s);
    }
  }

  // ── API Key ───────────────────────────────────────────
  function setupApiKey() {
    var input = document.getElementById('api-key-input');
    var saveBtn = document.getElementById('api-key-save');
    var toggleBtn = document.getElementById('api-key-toggle');
    var bar = document.getElementById('api-key-bar');
    var hint = document.getElementById('api-key-hint');

    var stored = localStorage.getItem('anthropic_api_key');
    if (stored) {
      input.value = stored;
      bar.classList.add('has-key');
      hint.textContent = 'Chave salva no navegador.';
    }

    saveBtn.addEventListener('click', function() {
      var key = input.value.trim();
      if (key) {
        localStorage.setItem('anthropic_api_key', key);
        bar.classList.add('has-key');
        hint.textContent = 'Chave salva no navegador.';
        saveBtn.classList.add('saved');
        saveBtn.textContent = 'Salvo';
        setTimeout(function() {
          saveBtn.classList.remove('saved');
          saveBtn.textContent = 'Salvar';
        }, 2000);
      }
    });

    toggleBtn.addEventListener('click', function() {
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  }

  function getApiKey() {
    return document.getElementById('api-key-input').value.trim() ||
           localStorage.getItem('anthropic_api_key') || '';
  }

  // ── Source Pills ──────────────────────────────────────
  function setupSourcePills() {
    var pills = document.querySelectorAll('.spill');
    pills.forEach(function(btn) {
      btn.addEventListener('click', function() {
        pills.forEach(function(b) { b.classList.remove('sel'); });
        btn.classList.add('sel');
        currentSource = btn.getAttribute('data-source');
        saveState();
      });
    });
  }

  // ── Prompt Chips ──────────────────────────────────────
  var snippets = {
    escola: 'Na escola, ',
    familia: 'Na minha família, ',
    trabalho: 'No trabalho, ',
    saude: 'Sobre minha saúde, ',
    relacionamento: 'Nos relacionamentos, ',
    moradia: 'Sobre onde morei, '
  };

  function setupPromptChips() {
    document.querySelectorAll('.prompt-chip').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.getAttribute('data-prompt');
        var ta = document.getElementById('freetext');
        var cur = ta.value;
        var snip = snippets[key];
        ta.value = cur ? cur + '\n\n' + snip : snip;
        ta.focus();
        updateWordCount();
      });
    });
  }

  // ── City Autocomplete ─────────────────────────────────
  function setupCityAutocomplete() {
    var input = document.getElementById('b-cidade');
    var dropdown = document.getElementById('city-dropdown');
    var highlighted = -1;

    input.addEventListener('input', function() {
      var query = input.value.trim();
      var results = CitiesBR.search(query);
      highlighted = -1;

      if (results.length === 0) {
        dropdown.classList.remove('show');
        dropdown.innerHTML = '';
        return;
      }

      dropdown.innerHTML = '';
      results.forEach(function(city, i) {
        var opt = document.createElement('div');
        opt.className = 'city-option';
        opt.innerHTML = city.name + '<span class="city-state">' + city.state + '</span>';
        opt.addEventListener('click', function() {
          selectCity(city);
          dropdown.classList.remove('show');
        });
        dropdown.appendChild(opt);
      });
      dropdown.classList.add('show');
    });

    input.addEventListener('keydown', function(e) {
      var options = dropdown.querySelectorAll('.city-option');
      if (!options.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlighted = Math.min(highlighted + 1, options.length - 1);
        updateHighlight(options);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlighted = Math.max(highlighted - 1, 0);
        updateHighlight(options);
      } else if (e.key === 'Enter' && highlighted >= 0) {
        e.preventDefault();
        options[highlighted].click();
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('show');
      }
    });

    function updateHighlight(options) {
      options.forEach(function(o, i) {
        o.classList.toggle('highlighted', i === highlighted);
      });
    }

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.city-field')) {
        dropdown.classList.remove('show');
      }
    });
  }

  function selectCity(city) {
    selectedCity = city;
    document.getElementById('b-cidade').value = city.name + ', ' + city.state;
    document.getElementById('selected-city-info').textContent =
      city.name + '/' + city.state + ' — ' + city.lat.toFixed(4) + ', ' + city.lon.toFixed(4);
    saveState();
  }

  // ── Textarea ──────────────────────────────────────────
  function setupTextarea() {
    var ta = document.getElementById('freetext');
    ta.addEventListener('input', updateWordCount);
  }

  function updateWordCount() {
    var val = document.getElementById('freetext').value;
    var words = val.trim() ? val.trim().split(/\s+/).length : 0;
    document.getElementById('char-hint').textContent = words + (words === 1 ? ' palavra' : ' palavras');
    document.getElementById('extract-btn').disabled = words < 10;
  }

  // ── Extract Button ────────────────────────────────────
  function setupExtractBtn() {
    document.getElementById('extract-btn').addEventListener('click', extractEvents);
  }

  // ── Add More ──────────────────────────────────────────
  function setupAddMore() {
    document.getElementById('add-more-btn').addEventListener('click', function() {
      var ta = document.getElementById('freetext');
      ta.focus();
      ta.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ── Extract Events ────────────────────────────────────
  async function extractEvents() {
    var apiKey = getApiKey();
    if (!apiKey) {
      showError('Insira sua chave da API Anthropic acima para extrair eventos.');
      document.getElementById('api-key-input').focus();
      return;
    }

    var text = document.getElementById('freetext').value.trim();
    if (!text) return;

    var dia = document.getElementById('b-dia').value;
    var mes = document.getElementById('b-mes').value;
    var ano = document.getElementById('b-ano').value;
    var cidade = document.getElementById('b-cidade').value;
    var hora = document.getElementById('b-hora').value;

    document.getElementById('extract-btn').disabled = true;
    document.getElementById('loading').classList.add('show');
    hideError();

    var systemPrompt = 'Você é um motor de extração de eventos biográficos para retificação astrológica.\n\n' +
      'Dado o relato livre de um usuário, extraia todos os eventos de vida mencionados ou inferíveis.\n\n' +
      'Para cada evento, retorne um objeto JSON com:\n' +
      '- descricao: string (frase curta e clara descrevendo o evento, em português)\n' +
      '- data_inferida: string (a data mais precisa possível: "AAAA", "MM/AAAA", "DD/MM/AAAA", ou null se impossível de inferir)\n' +
      '- tipo: string (um de: "familia", "carreira", "saude", "moradia", "educacao", "relacionamento", "outro")\n' +
      '- peso: number entre 0 e 1 (confiabilidade da data: 1.0=documento, 0.85=data exata, 0.6=mês/ano, 0.35=só ano aproximado, 0.15=muito vago)\n' +
      '- precisao: string (um de: "exata", "dia_exato", "mes_ano", "so_ano", "aproximada")\n' +
      '- nota: string (observação sobre a imprecisão ou contexto, se relevante)\n\n' +
      'Regras importantes:\n' +
      '- Extraia TUDO que puder ser um evento, mesmo que o usuário diga que não foi "tão importante"\n' +
      '- Se o usuário mencionar idade, calcule o ano aproximado com base no ano de nascimento ' + (ano || 'informado') + '\n' +
      '- Se a data for vaga mas inferível por contexto (ex: "na faculdade" + ano de nascimento), estime\n' +
      '- Separe eventos compostos ("me casei e logo depois tive um filho") em eventos distintos\n' +
      '- Ignore opiniões, sentimentos e avaliações — extraia apenas fatos e eventos\n\n' +
      'Retorne APENAS um array JSON válido, sem texto adicional, sem markdown, sem explicações.';

    var userMsg = 'Usuário nascido em: ' + (dia || '?') + '/' + (mes || '?') + '/' + (ano || '?') +
      ' em ' + (cidade || 'cidade não informada') + '. Horário: ' + (hora || 'desconhecido') +
      '. Fonte: ' + currentSource + '.\n\nRelato:\n"' + text + '"';

    try {
      var resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMsg }]
        })
      });

      var data = await resp.json();

      if (data.error) {
        throw new Error(data.error.message || 'Erro na API');
      }

      var raw = '';
      if (data.content) {
        for (var i = 0; i < data.content.length; i++) {
          if (data.content[i].type === 'text') {
            raw = data.content[i].text;
            break;
          }
        }
      }

      var clean = raw.replace(/```json|```/g, '').trim();
      var events = JSON.parse(clean);
      renderEvents(events);
      saveState();
    } catch (e) {
      showError('Não foi possível processar: ' + e.message);
    }

    document.getElementById('loading').classList.remove('show');
    document.getElementById('extract-btn').disabled = false;
  }

  // ── Render Events ─────────────────────────────────────
  function getTagStyle(type) {
    var map = {
      familia:        { bg: 'var(--teal-dim)',   color: 'var(--teal)',   label: 'Família' },
      carreira:       { bg: 'var(--purple-dim)', color: 'var(--purple)', label: 'Carreira' },
      saude:          { bg: 'var(--coral-dim)',  color: 'var(--coral)',  label: 'Saúde' },
      moradia:        { bg: 'var(--amber-dim)',  color: 'var(--amber)',  label: 'Moradia' },
      educacao:       { bg: 'var(--purple-dim)', color: 'var(--purple)', label: 'Educação' },
      relacionamento: { bg: 'rgba(212,84,126,.15)', color: '#d4547e', label: 'Relacionamento' },
      outro:          { bg: 'rgba(122,117,144,.15)', color: 'var(--text-muted)', label: 'Outro' }
    };
    return map[type] || map['outro'];
  }

  function getPesoLabel(peso) {
    if (peso >= 0.8) return { label: 'Alta confiança', color: 'var(--teal)' };
    if (peso >= 0.5) return { label: 'Média confiança', color: 'var(--amber)' };
    return { label: 'Baixa confiança', color: 'var(--coral)' };
  }

  function renderEvents(events) {
    var list = document.getElementById('events-list');
    list.innerHTML = '';
    extractedEvents = events;
    document.getElementById('evt-count').textContent = events.length;

    events.forEach(function(evt, i) {
      var tag = getTagStyle(evt.tipo);
      var conf = getPesoLabel(evt.peso);
      var barW = Math.round(evt.peso * 100);

      var card = document.createElement('div');
      card.className = 'event-card';
      card.style.animationDelay = (i * 0.06) + 's';
      card.innerHTML =
        '<div class="evt-dot" style="background:' + tag.color + '"></div>' +
        '<div class="evt-body">' +
          '<div class="evt-desc">' + escapeHtml(evt.descricao) + '</div>' +
          '<div class="evt-meta">' +
            '<span class="evt-date">' + (evt.data_inferida || 'Data incerta') + '</span>' +
            '<span class="evt-tag" style="background:' + tag.bg + ';color:' + tag.color + '">' + tag.label + '</span>' +
          '</div>' +
          '<div class="conf-bar-wrap">' +
            '<div class="conf-bar"><div class="conf-fill" style="width:' + barW + '%;background:' + conf.color + '"></div></div>' +
            '<span class="conf-label">' + conf.label + '</span>' +
          '</div>' +
        '</div>';
      list.appendChild(card);
    });

    updateQualityBar(events);
    document.getElementById('events-section').classList.add('show');
    document.getElementById('pipeline').style.display = 'block';
    document.getElementById('pipe1-sub').textContent = events.length + ' evento' + (events.length === 1 ? '' : 's') + ' extraído' + (events.length === 1 ? '' : 's');

    // Show rectify button
    document.getElementById('rectify-btn').style.display = 'block';

    setStep(3);
  }

  function updateQualityBar(events) {
    var avg = events.reduce(function(s, e) { return s + e.peso; }, 0) / Math.max(events.length, 1);
    var segs = 5;
    var filled = Math.round(avg * segs);
    for (var i = 1; i <= segs; i++) {
      var el = document.getElementById('qs' + i);
      if (i <= filled) {
        el.style.background = avg >= 0.7 ? 'var(--teal)' : avg >= 0.45 ? 'var(--amber)' : 'var(--coral)';
      } else {
        el.style.background = 'var(--border)';
      }
    }
    var label = avg >= 0.7 ? 'Qualidade boa' : avg >= 0.45 ? 'Qualidade média' : 'Qualidade baixa';
    document.getElementById('q-label').textContent = label;
  }

  function setStep(n) {
    for (var i = 1; i <= 4; i++) {
      var el = document.getElementById('st' + i);
      el.className = 'step' + (i < n ? ' done' : i === n ? ' active' : '');
    }
  }

  // ── Rectify Button ────────────────────────────────────
  function setupRectifyBtn() {
    document.getElementById('rectify-btn').addEventListener('click', runRectification);
  }

  // ── Run Rectification ─────────────────────────────────
  function runRectification() {
    hideError();

    // Validate birth data
    var dia = parseInt(document.getElementById('b-dia').value);
    var mes = parseInt(document.getElementById('b-mes').value);
    var ano = parseInt(document.getElementById('b-ano').value);
    var horaStr = document.getElementById('b-hora').value.trim();

    if (!dia || !mes || !ano) {
      showError('Preencha a data de nascimento completa (dia, mês, ano).');
      return;
    }

    if (!selectedCity) {
      showError('Selecione uma cidade de nascimento da lista.');
      return;
    }

    if (extractedEvents.length === 0) {
      showError('Extraia pelo menos um evento antes de retificar.');
      return;
    }

    // Parse time
    var hour = 12, minute = 0;
    if (horaStr && horaStr.includes(':')) {
      var parts = horaStr.split(':');
      hour = parseInt(parts[0]) || 0;
      minute = parseInt(parts[1]) || 0;
    } else if (horaStr) {
      hour = parseInt(horaStr) || 12;
    }

    var birthData = {
      day: dia,
      month: mes,
      year: ano,
      hour: hour,
      minute: minute,
      estado: selectedCity.state,
      lat: selectedCity.lat,
      lon: selectedCity.lon,
      source: currentSource
    };

    // UI: show running state
    var btn = document.getElementById('rectify-btn');
    btn.textContent = 'Calculando...';
    btn.classList.add('running');
    btn.disabled = true;

    // Update pipeline
    setPipeStep(2, 'active-pipe', 'Calculando...');
    setPipeStep(3, 'pending', 'Pendente');
    setPipeStep(4, 'pending', 'Pendente');

    // Run async to allow UI to update
    setTimeout(function() {
      try {
        var result = Rectifier.rectify(birthData, extractedEvents, function(pct) {
          btn.textContent = 'Calculando... ' + pct + '%';
          if (pct > 50) {
            setPipeStep(2, 'ready', 'Pronto');
            setPipeStep(3, 'active-pipe', 'Calculando...');
          }
        });

        rectificationResult = result;

        setPipeStep(2, 'ready', 'Pronto');
        setPipeStep(3, 'ready', 'Pronto');
        setPipeStep(4, 'ready', 'Pronto');

        renderResults(result);
        setStep(4);
        saveState();

      } catch (e) {
        showError('Erro no cálculo: ' + e.message);
        console.error(e);
      }

      btn.textContent = 'Retificar agora';
      btn.classList.remove('running');
      btn.disabled = false;
    }, 50);
  }

  function setPipeStep(idx, cls, statusText) {
    var el = document.getElementById('pipe' + idx);
    el.className = 'pipe-step ' + cls;
    var statusEl = document.getElementById('pipe' + idx + '-status');
    if (statusEl) statusEl.textContent = statusText;
  }

  // ── Render Results ────────────────────────────────────
  function renderResults(result) {
    var section = document.getElementById('results-section');
    section.style.display = 'block';

    // Convergence banner
    var banner = document.getElementById('convergence-banner');
    var conv = result.metadata.convergence;
    banner.className = 'convergence-banner ' + conv.level;
    banner.innerHTML =
      '<strong>Convergência: ' + conv.level.toUpperCase() + '</strong><br>' +
      conv.description +
      '<br><span style="font-size:10px;opacity:.7">' +
      result.metadata.totalCandidates + ' horários testados, ' +
      result.metadata.totalEvents + ' eventos avaliados</span>';

    // Result cards
    var cardsEl = document.getElementById('results-cards');
    cardsEl.innerHTML = '';

    var maxScore = result.top3.length > 0 ? result.top3[0].score : 1;

    result.top3.forEach(function(cand, i) {
      var card = document.createElement('div');
      card.className = 'result-card' + (i === 0 ? ' best' : '');
      var pct = maxScore > 0 ? Math.round((cand.score / maxScore) * 100) : 0;
      var barColor = i === 0 ? 'var(--teal)' : i === 1 ? 'var(--amber)' : 'var(--accent)';

      var ascF = cand.chart.angles.asc.formatted;
      var mcF = cand.chart.angles.mc.formatted;
      var dscF = cand.chart.angles.dsc.formatted;
      var icF = cand.chart.angles.ic.formatted;

      card.innerHTML =
        '<div style="display:flex;align-items:center;margin-bottom:4px">' +
          '<span class="result-rank">' + (i + 1) + '</span>' +
          '<span class="result-time">' + cand.candidateTime + '</span>' +
          '<span style="margin-left:auto;font-size:11px;color:var(--text-muted)">' +
            'score ' + cand.score.toFixed(3) +
          '</span>' +
        '</div>' +
        '<div class="result-score-bar">' +
          '<div class="result-score-fill" style="width:' + pct + '%;background:' + barColor + '"></div>' +
        '</div>' +
        '<div class="result-angles">' +
          '<div class="result-angle">ASC: <strong>' + ascF + '</strong></div>' +
          '<div class="result-angle">MC: <strong>' + mcF + '</strong></div>' +
          '<div class="result-angle">DSC: <strong>' + dscF + '</strong></div>' +
          '<div class="result-angle">IC: <strong>' + icF + '</strong></div>' +
        '</div>' +
        '<div class="result-expand">' +
          buildDetailRows(cand.details) +
        '</div>';

      card.addEventListener('click', function() {
        card.classList.toggle('expanded');
      });

      cardsEl.appendChild(card);
    });

    // Score distribution chart
    if (result.allScores && result.allScores.length > 1) {
      renderScoreChart(result);
    }

    // Scroll to results
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Meta
    document.getElementById('results-meta').textContent =
      'Técnicas: Arco Solar (' + Math.round(Rectifier.TECHNIQUE_WEIGHTS.solarArc * 100) + '%) + ' +
      'Profecções (' + Math.round(Rectifier.TECHNIQUE_WEIGHTS.profections * 100) + '%) + ' +
      'Progressões (' + Math.round(Rectifier.TECHNIQUE_WEIGHTS.progressions * 100) + '%)';
  }

  function buildDetailRows(details) {
    if (!details || details.length === 0) return '<div style="font-size:11px;color:var(--text-faint)">Sem detalhes</div>';

    var html = '<div class="result-detail-row">' +
      '<span>Evento</span><span>Arco S.</span><span>Profec.</span><span>Progr.</span><span>Total</span>' +
      '</div>';

    details.forEach(function(d) {
      var saColor = scoreColor(d.solarArc);
      var pfColor = scoreColor(d.profections);
      var prColor = scoreColor(d.progressions);
      html += '<div class="result-detail-row">' +
        '<span style="color:var(--text)">' + truncate(d.evento, 30) + '</span>' +
        '<span style="color:' + saColor + '">' + d.solarArc.toFixed(2) + '</span>' +
        '<span style="color:' + pfColor + '">' + d.profections.toFixed(2) + '</span>' +
        '<span style="color:' + prColor + '">' + d.progressions.toFixed(2) + '</span>' +
        '<span style="color:var(--accent)">' + d.combined.toFixed(2) + '</span>' +
        '</div>';
    });
    return html;
  }

  function scoreColor(val) {
    if (val >= 0.6) return 'var(--teal)';
    if (val >= 0.3) return 'var(--amber)';
    if (val > 0) return 'var(--coral)';
    return 'var(--text-faint)';
  }

  function renderScoreChart(result) {
    var panel = document.getElementById('score-chart-panel');
    panel.style.display = 'block';
    var chart = document.getElementById('score-chart');
    chart.innerHTML = '';

    var scores = result.allScores;
    var maxScore = Math.max.apply(null, scores.map(function(s) { return s.score; }));
    if (maxScore === 0) maxScore = 1;

    var top3Times = result.top3.map(function(c) { return c.candidateTime; });

    scores.forEach(function(s) {
      var bar = document.createElement('div');
      bar.className = 'score-bar';
      if (top3Times.indexOf(s.time) >= 0) bar.classList.add('top3');
      var h = Math.max(2, Math.round((s.score / maxScore) * 90));
      bar.style.height = h + 'px';
      bar.title = s.time + ' — score: ' + s.score.toFixed(3);
      chart.appendChild(bar);
    });
  }

  // ── Utilities ─────────────────────────────────────────
  function showError(msg) {
    var box = document.getElementById('error-box');
    box.textContent = msg;
    box.classList.add('show');
  }

  function hideError() {
    document.getElementById('error-box').classList.remove('show');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function truncate(str, max) {
    return str.length > max ? str.substring(0, max) + '...' : str;
  }

  // ── State Persistence ─────────────────────────────────
  function saveState() {
    try {
      var state = {
        dia: document.getElementById('b-dia').value,
        mes: document.getElementById('b-mes').value,
        ano: document.getElementById('b-ano').value,
        hora: document.getElementById('b-hora').value,
        cidade: document.getElementById('b-cidade').value,
        source: currentSource,
        selectedCity: selectedCity,
        freetext: document.getElementById('freetext').value,
        events: extractedEvents
      };
      localStorage.setItem('retificacao_state', JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem('retificacao_state');
      if (!raw) return;
      var state = JSON.parse(raw);

      if (state.dia) document.getElementById('b-dia').value = state.dia;
      if (state.mes) document.getElementById('b-mes').value = state.mes;
      if (state.ano) document.getElementById('b-ano').value = state.ano;
      if (state.hora) document.getElementById('b-hora').value = state.hora;
      if (state.cidade) document.getElementById('b-cidade').value = state.cidade;

      if (state.source) {
        currentSource = state.source;
        document.querySelectorAll('.spill').forEach(function(b) {
          b.classList.toggle('sel', b.getAttribute('data-source') === currentSource);
        });
      }

      if (state.selectedCity) {
        selectedCity = state.selectedCity;
        document.getElementById('selected-city-info').textContent =
          selectedCity.name + '/' + selectedCity.state + ' — ' +
          selectedCity.lat.toFixed(4) + ', ' + selectedCity.lon.toFixed(4);
      }

      if (state.freetext) {
        document.getElementById('freetext').value = state.freetext;
        updateWordCount();
      }

      if (state.events && state.events.length > 0) {
        renderEvents(state.events);
      }
    } catch (e) { /* ignore */ }
  }

})();
