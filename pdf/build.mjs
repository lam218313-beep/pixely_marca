// Convierte cada pieza de pdf/<nombre>/index.html en public/piezas/pdf/<archivo>.pdf
// Uso: npm run pdf            → todas
//      npm run pdf brochure   → solo una
// Chrome: usa el que traiga Playwright o el de la variable CHROME (ruta al ejecutable).
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

// Cada pieza es una carpeta con su index.html. El valor es el PDF de salida, o un mapa
// { archivo: páginas } cuando un mismo HTML da varios PDF (como los tres planes).
const PIEZAS = {
  brochure: 'Pixely-Brochure.pdf',
  planes: { 'Pixely-Plan-Lite.pdf': '1', 'Pixely-Plan-Basic.pdf': '2', 'Pixely-Plan-Pro.pdf': '3' },
  manual: 'Pixely-Manual-de-Partners.pdf',
};

const raiz = path.dirname(fileURLToPath(import.meta.url));
const salida = path.join(raiz, '..', 'public', 'piezas', 'pdf');
const pedidas = process.argv.slice(2);
const lista = pedidas.length ? pedidas : Object.keys(PIEZAS);

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
for (const nombre of lista) {
  if (!PIEZAS[nombre]) throw new Error(`No existe la pieza "${nombre}"`);
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.join(raiz, nombre, 'index.html')).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400); // deja que los orbes pinten su primer cuadro
  // Aviso si algo se sale de su hoja (el pie de página quedaría cortado)
  // (no cuenta los adornos con position:absolute, como los anillos, que salen del borde a propósito)
  const desbordes = await page.$$eval('.page', (ps) => ps.map((p, i) => {
    const fondo = p.getBoundingClientRect().bottom;
    const hijos = [...p.children].filter((h) => getComputedStyle(h).position !== 'absolute');
    return [i + 1, Math.round(Math.max(...hijos.map((h) => h.getBoundingClientRect().bottom)) - fondo)];
  }).filter(([, d]) => d > 0));
  for (const [n, d] of desbordes) console.warn(`  ⚠ ${nombre}: la página ${n} se pasa ${d}px`);
  const archivos = typeof PIEZAS[nombre] === 'string' ? { [PIEZAS[nombre]]: '' } : PIEZAS[nombre];
  for (const [archivo, pageRanges] of Object.entries(archivos)) {
    await page.pdf({ path: path.join(salida, archivo), pageRanges, preferCSSPageSize: true, printBackground: true });
    console.log(`✓ ${archivo}`);
  }
  await page.close();
}
await browser.close();
