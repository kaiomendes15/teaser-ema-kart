"""Original deterministic adventure underscore and synchronized comic foley.
Regenerate only this composition's audio: python3 scripts/comic-audio.py.
No external music, voice imitation or sounds from the GTA teaser are used.
"""
import math, random, struct, wave
from pathlib import Path
SR=48000
ROOT=Path(__file__).resolve().parent.parent/'public/audio/comic'
ROOT.mkdir(parents=True,exist_ok=True)
rng=random.Random(73)
TAU=math.tau

def write(name,duration,fn):
    data=bytearray(); peak=0
    for i in range(round(duration*SR)):
        t=i/SR
        l,r=fn(t)
        # Very short edge ramps prevent clicks when a panel cuts to the next.
        edge=min(1,t/.006,max(0,(duration-t)/.016))
        l*=edge;r*=edge
        peak=max(peak,abs(l),abs(r))
        data.extend(struct.pack('<hh',round(max(-.98,min(.98,l))*32767),round(max(-.98,min(.98,r))*32767)))
    with wave.open(str(ROOT/(name+'.wav')),'wb') as f:
        f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes(data)
    print(name,'peak',round(peak,3))

def note(midi):return 440*2**((midi-69)/12)

def adventure(t):
    # 144 BPM, a pentatonic motif over a rising C minor / Ab / Fm / G cadence.
    beat=60/144
    roots=[48,44,41,43]
    chord=roots[min(3,int(t/6))]
    gate=(t%beat)/beat
    bass=math.sin(TAU*note(chord-12)*t)*math.exp(-gate*5)*.038
    strings=sum(math.sin(TAU*note(chord+v)*t+math.sin(t*4)*.014) for v in [0,7,15])*.009
    motif=[72,75,79,82,79,75,77,79,75,72,70,67]
    step=int(t/(beat/2));age=t%(beat/2)
    melody=note(motif[step%len(motif)])
    pluck=(math.sin(TAU*melody*t)+.3*math.sin(TAU*melody*2*t)+.13*math.sin(TAU*melody*3*t))*math.exp(-age*13)*min(1,age/.008)*.032
    kick=math.sin(TAU*(52*gate*beat+1.7*(1-math.exp(-gate*25))))*math.exp(-gate*19)*.055
    hat=rng.uniform(-1,1)*math.exp(-(t%(beat/2))*70)*.013
    swell=.4+.6*min(1,t/20)
    hit=math.sin(TAU*65*(t-20.5))*math.exp(-(t-20.5)*5)*.07 if t>=20.5 else 0
    env=min(1,t/.65)*min(1,(24-t)/.09)
    core=(bass+strings+pluck+kick+hat)*swell+hit
    return (core+math.sin(TAU*note(chord+19)*t)*.006)*env,(core+math.sin(TAU*note(chord+12)*t)*.006)*env
write('adventure',24,adventure)

low=0

def noise():
    global low
    n=rng.uniform(-1,1);low+=.12*(n-low)
    return n,low

def page(t):
    n,l=noise();env=math.sin(math.pi*t/.3)**2
    return (n-l)*env*.13,(n-l)*env*.10
write('page',.3,page)

def book(t):
    n,l=noise()
    rustle=(n-l)*math.exp(-t*16)*.10
    impact=0
    if t>.18:
        a=t-.18;impact=(math.sin(TAU*(95*a-90*a*a))*.22+l*.14)*math.exp(-a*19)
    surprise=math.sin(TAU*(550*t+500*t*t))*.045*math.exp(-t*8)
    return rustle+impact+surprise,rustle*.8+impact+surprise
write('book',.65,book)

def energy(t):
    n,l=noise();p=t/3.1
    crack=max(0,math.sin(t*133))**12
    v=(math.sin(TAU*(95*t+170*t*t))*.05+math.sin(TAU*(280*t+430*t*t))*.018+(n-l)*crack*.10)*min(1,t*8)
    return v*(.7+.3*math.sin(t*9)),v*(.7-.3*math.sin(t*9))
write('energy',3.1,energy)

def reveal(t):
    n,l=noise();env=math.sin(math.pi*t/.7)**1.2
    v=l*.35*env+math.sin(TAU*(100*t-45*t*t))*.12*math.exp(-t*7)
    return v,v*.93
write('reveal',.7,reveal)

def roots(t):
    n,l=noise();pulses=sum(math.exp(-((t-at)/.035)**2) for at in [.06,.23,.49,.72,.98,1.21,1.48,1.76,2.03,2.31])
    v=(l*.45+math.sin(TAU*43*t)*.16)*pulses+(n-l)*pulses*.035
    return v,v*.87
write('roots',2.5,roots)

def vortex(t):
    n,l=noise();env=math.sin(math.pi*t/2.5)
    v=l*.30*env+(n-l)*.025*env
    pan=math.sin(t*11)*.45
    return v*(1-pan),v*(1+pan)
write('vortex',2.5,vortex)

def water(t):
    n,l=noise();env=min(1,t*12)*(.55+.45*math.sin(t*14)**2)
    bubbles=math.sin(TAU*(330*t+30*math.sin(t*18)))*.015
    return l*.36*env+bubbles,l*.28*env-bubbles
write('water',2.5,water)

phase=0

def karts(t):
    global phase
    p=t/3.5;phase+=TAU*(48+115*p*p)/SR
    n,l=noise()
    v=(math.tanh(math.sin(phase)+math.sin(phase*2)*.4)*.16+math.sin(phase/2)*.05+l*.08)*(.2+.8*p*p)
    return v*.93,v
write('karts',3.5,karts)


# Alternating heel/toe contacts on campus paving, every half second.
def footsteps(t):
    n,l=noise()
    a=t%.5
    heel=(l*.45+math.sin(TAU*105*a)*.10)*math.exp(-a*55)
    toe=(n-l)*.04*math.exp(-max(0,a-.08)*50) if a>.08 else 0
    index=int(t/.5)
    value=heel+toe
    return value*(.8 if index%2 else 1), value*(1 if index%2 else .8)
write('footsteps',3.75,footsteps)
