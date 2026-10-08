// Sube el volumen del video terminado al nivel de las redes (-16 LUFS) sin que nada se sature.
// Uso: node scripts/masterizar.mjs out/manual-reel.mp4 ../public/piezas/videos/Pixely-Manual-de-Partners-reel.mp4
// Usa el ffmpeg que trae Remotion (npx remotion ffmpeg), así que funciona en cualquier computadora con el proyecto instalado.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [entrada, salida] = process.argv.slice(2);
if (!entrada || !salida) throw new Error('Uso: node scripts/masterizar.mjs <entrada.mp4> <salida.mp4>');
const OBJETIVO = -16; // LUFS, volumen medio
const TECHO = 10 ** (-1.5 / 20); // ningún pico pasa de -1.5 dB
const SR = 48000;

const ffmpeg = (...args) => {
  const r = spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-y', ...args], { encoding: 'utf8', shell: process.platform === 'win32', maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error(r.stderr);
  return r.stderr; // ffmpeg escribe sus reportes en stderr
};
const medir = (archivo) => {
  const texto = ffmpeg('-nostats', '-i', archivo, '-vn', '-af', 'loudnorm=print_format=json', '-f', 'null', '-');
  const json = JSON.parse(texto.slice(texto.lastIndexOf('{'), texto.lastIndexOf('}') + 1));
  return { volumen: Number(json.input_i), pico: Number(json.input_tp) };
};

const carpeta = mkdtempSync(join(tmpdir(), 'masterizar-'));
const crudo = join(carpeta, 'crudo.wav');
const listo = join(carpeta, 'listo.wav');
ffmpeg('-i', entrada, '-vn', '-ac', '2', '-ar', String(SR), '-c:a', 'pcm_s16le', crudo);

const antes = medir(crudo);
const ganancia = 10 ** ((OBJETIVO - antes.volumen) / 20);

// Lee el WAV (16 bits, 2 canales) y busca el bloque de datos
const wav = readFileSync(crudo);
let p = 12;
while (wav.toString('ascii', p, p + 4) !== 'data') p += 8 + wav.readUInt32LE(p + 4);
const datos = wav.subarray(p + 8, p + 8 + wav.readUInt32LE(p + 4));
const n = datos.length / 4;
const L = new Float32Array(n), R = new Float32Array(n);
for (let i = 0; i < n; i++) {
  L[i] = (datos.readInt16LE(4 * i) / 32768) * ganancia;
  R[i] = (datos.readInt16LE(4 * i + 2) / 32768) * ganancia;
}

// Limitador que mira 5 ms hacia adelante: baja el volumen justo antes de cada pico y lo suelta despacio
const ADELANTE = Math.round(0.005 * SR);
const SOLTAR = 1 - Math.exp(-1 / (0.08 * SR));
const necesita = new Float32Array(n);
for (let i = 0; i < n; i++) necesita[i] = Math.min(1, TECHO / Math.max(Math.abs(L[i]), Math.abs(R[i]), 1e-9));
const minimo = new Float32Array(n);
const cola = []; // mínimo de la ventana [i - ADELANTE, i + ADELANTE]
for (let j = 0, i = -ADELANTE; i < n; i++) {
  for (; j < n && j <= i + ADELANTE; j++) {
    while (cola.length && necesita[cola[cola.length - 1]] >= necesita[j]) cola.pop();
    cola.push(j);
  }
  while (cola[0] < i - ADELANTE) cola.shift();
  if (i >= 0) minimo[i] = necesita[cola[0]];
}
const MEDIA = Math.floor(ADELANTE / 2);
let suma = 0, g = 1, maximo = 0;
for (let i = -MEDIA; i < MEDIA; i++) suma += minimo[Math.min(n - 1, Math.max(0, i))];
const salidaPcm = Buffer.alloc(n * 4);
for (let i = 0; i < n; i++) {
  suma += minimo[Math.min(n - 1, i + MEDIA)] - minimo[Math.max(0, i - MEDIA)];
  const suave = suma / (2 * MEDIA);
  g = Math.min(suave, g + (1 - g) * SOLTAR);
  const l = Math.max(-TECHO, Math.min(TECHO, L[i] * g));
  const r = Math.max(-TECHO, Math.min(TECHO, R[i] * g));
  maximo = Math.max(maximo, 1 - g);
  salidaPcm.writeInt16LE(Math.round(l * 32767), 4 * i);
  salidaPcm.writeInt16LE(Math.round(r * 32767), 4 * i + 2);
}
writeFileSync(listo, Buffer.concat([wav.subarray(0, p + 8), salidaPcm]));

ffmpeg('-i', entrada, '-i', listo, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', salida);
const despues = medir(salida);
rmSync(carpeta, { recursive: true, force: true });
console.log(`Volumen: ${antes.volumen.toFixed(1)} → ${despues.volumen.toFixed(1)} LUFS · pico ${despues.pico.toFixed(1)} dB · el limitador bajó como máximo ${(-20 * Math.log10(1 - maximo)).toFixed(1)} dB`);
