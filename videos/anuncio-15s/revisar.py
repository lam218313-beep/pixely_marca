"""Revisión del MP4 final: especificaciones, sincronía golpe-imagen, volumen, cortes y hoja de contactos.

python revisar.py anuncio.mp4
"""
import json
import os
import subprocess
import sys
import numpy as np
from PIL import Image, ImageDraw
from cues import GOLPES, FPS, PLANOS

HERE = os.path.dirname(os.path.abspath(__file__))
FF, FP = os.path.join(HERE, 'ffmpeg.sh'), os.path.join(HERE, 'ffprobe.sh')
mp4 = sys.argv[1]
rep = []


def sh(cmd, binary=False):
    return subprocess.run(cmd, capture_output=True, check=True).stdout if binary else subprocess.run(cmd, capture_output=True, text=True, check=True).stdout


# 1 · especificaciones
info = json.loads(sh([FP, '-v', 'error', '-show_streams', '-show_format', '-count_frames', '-of', 'json', mp4]))
v = next(s for s in info['streams'] if s['codec_type'] == 'video')
a = next(s for s in info['streams'] if s['codec_type'] == 'audio')
spec = dict(video=f"{v['codec_name']} {v['profile']} {v['width']}x{v['height']} {v['r_frame_rate']} fps {v['pix_fmt']} {v['nb_read_frames']} fotogramas",
            audio=f"{a['codec_name']} {a['sample_rate']} Hz {a['channels']} canales", duracion=info['format']['duration'],
            peso_MB=round(int(info['format']['size']) / 1e6, 2))
rep.append(('Especificaciones', spec))

# 2 · imagen: energía de cambio por fotograma (gris, 135x240)
w, h = 135, 240
raw = sh([FF, '-v', 'error', '-i', mp4, '-vf', f'scale={w}:{h}:flags=area,format=gray', '-f', 'rawvideo', '-'], True)
fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)
dv = np.r_[0, np.mean(np.abs(np.diff(fr, axis=0)), axis=(1, 2))]

# 3 · audio: flujo espectral con ventanas de 1/60 s (comparables a fotogramas)
pcm = sh([FF, '-v', 'error', '-i', mp4, '-ac', '1', '-ar', '48000', '-f', 's16le', '-'], True)
x = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
hop = 800
nfr = len(x) // hop
spec_prev = None
flux = np.zeros(nfr)
win = np.hanning(1600)
for i in range(nfr):
    seg = x[i * hop: i * hop + 1600]
    if len(seg) < 1600:
        seg = np.pad(seg, (0, 1600 - len(seg)))
    S = np.abs(np.fft.rfft(seg * win))
    if spec_prev is not None:
        flux[i] = np.sum(np.maximum(0, S - spec_prev))
    spec_prev = S
# la ventana i empieza en i/60 s pero abarca 2 fotogramas: el ataque aparece en i o i-1 -> corregimos media ventana
cues = []
for k, val in GOLPES.items():
    for tm in (val if isinstance(val, list) else [val]):
        cues.append((tm, k))
cues.sort()
rows, offs_a, offs_v = [], [], []
for tm, k in cues:
    f = int(round(tm * FPS))
    lo, hi = max(1, f - 3), min(len(dv) - 1, f + 3)
    fv = lo + int(np.argmax(dv[lo:hi + 1]))
    la, ha = max(1, f - 3), min(nfr - 1, f + 3)
    fa = la + int(np.argmax(flux[la:ha + 1]))
    offs_v.append(fv - f)
    offs_a.append(fa - f)
    rows.append((round(tm, 3), k, f, fv - f, fa - f))
rep.append(('Sincronía (desvío en fotogramas, 1 fotograma = 16,7 ms)', dict(
    golpes=len(rows), imagen_media=round(float(np.mean(offs_v)), 2), imagen_max_abs=int(np.max(np.abs(offs_v))),
    audio_media=round(float(np.mean(offs_a)), 2), audio_max_abs=int(np.max(np.abs(offs_a))))))

# 4 · volumen
ln = subprocess.run([FF, '-hide_banner', '-nostats', '-i', mp4, '-af', 'loudnorm=I=-14:TP=-1:print_format=json', '-f', 'null', '-'],
                    capture_output=True, text=True).stderr
j = json.loads(ln[ln.rfind('{'):ln.rfind('}') + 1])
rep.append(('Volumen', dict(LUFS=j['input_i'], true_peak_dBTP=j['input_tp'], LRA=j['input_lra'])))

# 5 · cortes: el fotograma del corte no debe parecerse a una mezcla (comparamos con vecinos)
cortes = []
for a0, z0, n in PLANOS[1:]:
    f = int(a0 * FPS)
    d_prev = float(np.mean(np.abs(fr[f] - fr[f - 1])))
    d_next = float(np.mean(np.abs(fr[f + 1] - fr[f])))
    cortes.append(dict(fotograma=f, cambio_en_el_corte=round(d_prev, 1), cambio_siguiente=round(d_next, 1)))
rep.append(('Cortes', cortes))

# 6 · hoja de contactos: un fotograma cada 0,5 s + los fotogramas alrededor de cada corte
os.makedirs('revision', exist_ok=True)
times = [i * 0.5 for i in range(30)]
th_w, th_h = 216, 384
sheet = Image.new('RGB', (10 * (th_w + 6), 3 * (th_h + 26)), (40, 40, 46))
d = ImageDraw.Draw(sheet)
for i, tm in enumerate(times):
    f = min(int(tm * FPS) + 8, len(fr) - 1)
    img = Image.open(subprocess.Popen([FF, '-v', 'error', '-ss', f'{f / FPS:.4f}', '-i', mp4, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], stdout=subprocess.PIPE).stdout)
    img = img.convert('RGB').resize((th_w, th_h))
    X, Y = (i % 10) * (th_w + 6), (i // 10) * (th_h + 26)
    sheet.paste(img, (X, Y))
    d.text((X + 4, Y + th_h + 6), f'{f / FPS:.2f} s', fill=(200, 200, 210))
sheet.save('revision/hoja_contactos.png')
for a0, z0, n in PLANOS[1:]:
    f = int(a0 * FPS)
    strip = Image.new('RGB', (3 * (th_w + 6), th_h), (40, 40, 46))
    for j_, ff in enumerate([f - 1, f, f + 1]):
        img = Image.open(subprocess.Popen([FF, '-v', 'error', '-i', mp4, '-vf', f'select=eq(n\\,{ff})', '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], stdout=subprocess.PIPE).stdout)
        strip.paste(img.convert('RGB').resize((th_w, th_h)), (j_ * (th_w + 6), 0))
    strip.save(f'revision/corte_{f}.png')

# gráfico de sincronía
G = Image.new('RGB', (1800, 360), (10, 10, 12))
d = ImageDraw.Draw(G)
n_f = len(dv)
vmax, amax = np.percentile(dv, 99.5), np.percentile(flux, 99.5)
for i in range(1, n_f):
    X = i / n_f * 1800
    d.line([(X, 170), (X, 170 - min(dv[i] / vmax, 1) * 150)], fill=(220, 220, 230))
for i in range(1, nfr):
    X = i / n_f * 1800
    d.line([(X, 190), (X, 190 + min(flux[i] / amax, 1) * 150)], fill=(235, 12, 110))
for tm, k in cues:
    X = tm * FPS / n_f * 1800
    d.line([(X, 172), (X, 188)], fill=(255, 220, 0), width=2)
G.save('revision/sincronia.png')

with open('revision/reporte.json', 'w') as fo:
    json.dump(dict(reporte=rep, golpes=rows), fo, ensure_ascii=False, indent=1)
for t_, val in rep:
    print(t_, ':', val)
bad = [r for r in rows if abs(r[3]) > 1 or abs(r[4]) > 1]
print('golpes con desvío > 1 fotograma:', bad)
