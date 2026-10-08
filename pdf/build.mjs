// Convierte cada pieza de pdf/<nombre>/index.html en public/piezas/pdf/<archivo>.pdf
// Uso: npm run pdf            → todas
//      npm run pdf brochure   → solo una
// Chrome: usa el que traiga Playwright o el de la variable CHROME (ruta al ejecutable).
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PIEZAS = {
  brochure: 'Pixely-Brochure.pdf',
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
  await page.pdf({ path: path.join(salida, PIEZAS[nombre]), preferCSSPageSize: true, printBackground: true });
  console.log(`✓ ${PIEZAS[nombre]}`);
  await page.close();
}
await browser.close();
