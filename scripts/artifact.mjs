// Genera artifact/index.html: versión de una sola página para publicarla como Artifact privado de claude.ai.
import { readFileSync, writeFileSync } from 'node:fs';
const r = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const rel = (s) => s.replace(/([`'"(])\/(logos|fondos|capturas|piezas|fonts)\//g, '$1$2/');
const tokensJson = r('tokens/tokens.json');
const tokensCss = r('src/tokens.css');
let css = rel(r('src/style.css')).replace(/@font-face\{[^}]*\}\n/g, '');
css = css.replace(/body\{background/, 'html{color-scheme:dark}body{background');
let body = rel(r('index.html').split('<body>')[1].split('</body>')[0]);
body = body.replace(/<a class="btn btn--ghost" href="fonts\/unbounded[^>]*>[^<]*<\/a>/, '<a class="btn btn--ghost" href="https://fonts.google.com/specimen/Unbounded" target="_blank" rel="noopener">Ver en Google Fonts</a>')
           .replace(/<a class="btn btn--ghost" href="fonts\/manrope[^>]*>[^<]*<\/a>/, '<a class="btn btn--ghost" href="https://fonts.google.com/specimen/Manrope" target="_blank" rel="noopener">Ver en Google Fonts</a>')
           .replace(/<script[^>]*><\/script>/, '');
let js = rel(r('src/main.js'))
  .replace(/import [^\n]*\n/g, '')
  .replace('const $ =', `const tokens = ${tokensJson};\nconst $ =`)
  .replace(/const dl = .*\n/, "const dl = (href, label) => `<a class=\"btn btn--ghost btn--s\" href=\"${href}\" data-dl target=\"_blank\" rel=\"noopener\">${label}</a>`;\n");
js += `
// Descargas: usan la capacidad "downloads" del visor; si no existe, el enlace se abre en otra pestaña.
let dlCap = null; try { window.claude?.use('downloads').then((d) => { dlCap = d; }).catch(() => {}); } catch (e) {}
document.addEventListener('click', async (e) => {
  const a = e.target.closest('a[data-dl]'); if (!a || !dlCap) return;
  e.preventDefault();
  const old = a.textContent;
  try {
    const res = await fetch(a.getAttribute('href')); const blob = await res.blob();
    await dlCap.save({ filename: a.getAttribute('href').split('/').pop(), data: blob });
    a.textContent = 'Listo';
  } catch (err) { a.textContent = err && err.code === 'declined' ? old : 'No se pudo'; }
  setTimeout(() => (a.textContent = old), 1400);
});
`;
const html = `<title>Línea gráfica Pixely</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&family=Unbounded:wght@300..900&display=swap">
<style>
${tokensCss}
${css}
:root{--font-titulo:'Unbounded','Arial Black',system-ui,sans-serif;--font-texto:'Manrope',system-ui,sans-serif}
.nav nav a:focus-visible,.btn:focus-visible,.sw:focus-visible,.row:focus-visible{outline:2px solid var(--rosa);outline-offset:2px}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>
${body}
<script>
${js}
</script>
`;
writeFileSync(new URL('../artifact/index.html', import.meta.url), html);
console.log('artifact ok', html.length);
