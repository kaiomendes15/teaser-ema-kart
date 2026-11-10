"""Deterministic 48 kHz stereo design; preserves the original supplied assets.

Engine and startup start at 5.35 s, wind at 5.60 s, impact and tear at 7.15 s.
All audio must be unmounted at 8.45 seconds: the collision cut is silent.
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


def engine(t):
    global phase, low_noise, exhaust_filter, cursor
    p = t / 3.1
    # Combustion frequency climbs from distant idle into a high kart whine.
    hz = 46 + 180 * p ** 1.28 + 4 * math.sin(t * 7) * p
    phase += math.tau * hz / SR
    noise = random.uniform(-1, 1)
    low_noise += .09 * (noise - low_noise)
    exhaust = sum(math.sin(phase * h + .12 * math.sin(phase / 2)) / h ** .85 for h in range(1, 10))
    exhaust = math.tanh(exhaust * 1.7) * .58 + low_noise * .26
    # Low-pass distance occlusion steadily opens as the kart approaches.
    cutoff = .035 + .6 * p ** 1.8
    exhaust_filter += cutoff * (exhaust - exhaust_filter)
    bass = math.sin(phase / 2) * .24 + math.sin(math.tau * 38 * t) * .10
    flutter = 1 + .055 * math.sin(t * 23) + .035 * math.sin(t * 67)
    amp = (.04 + .32 * p ** 2 + .16 * p ** 7) * min(1, t / .14)
    value = amp * (exhaust_filter + bass) * flutter
    delayed = history[cursor]
    history[cursor] = value
    cursor = (cursor + 1) % len(history)
    spread = .11 * p ** 2
    return value * (1 - spread) + delayed * spread, value * (1 - spread * 1.5) + delayed * spread * 1.5


write('engine', 3.1, engine)
wind_l = 0
wind_r = 0


def wind(t):
    global wind_l, wind_r
    p = t / 2.85
    wind_l += .10 * (random.uniform(-1, 1) - wind_l)
    wind_r += .10 * (random.uniform(-1, 1) - wind_r)
    envelope = .005 * p + .29 * p ** 4.5
    return wind_l * envelope, wind_r * envelope


write('wind', 2.85, wind)
impact_low = 0


def impact(t):
    global impact_low
    noise = random.uniform(-1, 1)
    impact_low += .25 * (noise - impact_low)
    boom = math.sin(math.tau * (59 * t + 3.3 * (1 - math.exp(-t * 23))))
    value = (boom * .68 * math.exp(-t * 9) + impact_low * .65 * math.exp(-t * 29)) * min(1, t * 1600)
    return value * .72, value * .70


write('impact', .8, impact)
tear_low = 0


def tear(t):
    global tear_low
    noise = random.uniform(-1, 1)
    tear_low += .14 * (noise - tear_low)
    rip = (noise - tear_low) * .16 * math.exp(-t * 12)
    rip *= .4 + .6 * abs(math.sin(t * 105))
    flaps = sum(math.exp(-((t - at) / .015) ** 2) * .055 for at in [.07, .12, .2, .29, .43, .62])
    v = (rip + tear_low * flaps) * min(1, t * 2000)
    pan = math.sin(t * 24) * .4
    return v * (1 - pan), v * (1 + pan)


write('tear', 1.5, tear)


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
