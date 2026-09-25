"""The watkorn yeti as a 32x32 pixel sprite (Handheld Quest style).

build(frame) returns a 32x32 grid of layer ids. frame 0 = stride, frame 1 = passing
(feet together, body bobbed up 1px), which together make a 2-frame walk cycle.
Every pixel belongs to one of 8 layers, so each layer can be recoloured on its own.
Edit the shapes below, then run `python3 brand/build.py` to regenerate everything.
"""
import numpy as np

N = 32
E,LINE,FUR,SHADE,SKIN,DEEP,FACE,FSH,TEETH=0,1,2,3,4,5,6,7,8
NAMES={LINE:'line',FUR:'fur',SHADE:'fur-shade',SKIN:'skin',DEEP:'skin-deep',FACE:'face',FSH:'face-shade',TEETH:'teeth'}
yy,xx=np.mgrid[0:N,0:N]
def ell(g,cx,cy,rx,ry,v,m=None):
    k=((xx-cx+.5)/rx)**2+((yy-cy+.5)/ry)**2<=1
    if m is not None: m|=k
    g[k]=v; return k
def rect(g,x0,y0,x1,y1,v):
    g[y0:y1+1,x0:x1+1]=v
    k=np.zeros((N,N),bool); k[y0:y1+1,x0:x1+1]=True; return k
def px(g,pts,v):
    for x,y in pts: g[y,x]=v
def nb(mask):
    r=np.zeros_like(mask)
    r[1:,:]|=mask[:-1,:]; r[:-1,:]|=mask[1:,:]; r[:,1:]|=mask[:,:-1]; r[:,:-1]|=mask[:,1:]
    return r
def build(frame=0):
    g=np.zeros((N,N),int)
    b=-1 if frame==1 else 0   # body bob
    parts=[]  # skin parts (feet, hands, ear) that get their own inner outline
    # --- legs + feet (behind body)
    if frame==0:
        rect(g,8,20,11,25,FUR); parts.append(rect(g,4,25,11,28,SKIN))
        rect(g,17,20,20,25,FUR); parts.append(rect(g,17,25,24,28,SKIN))
    else:
        rect(g,10,20,13,25,FUR); parts.append(rect(g,7,25,13,28,SKIN))
        rect(g,16,20,19,25,FUR); parts.append(rect(g,16,25,22,28,SKIN))
    # --- back arm + mitten
    ell(g,8,15+b,3.2,2.6,FUR)
    parts.append(ell(g,5,18+b,3,2.6,SKIN))
    # --- body
    ell(g,15,13+b,8.5,9.5,FUR)
    px(g,[(14,2+b),(15,1+b),(16,1+b),(16,2+b),(17,2+b),(13,3+b),(18,3+b)],FUR)   # tuft
    # --- ear
    parts.append(ell(g,8,9+b,2.2,2.2,SKIN))
    # --- front arm + fist
    ell(g,24,16+b,3.4,2.2,FUR)
    parts.append(ell(g,28,15+b,3,3,SKIN))
    # carve inner outline around each skin part (on the skin side, where it touches fur)
    furm=(g==FUR)
    allp=np.zeros((N,N),bool)
    for p in parts: allp|=p
    for p in parts:
        edge=p&(nb(furm&~p)|nb(allp&~p))
        g[edge]=LINE
    # skin shading: bottom row of each skin part -> deep
    sk=(g==SKIN); d=sk&~np.roll(sk,-1,0); g[d]=DEEP
    # knuckles on fist
    px(g,[(28,14+b),(28,16+b)],LINE)
    # --- face panel with its own dark frame
    face=rect(g,15,5+b,26,15+b,FACE)
    for c in [(15,5+b),(26,5+b),(15,15+b),(26,15+b)]: g[c[1],c[0]]=FUR  # rounded corners
    face=(g==FACE)
    frame_=face&nb(~face); g[frame_]=LINE
    inner=(g==FACE)
    # face shading: left + bottom inner rim
    lr=inner&~np.roll(inner,1,1); br=inner&~np.roll(inner,-1,0); g[lr|br]=FSH
    # mouth
    rect(g,18,10+b,24,13+b,DEEP)
    px(g,[(18,10+b),(20,10+b),(22,10+b),(24,10+b)],TEETH)
    px(g,[(19,13+b),(21,13+b),(23,13+b)],TEETH)
    # eyes + angry brows
    px(g,[(18,8+b),(23,8+b)],LINE)
    px(g,[(17,7+b),(18,7+b),(23,7+b),(24,7+b)],LINE)
    # --- fur shading: left + bottom rim of fur
    furm=(g==FUR)
    sh=furm&(~np.roll(furm,1,1)|~np.roll(furm,-1,0)); g[sh]=SHADE
    px(g,[(11,8+b),(12,13+b),(10,17+b),(14,18+b),(19,19+b)],SHADE)
    # --- outer outline
    filled=g>0
    g[nb(filled)&~filled]=LINE
    return g
