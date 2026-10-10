"""Render del anuncio: 1080x1920, 60 fps. Desenfoque de movimiento real por acumulación de submuestras dentro
del obturador (180°: de t a t + 1/120 s). Las submuestras nunca cruzan un corte: los cortes caen en el inicio
exacto de un fotograma y el obturador se abre en ese instante.

python render.py prueba 2.0 4.5 10.0   -> PNG de esos instantes
python render.py video                 -> anuncio.mp4 (con musica.wav)
"""
import os
import sys
import subprocess
import numpy as np
import skia
from multiprocessing import Pool
from cues import W, H, FPS, DUR, PLANOS
import escenas

N_CALMA, N_RAPIDO = 12, 32
RAPIDO = [(0.0, 1.75), (1.95, 2.25), (2.45, 2.65), (3.78, 4.3), (4.45, 4.65), (5.78, 6.25), (6.33, 6.55), (6.83, 7.05),
          (7.33, 7.55), (7.7, 8.5), (9.85, 10.2), (10.35, 10.7), (10.5, 11.95), (12.0, 13.45), (13.95, 14.2)]
VIG = None


def n_samples(t):
    return N_RAPIDO if any(a <= t < b for a, b in RAPIDO) else N_CALMA


def vignette():
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((x - W / 2) / (W * 0.62)) ** 2 + ((y - H / 2) / (H * 0.62)) ** 2)
    return (1 - 0.22 * np.clip(d - 0.55, 0, 1) ** 1.5)[..., None].astype(np.float32)


_surf = None


def render_frame(f):
    global _surf, VIG
    if _surf is None:
        _surf = skia.Surface(skia.ImageInfo.Make(W, H, skia.ColorType.kRGBA_8888_ColorType, skia.AlphaType.kPremul_AlphaType))
        VIG = vignette()
    t0 = f / FPS
    shot = next(p for p in PLANOS if p[0] <= t0 < p[1]) if t0 < DUR else PLANOS[-1]
    n = n_samples(t0)
    acc = np.zeros((H, W, 3), np.float32)
    c = _surf.getCanvas()
    for k in range(n):
        ts = t0 + (k + 0.5) / n * (0.5 / FPS)
        ts = min(ts, shot[1] - 1e-6)            # nunca mezclar con el plano siguiente
        c.save()
        escenas.draw(c, ts, shot[2])
        c.restore()
        acc += _surf.makeImageSnapshot().toarray()[:, :, :3]
    img = acc / n
    img *= VIG
    r = np.random.default_rng(90000 + f)
    img += r.normal(0, 1.4, (H, W, 1)).astype(np.float32)   # grano fino (evita bandas en los degradados)
    return np.clip(img + 0.5, 0, 255).astype(np.uint8)


def frame_png(f):
    import io
    from PIL import Image
    bio = io.BytesIO()
    Image.fromarray(render_frame(f)).save(bio, 'PNG', compress_level=1)
    return bio.getvalue()


def ffmpeg_cmd(out, audio):
    ff = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ffmpeg.sh')
    # este ffmpeg (el del repo de videos) no trae el lector de video crudo: los fotogramas viajan como PNG sin pérdida
    return [ff, '-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-vcodec', 'png', '-framerate', str(FPS),
            '-i', '-', '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '15',
            '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.2', '-x264-params', 'keyint=60:min-keyint=60:colorprim=bt709:transfer=bt709:colormatrix=bt709',
            '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
            '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-t', str(DUR), '-movflags', '+faststart', out]


if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'prueba':
        from PIL import Image
        os.makedirs('prueba', exist_ok=True)
        for v in sys.argv[2:]:
            f = int(round(float(v) * FPS))
            Image.fromarray(render_frame(f)).save(f'prueba/f{f:04d}.png')
            print('ok', f)
    elif mode == 'video':
        out = sys.argv[2] if len(sys.argv) > 2 else 'anuncio.mp4'
        a = int(sys.argv[3]) if len(sys.argv) > 3 else 0
        z = int(sys.argv[4]) if len(sys.argv) > 4 else int(DUR * FPS)
        p = subprocess.Popen(ffmpeg_cmd(out, 'musica.wav'), stdin=subprocess.PIPE)
        with Pool(4) as pool:
            for i, fr in enumerate(pool.imap(frame_png, range(a, z), chunksize=2)):
                p.stdin.write(fr)
                if (a + i) % 60 == 0:
                    print('fotograma', a + i, flush=True)
        p.stdin.close()
        p.wait()
        print('listo', out)
