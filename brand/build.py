#!/usr/bin/env python3
"""Regenerate every yeti asset from brand/yeti_sprite.py + brand/palettes.json.

    pip install numpy pillow
    python3 brand/build.py

Writes:
  brand/yeti.svg              master sprite (2 walk frames as <symbol>s, colours = CSS vars)
  src/assets/yeti.svg         same file, used by src/components/Yeti.jsx
  brand/svg/*.svg             baked-colour SVGs per palette (transparent + circle avatar)
  brand/png/*.png, *.gif      1024px PNGs + animated walk GIFs per palette
  public/favicon.svg          theme-aware favicon (light/dark)
  public/favicon-32.png, apple-touch-icon.png, icon-512.png
  public/og.png               1200x630 link-preview image (Open Graph / Twitter)
  brand/lab.html              the Logo Lab (from lab.template.html)
"""
import json
import pathlib
import sys

import numpy as np
import urllib.request

from PIL import Image, ImageDraw, ImageFont

BRAND = pathlib.Path(__file__).resolve().parent
ROOT = BRAND.parent
sys.path.insert(0, str(BRAND))
import yeti_sprite as sprite  # noqa: E402

N = sprite.N
ORDER = ["fur", "fur-shade", "skin", "skin-deep", "face", "face-shade", "teeth", "line"]
LAYER_ID = {name: i for i, name in sprite.NAMES.items()}
PALETTES = json.loads((BRAND / "palettes.json").read_text())["palettes"]
FRAMES = [sprite.build(0), sprite.build(1)]
SITE_BG = "#2A2E45"  # bezel colour used behind app icons


# ---------- SVG ----------
def runs(mask):
    """Merge each row's pixels into horizontal runs -> compact path data."""
    d = []
    for y in range(N):
        x = 0
        while x < N:
            if mask[y, x]:
                s = x
                while x < N and mask[y, x]:
                    x += 1
                d.append(f"M{s} {y}h{x - s}v1h-{x - s}z")
            else:
                x += 1
    return "".join(d)


LAYER_PATHS = [{n: runs(g == LAYER_ID[n]) for n in ORDER} for g in FRAMES]


def paths_svg(frame, colors=None):
    out = []
    for n in ORDER:
        d = LAYER_PATHS[frame][n]
        if not d:
            continue
        fill = f'fill="{colors[n]}"' if colors else f'style="fill:var(--yeti-{n},{PALETTES["snow"][n]})"'
        out.append(f'<path {fill} d="{d}"/>')
    return "".join(out)


SHAPES = {
    "circle": "M50 0A50 50 0 1 1 50 100A50 50 0 1 1 50 0Z",
    "screen": "M10 0H90A10 10 0 0 1 100 10V70A30 30 0 0 1 70 100H10A10 10 0 0 1 0 90V10A10 10 0 0 1 10 0Z",
    "square": "M22 0H78A22 22 0 0 1 100 22V78A22 22 0 0 1 78 100H22A22 22 0 0 1 0 78V22A22 22 0 0 1 22 0Z",
}
INSET = {"none": 0, "circle": 14, "screen": 8, "square": 10}


def baked_svg(palette, bg="none"):
    c = PALETTES[palette]
    i = INSET[bg]
    inner = 100 - 2 * i
    shape = f'<path fill="{c["bg"]}" d="{SHAPES[bg]}"/>' if bg != "none" else ""
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512">'
        f'{shape}<svg x="{i}" y="{i}" width="{inner}" height="{inner}" viewBox="0 0 {N} {N}" shape-rendering="crispEdges">'
        f"{paths_svg(0, c)}</svg></svg>"
    )


def master_svg():
    desc = (
        "watkorn yeti, 32x32 pixel sprite. Symbols: yeti (frame 1) and yeti-step (frame 2 of the walk cycle). "
        "Recolour each layer with the CSS custom properties yeti-fur, yeti-fur-shade, yeti-skin, yeti-skin-deep, "
        "yeti-face, yeti-face-shade, yeti-teeth and yeti-line (each prefixed with two hyphens). See brand/README.md."
    )
    syms = "".join(
        f'<symbol id="{sid}" viewBox="0 0 {N} {N}">{paths_svg(f)}</symbol>' for f, sid in enumerate(["yeti", "yeti-step"])
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {N} {N}" width="512" height="512" '
        f'shape-rendering="crispEdges" role="img" aria-label="watkorn yeti"><desc>{desc}</desc>'
        # CTF level 5 ("Pixel secrets"): a base64 flag rides along in the sprite's metadata
        '<metadata>yeti-says: d2F0a29ybntwMXgzbHNfYzRuX2gxZDNfc3Q0ZmZfdDAwfQ==</metadata>'
        f'{syms}<use href="#yeti"/></svg>'
    )


def favicon_svg():
    def rules(p):
        return "".join(f".{n}{{fill:{PALETTES[p][n]}}}" for n in ORDER)

    body = "".join(f'<path class="{n}" d="{LAYER_PATHS[0][n]}"/>' for n in ORDER if LAYER_PATHS[0][n])
    css = rules("dandelion") + "@media (prefers-color-scheme:dark){" + rules("night") + "}"
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {N} {N}" shape-rendering="crispEdges">'
        f"<style>{css}</style>{body}</svg>"
    )


# ---------- raster ----------
def hex_rgba(h, a=255):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4)) + (a,)


def sprite_image(frame, palette):
    img = np.zeros((N, N, 4), np.uint8)
    for n in ORDER:
        img[FRAMES[frame] == LAYER_ID[n]] = hex_rgba(PALETTES[palette][n])
    return Image.fromarray(img, "RGBA")


def shape_mask(bg, size):
    """Anti-aliased background shape (drawn 4x, then downsampled)."""
    ss = size * 4
    m = Image.new("L", (ss, ss), 0)
    d = ImageDraw.Draw(m)
    if bg == "circle":
        d.ellipse([0, 0, ss - 1, ss - 1], fill=255)
    elif bg == "square":
        d.rounded_rectangle([0, 0, ss - 1, ss - 1], radius=int(ss * 0.22), fill=255)
    elif bg == "screen":
        r1, r2 = int(ss * 0.10), int(ss * 0.30)
        d.rounded_rectangle([0, 0, ss - 1, ss - 1], radius=r1, fill=255)
        d.rectangle([ss - r2, ss - r2, ss, ss], fill=0)
        d.pieslice([ss - 2 * r2, ss - 2 * r2, ss - 1, ss - 1], 0, 90, fill=255)
    return m.resize((size, size), Image.LANCZOS)


def raster(palette, size, scale, bg="none", bg_color=None, frame=0):
    """Sprite scaled by an integer factor (stays crisp), centred on an optional shape."""
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    if bg != "none":
        fill = Image.new("RGBA", (size, size), hex_rgba(bg_color or PALETTES[palette]["bg"]))
        out.paste(fill, (0, 0), shape_mask(bg, size))
    s = sprite_image(frame, palette).resize((N * scale, N * scale), Image.NEAREST)
    off = (size - N * scale) // 2
    out.alpha_composite(s, (off, off))
    return out


def walk_gif(palette, path, scale=16):
    frames = [raster(palette, N * scale, scale, frame=f) for f in (0, 1)]
    frames[0].save(path, save_all=True, append_images=frames[1:], duration=280, loop=0, disposal=2)


# ---------- Open Graph image ----------
FONT_CACHE = BRAND / "fonts" / "Mali-Bold.ttf"  # gitignored; Mali is SIL OFL 1.1


def mali_bold():
    if not FONT_CACHE.exists():
        FONT_CACHE.parent.mkdir(exist_ok=True)
        css = urllib.request.urlopen(
            urllib.request.Request(
                "https://fonts.googleapis.com/css2?family=Mali:wght@700", headers={"User-Agent": "Mozilla/4.0"}
            ),
            timeout=30,
        ).read().decode()
        url = css.split("url(")[1].split(")")[0]
        FONT_CACHE.write_bytes(urllib.request.urlopen(url, timeout=30).read())
    return str(FONT_CACHE)


def og_image():
    W, H = 1200, 630
    shell, bezel, ink, berry = "#F2D54C", "#2A2E45", "#2A1B0E", "#C42A50"
    img = Image.new("RGBA", (W, H), hex_rgba(shell))
    # the yeti on a handheld "screen" on the left
    card = 470
    img.alpha_composite(raster("dandelion", card, 13, "screen", bezel), (70, (H - card) // 2))
    d = ImageDraw.Draw(img)
    font = mali_bold()
    d.text((600, 150), "find the", font=ImageFont.truetype(font, 104), fill=hex_rgba(ink))
    d.text((600, 262), "flag.", font=ImageFont.truetype(font, 104), fill=hex_rgba(ink))
    d.text((604, 408), "CTF writeups · security tools", font=ImageFont.truetype(font, 34), fill=hex_rgba(ink))
    d.text((604, 470), "WATKORN.ME", font=ImageFont.truetype(font, 40), fill=hex_rgba(berry))
    img.convert("RGB").save(ROOT / "public/og.png", optimize=True)


# ---------- lab ----------
def build_lab():
    data = {"size": N, "order": ORDER, "frames": LAYER_PATHS, "palettes": PALETTES}
    tpl = (BRAND / "lab.template.html").read_text()
    (BRAND / "lab.html").write_text(tpl.replace("__DATA__", json.dumps(data)))


def main():
    (BRAND / "svg").mkdir(exist_ok=True)
    (BRAND / "png").mkdir(exist_ok=True)

    master = master_svg()
    (BRAND / "yeti.svg").write_text(master)
    (ROOT / "src/assets/yeti.svg").write_text(master)
    (ROOT / "public/favicon.svg").write_text(favicon_svg())

    raster("dandelion", 32, 1).save(ROOT / "public/favicon-32.png")
    raster("dandelion", 180, 5, "square", SITE_BG).save(ROOT / "public/apple-touch-icon.png")
    raster("dandelion", 512, 14, "screen", SITE_BG).save(ROOT / "public/icon-512.png")
    og_image()

    for name in PALETTES:
        (BRAND / f"svg/yeti-{name}.svg").write_text(baked_svg(name))
        (BRAND / f"svg/avatar-{name}-circle.svg").write_text(baked_svg(name, "circle"))
        raster(name, 1024, 32).save(BRAND / f"png/yeti-{name}.png")
        raster(name, 1024, 24, "circle").save(BRAND / f"png/avatar-{name}-circle.png")
        walk_gif(name, BRAND / f"png/yeti-{name}-walk.gif")

    build_lab()
    print(f"built: master svg ({len(master)} bytes), {len(PALETTES)} palettes, icons, lab")


if __name__ == "__main__":
    main()
