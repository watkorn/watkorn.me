# Changelog

All notable changes to this site are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- **New pixel yeti:** the mascot redrawn as a 32×32 handheld-game sprite whose face is a little screen. It has a 2-frame walk cycle and follows the site theme, and it walks on hover and when you find the flag. 6 palettes (snow, dandelion, night, lcd, berry, ink) and optional circle, handheld-screen or square backgrounds.
- `Yeti` React component, used in the header, the home avatar and the About dialog.
- `brand/yeti_sprite.py` + `brand/build.py`: one command regenerates the master SVG, icons, exports and Logo Lab.
- **Logo Lab** (`brand/lab.html`): recolour the yeti, pick a background, preview the walk, and download SVG or PNG.
- Ready-made SVG and PNG exports and animated walk GIFs in `brand/svg` and `brand/png`.
- The previous yeti, as a recolourable traced vector, kept in `brand/classic/`.
- New favicon set: an SVG favicon that switches with light/dark mode, a 32px PNG, an Apple touch icon, a 512px icon and a web manifest.

### Changed
- Replaced the 1536×1024 `favicon.png` (674 KB) with properly sized icons.
- Moved the original mascot PNGs to `brand/source/`.

## [1.0.0] - 2026-09-25

First release in this repository.

### Added
- **Handheld Quest** design: console-shell theme in light (dandelion) and dark (grape), LCD terminal, rubber push buttons, Start/Select navigation, and a power-switch theme toggle.
- Blog posts and projects written in **Markdown** (`content/blogs`, `content/projects`) with frontmatter, drafts, reading time, and syntax-highlighted code blocks.
- `npm run new-post -- "Title"` to scaffold a post.
- Terminal quality of life: command history (↑/↓), Tab completion, `Ctrl+L` to clear, tap-anywhere focus, and quick-command buttons for phones.
- "Achievement unlocked" toast when you find the flag.
- Copy buttons on code blocks, a reading progress bar, older/newer post navigation, and a 404 page.
- Theme follows the OS setting on first visit, with no flash of the wrong theme.
- GitHub Actions: build and deploy to the `gh-pages` branch on every push to `main`; create a GitHub Release when a `v*` tag is pushed.
- Hallmark and Impeccable design skills for Claude Code in `.claude/skills/`, plus `PRODUCT.md` and `DESIGN.md`.

### Changed
- Responsive layouts for desktop and mobile: no horizontal scroll from 320 px up, 44 px touch targets, and no auto-opening keyboard on phones.
- Blog and project lists are real links, so middle-click and keyboard navigation work.
- The page scrolls to the top when you change page.

### Security
- The production build ships without source maps or inline scripts, with a strict `Content-Security-Policy`.
- The site is fully static: no server, database, or third-party scripts.

[Unreleased]: https://github.com/watkorn/watkorn.me/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/watkorn/watkorn.me/releases/tag/v1.0.0
