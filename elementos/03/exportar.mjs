// Elemento 03 «Resplandor rosa» (aprobado: el de la vitrina de pixely.pe) como fondos PNG para Canva.
// CHROME=<ruta a chrome> node elementos/03/exportar.mjs → public/elementos/03-cuadrado.png y 03-historia.png
import { chromium } from 'playwright-core';

const RESPLANDOR = 'radial-gradient(60% 55% at 50% 38%, rgba(235, 12, 110, .20), transparent 70%)';
const navegador = await chromium.launch({ executablePath: process.env.CHROME });
for (const [nombre, w, h] of [['cuadrado', 1080, 1080], ['historia', 1080, 1920]]) {
  const page = await navegador.newPage({ viewport: { width: w, height: h } });
  await page.setContent(`<body style="margin:0;background:${RESPLANDOR},#0A0A0C"></body>`);
  await page.screenshot({ path: new URL(`../../public/elementos/03-${nombre}.png`, import.meta.url).pathname });
  console.log(nombre, 'ok');
}
await navegador.close();
