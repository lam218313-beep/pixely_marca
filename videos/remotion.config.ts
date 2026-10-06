import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Chrome headless shell ya instalado en este entorno (evita descargar otro). En otra computadora se puede quitar esta línea.
Config.setBrowserExecutable(process.env.CHROME ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell');
