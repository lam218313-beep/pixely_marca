// Página "Redes sociales" del catálogo: el kit descargable (logos, fuentes, colores, tamaños para Canva, QR y contactos).
// Los datos salen de public/kit-redes/kit.json, que arma scripts/kit-redes.mjs; los archivos se publican junto a la página
// en kit-redes/ y se descargan con la capacidad "downloads" del Artifact.
import { readdirSync, readFileSync, statSync } from 'node:fs';

const BASE = new URL('../../public/kit-redes/', import.meta.url);
export const kit = JSON.parse(readFileSync(new URL('kit.json', BASE), 'utf8'));
const peso = (f) => { const b = statSync(new URL(f, BASE)).size; return b > 1e6 ? `${(b / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.round(b / 1024)} KB`; };
// Lo que va en el paquete completo: todo kit-redes menos kit.json y el .zip (el .zip se arma en el navegador al pedirlo)
const listar = (d) => readdirSync(new URL(d, BASE), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? listar(`${d}${e.name}/`) : [`${d}${e.name}`]));
export const kitFiles = listar('').filter((f) => f !== 'kit.json' && !f.endsWith('.zip')).sort();
const total = kitFiles.reduce((a, f) => a + statSync(new URL(f, BASE)).size, 0);
const PESO = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800 };
const btn = (path, label) => `<button class="kb" type="button" data-dl="${path}">${label}</button>`;
const copy = (txt, label = 'Copiar') => `<button class="kc" type="button" data-copytxt="${txt.replace(/"/g, '&quot;')}">${label}</button>`;

export const kitNav = `<a class="side__kit" href="#redes"><b>Redes sociales</b><small>Kit descargable</small></a><a class="side__comp" href="#top">Componentes</a>`;

export const kitHTML = () => `<section id="redes" class="kit" hidden aria-labelledby="kit-t">
<header class="kit__top">
  <p class="top__e">Redes sociales</p>
  <h1 id="kit-t">Kit de redes de Pixely<span>.</span></h1>
  <p class="top__l">Todo para publicar como Pixely en Canva o en cualquier programa: logos, fuentes, colores, tamaños de letra, QR, redes y teléfonos. Descarga el paquete completo o cada archivo por separado.</p>
  <div class="kit__cta"><button class="kb kb--big" type="button" data-zip="${kit.zip}">Descargar el kit completo <small>.zip · ${kitFiles.length} archivos · ${(total / 1048576).toFixed(1).replace('.', ',')} MB</small></button></div>
  <nav class="kit__idx" aria-label="Partes del kit"><a href="#k-logos">Logos</a><a href="#k-fuentes">Fuentes</a><a href="#k-colores">Colores</a><a href="#k-canva">Tamaños para Canva</a><a href="#k-qr">QR</a><a href="#k-redes">Redes y teléfonos</a></nav>
</header>

<section class="kblk" id="k-logos">
  <header class="kblk__h"><h2>Logos</h2><p>PNG para usar directo; SVG para agrandar sin perder calidad (Canva acepta los dos).</p></header>
  <div class="klogos">${kit.LOGOS.map(([id, nombre, uso, tono]) => `<article class="klogo">
    <div class="klogo__img klogo__img--${tono}"><img src="kit-redes/logos/${id}.svg" alt="${nombre}" loading="lazy"></div>
    <h3>${nombre}</h3><p>${uso}</p><div class="kbs">${btn(`logos/${id}.png`, 'PNG')}${btn(`logos/${id}.svg`, 'SVG')}</div></article>`).join('')}</div>
</section>

<section class="kblk" id="k-fuentes">
  <header class="kblk__h"><h2>Fuentes</h2><p>Gratis y de uso libre (licencia SIL Open Font License). Instálalas con doble clic. En Canva búscalas por su nombre; si no aparecen, súbelas en Marca → Fuentes.</p></header>
  <div class="kfonts">${kit.FUENTES.map((f) => `<article class="kfont">
    <p class="kfont__uso">${f.uso}</p>
    <h3 style="font-family:${f.nombre},sans-serif;font-weight:${PESO[f.principal]}">${f.nombre}</h3>
    <p class="kfont__abc" style="font-family:${f.nombre},sans-serif;font-weight:${PESO[f.principal]}">Aa Bb Cc Ññ Áé ¿¡ 0123456789</p>
    <ul class="kfont__pesos">${f.pesos.map((p) => `<li><span style="font-family:${f.nombre},sans-serif;font-weight:${PESO[p]}">${p}</span>${btn(`fuentes/${f.nombre}-${p}.ttf`, 'TTF')}</li>`).join('')}</ul>
    <div class="kbs">${btn(`fuentes/${f.nombre}-licencia-OFL.txt`, 'Licencia')}</div></article>`).join('')}</div>
</section>

<section class="kblk" id="k-colores">
  <header class="kblk__h"><h2>Colores</h2><p>En Canva: Marca → Colores, y pega el código HEX. Rosa solo como acento: el punto, un botón o una palabra clave.</p></header>
  <div class="kcolors">${kit.COLORES.map((c) => `<article class="kcolor"><i style="background:${c.hex}"></i><div><h3>${c.nombre}</h3><p class="kcolor__v"><b>${c.hex}</b> ${copy(c.hex)}</p><p class="kcolor__v">RGB ${c.rgb}</p><p class="kcolor__u">${c.uso}</p></div></article>`).join('')}</div>
  <div class="kbs kbs--end">${btn('colores/Pixely-colores.png', 'Tarjeta de colores · PNG')}${btn('colores/Pixely-colores.txt', 'Códigos · TXT')}</div>
</section>

<section class="kblk" id="k-canva">
  <header class="kblk__h"><h2>Tamaños de letra para Canva</h2><p>En píxeles, con el diseño a tamaño real. “Espaciado” y “Altura de línea” son los controles de Canva con esos mismos nombres.</p></header>
  <div class="ktable"><table><thead><tr><th>Uso</th><th>Fuente</th>${kit.FORMATOS.map(([, n, m]) => `<th class="r">${n}<small>${m}</small></th>`).join('')}<th class="r">Espaciado</th><th class="r">Altura de línea</th></tr></thead>
  <tbody>${kit.TAMANOS.map((t) => `<tr><td><span class="ksample" style="font-family:${t.fuente},sans-serif;font-weight:${PESO[t.peso]};letter-spacing:${t.espaciado / 1000}em${t.rol.includes('rosa') ? ';color:var(--pink)' : ''}">${t.muestra}</span><small>${t.rol}</small></td><td>${t.fuente} ${t.peso}</td>${kit.FORMATOS.map(([k]) => `<td class="r n">${t[k]}</td>`).join('')}<td class="r">${t.espaciado}</td><td class="r">${String(t.interlineado).replace('.', ',')}</td></tr>`).join('')}</tbody></table></div>
  <ul class="krules">${kit.REGLAS.map((r) => `<li>${r}</li>`).join('')}</ul>
  <div class="kbs kbs--end">${btn('canva/Pixely-tamanos-de-letra-canva.png', 'Guía de tamaños · PNG')}${btn('canva/Pixely-tamanos-de-letra-canva.txt', 'Guía · TXT')}</div>
</section>

<section class="kblk" id="k-qr">
  <header class="kblk__h"><h2>QR</h2><p>Con el logo al centro. En el paquete completo también van con fondo transparente.</p></header>
  <div class="kqrs">${kit.QR.map(([id, nombre, desc]) => `<article class="kqr"><img src="kit-redes/qr/qr-${id}.svg" alt="QR de ${nombre}" loading="lazy"><h3>${nombre}</h3><p>${desc}</p><div class="kbs">${btn(`qr/qr-${id}.png`, 'PNG')}${btn(`qr/qr-${id}.svg`, 'SVG')}</div></article>`).join('')}</div>
</section>

<section class="kblk" id="k-redes">
  <header class="kblk__h"><h2>Redes y teléfonos</h2><p>Eslogan en todas: <b>Publicidad que vende.</b></p></header>
  <ul class="kredes">${kit.REDES.map((r) => `<li><span class="kredes__r">${r.red}</span><b>${r.usuario}</b><span class="kredes__u">${r.url.replace(/^mailto:/, '')}</span>${copy(r.url.replace(/^mailto:/, ''), 'Copiar')}</li>`).join('')}</ul>
  <h3 class="kbios__t">Biografías listas para copiar</h3>
  <ul class="kbios">${kit.BIOS.map(([d, t]) => `<li><small>${d}</small><p>${t}</p>${copy(t)}</li>`).join('')}</ul>
  <div class="kbs kbs--end">${btn('redes/Pixely-redes-y-contacto.txt', 'Redes, contacto y biografías · TXT')}</div>
</section>
<p class="ktoast" id="ktoast" role="status" aria-live="polite" hidden></p>
</section>`;

export const kitCSS = `
/* ===== Página Redes sociales (kit descargable) ===== */
.side__kit{display:flex;flex-direction:column;gap:2px;margin:0 0 6px;padding:12px;border-radius:14px;background:var(--pink);color:#fff;text-decoration:none}
.side__kit b{font:800 14px Manrope}.side__kit small{font:700 12px Manrope;opacity:.85}
.side__comp{display:block;margin:0 0 14px;padding:9px 10px;border-radius:12px;color:var(--text-2);text-decoration:none;font:700 14px Manrope}
.side__comp:hover,.side__comp.on{background:var(--card);color:#fff}
.side__kit.on{box-shadow:0 0 0 2px #fff inset}
.kit{padding-bottom:40px}
.kit__top{padding:56px 0 8px}
.kit__top h1{margin:10px 0 14px;font:800 clamp(1.8rem,4vw,3rem)/1.08 Unbounded,sans-serif;letter-spacing:-.02em}.kit__top h1 span{color:var(--pink)}
.kit__cta{margin-top:24px}
.kit__idx{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px;padding:14px 0;border-block:1px solid var(--edge)}
.kit__idx a{height:34px;display:inline-flex;align-items:center;padding:0 14px;border:1px solid var(--line);border-radius:99px;color:var(--text-2);text-decoration:none;font:700 13px Manrope}
.kit__idx a:hover{color:#fff;border-color:var(--mute)}
.kblk{padding-top:48px;scroll-margin-top:16px}
.kblk__h h2{font:700 1.7rem Unbounded,sans-serif;letter-spacing:-.02em}
.kblk__h p{margin:6px 0 22px;max-width:70ch;color:var(--text-3)}.kblk__h p b{color:#fff}
.kb{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:36px;padding:0 14px;border:1px solid var(--line);border-radius:12px;background:var(--raised);color:#fff;font:800 12px Manrope;letter-spacing:.04em;cursor:pointer}
.kb:hover{border-color:var(--pink)}.kb:disabled{opacity:.6;cursor:progress}
.kb--big{height:56px;padding:0 24px;border:0;border-radius:16px;background:var(--pink);font-size:15px;letter-spacing:0;box-shadow:0 12px 28px rgba(217,11,102,.35)}
.kb--big small{font:700 13px Manrope;opacity:.85}
.kc{height:28px;padding:0 10px;border:1px solid var(--line);border-radius:9px;background:none;color:var(--text-2);font:700 11px Manrope;cursor:pointer}
.kc:hover{color:#fff;border-color:var(--mute)}
.kbs{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.kbs--end{margin-top:18px}
.klogos{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
.klogo,.kqr{padding:12px 12px 14px;border:1px solid var(--edge);border-radius:20px;background:var(--ink)}
.klogo__img{display:grid;place-items:center;height:130px;padding:18px;border-radius:14px}
.klogo__img img{display:block;width:auto;height:auto;max-width:100%;max-height:94px}
.klogo__img--oscuro{background:#0A0A0C;box-shadow:inset 0 0 0 1px var(--edge)}
.klogo__img--claro{background:#fff}
.klogo__img--rosa{background:var(--card)}
.klogo h3,.kqr h3{margin-top:12px;font:800 15px Manrope}
.klogo p,.kqr p{margin-top:2px;color:var(--text-3);font:600 13px/1.4 Manrope}
.kfonts{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:12px}
.kfont{padding:22px;border:1px solid var(--edge);border-radius:24px;background:var(--ink);min-width:0}
.kfont__uso{font:800 12px Manrope;letter-spacing:.12em;text-transform:uppercase;color:var(--pink)}
.kfont h3{margin-top:8px;font-size:clamp(2.2rem,5vw,3.2rem);line-height:1;letter-spacing:-.03em}
.kfont__abc{margin-top:12px;font-size:1.15rem;color:var(--text-2);overflow-wrap:anywhere}
.kfont__pesos{display:grid;gap:6px;margin-top:16px}
.kfont__pesos li{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0;border-top:1px solid var(--edge);font-size:1.05rem}
.kcolors{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.kcolor{display:flex;gap:14px;padding:12px;border:1px solid var(--edge);border-radius:20px;background:var(--ink)}
.kcolor i{flex:none;width:72px;border-radius:14px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
.kcolor h3{font:700 15px Unbounded;letter-spacing:-.02em}
.kcolor__v{display:flex;align-items:center;gap:8px;margin-top:4px;font:600 13px ui-monospace,Menlo,monospace;color:var(--text-2)}.kcolor__v b{color:#fff}
.kcolor__u{margin-top:6px;color:var(--text-3);font:600 12px/1.4 Manrope}
.ktable{overflow-x:auto;border:1px solid var(--edge);border-radius:20px;background:var(--ink)}
.ktable table{width:100%;min-width:720px;border-collapse:collapse;font:600 14px Manrope}
.ktable th{padding:12px 16px;text-align:left;font:800 11px Manrope;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);border-bottom:1px solid var(--edge);white-space:nowrap}
.ktable th small{display:block;margin-top:2px;letter-spacing:0;text-transform:none;font-weight:700}
.ktable td{padding:12px 16px;border-bottom:1px solid var(--edge);color:var(--text-2);vertical-align:middle}
.ktable tr:last-child td{border-bottom:0}
.ktable .r{text-align:right;font-variant-numeric:tabular-nums}.ktable td.n{color:#fff;font:700 18px Unbounded}
.ksample{display:block;color:#fff;font-size:20px;line-height:1.15;white-space:nowrap}
.ktable td small{display:block;margin-top:4px;color:var(--text-3);font:700 12px Manrope}
.krules{display:grid;gap:6px;margin-top:16px}
.krules li{position:relative;padding-left:16px;color:var(--text-2);font-size:.92rem}
.krules li::before{content:'';position:absolute;left:0;top:.62em;width:6px;height:6px;border-radius:50%;background:var(--pink)}
.kqrs{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px}
.kqr img{display:block;width:100%;aspect-ratio:1;max-width:100%;border-radius:12px;background:#fff}
.kredes{display:grid;border:1px solid var(--edge);border-radius:20px;background:var(--ink)}
.kredes li{display:grid;grid-template-columns:140px minmax(0,180px) minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px 16px;border-top:1px solid var(--edge)}
.kredes li:first-child{border-top:0}
.kredes__r{font:800 12px Manrope;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3)}
.kredes b{font:800 15px Manrope;overflow-wrap:anywhere}
.kredes__u{color:var(--text-2);font:600 13px ui-monospace,Menlo,monospace;overflow-wrap:anywhere}
.kbios__t{margin-top:26px;font:700 1.15rem Unbounded;letter-spacing:-.02em}
.kbios{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:12px}
.kbios li{display:flex;flex-direction:column;gap:8px;align-items:flex-start;padding:14px;border:1px solid var(--edge);border-radius:18px;background:var(--ink)}
.kbios small{font:800 11px Manrope;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3)}
.kbios p{color:#fff;font:600 14px/1.5 Manrope}
.ktoast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:50;max-width:calc(100% - 32px);padding:12px 16px;border:1px solid var(--line);border-radius:14px;background:var(--raised);color:#fff;font:800 14px Manrope;box-shadow:0 18px 40px rgba(0,0,0,.55)}
@media (max-width:640px){.kredes li{grid-template-columns:1fr auto}.kredes__r{grid-column:1/-1}.kredes__u{grid-column:1/-1;order:3}}
`;

export const kitJS = () => `
window.KIT_FILES = ${JSON.stringify(kitFiles)};
(function () {
  var $ = function (s) { return document.querySelector(s); };
  // Tres páginas en una: #redes (y #k-…) el kit, #elementos (y #e-…) los elementos gráficos; lo demás, los componentes
  function route() {
    var h = location.hash.slice(1);
    var vista = h === 'redes' || h.indexOf('k-') === 0 ? 'redes' : h === 'elementos' || h.indexOf('e-') === 0 ? 'elementos' : 'comp';
    $('#redes').hidden = vista !== 'redes'; $('#elementos').hidden = vista !== 'elementos'; $('#comp').hidden = vista !== 'comp';
    $('.side__kit').classList.toggle('on', vista === 'redes');
    $('.side__elem').classList.toggle('on', vista === 'elementos');
    $('.side__comp:not(.side__elem)').classList.toggle('on', vista === 'comp' && (!h || h === 'top'));
    if (vista !== 'comp') { var el = h === vista ? null : document.getElementById(h); if (el) el.scrollIntoView(); else window.scrollTo(0, 0); }
  }
  window.addEventListener('hashchange', route); route();
  var toastT;
  function toast(t) { var el = $('#ktoast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2600); }
  // Descargas: se piden a claude.ai (la página no puede bajar archivos por su cuenta)
  var dlP = window.claude && window.claude.use ? window.claude.use('downloads') : Promise.resolve(null);
  var avisar = function (err) {
    var c = err && err.code;
    if (c === 'declined') return;
    toast(c === 'rate_limited' ? 'Hay otra descarga esperando. Prueba en un momento.' : c === 'missing' ? 'No se encontró ese archivo.' : 'Las descargas funcionan al abrir esta página en claude.ai.');
  };
  // data-raiz: la ruta ya es completa (archivos de elementos/ o capturas/); si no, es un archivo del kit.
  var traer = function (path, raiz) { return fetch((raiz ? '' : 'kit-redes/') + path).then(function (r) { if (!r.ok) throw { code: 'missing' }; return r.blob(); }); };
  document.addEventListener('click', function (e) {
    var z = e.target.closest('[data-zip]');
    if (z) {
      // El paquete completo se arma aquí con todos los archivos del kit (JSZip) y se entrega como un solo .zip
      var oldZ = z.innerHTML, carpeta = z.getAttribute('data-zip').replace(/\.zip$/, '');
      z.disabled = true; z.textContent = 'Armando el paquete…';
      dlP.then(function (dl) {
        if (!dl) throw { code: 'unavailable' };
        if (!window.JSZip) throw { code: 'unavailable' };
        var zip = new window.JSZip(), files = window.KIT_FILES;
        return Promise.all(files.map(function (f) { return traer(f).then(function (b) { zip.file(carpeta + '/' + f, b); }); }))
          .then(function () { return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }); })
          .then(function (blob) { return dl.save({ filename: carpeta + '.zip', data: blob }); })
          .then(function () { toast('Listo: ' + carpeta + '.zip'); });
      }).catch(avisar).then(function () { z.disabled = false; z.innerHTML = oldZ; });
      return;
    }
    var b = e.target.closest('[data-dl]');
    if (b) {
      var path = b.getAttribute('data-dl'), name = path.split('/').pop(), old = b.innerHTML;
      b.disabled = true; b.textContent = 'Preparando…';
      dlP.then(function (dl) {
        if (!dl) throw { code: 'unavailable' };
        return traer(path, b.hasAttribute('data-raiz')).then(function (blob) { return dl.save({ filename: name, data: blob }); })
          .then(function () { toast('Listo: ' + name); });
      }).catch(avisar).then(function () { b.disabled = false; b.innerHTML = old; });
      return;
    }
    var c = e.target.closest('[data-copytxt]');
    if (c) {
      var txt = c.getAttribute('data-copytxt'), o = c.textContent;
      var ok = function () { c.textContent = 'Copiado'; setTimeout(function () { c.textContent = o; }, 1100); };
      try { navigator.clipboard.writeText(txt).then(ok, function () { toast(txt); }); } catch (x) { toast(txt); }
    }
  });
})();
`;
