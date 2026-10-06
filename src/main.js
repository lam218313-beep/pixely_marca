import './tokens.css';
import './style.css';
import tokens from '../tokens/tokens.json';

const $ = (s) => document.querySelector(s);
const dl = (href, label) => `<a class="btn btn--ghost btn--s" href="${href}" download>${label}</a>`;

// Índice lateral con sección activa
const secs = [...document.querySelectorAll('section[data-title]')];
$('#toc').innerHTML = secs.map((s) => `<a href="#${s.id}">${s.dataset.title}</a>`).join('');
const links = [...document.querySelectorAll('#toc a')];
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) links.forEach((l) => l.classList.toggle('on', l.hash === '#' + e.target.id));
}), { rootMargin: '-30% 0px -60% 0px' });
secs.forEach((s) => io.observe(s));

// Logos
const logos = [
  ['pixely-sobre-negro', 'Sobre negro', '#0A0A0C'], ['pixely-sobre-blanco', 'Sobre blanco', '#FFFFFF'],
  ['pixely-sobre-rosa', 'Sobre rosa', '#EB0C6E'], ['pixely-negro', 'Una tinta · negro', '#FFFFFF'], ['pixely-blanco', 'Una tinta · blanco', '#0A0A0C'],
];
$('#logos').innerHTML = logos.map(([f, n, bg]) => `<figure class="tile"><div class="tile__bg" style="background:${bg}"><img src="/logos/${f}.svg" alt="${n}"></div><figcaption><b>${n}</b>${dl(`/logos/${f}.svg`, 'SVG')}${dl(`/logos/${f}.png`, 'PNG')}</figcaption></figure>`).join('');
$('#pmarks').innerHTML = [['p-sobre-rosa', 'p. sobre rosa'], ['p-sobre-negro', 'p. sobre negro']].map(([f, n]) => `<figure class="tile"><div class="tile__bg sq"><img src="/logos/${f}.svg" alt="${n}"></div><figcaption><b>${n}</b>${dl(`/logos/${f}.svg`, 'SVG')}${dl(`/logos/${f}.png`, 'PNG')}</figcaption></figure>`).join('');

// Colores
const nombres = { tinta: 'Tinta', carbon: 'Carbón', carbon2: 'Carbón 2', rosa: 'Rosa Pixely', blanco: 'Blanco', gris: 'Gris texto', linea: 'Línea', anillo: 'Anillo', tarjeta: 'Tarjeta' };
const usos = { tinta: 'Fondo principal', carbon: 'Capas y tarjetas', carbon2: 'Capas elevadas', rosa: 'Acento y CTA', blanco: 'Texto y fondo claro', gris: 'Texto secundario sobre negro', linea: 'Bordes sobre negro', anillo: 'Anillos del fondo', tarjeta: 'Tarjetas en piezas' };
const claro = new Set(['blanco', 'gris']);
$('#colores').innerHTML = Object.entries(tokens.color).map(([k, v]) => `<button class="sw" data-hex="${v}" style="background:${v};color:${claro.has(k) ? '#0A0A0C' : '#fff'}"><b>${nombres[k]}</b><span>${v}</span><small>${usos[k]}</small></button>`).join('');
$('#combos').innerHTML = [['#0A0A0C', '#FFFFFF', 'Blanco sobre tinta'], ['#EB0C6E', '#FFFFFF', 'Blanco sobre rosa'], ['#FFFFFF', '#0A0A0C', 'Tinta sobre blanco'], ['#0A0A0C', '#EB0C6E', 'Rosa sobre tinta (títulos grandes)']]
  .map(([b, t, n]) => `<div class="combo" style="background:${b};color:${t}"><b>Aa</b><span>${n}</span></div>`).join('');
document.addEventListener('click', (e) => {
  const b = e.target.closest('.sw'); if (!b) return;
  navigator.clipboard?.writeText(b.dataset.hex).catch(() => {});
  const s = b.querySelector('span'), old = s.textContent; s.textContent = 'Copiado'; setTimeout(() => (s.textContent = old), 900);
});

// Fondos
const fmts = [['horizontal-1920x1080', 'Horizontal 1920×1080'], ['historia-1080x1920', 'Historia 1080×1920'], ['cuadrado-1080', 'Cuadrado 1080']];
$('#fondos-grid').innerHTML = ['negro', 'rosa'].flatMap((c) => fmts.map(([f, n]) => `<figure class="tile"><div class="tile__bg fit"><img src="/fondos/fondo-${c}-${f}.png" alt="${n} ${c}" loading="lazy"></div><figcaption><b>${c === 'negro' ? 'Negro' : 'Rosa'} · ${n}</b>${dl(`/fondos/fondo-${c}-${f}.svg`, 'SVG')}${dl(`/fondos/fondo-${c}-${f}.png`, 'PNG')}</figcaption></figure>`)).join('');

// Capturas
const caps = [['inicio', 'Inicio'], ['validar', 'Validar'], ['plan', 'Plan'], ['mercado', 'Mercado'], ['resultado', 'Resultados'], ['marca', 'Marca'], ['voz', 'Voz'], ['pieza', 'Una pieza']];
$('#caps').innerHTML = caps.map(([f, n]) => `<figure class="tile"><div class="tile__bg phone"><img src="/capturas/m-${f}.webp" alt="Partners ${n}" loading="lazy"></div><figcaption><b>${n}</b>${dl(`/capturas/m-${f}.webp`, 'WebP')}</figcaption></figure>`).join('');

// Piezas
const pdfs = [['Pixely-Brochure', 'Brochure'], ['Pixely-Manual-de-Partners', 'Manual de Partners'], ['Pixely-Plan-Basic', 'Plan Basic'], ['Pixely-Plan-Lite', 'Plan Lite'], ['Pixely-Plan-Pro', 'Plan Pro'], ['Pixely-Tarjeta-para-imprenta', 'Tarjeta para imprenta']];
$('#pdfs').innerHTML = pdfs.map(([f, n]) => `<a class="row" href="/piezas/pdf/${f}.pdf" download><span>${n}</span><em>PDF ↓</em></a>`).join('');
$('#redes').innerHTML = ['facebook', 'linkedin', 'x', 'youtube'].map((r) => `<figure class="tile"><div class="tile__bg wide"><img src="/piezas/redes/portada-${r}.png" alt="Portada ${r}" loading="lazy"></div><figcaption><b>Portada ${r}</b>${dl(`/piezas/redes/portada-${r}.png`, 'PNG')}</figcaption></figure>`).join('')
  + [1, 2, 3].map((i) => `<figure class="tile"><div class="tile__bg phone"><img src="/piezas/redes/historia-fondo-${i}.png" alt="Fondo de historia ${i}" loading="lazy"></div><figcaption><b>Fondo historia ${i}</b>${dl(`/piezas/redes/historia-fondo-${i}.png`, 'PNG')}</figcaption></figure>`).join('');
const qrs = ['whatsapp', 'web', 'partners', 'instagram', 'facebook', 'tiktok', 'linkedin', 'x', 'youtube', 'todas-las-redes'];
$('#qrs').innerHTML = qrs.map((q) => `<figure class="tile"><div class="tile__bg sq qr"><img src="/piezas/qr/qr-${q}.svg" alt="QR ${q}" loading="lazy"></div><figcaption><b>${q.replaceAll('-', ' ')}</b>${dl(`/piezas/qr/qr-${q}.svg`, 'SVG')}${dl(`/piezas/qr/qr-${q}-transparente.svg`, 'Transp.')}</figcaption></figure>`).join('');

$('#json').textContent = JSON.stringify(tokens, null, 2);
