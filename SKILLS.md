# Skills instaladas (`.claude/skills/`)

Se cargan solas cuando Claude Code trabaja dentro de este repositorio.

| Skill | Origen | Licencia | Para qué |
|---|---|---|---|
| motion-design | github.com/lottiefiles/motion-design-skill | MIT | Principios de animación: tiempos, curvas, coreografía |
| gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-react, gsap-frameworks, gsap-utils, gsap-performance | github.com/greensock/gsap-skills (oficial) | MIT | Animación web con GSAP (web y Partners) |
| threejs-* (10) | github.com/CloudAI-X/threejs-skills | sin archivo de licencia: solo referencia | Escenas 3D, luces, cámaras, partículas, shaders |
| cast, paint, bunshin, _jutsu (genjutsu) | github.com/AThevon/genjutsu | MIT | Microinteracciones y dirección de arte. Ojo: `paint` propone universos visuales nuevos; usar siempre con los tokens de Pixely |
| design-dna | github.com/zanwei/design-dna | MIT | Analizar referencias visuales y convertirlas en ficha de estilo |
| banana-pro-director, cinema-worldbuilder, ai-film-director, video-qa, story-bible-builder | github.com/A0339x/ai-film-pipeline (basado en las skills de Joey, @acornjoey) | MIT | Dirección de video con IA: prompts de imagen para Nano Banana Pro (personajes, escenarios, láminas), prompts de video para Seedance (5 modos de cine), orquestador del proyecto, control de calidad y biblia de la historia. Plantillas y guías en `videos/ai-film-pipeline/` |
| remotion-* (12) | remotion-dev (skills oficiales) | ver Remotion | Videos con código |
| scroll-world | github.com/oso95/scroll-world | MIT | Webs que "vuelan" por un mundo 3D al hacer scroll. Viene pensada para Higgsfield + Monid (pago por clip); en Pixely se adapta a Magnific (mismo modelo, Seedance) |
| ponytail, ponytail-review, ponytail-audit, ponytail-debt, ponytail-help, ponytail-gain | github.com/DietrichGebert/ponytail | MIT | Programar lo más simple que funcione y auditar lo que sobra. Solo las skills: sin los hooks que la activan sola |
| security-audit | github.com/shaxbozaka/security-audit | MIT | Auditoría de seguridad de una app web. **Solo sobre sistemas propios** (Partners, pixely.pe) o con autorización escrita |

Instaladas el 2026-10-06 (y las cuatro últimas filas el 2026-10-08) copiando cada repositorio, versión de esa fecha. Para actualizar, volver a copiar desde su origen.

## Guardadas sin activar (`skills-extra/`)

| Skill | Origen | Licencia | Por qué no está activa |
|---|---|---|---|
| agent-reach | github.com/Panniantong/Agent-Reach | MIT | Se dispara ante **cualquier** búsqueda o enlace, necesita su programa (`pip install agent-reach`) en la computadora y, para algunas redes, sesiones iniciadas. Para activarla: instalar el programa y copiar la carpeta a `.claude/skills/` |

## Librerías de interfaz (`package.json`)

| Librería | Origen | Licencia | Para qué |
|---|---|---|---|
| thinking-orbs 0.3.2 | github.com/Jakubantalik/thinking-orbs | MIT | Animaciones de "pensando" hechas de puntos (9 estados). React o, sin React, su motor en `thinking-orbs/engine` |

## Programas para la computadora del equipo

| Programa | Dónde | Licencia | Para qué |
|---|---|---|---|
| Recordly | github.com/webadderallorg/Recordly/releases/latest · recordly.dev | AGPL-3.0 | Grabar pantalla (Partners, web) con zoom automático: materia prima de las animaciones |
