// Sistema visual de Pixely para los videos. Mismos valores que pixely.pe y Partners.
import { staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';

export const colores = {
  tinta: '#0A0A0C',
  rosa: '#EB0C6E',
  blanco: '#FFFFFF',
  suave: 'rgba(255,255,255,0.76)',
  tarjeta: '#141417',
  anillo: '#34343c',
} as const;

export const fuentes = { titulo: 'Unbounded', texto: 'Manrope' } as const;

export const cargarFuentes = async () => {
  await Promise.all([
    loadFont({ family: 'Unbounded', url: staticFile('fonts/unbounded-latin-wght-normal.woff2'), weight: '200 900' }),
    loadFont({ family: 'Manrope', url: staticFile('fonts/manrope-latin-wght-normal.woff2'), weight: '200 800' }),
  ]);
};
