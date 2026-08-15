(function () {
  var cfg = window.CENTRAL_CONFIG;

  document.getElementById('header-title').textContent = cfg.APP_NAME;
  document.getElementById('apple-app-title').content = cfg.APP_NAME;
  document.getElementById('app-title').textContent = cfg.APP_NAME;

  // ---------------- Navegación entre views ----------------
  var views = {
    inicio: document.getElementById('view-inicio'),
    curso: document.getElementById('view-curso'),
    perfil: document.getElementById('view-perfil'),
  };
  var navItems = document.querySelectorAll('.nav-item');

  function showView(name) {
    Object.keys(views).forEach(function (key) {
      views[key].hidden = key !== name;
    });
    navItems.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.view === name);
    });
  }

  navItems.forEach(function (btn) {
    btn.addEventListener('click', function () { showView(btn.dataset.view); });
  });

  // ---------------- Progreso del curso (localStorage) ----------------
  var PROGRESS_KEY = 'ritual_curso_progress';

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function setDone(itemId, done) {
    var p = getProgress();
    p[itemId] = !!done;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  }
  function isDone(itemId) {
    return !!getProgress()[itemId];
  }

  // ---------------- View: Início ----------------
  function renderInicio() {
    views.inicio.innerHTML =
      '<h1 class="view-title">Bienvenida</h1>' +
      '<p class="view-subtitle">Este es tu espacio personal dentro de El Ritual del Regresso.</p>' +
      '<div class="stat-row">' +
      '  <div class="stat"><div class="stat__value" id="stat-progreso">—</div><div class="stat__label">completado</div></div>' +
      '</div>' +
      '<div class="card card--accent">' +
      '  <strong>Continúa tu camino</strong>' +
      '  <p style="margin:8px 0 0;color:var(--paper-dim);font-size:14px;">Entra en "Curso" para retomar donde te quedaste.</p>' +
      '</div>';
    refreshInicioStats();
  }

  function refreshInicioStats() {
    var manifest = window.CURSO_MANIFEST;
    var total = 0, done = 0;
    manifest.forEach(function (item) {
      if (item.kind === 'collection') {
        item.children.forEach(function (c) { total++; if (isDone(c.id)) done++; });
      } else if (item.kind === 'article') {
        total++; if (isDone(item.id)) done++;
      }
    });
    var statProgreso = document.getElementById('stat-progreso');
    if (statProgreso) statProgreso.textContent = total ? Math.round((done / total) * 100) + '%' : '—';
  }

  // ---------------- View: Curso ----------------
  var cursoState = { screen: 'list', openItem: null, openChild: null };

  function renderCurso() {
    if (cursoState.screen === 'list') return renderCursoList();
    if (cursoState.screen === 'collection') return renderCursoCollection();
    return renderCursoReader();
  }

  function renderCursoList() {
    var manifest = window.CURSO_MANIFEST;
    var modulos = manifest.filter(function (i) { return i.section === 'modulo'; });
    var bonos = manifest.filter(function (i) { return i.section === 'bono'; });

    function cardHtml(item, index) {
      var done = item.kind === 'collection'
        ? item.children.every(function (c) { return isDone(c.id); })
        : isDone(item.id);
      var numLabel = item.kind === 'link' ? '🔗' : (index != null ? index : '★');
      return (
        '<button class="module-card" data-item="' + item.id + '">' +
        '  <span class="module-card__num' + (done ? ' is-done' : '') + '">' + numLabel + '</span>' +
        '  <span class="module-card__body">' +
        '    <div class="module-card__title">' + item.title + '</div>' +
        '    <div class="module-card__hint">' + item.hint + '</div>' +
        '  </span>' +
        '  <span class="module-card__chevron">›</span>' +
        '</button>'
      );
    }

    views.curso.innerHTML =
      '<h1 class="view-title">Curso</h1>' +
      '<p class="view-subtitle">El Ritual del Regresso — módulos y bonos.</p>' +
      '<div class="module-list">' +
      modulos.map(function (item, i) { return cardHtml(item, i + 1); }).join('') +
      '</div>' +
      '<h2 style="font-family:var(--font-display);font-size:16px;margin:24px 0 10px;color:var(--paper-dim);">Bonos</h2>' +
      '<div class="module-list">' +
      bonos.map(function (item) { return cardHtml(item, null); }).join('') +
      '</div>';

    views.curso.querySelectorAll('[data-item]').forEach(function (btn) {
      btn.addEventListener('click', function () { openCursoItem(btn.dataset.item); });
    });
  }

  function findItem(itemId) {
    return window.CURSO_MANIFEST.find(function (i) { return i.id === itemId; });
  }

  function openCursoItem(itemId) {
    var item = findItem(itemId);
    if (!item) return;

    if (item.kind === 'link') {
      window.open(item.url, '_blank');
      return;
    }
    if (item.kind === 'collection') {
      cursoState.screen = 'collection';
      cursoState.openItem = item;
      renderCursoCollection();
      return;
    }
    cursoState.screen = 'reader';
    cursoState.openItem = item;
    cursoState.openChild = null;
    renderCursoReader();
  }

  function renderCursoCollection() {
    var item = cursoState.openItem;
    views.curso.innerHTML =
      '<button class="reader__back" id="curso-back">‹ Volver al curso</button>' +
      '<h1 class="view-title">' + item.title + '</h1>' +
      '<p class="view-subtitle">' + item.hint + '</p>' +
      '<div class="module-list">' +
      item.children.map(function (c, i) {
        var done = isDone(c.id);
        return (
          '<button class="module-card" data-child="' + c.id + '">' +
          '  <span class="module-card__num' + (done ? ' is-done' : '') + '">' + (i + 1) + '</span>' +
          '  <span class="module-card__body"><div class="module-card__title">' + c.title + '</div></span>' +
          '  <span class="module-card__chevron">›</span>' +
          '</button>'
        );
      }).join('') +
      '</div>';

    document.getElementById('curso-back').addEventListener('click', function () {
      cursoState.screen = 'list';
      renderCursoList();
    });
    views.curso.querySelectorAll('[data-child]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var child = item.children.find(function (c) { return c.id === btn.dataset.child; });
        cursoState.screen = 'reader';
        cursoState.openChild = child;
        renderCursoReader();
      });
    });
  }

  async function renderCursoReader() {
    var target = cursoState.openChild || cursoState.openItem;
    var backLabel = cursoState.openChild ? '‹ Volver a Mejora Personal' : '‹ Volver al curso';

    views.curso.innerHTML =
      '<div class="reader">' +
      '<button class="reader__back" id="curso-back">' + backLabel + '</button>' +
      '<h1 class="view-title">' + target.title + '</h1>' +
      '<div class="reader__content" id="reader-body"><p style="color:var(--paper-dim);">Cargando…</p></div>' +
      '<div class="reader__complete">' +
      '  <button class="btn btn--primary" id="mark-done">' +
      (isDone(target.id) ? '✓ Completado' : 'Marcar como completado') +
      '  </button>' +
      '</div>' +
      '</div>';

    document.getElementById('curso-back').addEventListener('click', function () {
      if (cursoState.openChild) {
        cursoState.screen = 'collection';
        cursoState.openChild = null;
        renderCursoCollection();
      } else {
        cursoState.screen = 'list';
        renderCursoList();
      }
    });

    document.getElementById('mark-done').addEventListener('click', function () {
      var nowDone = !isDone(target.id);
      setDone(target.id, nowDone);
      this.textContent = nowDone ? '✓ Completado' : 'Marcar como completado';
      refreshInicioStats();
    });

    try {
      var res = await fetch(target.path);
      if (!res.ok) throw new Error('No se pudo cargar el contenido.');
      var md = await res.text();
      document.getElementById('reader-body').innerHTML = window.mdToHtml(md);
    } catch (e) {
      document.getElementById('reader-body').innerHTML =
        '<p style="color:var(--paper-dim);">No se pudo cargar este contenido ahora. Intenta de nuevo.</p>';
    }
  }

  // ---------------- View: Perfil ----------------
  function renderPerfil() {
    views.perfil.innerHTML =
      '<h1 class="view-title">Perfil</h1>' +
      '<p class="view-subtitle">' + cfg.APP_NAME + '</p>' +
      '<div class="card">' +
      '  <div class="field-row">' +
      '    <div class="field-row__label">Tema oscuro</div>' +
      '    <button class="switch is-on" id="theme-switch"></button>' +
      '  </div>' +
      '</div>';

    document.getElementById('theme-switch').addEventListener('click', toggleThemeSwitch);
  }

  function toggleThemeSwitch() {
    var btn = document.getElementById('theme-switch');
    var next = document.documentElement.classList.contains('dark-theme') ? 'light' : 'dark';
    localStorage.setItem('app_theme', next);
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark-theme', next === 'dark');
    btn.classList.toggle('is-on', next === 'dark');
  }

  // ---------------- Init ----------------
  renderInicio();
  renderCurso();
  renderPerfil();
  showView('inicio');

  document.getElementById('theme-toggle').addEventListener('click', function () {
    document.getElementById('theme-switch') && toggleThemeSwitch();
  });
})();
