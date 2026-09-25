# Brand: the watkorn yeti

The mascot as a **layered vector**: every part has its own colour, so it can be recoloured, put on any background, or left transparent.

**▶ Open [`lab.html`](lab.html) in a browser** (double-click it) to pick a palette, change each colour, choose a background, and download SVG or PNG.

## Files

| Path | What |
|---|---|
| `yeti.svg` | Master vector. 8 layers, each coloured by a CSS variable (below). Transparent. |
| `palettes.json` | The 6 named palettes (hex), including each one's default background colour. |
| `svg/` | Ready-made SVGs: `yeti-<palette>.svg` (transparent) and `avatar-<palette>-circle.svg`. |
| `png/` | 1024 px PNGs of the same (transparent or circle). Good for GitHub, LinkedIn, TryHackMe or Discord avatars. |
| `lab.html` | The Logo Lab (generated; don't edit by hand). |
| `lab.template.html` + `build_lab.py` | Source of the Lab. Rebuild with `python3 brand/build_lab.py`. |
| `source/` | The original raster artwork the vector was traced from. |

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
<Yeti bg="circle" crop="head" />           // header-style badge
<Yeti bg="screen" palette="lcd" />         // pinned palette, handheld-screen background
<Yeti palette="ink" title="watkorn yeti" />// with an accessible name
```

- `palette`: omit it to follow the theme, or use `snow` · `dandelion` · `night` · `lcd` · `berry` · `ink`.
- `bg`: `none` (transparent) · `circle` · `screen` · `square`.
- `crop`: `full` · `head` (use `head` at small sizes).
- Any single colour can be overridden with CSS, e.g. `.my-yeti { --yeti-skin: hotpink; --yeti-bg: black; }`.

Theme defaults are set in `src/styles/tokens.css` and palette classes in `src/styles/yeti.css`.

## Provenance

`yeti.svg` was traced from `source/yeti-original-light.png` (the owner's original mascot artwork): colour-quantised into 8 layers, with the teeth split out into their own layer, then vectorised with VTracer. The PNGs in `png/` and `public/` are rendered from that SVG. No generated imagery is involved.
