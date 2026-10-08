(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var st = { q: '', origen: '', estado: '' };
  function apply() {
    var shown = {};
    $$('.comp').forEach(function (c) {
      var ok = (!st.q || c.dataset.q.indexOf(st.q) > -1) &&
        (!st.origen || c.dataset.origen === st.origen || (c.dataset.origen === 'Ambos')) &&
        (!st.estado || c.dataset.estado === st.estado);
      c.hidden = !ok; if (ok) shown[c.dataset.cat] = (shown[c.dataset.cat] || 0) + 1;
    });
    $$('.cat').forEach(function (s) { s.hidden = !shown[s.dataset.cat]; });
    $$('#nav a').forEach(function (a) { a.style.display = shown[a.dataset.catlink] ? '' : 'none'; });
    $('#none').hidden = Object.keys(shown).length > 0;
  }
  $('#q').addEventListener('input', function (e) { st.q = e.target.value.trim().toLowerCase(); apply(); });
  $$('.fg').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', g).forEach(function (x) { x.classList.toggle('is-on', x === b); });
      st[g.dataset.f] = b.dataset.v; apply();
    });
  });
  // Menú lateral: sección activa
  var links = $$('#nav a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle('on', l.dataset.catlink === e.target.dataset.cat); }); });
    }, { rootMargin: '-20% 0px -70% 0px' });
    $$('.cat').forEach(function (s) { io.observe(s); });
  }
  // Animaciones de entrada: corren al aparecer en pantalla y con “Repetir animación”
  function play(stage) { var el = stage.querySelector('.stage__in > *'); if (!el) return; el.classList.remove('is-play'); void el.offsetWidth; el.classList.add('is-play'); }
  var stages = $$('[data-replay]');
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { play(e.target); io2.unobserve(e.target); } }); }, { threshold: 0.35 });
    stages.forEach(function (s) { io2.observe(s); });
  } else stages.forEach(play);
  document.addEventListener('click', function (e) {
    var t = e.target;
    var rp = t.closest('[data-replay-btn]');
    if (rp) { play(rp.closest('[data-replay]')); return; }
    // Copiar código
    var cp = t.closest('[data-copy]');
    if (cp) {
      var txt = cp.parentNode.querySelector('pre').textContent, old = cp.textContent;
      var done = function () { cp.textContent = 'Copiado'; setTimeout(function () { cp.textContent = old; }, 1100); };
      var fb = function () { var r = document.createRange(); r.selectNodeContents(cp.parentNode.querySelector('pre')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); cp.textContent = 'Selecciona y copia'; setTimeout(function () { cp.textContent = old; }, 1600); };
      try { navigator.clipboard.writeText(txt).then(done, fb); } catch (err) { fb(); }
      return;
    }
    // Pestañas HTML / CSS
    var tab = t.closest('[data-tab]');
    if (tab) {
      var box = tab.closest('.code');
      $$('[data-tab]', box).forEach(function (b) { b.classList.toggle('is-on', b === tab); });
      $$('.code__p', box).forEach(function (p) { p.hidden = p.dataset.p !== tab.dataset.tab; });
      return;
    }
    // Enlaces "Usa:"
    var go = t.closest('[data-go]');
    if (go) { e.preventDefault(); var el = document.getElementById(go.dataset.go); if (el) { if (el.hidden) { st = { q: '', origen: '', estado: '' }; $('#q').value = ''; apply(); } el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } return; }
    // Demos interactivas
    var seg = t.closest('[data-v]');
    if (seg && seg.parentNode.hasAttribute('data-seg')) { $$('[data-v]', seg.parentNode).forEach(function (b) { b.classList.toggle('is-on', b === seg); }); return; }
    var pick = t.closest('[data-pick]');
    if (pick) { $$('[data-pick]', pick.parentNode).forEach(function (b) { b.classList.toggle('is-sel', b === pick); }); return; }
    var tg = t.closest('[data-toggle]');
    if (tg) {
      var stage = tg.closest('.stage'), target = stage && $(tg.getAttribute('data-toggle'), stage);
      if (target) { target.hidden = !target.hidden; if (tg.hasAttribute('aria-expanded')) tg.setAttribute('aria-expanded', String(!target.hidden)); }
      return;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    $$('.p-ov:not([hidden]),.p-menu:not([hidden])').forEach(function (x) { x.hidden = true; });
  });
  apply();
})();
