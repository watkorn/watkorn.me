# Brand: the watkorn yeti

The mascot is a **32×32 pixel sprite**, a handheld-game character that fits the site's Handheld Quest design (its face is a little screen). Every part is its own layer, so it can be recoloured, put on any background, or left transparent. It has a 2-frame walk cycle.

**▶ Open [`lab.html`](lab.html) in a browser** (double-click it) to pick a palette, change each colour, choose a background, and download SVG or PNG.

## Files

| Path | What |
|---|---|
| `yeti.svg` | Master sprite. Two `<symbol>`s (`#yeti`, `#yeti-step`), 8 layers each coloured by a CSS variable (below). Transparent. |
| `yeti_sprite.py` | **The source.** The sprite drawn in code (shapes + auto outlines). Edit this to change the character. |
| `build.py` | Regenerates everything below from the source: `pip install numpy pillow && python3 brand/build.py`. |
| `palettes.json` | The 6 named palettes (hex), including each one's default background colour. |
| `svg/` | Ready-made SVGs: `yeti-<palette>.svg` (transparent) and `avatar-<palette>-circle.svg`. |
| `png/` | 1024 px PNGs (transparent or circle) plus `yeti-<palette>-walk.gif` animated walk cycles. Good for GitHub, LinkedIn, TryHackMe or Discord avatars. |
| `lab.html` | The Logo Lab (generated from `lab.template.html`; don't edit by hand). |
| `classic/yeti-classic.svg` | The previous, hand-drawn-style yeti (a vector traced from `source/`), kept for reference. It uses the same CSS variables. |
| `source/` | The original raster artwork. |

Site icons live in `public/`: `favicon.svg` (switches with the visitor's light/dark mode), `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` and `site.webmanifest`.

## Layers and CSS variables

Painted bottom to top:

| Layer | Variable | Snow (original) |
|---|---|---|
| fur | `--yeti-fur` | `#F8F2DF` |
| fur shading | `--yeti-fur-shade` | `#C6D3CB` |
| hands, feet, ears | `--yeti-skin` | `#287191` |
| skin shadow, mouth | `--yeti-skin-deep` | `#115E7C` |
| face panel | `--yeti-face` | `#A7C4CC` |
| face shading | `--yeti-face-shade` | `#76A0B0` |
| teeth | `--yeti-teeth` | `#FFFBEF` |
| outline, eyes | `--yeti-line` | `#06374B` |
| background (component only) | `--yeti-bg` | `#0E2F3E` |

## Palettes

| Name | Mood | Used for |
|---|---|---|
| `snow` | The original blue-and-cream yeti | Classic avatar |
| `dandelion` | Cream fur, grape hands | **Site light theme** (on a dark bezel) |
| `night` | Grape fur, pear hands | **Site dark theme** |
| `lcd` | Game Boy 4-tone green | Retro/LCD moments |
| `berry` | Pink and berry | Matches the A button |
| `ink` | Black on white | Stamps, stickers, one-colour print |

## Using it in the site

```jsx
import Yeti from "../components/Yeti";

<Yeti />                                   // follows the site theme, transparent
<Yeti bg="circle" />                       // header-style badge
<Yeti bg="screen" palette="lcd" walk />    // pinned palette, handheld-screen background, walking
<Yeti palette="ink" title="watkorn yeti" />// with an accessible name
```

- `palette`: omit it to follow the theme, or use `snow` · `dandelion` · `night` · `lcd` · `berry` · `ink`.
- `bg`: `none` (transparent) · `circle` · `screen` · `square`.
- `walk`: `true` loops the 2-frame walk (it is switched off for people with reduced motion). On the site the yeti walks when you hover it, and after you find the flag.
- Any single colour can be overridden with CSS, e.g. `.my-yeti { --yeti-skin: hotpink; --yeti-bg: black; }`.

Theme defaults are set in `src/styles/tokens.css` and palette classes in `src/styles/yeti.css`.

## Provenance

- **The pixel yeti** is drawn in code in `yeti_sprite.py`: an original sprite based on the owner's mascot (white fur, blue face panel, angry brows, toothy mouth, walking pose). Every PNG, GIF and SVG in `png/`, `svg/` and `public/` is rendered from it by `build.py`. No generated imagery is involved.
- **The classic yeti** (`classic/`) was traced from `source/yeti-original-light.png`: colour-quantised into 8 layers, with the teeth split out into their own layer, then vectorised with VTracer.
