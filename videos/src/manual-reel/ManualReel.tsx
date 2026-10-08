// "Así funciona Pixely Partners": reel vertical del manual (≈35 s). Une las escenas con un solo fondo continuo.
import React from 'react';
import { Series, useVideoConfig } from 'remotion';
import { Fondo } from './base';
import { Cierre, DURACION_CIERRE } from './Cierre';
import { DURACION_ENTRAR, Entrar } from './Entrar';
import { DURACION_GANCHO, Gancho } from './Gancho';
import { DURACION_INICIO, Inicio } from './Inicio';
import { DURACION_PLAN, Plan } from './Plan';
import { DURACION_RESULTADOS, Resultados } from './Resultados';
import { DURACION_VALIDAR, Validar } from './Validar';

export const DURACION_REEL = DURACION_GANCHO + DURACION_ENTRAR + DURACION_INICIO + DURACION_PLAN + DURACION_VALIDAR + DURACION_RESULTADOS + DURACION_CIERRE;

export const ManualReel: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Fondo />
      <Series>
        <Series.Sequence name="Gancho" durationInFrames={DURACION_GANCHO} premountFor={fps}><Gancho conFondo={false} /></Series.Sequence>
        <Series.Sequence name="Entrar" durationInFrames={DURACION_ENTRAR} premountFor={fps}><Entrar conFondo={false} /></Series.Sequence>
        <Series.Sequence name="Inicio" durationInFrames={DURACION_INICIO} premountFor={fps}><Inicio conFondo={false} /></Series.Sequence>
        <Series.Sequence name="Plan" durationInFrames={DURACION_PLAN} premountFor={fps}><Plan conFondo={false} /></Series.Sequence>
        <Series.Sequence name="Validar" durationInFrames={DURACION_VALIDAR} premountFor={fps}><Validar conFondo={false} /></Series.Sequence>
        <Series.Sequence name="Resultados" durationInFrames={DURACION_RESULTADOS} premountFor={fps}><Resultados conFondo={false} /></Series.Sequence>
        <Series.Sequence name="Cierre" durationInFrames={DURACION_CIERRE} premountFor={fps}><Cierre conFondo={false} /></Series.Sequence>
      </Series>
    </div>
  );
};
