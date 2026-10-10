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

# 2 · imagen: energía de cambio por fotograma (gris, 135x240). Se decodifica con OpenCV (el ffmpeg del repo no exporta crudo)
import cv2
w, h = 135, 240
cap = cv2.VideoCapture(mp4)
small, full = [], {}
want = set()
for a0, z0, n in PLANOS[1:]:
    want |= {int(a0 * FPS) - 1, int(a0 * FPS), int(a0 * FPS) + 1}
want |= {min(int(i * 0.5 * FPS) + 8, 899) for i in range(30)}
i = 0
while True:
    ok, img = cap.read()
    if not ok:
        break
    small.append(cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), (w, h), interpolation=cv2.INTER_AREA))
    if i in want:
        full[i] = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    i += 1
fr = np.array(small, np.float32)
dv = np.r_[0, np.mean(np.abs(np.diff(fr, axis=0)), axis=(1, 2))]

# 3 · audio: flujo espectral con ventanas de 1/60 s (comparables a fotogramas)
wav = sh([FF, '-v', 'error', '-i', mp4, '-ac', '1', '-ar', '48000', '-c:a', 'pcm_s16le', '-f', 'wav', '-'], True)
x = np.frombuffer(wav[44:], np.int16).astype(np.float32) / 32768
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
# zonas de cada golpe (en píxeles de 1080x1920), tomadas de la geometría de escenas.py
import escenas as E
def box(x0, y0, x1, y1):
    return (x0, y0, x1, y1)
ph_sx, ph_sy, ph_sw = E.PH_X + E.PH_W * 0.027, E.PH_Y + E.PH_H * 0.0134, E.PH_W * 0.946
card_y, card_h = ph_sy + 150, (ph_sw - 48) * 1.25
btn = (ph_sx + ph_sw * 0.7, card_y + card_h + 78)
lb = [p_.getBounds() for p_, _ in E.LOGO]
ZONAS = {
    'tu': box(80, 640, 300, 790), 'publicidad': box(300, 640, 1000, 790), 'no_sale': box(80, 790, 1000, 915),
    'ocurrencia': box(80, 900, 1000, 1070), 'tachon': box(60, 970, 1010, 1030), 'orden': box(80, 520, 700, 670),
    'datos': box(80, 660, 1000, 800), 'estudiamos': box(80, 520, 1000, 670), 'mercado': box(80, 660, 1000, 810),
    'funciona': box(E.bar_rect(3)[0] - 90, E.BASE_Y - E.BMAX - 100, E.bar_rect(3)[0] + E.BW + 90, E.BASE_Y - E.BMAX - 25),
    'armamos': box(80, 520, 1000, 670), 'estrategia': box(80, 660, 1000, 800),
    'apruebas': box(80, 290, 1000, 430), 'cada_pieza': box(80, 430, 1000, 560),
    'aprobada': box(ph_sx, card_y + card_h * 0.3, ph_sx + ph_sw + 60, card_y + card_h * 0.62),
    'lema': box(100, 1080, 980, 1160), 'cta': box(150, 1230, 930, 1350),
    'punto': box(E.LG_X + lb[6].left() * E.LG_S - 40, E.LG_Y + lb[6].top() * E.LG_S - 40, E.LG_X + lb[6].right() * E.LG_S + 40, E.LG_Y + 40),
}
ZONAS['rebote'] = ZONAS['punto']
LISTAS = {
    'puntos': [box(x - 55, y - 55, x + 55, y + 55) for x, y in E.PTS],
    'barras': [box(E.bar_rect(i)[0] - 10, E.BASE_Y - E.BMAX * h_ - 30, E.bar_rect(i)[0] + E.BW + 10, E.BASE_Y) for i, h_ in enumerate(E.BARS_H)],
    'nodos': [box(x - 85, y - 85, x + 85, y + 85) for x, y in E.NODES],
    'redoble': [box(btn[0] - 95, btn[1] - 95, btn[0] + 95, btn[1] + 95)] * 6,
    'fichas': [box(x - 10, y - 10, x + 216, y + 216) for x, y in E.TILES],
    'letras': [box(E.LG_X + r.left() * E.LG_S - 10, E.LG_Y + r.top() * E.LG_S - 290, E.LG_X + r.right() * E.LG_S + 10, E.LG_Y + r.bottom() * E.LG_S + 10) for r in lb[:6]],
}
def zona(k, idx):
    if k in LISTAS:
        return LISTAS[k][idx]
    return ZONAS.get(k)
# audio: flujo espectral en ventanas de exactamente 1 fotograma (800 muestras), alineadas al inicio de cada fotograma
nfr = len(x) // hop
flux = np.zeros(nfr)
prev = np.zeros(hop // 2 + 1)
for i in range(nfr):
    S = np.abs(np.fft.rfft(x[i * hop:(i + 1) * hop]))
    flux[i] = np.sum(np.maximum(0, S - prev))
    prev = S
cues = []
for k, val in GOLPES.items():
    for j_, tm in enumerate(val if isinstance(val, list) else [val]):
        cues.append((tm, k, j_))
cues.sort()
rows, offs_a, offs_v = [], [], []
for tm, k, j_ in cues:
    f = int(round(tm * FPS))
    zb = zona(k, j_)
    if zb is None:          # transiciones (látigo, acercamiento, empuje, respiro, impacto): cambio en toda la imagen
        d = dv
    else:
        X0_, Y0_, X1_, Y1_ = [int(v / 8) for v in zb]
        X0_, Y0_ = max(0, X0_), max(0, Y0_)
        reg = fr[:, Y0_:max(Y1_, Y0_ + 1), X0_:max(X1_, X0_ + 1)]
        d = np.r_[0, np.mean(np.abs(np.diff(reg, axis=0)), axis=(1, 2))]
    # inicio del cambio: primer fotograma que supera la base previa + 30 % del salto (no el máximo, que llega después por la curva)
    def onset(sig, f, lo_off, hi_off):
        lo, hi = max(1, f + lo_off), min(len(sig) - 1, f + hi_off)
        base = float(np.median(sig[max(0, f - 9):max(1, f - 3)]))
        peak = float(np.max(sig[lo:hi + 1]))
        thr = base + 0.3 * (peak - base)
        for i in range(lo, hi + 1):
            if sig[i] > thr and sig[i] > base * 1.15 + 1e-6:
                return i
        return lo + int(np.argmax(sig[lo:hi + 1]))
    # tras una salida anticipada (la frase vieja se va antes del golpe), se mide la llegada de la nueva: ventana desde el golpe
    lo_v = 0 if k in ('orden', 'armamos', 'estudiamos', 'barras', 'nodos') and j_ == 0 else -3
    fv = onset(d, f, lo_v, 3)
    fa = onset(flux, f, -3, 3)
    offs_v.append(fv - f)
    offs_a.append(fa - f)
    rows.append((round(tm, 3), k, f, fv - f, fa - f))
rep.append(('Sincronía (desvío en fotogramas, 1 fotograma = 16,7 ms)', dict(
    golpes=len(rows), imagen_media=round(float(np.mean(offs_v)), 2), imagen_max_abs=int(np.max(np.abs(offs_v))),
    audio_media=round(float(np.mean(offs_a)), 2), audio_max_abs=int(np.max(np.abs(offs_a))))))

# 4 · volumen
ln = subprocess.run([FF, '-hide_banner', '-nostats', '-i', mp4, '-vn', '-af', 'loudnorm=I=-14:TP=-1:print_format=json', '-f', 'null', '-'],
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
    img = full[f].resize((th_w, th_h))
    X, Y = (i % 10) * (th_w + 6), (i // 10) * (th_h + 26)
    sheet.paste(img, (X, Y))
    d.text((X + 4, Y + th_h + 6), f'{f / FPS:.2f} s', fill=(200, 200, 210))
sheet.save('revision/hoja_contactos.png')
for a0, z0, n in PLANOS[1:]:
    f = int(a0 * FPS)
    strip = Image.new('RGB', (3 * (th_w + 6), th_h), (40, 40, 46))
    for j_, ff in enumerate([f - 1, f, f + 1]):
        strip.paste(full[ff].resize((th_w, th_h)), (j_ * (th_w + 6), 0))
        full[ff].save(f'revision/f{ff}.png')
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
for tm, k, _j in cues:
    X = tm * FPS / n_f * 1800
    d.line([(X, 172), (X, 188)], fill=(255, 220, 0), width=2)
G.save('revision/sincronia.png')

with open('revision/reporte.json', 'w') as fo:
    json.dump(dict(reporte=rep, golpes=rows), fo, ensure_ascii=False, indent=1)
for t_, val in rep:
    print(t_, ':', val)
bad = [r for r in rows if abs(r[3]) > 1 or abs(r[4]) > 1]
print('golpes con desvío > 1 fotograma:', bad)
