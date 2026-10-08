// Arma el kit de redes sociales en public/kit-redes: logos, fuentes, colores, tamaños de letra para Canva,
// QR y contactos, cada cosa suelta y todo junto en Pixely-kit-redes-sociales.zip.
// Los datos viven aquí y salen también en kit.json, que lee el catálogo de componentes.
// Uso: node scripts/kit-redes.mjs   (Chrome: el de Playwright o la variable CHROME)
import { chromium } from 'playwright-core';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(RAIZ, 'public');
const OUT = path.join(PUB, 'kit-redes');
const ZIP = 'Pixely-kit-redes-sociales.zip';

const LOGOS = [
  ['pixely-sobre-negro', 'Logo para fondos oscuros', 'Letras blancas y punto rosa. El de siempre sobre negro o fotos oscuras.', 'oscuro'],
  ['pixely-sobre-blanco', 'Logo para fondos claros', 'Letras negras y punto rosa. Sobre blanco o fotos claras.', 'claro'],
  ['pixely-sobre-rosa', 'Logo con fondo rosa', 'Ya trae su fondo rosa: úsalo como bloque.', 'rosa'],
  ['pixely-blanco', 'Logo blanco, una tinta', 'Todo blanco, para encima de fotos con mucho color.', 'oscuro'],
  ['pixely-negro', 'Logo negro, una tinta', 'Todo negro, para impresiones a un color.', 'claro'],
  ['p-sobre-negro', 'Ícono p. sobre negro', 'Foto de perfil de todas las redes. Funciona en círculo.', 'oscuro'],
  ['p-sobre-rosa', 'Ícono p. sobre rosa', 'Variante del ícono para destacar.', 'rosa'],
];
const FUENTES = [
  { nombre: 'Unbounded', uso: 'Títulos, cifras y el logo', pesos: ['Regular', 'Bold', 'ExtraBold'], principal: 'Bold' },
  { nombre: 'Manrope', uso: 'Textos, etiquetas y botones', pesos: ['Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold'], principal: 'Medium' },
];
const COLORES = [
  ['Rosa Pixely', '#EB0C6E', 'El punto del logo, botones y una palabra clave por pieza. También fondos de impacto.'],
  ['Tinta', '#0A0A0C', 'Fondo principal y texto sobre claro.'],
  ['Carbón', '#16161B', 'Tarjetas sobre fondo negro.'],
  ['Grafito', '#1F1F26', 'Tarjetas elevadas y botones secundarios.'],
  ['Blanco', '#FFFFFF', 'Texto sobre negro y fondos claros.'],
  ['Gris', '#B4B4BE', 'Texto secundario sobre negro.'],
  ['Rosa suave', '#FFC2E1', 'Detalles sobre negro o sobre rosa.'],
].map(([nombre, hex, uso]) => ({ nombre, hex, rgb: [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', '), uso }));
// Tamaños en píxeles de Canva para cada formato. Espaciado = "Espaciado entre letras" de Canva; interlineado = "Altura de línea".
const FORMATOS = [['post', 'Post y carrusel', '1080 × 1350'], ['historia', 'Historia y reel', '1080 × 1920']];
const TAMANOS = [
  { rol: 'Cifra o palabra gigante', fuente: 'Unbounded', peso: 'ExtraBold', post: 180, historia: 220, espaciado: -40, interlineado: 1.0, muestra: '+48%' },
  { rol: 'Título', fuente: 'Unbounded', peso: 'Bold', post: 96, historia: 112, espaciado: -40, interlineado: 1.05, muestra: 'Que se note.' },
  { rol: 'Subtítulo', fuente: 'Unbounded', peso: 'Bold', post: 48, historia: 56, espaciado: -20, interlineado: 1.15, muestra: 'Tu mercado, al día' },
  { rol: 'Texto', fuente: 'Manrope', peso: 'Medium', post: 34, historia: 40, espaciado: 0, interlineado: 1.4, muestra: 'Apruebas cada pieza desde el celular.' },
  { rol: 'Texto destacado (en rosa)', fuente: 'Manrope', peso: 'ExtraBold', post: 34, historia: 40, espaciado: 0, interlineado: 1.4, muestra: 'datos reales de tu mercado' },
  { rol: 'Etiqueta (en mayúsculas)', fuente: 'Manrope', peso: 'ExtraBold', post: 24, historia: 28, espaciado: 180, interlineado: 1.2, muestra: 'PIXELY PARTNERS' },
  { rol: 'Nota o fuente', fuente: 'Manrope', peso: 'Regular', post: 22, historia: 26, espaciado: 0, interlineado: 1.4, muestra: 'Fuente: estudio de mercado, oct 2026' },
];
const REGLAS = [
  'Márgenes: 80 px a cada lado en posts; en historias, 90 px a los lados y 250 px libres arriba y abajo (ahí van los botones de la app).',
  'Un solo título por pieza, y su punto final en rosa.',
  'Una sola palabra o frase en rosa por párrafo: la que más importa.',
  'Texto de al menos 32 px en historias, para que se lea en el celular.',
];
const QR = [
  ['whatsapp', 'WhatsApp', 'Abre el chat con el mensaje «¡Hola Pixely! 👋 Quiero que mi negocio destaque ✨»'],
  ['web', 'pixely.pe', 'La web, marcada como visita desde un QR'],
  ['partners', 'Pixely Partners', 'partners.pixely.pe'],
  ['todas-las-redes', 'Todas las redes', 'linktr.ee/pixely_pe'],
  ['instagram', 'Instagram', '@pixely_pe'],
  ['tiktok', 'TikTok', '@pixely_pe'],
  ['facebook', 'Facebook', 'Pixely'],
  ['linkedin', 'LinkedIn', 'Pixely'],
  ['x', 'X', '@pixely_pe'],
  ['youtube', 'YouTube', '@Pixely_pe'],
];
const REDES = [
  ['WhatsApp', '+51 949 268 607', 'https://wa.me/51949268607'],
  ['Correo', 'hola@pixely.pe', 'mailto:hola@pixely.pe'],
  ['Web', 'pixely.pe', 'https://pixely.pe'],
  ['Pixely Partners', 'partners.pixely.pe', 'https://partners.pixely.pe'],
  ['Instagram', '@pixely_pe', 'https://www.instagram.com/pixely_pe/'],
  ['TikTok', '@pixely_pe', 'https://www.tiktok.com/@pixely_pe'],
  ['YouTube', '@Pixely_pe', 'https://www.youtube.com/@Pixely_pe'],
  ['X', '@pixely_pe', 'https://x.com/Pixely_pe'],
  ['Facebook', 'Pixely', 'https://www.facebook.com/profile.php?id=61587052585063'],
  ['LinkedIn', 'Pixely', 'https://www.linkedin.com/company/pixely-pe'],
  ['Todas las redes', 'linktr.ee/pixely_pe', 'https://linktr.ee/pixely_pe'],
].map(([red, usuario, url]) => ({ red, usuario, url }));
const BIOS = [
  ['Instagram (máx. 150)', 'Publicidad que vende. Leemos tu mercado, armamos tu plan y tú apruebas desde el celular. Escríbenos por WhatsApp.'],
  ['TikTok (máx. 80)', 'Publicidad que vende, con datos de tu mercado. Escríbenos por WhatsApp.'],
  ['X (máx. 160)', 'Publicidad que vende. Leemos tu mercado, armamos tu plan y tú apruebas desde el celular. pixely.pe'],
  ['Facebook, descripción breve (máx. 101)', 'Publicidad que vende, con datos reales de tu mercado.'],
  ['LinkedIn, eslogan (máx. 120)', 'Publicidad que vende para negocios que ya venden, con datos reales de su mercado.'],
];

rmSync(OUT, { recursive: true, force: true });
for (const d of ['logos', 'fuentes', 'colores', 'canva', 'qr', 'redes']) mkdirSync(path.join(OUT, d), { recursive: true });

// 1. Logos y 2. Fuentes: tal cual están en el repositorio
for (const [id] of LOGOS) for (const ext of ['png', 'svg']) cpSync(path.join(PUB, 'logos', `${id}.${ext}`), path.join(OUT, 'logos', `${id}.${ext}`));
for (const f of readdirSync(path.join(PUB, 'fuentes'))) cpSync(path.join(PUB, 'fuentes', f), path.join(OUT, 'fuentes', f));

// 3. Colores, 4. Tamaños y 6. Redes en texto
writeFileSync(path.join(OUT, 'colores', 'Pixely-colores.txt'), ['COLORES DE PIXELY', '', ...COLORES.map((c) => `${c.nombre.padEnd(12)} ${c.hex}   RGB ${c.rgb}\n             ${c.uso}`)].join('\n') + '\n');
writeFileSync(path.join(OUT, 'canva', 'Pixely-tamanos-de-letra-canva.txt'), [
  'TAMAÑOS DE LETRA PARA CANVA (en píxeles, a tamaño real del diseño)', '',
  ...TAMANOS.map((t) => `${t.rol}\n  ${t.fuente} ${t.peso} · Post (1080 × 1350): ${t.post} · Historia (1080 × 1920): ${t.historia} · Espaciado ${t.espaciado} · Altura de línea ${t.interlineado}`),
  '', 'REGLAS', ...REGLAS.map((r) => `- ${r}`),
].join('\n') + '\n');
writeFileSync(path.join(OUT, 'redes', 'Pixely-redes-y-contacto.txt'), [
  'PIXELY · REDES Y CONTACTO', 'Eslogan: Publicidad que vende.', '',
  ...REDES.map((r) => `${r.red.padEnd(16)} ${r.usuario.padEnd(22)} ${r.url}`),
  '', 'BIOGRAFÍAS LISTAS PARA COPIAR', ...BIOS.flatMap(([d, t]) => ['', d, t]),
].join('\n') + '\n');

// Imágenes: QR en PNG, tarjeta de colores y tarjeta de tamaños
const fuente = (n) => pathToFileURL(path.join(PUB, 'fuentes', `${n}.ttf`)).href;
const CSS = `@font-face{font-family:Unbounded;font-weight:400;src:url(${fuente('Unbounded-Regular')})}@font-face{font-family:Unbounded;font-weight:700;src:url(${fuente('Unbounded-Bold')})}@font-face{font-family:Unbounded;font-weight:800;src:url(${fuente('Unbounded-ExtraBold')})}
@font-face{font-family:Manrope;font-weight:400;src:url(${fuente('Manrope-Regular')})}@font-face{font-family:Manrope;font-weight:500;src:url(${fuente('Manrope-Medium')})}@font-face{font-family:Manrope;font-weight:600;src:url(${fuente('Manrope-SemiBold')})}@font-face{font-family:Manrope;font-weight:700;src:url(${fuente('Manrope-Bold')})}@font-face{font-family:Manrope;font-weight:800;src:url(${fuente('Manrope-ExtraBold')})}
*{margin:0;box-sizing:border-box}body{background:#0A0A0C;color:#fff;font-family:Manrope}`;
const PESO = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800 };
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage();
// Cada imagen se dibuja desde un HTML temporal (con file:// puede cargar fuentes y SVG del repositorio)
const tmp = mkdtempSync(path.join(tmpdir(), 'kit-redes-'));
const foto = async (html, w, h, salida, transparente = false) => {
  await page.setViewportSize({ width: w, height: h });
  const f = path.join(tmp, 'pieza.html');
  writeFileSync(f, `<!doctype html><meta charset="utf-8">${html}`);
  await page.goto(pathToFileURL(f).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: salida, omitBackground: transparente });
};
for (const [id] of QR) {
  for (const t of ['', '-transparente']) {
    const svg = path.join(PUB, 'piezas', 'qr', `qr-${id}${t}.svg`);
    cpSync(svg, path.join(OUT, 'qr', `qr-${id}${t}.svg`));
    await foto(`<style>html,body{margin:0;background:transparent}</style><img src="${pathToFileURL(svg).href}" style="display:block;width:1080px;height:1080px">`, 1080, 1080, path.join(OUT, 'qr', `qr-${id}${t}.png`), !!t);
  }
}
await foto(`<style>${CSS}
body{padding:80px;width:1080px;height:1350px;display:flex;flex-direction:column}
h1{font:700 64px/1 Unbounded;letter-spacing:-.04em}h1 b{color:#EB0C6E}
p.l{margin-top:16px;font:500 26px/1.4 Manrope;color:#B4B4BE}
.g{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:48px;flex:1}
.c{border-radius:28px;padding:26px;display:flex;flex-direction:column;justify-content:flex-end;box-shadow:inset 0 0 0 2px rgba(255,255,255,.1)}
.c b{font:700 34px Unbounded;letter-spacing:-.03em}.c span{margin-top:6px;font:800 24px Manrope;letter-spacing:.04em}.c small{margin-top:4px;font:600 20px Manrope;opacity:.75}
.c:first-child{grid-column:span 2}</style>
<h1>Colores de Pixely<b>.</b></h1><p class="l">Para Canva: Marca → Colores. Copia el código HEX de cada uno.</p>
<div class="g">${COLORES.map((c) => { const claro = ['#FFFFFF', '#FFC2E1', '#B4B4BE'].includes(c.hex); return `<div class="c" style="background:${c.hex};color:${claro ? '#0A0A0C' : '#fff'}"><b>${c.nombre}</b><span>${c.hex}</span><small>RGB ${c.rgb}</small></div>`; }).join('')}</div>`,
  1080, 1350, path.join(OUT, 'colores', 'Pixely-colores.png'));
await foto(`<style>${CSS}
body{padding:70px 70px 60px;width:1080px;height:1350px}
h1{font:700 56px/1 Unbounded;letter-spacing:-.04em}h1 b{color:#EB0C6E}
p.l{margin-top:14px;font:500 24px/1.4 Manrope;color:#B4B4BE}
.r{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:24px;align-items:center;padding:16px 0;border-top:2px solid #26262E}
.r:first-of-type{margin-top:34px}
.m{overflow:hidden;white-space:nowrap;text-overflow:clip}
.d{font:600 20px/1.4 Manrope;color:#B4B4BE;text-align:right;white-space:nowrap}.d b{display:block;color:#fff;font:800 22px Manrope}
.n{font:800 22px Manrope;color:#EB0C6E}</style>
<h1>Tamaños de letra<br>para Canva<b>.</b></h1><p class="l">Post 1080 × 1350 · Historia 1080 × 1920. Muestras a escala de un post.</p>
${TAMANOS.map((t) => `<div class="r"><div class="m" style="font-family:${t.fuente};font-weight:${PESO[t.peso]};font-size:${Math.min(t.post, 110) * 0.5}px;letter-spacing:${t.espaciado / 1000}em;line-height:${t.interlineado};${t.rol.includes('rosa') ? 'color:#EB0C6E;' : ''}">${t.muestra}</div><div class="d"><b>${t.rol}</b>${t.fuente} ${t.peso}<br><span class="n">${t.post}</span> post · <span class="n">${t.historia}</span> historia<br>Espaciado ${t.espaciado} · Línea ${t.interlineado}</div></div>`).join('')}`,
  1080, 1350, path.join(OUT, 'canva', 'Pixely-tamanos-de-letra-canva.png'));
await browser.close();
rmSync(tmp, { recursive: true, force: true });

writeFileSync(path.join(OUT, 'LEEME.txt'), [
  'KIT DE REDES SOCIALES DE PIXELY', '',
  'logos/    7 versiones del logo en PNG (fondo transparente o con su color) y SVG (se agranda sin perder calidad).',
  'fuentes/  Unbounded (títulos y cifras) y Manrope (textos), un archivo por grosor, con su licencia libre (SIL OFL).',
  '          Instálalas con doble clic. En Canva búscalas por su nombre; si no aparecen, súbelas en Marca → Fuentes.',
  'colores/  Los 7 colores de la marca con su código HEX y RGB.',
  'canva/    Tamaños de letra para posts e historias, en píxeles de Canva.',
  'qr/       QR de WhatsApp, web, Partners y cada red, en PNG y SVG, con fondo blanco o transparente.',
  'redes/    Usuarios, enlaces, WhatsApp, correo y biografías listas para copiar.',
].join('\n') + '\n');

// El paquete completo
execFileSync('python3', ['-c', `import zipfile,os,sys
base=sys.argv[1]; z=zipfile.ZipFile(os.path.join(base,sys.argv[2]),'w',zipfile.ZIP_DEFLATED)
for r,_,fs in os.walk(base):
  for f in sorted(fs):
    if f==sys.argv[2] or f=='kit.json': continue
    p=os.path.join(r,f); z.write(p, os.path.join('Pixely-kit-redes-sociales', os.path.relpath(p,base)))
z.close()`, OUT, ZIP]);

writeFileSync(path.join(OUT, 'kit.json'), JSON.stringify({ zip: ZIP, LOGOS, FUENTES, COLORES, FORMATOS, TAMANOS, REGLAS, QR, REDES, BIOS }, null, 1));
const n = execFileSync('python3', ['-c', 'import zipfile,sys;z=zipfile.ZipFile(sys.argv[1]);print(len(z.namelist()))', path.join(OUT, ZIP)]).toString().trim();
console.log(`✓ kit en public/kit-redes · ${ZIP} con ${n} archivos`);
