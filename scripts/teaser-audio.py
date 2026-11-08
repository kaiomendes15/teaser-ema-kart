"""Deterministic 48 kHz stereo design; preserves the original supplied assets.

O kart entra ao fundo em 1,40 s, longe e abafado, e vem se aproximando por baixo da música (engine, 6,10 s).
Vento em 3,60 s. O banner é papel: estica de 4,95 a 5,15 s (stretch), estoura abafado (impact) e rasga com
abas e tiras esvoaçando (tear) a partir de 5,15 s. O startup (ignição de perto) não é mais usado no teaser.
All audio must be unmounted at 7.50 seconds: the collision cut is silent.
"""
from pathlib import Path
import math
import random
import struct
import wave

SR = 48000
ROOT = Path(__file__).resolve().parent.parent / 'public' / 'audio'
ROOT.mkdir(exist_ok=True)
random.seed(61)


def write(name, duration, sample):
    data = bytearray()
    peak = 0
    for i in range(round(duration * SR)):
        values = sample(i / SR)
        peak = max(peak, *[abs(v) for v in values])
        data.extend(struct.pack('<hh', *[round(max(-0.98, min(0.98, v)) * 32767) for v in values]))
    with wave.open(str(ROOT / f'teaser-{name}.wav'), 'wb') as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(SR)
        output.writeframes(data)
    print(f'{name}: {duration:.2f}s, peak {peak:.3f}')


phase = 0
low_noise = 0
exhaust_filter = 0
history = [0.0] * 96
cursor = 0


ENGINE_DURATION = 6.1  # de 1,40 s até o corte em 7,50 s


def engine(t):
    global phase, low_noise, exhaust_filter, cursor
    p = t / ENGINE_DURATION
    # Combustion frequency climbs from distant idle into a high kart whine.
    hz = 46 + 180 * p ** 1.28 + 4 * math.sin(t * 7) * p
    phase += math.tau * hz / SR
    noise = random.uniform(-1, 1)
    low_noise += .09 * (noise - low_noise)
    exhaust = sum(math.sin(phase * h + .12 * math.sin(phase / 2)) / h ** .85 for h in range(1, 10))
    exhaust = math.tanh(exhaust * 1.7) * .58 + low_noise * .26
    # Low-pass distance occlusion steadily opens as the kart approaches.
    cutoff = .02 + .62 * p ** 2.1
    exhaust_filter += cutoff * (exhaust - exhaust_filter)
    bass = math.sin(phase / 2) * .24 + math.sin(math.tau * 38 * t) * .10
    flutter = 1 + .055 * math.sin(t * 23) + .035 * math.sin(t * 67)
    # Ao longe só se ouve um zumbido; o volume cresce como 1/distância perto do impacto (p ≈ 0,61).
    amp = (.025 + .1 * p ** 1.5 + .3 * p ** 3.2 + .12 * p ** 7) * min(1, t / 1.2)
    value = amp * (exhaust_filter + bass) * flutter
    delayed = history[cursor]
    history[cursor] = value
    cursor = (cursor + 1) % len(history)
    spread = .11 * p ** 2
    return value * (1 - spread) + delayed * spread, value * (1 - spread * 1.5) + delayed * spread * 1.5


write('engine', ENGINE_DURATION, engine)
wind_l = 0
wind_r = 0


def wind(t):
    global wind_l, wind_r
    p = t / 3.9
    wind_l += .10 * (random.uniform(-1, 1) - wind_l)
    wind_r += .10 * (random.uniform(-1, 1) - wind_r)
    envelope = .005 * p + .29 * p ** 4.5
    return wind_l * envelope, wind_r * envelope


write('wind', 3.9, wind)
impact_low = 0


def impact(t):
    # Papel tensionado cedendo: um "puf" abafado de ar e um estalo seco, sem o estrondo grave de antes.
    global impact_low
    noise = random.uniform(-1, 1)
    impact_low += .32 * (noise - impact_low)
    snap = (noise - impact_low) * .55 * math.exp(-t * 70)
    puff = impact_low * .5 * math.exp(-t * 18)
    thud = math.sin(math.tau * 85 * t) * .16 * math.exp(-t * 22)
    value = (snap + puff + thud) * min(1, t * 2400)
    return value * .74, value * .70


write('impact', .8, impact)
tear_low = 0


tear_rng = random.Random(77)
CRACKLES = sorted(tear_rng.uniform(0, .42) for _ in range(70))
FLAPS = [.06, .1, .15, .21, .27, .34, .45]


def tear(t):
    global tear_low
    noise = random.uniform(-1, 1)
    tear_low += .14 * (noise - tear_low)
    high = noise - tear_low  # ruído agudo: o atrito das fibras
    # Rasgo principal: rápido no começo, arrastado no fim, com a aspereza irregular de papel.
    body = .2 * math.exp(-t * 7) * (.45 + .55 * abs(math.sin(t * 97 + math.sin(t * 31) * 3)))
    crackle = sum(.22 * math.exp(-((t - at) / .0016) ** 2) for at in CRACKLES if abs(t - at) < .01)
    rip = high * (body + crackle * math.exp(-t * 4))
    # Abas batendo para fora e tiras esvoaçando (abafado, com o ar).
    flaps = sum(.09 * math.exp(-((t - at) / .012) ** 2) for at in FLAPS)
    flutter = tear_low * .1 * max(0, math.sin(t * 38)) * math.exp(-max(0, t - .3) * 2.6) * min(1, t / .25)
    v = (rip + tear_low * flaps * 2 + flutter) * min(1, t * 2000)
    pan = math.sin(t * 24) * .4
    return v * (1 - pan), v * (1 + pan)


write('tear', 1.5, tear)
stretch_low = 0
stretch_rng = random.Random(55)


def stretch(t):
    # 0,20 s de papel esticando: rangido que sobe de tom e estalos de fibra cada vez mais frequentes.
    global stretch_low
    p = t / .2
    noise = stretch_rng.uniform(-1, 1)
    stretch_low += (.05 + .25 * p) * (noise - stretch_low)
    creak = stretch_low * (.08 + .3 * p ** 2)
    tick = (noise * .5) if stretch_rng.random() < .002 + .02 * p ** 2 else 0
    v = (creak + tick) * min(1, t / .02)
    return v * .9, v


write('stretch', .2, stretch)


# Short mechanical starter pulses, combustion catch, then a heavy rising rev.
# A separate stem keeps the ignition editable without changing the approach.
startup_rng = random.Random(301)
startup_phase = 0
startup_low = 0


def startup(t):
    global startup_phase, startup_low
    noise = startup_rng.uniform(-1, 1)
    startup_low += .14 * (noise - startup_low)
    catch = max(0, t - .24)
    hz = 24 + 55 * min(1, t / .3) + 80 * min(1, catch / .6)
    startup_phase += math.tau * hz / SR
    crank_gate = max(0, math.sin(math.tau * 17 * t)) ** 5
    crank = (.10 * noise + .22 * math.sin(startup_phase)) * crank_gate * max(0, 1 - t / .32)
    envelope = min(1, catch / .035) * math.exp(-catch * 2.8)
    combustion = math.tanh(sum(math.sin(startup_phase * h) / h for h in range(1, 8)) * 2)
    growl = (combustion * .40 + math.sin(startup_phase / 2) * .18 + startup_low * .23) * envelope
    thump = math.sin(math.tau * 54 * catch) * .13 * math.exp(-catch * 15) if catch > 0 else 0
    tail = min(1, max(0, (1.1 - t) / .18))
    value = (crank + growl + thump) * min(1, t / .008) * tail
    return value * .93, value


write('startup', 1.1, startup)
