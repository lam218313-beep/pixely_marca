"""Música del anuncio, sintetizada desde cero con numpy (sin muestras ni modelos).

La menor, 120 BPM. Am | Am7 | Fmaj7 | Cadd9 | G (subida) | Am(add9) (caída) | F(add9) -> Cmaj9 (logo).
Cada golpe del mapa (cues.GOLPES) dispara un sonido: lo que se ve, suena en el mismo instante.
Uso: python musica.py  ->  musica.wav (48 kHz, estéreo, 24 bit)
"""
import math
import wave
import numpy as np
from cues import GOLPES as G, DUR, b

SR = 48000
N = int(DUR * SR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)
SEND_L = np.zeros(N)   # envío a la reverb
SEND_R = np.zeros(N)
KICKS = []             # tiempos de bombo (para el ducking del bajo y el pad)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(n):
    return np.arange(n) / SR


def add(sig, t0, pan=0.0, gain=1.0, send=0.0, right=None):
    """Suma una señal (mono o L/R) en el tiempo t0 con paneo de potencia constante."""
    i0 = int(round(t0 * SR))
    if right is None:
        a = (pan + 1) * math.pi / 4
        l, r = sig * math.cos(a) * math.sqrt(2), sig * math.sin(a) * math.sqrt(2)
    else:
        l, r = sig, right
    if i0 < 0:
        l, r, i0 = l[-i0:], r[-i0:], 0
    n = min(len(l), N - i0)
    if n <= 0:
        return
    L[i0:i0 + n] += l[:n] * gain
    R[i0:i0 + n] += r[:n] * gain
    if send:
        SEND_L[i0:i0 + n] += l[:n] * gain * send
        SEND_R[i0:i0 + n] += r[:n] * gain * send


def fft_filter(x, lo=None, hi=None, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if hi:
        m /= np.sqrt(1 + (f / hi) ** (2 * order))
    if lo:
        m *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X * m, len(x))


def svf_sweep(x, fc, q=0.7, mode='bp'):
    """Filtro de estado variable con corte que cambia muestra a muestra (barridos de ruido)."""
    low = band = 0.0
    out = np.empty_like(x)
    damp = 1 / q
    for i in range(len(x)):
        f = 2 * math.sin(math.pi * min(fc[i], SR / 6) / SR)
        low += f * band
        high = x[i] - low - damp * band
        band += f * high
        out[i] = band if mode == 'bp' else low if mode == 'lp' else high
    return out


def saw(freq, n, detune=0.0, phase=0.0):
    ph = (phase + np.cumsum(np.full(n, freq * (1 + detune) / SR))) % 1.0
    return 2 * ph - 1


def env_ad(n, att, dec):
    t = tt(n)
    e = np.minimum(1, t / max(att, 1e-4)) * np.exp(-np.maximum(0, t - att) / dec)
    return e


# ---------------- instrumentos ----------------
def kick(t0, g=1.0, boom=False):
    n = int(0.5 * SR)
    t = tt(n)
    f = 46 + 120 * np.exp(-t / 0.032)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / (0.32 if boom else 0.2))
    punch = np.sin(2 * ph) * np.exp(-t / 0.05) * 0.35                      # armónico de 100-250 Hz
    click = fft_filter(rng.standard_normal(n) * np.exp(-t / 0.003), lo=1800, hi=6000) * 0.6
    s = np.tanh(2.4 * (body + punch + click)) / np.tanh(2.4)
    s *= np.minimum(1, t / 0.0015)
    add(s, t0, 0, 0.55 * g)
    KICKS.append((t0, g))


def sub_boom(t0, g=1.0, dur=1.2, f0=58, f1=34):
    n = int(dur * SR)
    t = tt(n)
    f = f1 + (f0 - f1) * np.exp(-t / 0.25)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (dur / 3.2)) * np.minimum(1, t / 0.004)
    add(np.tanh(1.3 * s), t0, 0, 0.32 * g)


def clap(t0, g=1.0, pan=0.0):
    n = int(0.35 * SR)
    t = tt(n)
    nz = rng.standard_normal(n)
    e = np.zeros(n)
    for k, d in enumerate([0.0, 0.009, 0.018]):
        tk = t - d
        e += np.where(tk >= 0, np.exp(-np.maximum(tk, 0) / 0.006), 0) * (0.8 if k < 2 else 1.0)
    e += np.where(t > 0.018, np.exp(-(t - 0.018) / 0.11), 0) * 0.55
    s = fft_filter(nz * e, lo=900, hi=4200, order=2)
    s /= np.max(np.abs(s)) + 1e-9
    add(s, t0, pan, 0.48 * g, send=0.35)


def hat(t0, g=1.0, open_=False, pan=0.0):
    n = int((0.25 if open_ else 0.06) * SR)
    t = tt(n)
    s = fft_filter(rng.standard_normal(n), lo=7500, order=3) * np.exp(-t / (0.09 if open_ else 0.018))
    s /= np.max(np.abs(s)) + 1e-9
    add(s, t0, pan, 0.19 * g, send=0.1)


def snare(t0, g=1.0):
    n = int(0.25 * SR)
    t = tt(n)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.04)
    nz = fft_filter(rng.standard_normal(n), lo=1200, hi=7000) * np.exp(-t / 0.07)
    nz /= np.max(np.abs(nz)) + 1e-9
    add(0.5 * tone + 0.8 * nz, t0, 0, 0.3 * g, send=0.25)


def slam(t0, g=1.0):
    """Golpe de palabra: cuerpo de 180 Hz y chasquido de 1-5 kHz, como una tecla grande."""
    n = int(0.3 * SR)
    t = tt(n)
    f = 180 + 220 * np.exp(-t / 0.012)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.06)
    nz = fft_filter(rng.standard_normal(n), lo=1000, hi=5000) * np.exp(-t / 0.035)
    nz /= np.max(np.abs(nz)) + 1e-9
    add(np.tanh(1.5 * (body + 0.7 * nz)), t0, 0, 0.6 * g, send=0.3)


def tick(t0, g=1.0, pan=0.0):
    """Tic de lápiz: el garabato tiembla en cada corchea."""
    n = int(0.03 * SR)
    t = tt(n)
    s = fft_filter(rng.standard_normal(n), lo=2500, hi=9000) * np.exp(-t / 0.006)
    s /= np.max(np.abs(s)) + 1e-9
    add(s, t0, pan, 0.07 * g)


def scratch(t0, dur=0.2, g=1.0):
    """Tachón de marcador sobre «ocurrencia»."""
    n = int(dur * SR)
    t = tt(n)
    fc = 900 + 2600 * (t / dur) ** 0.7
    s = svf_sweep(rng.standard_normal(n), fc, q=2.5) * np.sin(np.pi * t / dur) ** 0.6
    s /= np.max(np.abs(s)) + 1e-9
    add(s, t0, 0.25, 0.32 * g, send=0.15)


def whoosh(t0, dur, g=1.0, f_lo=250, f_hi=4200, pan0=-0.7, pan1=0.7):
    n = int(dur * SR)
    t = tt(n)
    x = t / dur
    shape = np.sin(np.pi * x) ** 2
    fc = f_lo + (f_hi - f_lo) * np.sin(np.pi * x) ** 1.5
    nz = svf_sweep(rng.standard_normal(n), fc, q=1.4)
    nz = nz / (np.max(np.abs(nz)) + 1e-9) * shape
    pan = pan0 + (pan1 - pan0) * x
    a = (pan + 1) * np.pi / 4
    add(nz * np.cos(a) * 1.41, t0, gain=0.42 * g, right=nz * np.sin(a) * 1.41, send=0.25)


def riser(t0, dur, g=1.0):
    n = int(dur * SR)
    t = tt(n)
    x = t / dur
    fc = 400 * (12000 / 400) ** (x ** 1.3)
    nz = svf_sweep(rng.standard_normal(n), fc, q=1.1)
    nz /= np.max(np.abs(nz)) + 1e-9
    f = 220 * 2 ** (2 * x ** 1.5)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    s = (nz * 0.8 + tone) * x ** 2.2
    add(s, t0, -0.2, 0.3 * g, send=0.4)
    add(np.roll(s, 220), t0, 0.2, 0.3 * g, send=0.4)


def reverse_swell(t1, dur, g=1.0):
    """Platillo al revés que termina justo en t1 (la entrada del golpe)."""
    n = int(dur * SR)
    t = tt(n)
    nz = fft_filter(rng.standard_normal(n), lo=3000, order=2)
    nz /= np.max(np.abs(nz)) + 1e-9
    s = nz * np.exp(-(dur - t) / (dur / 3.5))
    s *= np.minimum(1, (dur - t) / 0.004)        # corta limpio al llegar al golpe
    add(s, t1 - dur, -0.3, 0.22 * g, send=0.5)
    add(np.roll(s, 300), t1 - dur, 0.3, 0.22 * g, send=0.5)


def crash(t0, g=1.0, dur=2.2):
    n = int(dur * SR)
    t = tt(n)
    nz = fft_filter(rng.standard_normal(n), lo=4500, order=2)
    nz /= np.max(np.abs(nz)) + 1e-9
    e = np.exp(-t / (dur / 4.5)) * np.minimum(1, t / 0.002)
    nz2 = fft_filter(rng.standard_normal(n), lo=4500, order=2)
    nz2 /= np.max(np.abs(nz2)) + 1e-9
    add(nz * e, t0, gain=0.22 * g, right=nz2 * e, send=0.45)


def fm(t0, midi, dur=0.5, g=1.0, ratio=2.0, index=2.2, idec=0.08, adec=0.22, pan=0.0, send=0.35, att=0.002):
    n = int(dur * SR)
    t = tt(n)
    f = mtof(midi)
    mod = np.sin(2 * np.pi * f * ratio * t) * index * np.exp(-t / idec)
    s = np.sin(2 * np.pi * f * t + mod) * np.minimum(1, t / att) * np.exp(-t / adec)
    s *= np.minimum(1, (dur - t) / 0.01)
    add(s, t0, pan, 0.3 * g, send=send)


def blip(t0, midi, g=1.0, pan=0.0):
    """Blip corto para cada pieza que aparece."""
    n = int(0.09 * SR)
    t = tt(n)
    f = mtof(midi)
    tri = 2 * np.abs(2 * ((f * t) % 1) - 1) - 1
    s = (0.7 * tri + 0.3 * np.sin(2 * np.pi * 2 * f * t)) * np.exp(-t / 0.035) * np.minimum(1, t / 0.0015)
    add(s, t0, pan, 0.3 * g, send=0.3)


def bell(t0, midi, g=1.0, dur=1.8, pan=0.0):
    fm(t0, midi, dur, g, ratio=3.5, index=1.6, idec=0.35, adec=0.55, pan=pan, send=0.55)
    fm(t0, midi + 12, dur * 0.6, g * 0.35, ratio=1.0, index=0.6, idec=0.2, adec=0.25, pan=-pan, send=0.55)


def thud(t0, g=1.0):
    n = int(0.3 * SR)
    t = tt(n)
    f = 80 + 140 * np.exp(-t / 0.02)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.09)
    add(np.tanh(2 * s), t0, 0, 0.45 * g)


def stab(t0, notes, g=1.0, dur=0.45):
    """Acorde corto y brillante (sierras con filtro que se cierra): la caída del sello."""
    n = int(dur * SR)
    t = tt(n)
    l = np.zeros(n)
    r = np.zeros(n)
    for k, m in enumerate(notes):
        f = mtof(m)
        l += saw(f, n, -0.006, 0.1 * k)
        r += saw(f, n, 0.006, 0.6 * k)
    e = np.exp(-t / 0.16) * np.minimum(1, t / 0.002)
    l = (0.6 * fft_filter(l, lo=200, hi=5000) + 0.4 * fft_filter(l, lo=200, hi=1200)) * e
    r = (0.6 * fft_filter(r, lo=200, hi=5000) + 0.4 * fft_filter(r, lo=200, hi=1200)) * e
    add(l, t0, gain=0.11 * g / len(notes) * 4, right=r, send=0.4)


def bass_note(t0, midi, dur, g=1.0):
    n = int(dur * SR)
    t = tt(n)
    f = mtof(midi)
    raw = 0.6 * saw(f, n) + 0.4 * np.sin(2 * np.pi * f * t)
    dark = fft_filter(raw, hi=180, order=2)
    bright = fft_filter(raw, hi=900, order=2)
    e = np.exp(-t / 0.09)
    s = dark * (1 - 0.5 * e) + bright * (0.35 + 0.5 * e)
    s *= np.minimum(1, t / 0.004) * np.minimum(1, (dur - t) / 0.012)
    s = np.tanh(3.0 * s)
    add(s, t0, 0, 0.26 * g)


def pad_chord(t0, notes, dur, g=1.0, cutoff=1800, att=0.25, rel=0.35):
    n = int((dur + rel) * SR)
    t = tt(n)
    l = np.zeros(n)
    r = np.zeros(n)
    for k, m in enumerate(notes):
        f = mtof(m)
        l += saw(f, n, -0.004, 0.13 * k) + saw(f, n, 0.003, 0.37 * k)
        r += saw(f, n, 0.004, 0.71 * k) + saw(f, n, -0.003, 0.29 * k)
    e = np.minimum(1, t / att) * np.where(t < dur, 1.0, np.exp(-(t - dur) / (rel / 3)))
    l = fft_filter(l, lo=120, hi=cutoff, order=2) * e
    r = fft_filter(r, lo=120, hi=cutoff, order=2) * e
    sc = 0.06 * g / len(notes)
    add(l, t0, gain=sc, right=r, send=0.5)


# ---------------- arreglo ----------------
# 0-2 s · gancho: un golpe por palabra, garabato que tiembla en corcheas, dron grave
sub_boom(G['tu'], 1.0, 1.0)
for k, key in enumerate(['tu', 'publicidad', 'no_sale', 'ocurrencia']):
    kick(G[key], 1.0 if k == 0 else 0.85, boom=True)
    slam(G[key], 1.0 if k == 0 else 0.85)
for i in range(8):
    tick(b(i / 2) + 0.25 * b(1), 1.3, pan=(-0.4 if i % 2 else 0.4))
pad_chord(0.0, [57, 60, 64, 69], 2.0, 1.0, cutoff=1500, att=1.4, rel=0.15)
clap(G['no_sale'], 0.7)
scratch(G['tachon'], 0.22)
reverse_swell(G['orden'], 0.5, 0.8)

# 2-9 s · ritmo: bombo en cada tiempo, palmas en 2 y 4, hats a contratiempo, bajo en corcheas
for beat in range(4, 18):
    kick(b(beat))
    if beat % 2 == 1:
        clap(b(beat))
    hat(b(beat + 0.5), 1.0, open_=(beat % 4 == 3), pan=0.15)
    hat(b(beat + 0.25), 0.45, pan=-0.2)
    hat(b(beat + 0.75), 0.45, pan=-0.2)
crash(G['orden'], 0.9)
whoosh(G['orden'] - 0.02, 0.32, 0.7, pan0=0.4, pan1=-0.4)
roots = {2: 45, 4: 41, 6: 48, 8: 43}
for bar_t, root in roots.items():
    end = 9.0 if bar_t == 8 else bar_t + 2
    t = bar_t
    k = 0
    while t < end - 1e-6:
        m = root + (12 if k % 4 == 2 else 0)
        bass_note(t, m - 12, b(0.5) * 0.9)
        t += b(0.5)
        k += 1
pad_chord(2.0, [57, 60, 64, 67], 2.0)
pad_chord(4.0, [53, 57, 60, 64], 2.0)
pad_chord(6.0, [48, 55, 60, 62, 64], 2.0)
pad_chord(8.0, [55, 59, 62, 69], 2.0, cutoff=1200, att=1.5)

# datos (2,0 a 3,75): un pluck por punto
for tm, m in zip(G['puntos'], [69, 72, 76, 79, 81, 84, 83, 88]):
    fm(tm, m, 0.45, 0.9, pan=0.3 * math.sin(tm * 5))
# barras (4,0 a 5,25): suben de altura y de nota
for tm, m in zip(G['barras'], [65, 69, 72, 76, 77, 81]):
    fm(tm, m, 0.45, 0.95, ratio=1.0, index=1.4)
bell(G['funciona'], 84, 0.9)
whoosh(G['whip_ab'] - 0.06, 0.3, 0.8)
# estrategia: un acorde por nodo
for tm, chord in zip(G['nodos'], [[60, 64, 67], [64, 67, 72], [67, 72, 76], [72, 76, 79]]):
    for m in chord:
        fm(tm, m, 0.6, 0.45, ratio=2.0, index=1.0, adec=0.3)
whoosh(G['zoom_bc'] - 0.1, 0.36, 1.0, f_lo=180, f_hi=6000, pan0=0, pan1=0)
reverse_swell(G['apruebas'], 0.25, 0.6)

# 8-10 s · Partners: el celular sube, redoble y respiro antes del sello
whoosh(G['apruebas'] - 0.01, 0.4, 0.8, pan0=0, pan1=0, f_lo=120, f_hi=2500)
thud(G['apruebas'], 0.8)
fm(G['cada_pieza'], 76, 0.6, 0.6, ratio=2.0, index=1.2)
for i, tm in enumerate(G['redoble']):
    snare(tm, 0.45 + 0.11 * i)
riser(9.0, 0.75, 1.0)
reverse_swell(G['aprobada'], 0.25, 1.0)

# 10-12 s · caída: sello «Aprobada», empuje y las 12 piezas
kick(G['aprobada'], 1.15, boom=True)
sub_boom(G['aprobada'], 0.8, 0.9)
clap(G['aprobada'], 1.2)
thud(G['aprobada'], 1.0)
crash(G['aprobada'], 1.0)
stab(G['aprobada'], [69, 72, 76, 83], 1.0)
stab(G['push'] + 0.125, [72, 76, 79, 84], 0.55)
for beat in range(21, 24):
    kick(b(beat))
    if beat % 2 == 1:
        clap(b(beat))
    hat(b(beat + 0.5), 1.1, pan=0.15)
for t in np.arange(10.0, 12.0 - 1e-6, b(0.5)):
    bass_note(t, 45 - 12 + (12 if int(round(t / b(0.5))) % 4 == 2 else 0), b(0.5) * 0.9, 1.05)
pad_chord(10.0, [57, 60, 64, 71], 2.0, 1.1, cutoff=2400, att=0.02)
whoosh(G['push'] - 0.05, 0.28, 0.9, pan0=0.6, pan1=-0.6)
for i, (tm, m) in enumerate(zip(G['fichas'], [69, 72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96])):
    blip(tm, m, 0.85 + 0.02 * i, pan=(-0.35 if i % 2 else 0.35))
reverse_swell(G['impacto'], 0.6, 1.1)

# 12-15 s · logo: impacto, letras, punto rosa que rebota, lema y llamado
sub_boom(G['impacto'], 1.2, 2.2, f0=62, f1=30)
kick(G['impacto'], 1.1, boom=True)
crash(G['impacto'], 1.2, 2.6)
pad_chord(12.0, [53, 57, 60, 67], 1.0, 0.9, cutoff=1600, att=0.01, rel=0.4)
for tm, m in zip(G['letras'], [65, 69, 72, 76, 79, 84]):
    fm(tm, m, 0.5, 0.75, ratio=2.0, index=1.6, adec=0.2)
bell(G['punto'], 91, 1.1)
kick(G['punto'], 0.55)
bell(G['rebote'], 88, 0.5, pan=0.2)
pad_chord(13.0, [48, 55, 59, 62, 64], 1.75, 1.0, cutoff=2000, att=0.05, rel=0.25)
bass_note(13.0, 36, 1.75, 0.9)
fm(G['lema'], 84, 0.9, 0.35, ratio=3.0, index=0.8, adec=0.4)
blip(G['cta'], 88, 0.7)
bell(G['cta'], 96, 0.35, dur=1.0, pan=-0.2)

# ---------------- mezcla ----------------
# ducking: el bajo y el pad bajan cuando entra el bombo (se siente el pulso)
t = tt(N)
duck = np.ones(N)
for t0, g in KICKS:
    i0 = int(t0 * SR)
    seg = t[i0:i0 + int(0.3 * SR)] - t0
    duck[i0:i0 + len(seg)] = np.minimum(duck[i0:i0 + len(seg)], 1 - 0.45 * min(g, 1) * np.exp(-seg / 0.09))

# reverb: respuesta al impulso sintética (ruido con caída exponencial, 1,6 s), convolución por FFT
ir_n = int(1.6 * SR)
ti = tt(ir_n)
irl = rng.standard_normal(ir_n) * np.exp(-ti / 0.32)
irr = rng.standard_normal(ir_n) * np.exp(-ti / 0.32)
irl = fft_filter(irl, lo=250, hi=7000)
irr = fft_filter(irr, lo=250, hi=7000)
irl[: int(0.012 * SR)] = 0
irr[: int(0.017 * SR)] = 0
irl /= np.sqrt(np.sum(irl ** 2))
irr /= np.sqrt(np.sum(irr ** 2))


def conv(x, ir):
    n = len(x) + len(ir)
    return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[: len(x)]


wl, wr = conv(SEND_L, irl) * 0.55, conv(SEND_R, irr) * 0.55
ml, mr = L * duck + wl, R * duck + wr
ml, mr = fft_filter(ml, lo=28), fft_filter(mr, lo=28)


def shelf(x, fc, gain_db):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    gl = 10 ** (gain_db / 20)
    return np.fft.irfft(X * (1 + (gl - 1) / (1 + (f / fc) ** 4)), len(x))


ml, mr = shelf(ml, 75, -5.0), shelf(mr, 75, -5.0)
ml, mr = shelf(ml, 2600, 0) * 1.0, shelf(mr, 2600, 0) * 1.0

# compresión de bus suave (detector RMS) y limitador con anticipación de 3 ms
mono = np.sqrt((ml ** 2 + mr ** 2) / 2)
win = int(0.01 * SR)
rms = np.sqrt(np.convolve(mono ** 2, np.ones(win) / win, 'same') + 1e-12)
db = 20 * np.log10(rms)
thr, ratio = -18.0, 2.0
gr = np.where(db > thr, (db - thr) * (1 - 1 / ratio), 0)
gain = 10 ** (-gr / 20)
ml *= gain
mr *= gain


def master(ml, mr, target_peak=10 ** (-1.6 / 20)):
    peak = np.maximum(np.abs(ml), np.abs(mr))
    la = int(0.003 * SR)
    win_max = np.lib.stride_tricks.sliding_window_view(np.pad(peak, (0, la)), la + 1).max(axis=1)
    g = np.minimum(1.0, target_peak / np.maximum(win_max, 1e-9))
    out = np.empty_like(g)
    cur = 1.0
    rel = math.exp(-1 / (0.06 * SR))
    for i in range(len(g)):
        cur = g[i] if g[i] < cur else g[i] + (cur - g[i]) * rel
        out[i] = cur
    return ml * out, mr * out


def write(path, l, r):
    st = np.stack([l, r], 1)
    st = np.clip(st, -1, 1)
    pcm = (st * (2 ** 23 - 1)).astype(np.int32)
    b24 = np.frombuffer(pcm.astype('<i4').tobytes(), np.uint8).reshape(-1, 4)[:, :3].tobytes()
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(3)
        w.setframerate(SR)
        w.writeframes(b24)


if __name__ == '__main__':
    import sys
    gain_db = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0
    g = 10 ** (gain_db / 20)
    ml2, mr2 = master(ml * g, mr * g)
    fade = np.ones(N)
    nf = int(0.5 * SR)
    fade[-nf:] = np.cos(np.linspace(0, np.pi / 2, nf)) ** 2      # la cola de la reverb termina en 15,0 s
    write('musica.wav', ml2 * fade, mr2 * fade)
    print('ok', 'pico', round(20 * np.log10(np.max(np.abs(np.stack([ml2, mr2])))), 2), 'dBFS')
