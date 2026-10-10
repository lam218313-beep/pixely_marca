"""Dibuja el espectrograma y la forma de onda de musica.wav con los golpes del mapa encima (para revisar sin oír)."""
import wave
import numpy as np
from PIL import Image, ImageDraw
from cues import GOLPES, DUR
import sys
path = sys.argv[1] if len(sys.argv) > 1 else 'musica.wav'
out = sys.argv[2] if len(sys.argv) > 2 else 'ver_audio.png'
w = wave.open(path)
sr, n, ch, sw = w.getframerate(), w.getnframes(), w.getnchannels(), w.getsampwidth()
raw = np.frombuffer(w.readframes(n), np.uint8)
if sw == 3:
    a = raw.reshape(-1, 3)
    x = (a[:, 0].astype(np.int32) | (a[:, 1].astype(np.int32) << 8) | (a[:, 2].astype(np.int32) << 16))
    x = np.where(x >= 2 ** 23, x - 2 ** 24, x) / 2 ** 23
else:
    x = np.frombuffer(raw.tobytes(), np.int16) / 32768
x = x.reshape(-1, ch).mean(1)
Wpx, Hs, Hw = 1800, 520, 200
hop = len(x) // Wpx
nfft = 2048
spec = np.zeros((nfft // 2, Wpx))
win = np.hanning(nfft)
for i in range(Wpx):
    seg = x[i * hop: i * hop + nfft]
    if len(seg) < nfft:
        seg = np.pad(seg, (0, nfft - len(seg)))
    spec[:, i] = np.abs(np.fft.rfft(seg * win))[: nfft // 2]
db = 20 * np.log10(spec + 1e-7)
db = np.clip((db - db.max() + 85) / 85, 0, 1)
# eje de frecuencia logarítmico 30 Hz - 16 kHz
f = np.fft.rfftfreq(nfft, 1 / sr)[: nfft // 2]
rows = np.geomspace(30, 16000, Hs)[::-1]
idx = np.searchsorted(f, rows).clip(0, len(f) - 1)
img = (db[idx] * 255).astype(np.uint8)
rgb = np.stack([img, (img * 0.35).astype(np.uint8), (img * 0.6).astype(np.uint8)], -1)
canvas = Image.new('RGB', (Wpx, Hs + Hw + 40), (10, 10, 12))
canvas.paste(Image.fromarray(rgb), (0, 0))
d = ImageDraw.Draw(canvas)
env = np.array([np.max(np.abs(x[i * hop:(i + 1) * hop])) for i in range(Wpx)])
for i, v in enumerate(env):
    d.line([(i, Hs + Hw // 2 - v * Hw / 2), (i, Hs + Hw // 2 + v * Hw / 2)], fill=(200, 200, 210))
for bt in np.arange(0, DUR + 1e-6, 0.5):
    X = bt / DUR * Wpx
    d.line([(X, Hs), (X, Hs + Hw)], fill=(60, 60, 70))
evs = []
for k, v in GOLPES.items():
    for tm in (v if isinstance(v, list) else [v]):
        evs.append(tm)
for tm in evs:
    X = tm / DUR * Wpx
    d.line([(X, Hs + Hw), (X, Hs + Hw + 14)], fill=(235, 12, 110), width=2)
for s in range(16):
    d.text((s / DUR * Wpx + 2, Hs + Hw + 20), f'{s}s', fill=(180, 180, 190))
canvas.save(out)
print('ok', out)
