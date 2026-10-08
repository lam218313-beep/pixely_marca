// Saca cuadros sueltos de una composición para revisarlos sin renderizar el video entero.
// Uso: node scripts/cuadros.mjs <Composicion> <carpeta> <cuadro> [cuadro...]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';

const [id, salida, ...cuadros] = process.argv.slice(2);
const browserExecutable = process.env.CHROME ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const c of cuadros) {
  await renderStill({ serveUrl, composition, frame: Number(c), output: path.join(salida, `${id}-${c}.png`), browserExecutable });
  console.log(`✓ ${id} ${c}`);
}
