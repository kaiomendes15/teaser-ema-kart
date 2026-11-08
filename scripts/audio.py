"""Deterministic stereo sound design. Regenerate: python3 scripts/audio.py."""
import math, random, wave, struct
from pathlib import Path
sr=48000
random.seed(81)
Path('public/audio').mkdir(exist_ok=True)
def write(name,duration,fn):
 with wave.open('public/audio/'+name+'.wav','wb') as w:
  w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr)
  data=bytearray()
  for i in range(round(duration*sr)):
   a,b=fn(i/sr)
   data.extend(struct.pack('<hh',int(max(-.98,min(.98,a))*32767),int(max(-.98,min(.98,b))*32767)))
  w.writeframes(data)
phase=0
low=0
def engine(t):
 global phase,low
 p=min(1,t/7.2); hz=(42+145*p*p)*(1-.36*max(0,(t-6.85)/.35))
 phase+=2*math.pi*hz/sr
 low=.93*low+.07*random.uniform(-1,1)
 amp=.012+.40*p**2.4
 v=amp*(.5*math.sin(phase)+.23*math.sin(phase*2)+.12*math.sin(phase*4)+low*.5)*(1+.11*math.sin(phase/2))
 return v*(1-.15*p),v*(1+.15*p)
write('engine',7.2,engine)
low=0
def wind(t):
 global low
 n=random.uniform(-1,1);low=.96*low+.04*n
 v=(n-low)*.18*(t/7.2)**3
 return v, v*.83
write('wind',7.2,wind)
def shards(t):
 v=sum(math.sin(2*math.pi*f*t)*math.exp(-t*(5+k)) for k,f in enumerate([1801,2677,3907,5311]))*.08
 v+=random.uniform(-1,1)*.32*math.exp(-t*14)
 return v,v*.85
write('shards',1,shards)
def impact(t):
 v=(math.sin(2*math.pi*(90*t-120*t*t))*.65+random.uniform(-1,1)*.22)*math.exp(-t*38)*min(1,t*1500)
 return v,v
write('impact',.1,impact)
