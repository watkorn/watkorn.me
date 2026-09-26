# Changelog

All notable changes to this site are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- **Site search** at `/search` (and `/th/search`): every post and project by title, tag, heading or text, with highlighted matches, `?q=` links and suggestions. Fully static: the index is built with the content and only loads when search opens; substring matching handles Thai. Reach it with `/` anywhere, the search key in the header, the Blogs/Projects filter rows, the 404 page, or `search <words>` in the terminal.
- **Table of contents and section links** in posts: long posts (3+ sections) open with an "On this page" list, and every heading gets a `#` link for sharing that section. Heading ids are readable, Thai included, and `#section` URLs land below the sticky header.
- **Dependabot auto-merge** for patch and minor updates once CI passes (major updates still wait for a human), plus a **weekly scheduled deploy** that ships them and keeps `security.txt` fresh.

### Fixed
- The header no longer pushes the theme switch off-screen between 420 and 760px wide: the wordmark hides below 760px, the Home pill below 520px and the search key below 420px, checked by a new test at ten widths.

### Changed
- **Self-hosted fonts:** Mali and JetBrains Mono now come from `@fontsource` instead of Google Fonts, so the site makes no third-party requests. The CSP tightens to `style-src 'self'; font-src 'self'`, and the OG image script uses the same font files (no download at build time).
- The fonts each page's first screen uses (Mali Latin, plus the Thai subset on `/th/` pages) are preloaded, which removes the layout shift when the web font swaps in (Lighthouse CLS 0.21 → 0 on the home page, best practices 96 → 100).
- CI, deploy and release workflows run on **Node 24** (LTS).

### Removed
- Unused `eslint` and `eslint-plugin-react-hooks` dev dependencies (no config or lint script used them).

## [1.2.0] - 2026-09-26

### Added
- **Mini CTF season 2:** three harder levels, still fully static. *Trust issues* (60, web: a session cookie whose signature nobody checks, with `id` and `sudo` in the terminal), *One byte* (70, crypto: a single-byte XOR vault in `~/.secret`) and *Least significant* (80, forensics: LSB steganography in a blog image). 8 flags, 360 points. None of the new flags exist in plain text in the code or the build; the integrity test solves all eight.
- **Link-preview images for every post and project**, in both languages (`build/og/…`), drawn at build time by `scripts/og.mjs` in headless Chromium, plus a Thai card for the `/th/` pages.
- **`/.well-known/security.txt`** (RFC 9116), regenerated on every build with a fresh `Expires`, and a private-reporting note in the README instead of "open an issue".
- **Thoth** project page (English + Thai) with light and dark screenshots. Security is described by principle only, with no infrastructure, versions or known gaps, and the page states that Thoth is out of scope for the site's CTF.
- **Project tags** (`tags:` in frontmatter) with a tag filter on the Projects page, shared with Blogs (`TagFilter`). Tags on a post or project page now link to the filtered list.
- **Thai language** (ภาษาไทย): every page now also exists under `/th/`, with a globe key in the header that switches to the same page in the other language. The choice is remembered, and Thai browsers opening the home page land on `/th/`.
  - All UI text, the terminal's help, README, hints and messages, and the CTF level names and hints are translated (commands, file names and flags stay English).
  - Thai translations of "Preparing for CTF", the mini CTF writeup and "My Website". A translation is a `<slug>.th.md` next to the original; untranslated posts show the original with a note.
  - `hreflang` alternates on every page and in the sitemap, `og:locale`, `<html lang>` per page, Thai dates (Buddhist era), Thai word counts for reading time, and a Thai RSS feed at `/th/rss.xml`.
  - `npm run new-post -- --th <slug>` starts a translation from a copy of the original.
  - Thai typography: more line height, no negative tracking, Mali as the Thai fallback in the terminal.
  - Playwright tests for the Thai pages, the switch, the remembered choice and the Thai terminal; Lighthouse now also checks `/th/`.
- **"Writeup: the watkorn.me mini CTF"** blog post with every solution (each flag folded behind a "Show flag" toggle), linked from the Achievements page.
- Spoiler folds (`<details>`) styled for posts.

### Fixed
- Checklist items in posts are now `<label>`s, so each checkbox has an accessible name (Lighthouse accessibility back to 100).

### Changed
- Below 420px the Home pill hides (the yeti logo links home) to make room for the language key; the terminal's `achievements` list now prints points before level names so it lines up in both languages.
- Rewrote the site copy: the home page now says "find the flags." and "Five of them are hiding around this site", with a new About section, A/B buttons, `cat README.md`, `blogs`/`projects` output and "command not found" message, plus new text on the Achievements, Blogs, Projects and 404 pages, hints, the footer credit, meta descriptions and the noscript notice. The OG image now reads "find the flags."
- Rewrote the "Preparing for CTF" post into a practical starter guide and "My Website" into a full case study (architecture, security, the CTF, design, numbers, lessons).
- Refreshed the README screenshots with the pixel yeti and the real Mali font.
- Upgraded to **React 19**, **react-helmet-async 3** and **Tailwind CSS 4** (CSS-first config via `@tailwindcss/vite`; the PostCSS and Tailwind config files are gone), plus Playwright 1.63.

### Removed
- Dead code: `Card.jsx`, `ResponsiveLeftNav.jsx`, `utils/helpers.js`, three unused icon PNGs, and the `autoprefixer`/`postcss` dependencies (Tailwind 4 handles prefixing).

### Security
- CSP no longer allows `'unsafe-inline'` styles: the terminal and the level-4 page use classes and an external stylesheet instead. A new test fails on any CSP violation.

## [1.1.0] - 2026-09-26

### Added
- **Mini CTF:** five flags hidden around the site (terminal, hidden files, page source, robots.txt, the yeti sprite). They are checked by SHA-256 hash with `submit <flag>`, with `hint`, `achievements` and a new **/achievements** page that records progress in the browser.
- Terminal navigation: `cd`, `ls blogs`, `ls projects`, `open <post>`, `cd blogs`. The prompt now shows on every line, with the current folder.
- **CTF writeup template** (`npm run new-post -- --writeup "Name"`), with `event`, `category` and `difficulty` fields shown as badges. Tag and category **filters** on the Blogs page (shareable via `?tag=`).
- **Pre-rendered pages** with real URLs (`/blogs/<slug>/`), plus Open Graph/Twitter tags, canonical links, an OG image, `sitemap.xml`, `rss.xml` and `robots.txt`.
- Playwright smoke tests (desktop + mobile) and a CTF integrity test; **CI** workflow with Lighthouse; **Dependabot**; the deploy now runs the tests first.
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
- Moved from Create React App to **Vite**; React Router 6 → 7. `npm audit` went from 62 vulnerabilities to 0.
- Old `/#/…` links redirect to the new URLs.
- GitHub Actions pinned to commit SHAs and upgraded to their Node 24 versions.
- Social icons resized to 48 px (the GitHub one was 512 px); the theme switch's label now matches its accessible name.

### Removed
- Unused `react-helmet` and `react-infinite-scroll-component` dependencies.

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

[Unreleased]: https://github.com/watkorn/watkorn.me/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/watkorn/watkorn.me/releases/tag/v1.2.0
[1.1.0]: https://github.com/watkorn/watkorn.me/releases/tag/v1.1.0
[1.0.0]: https://github.com/watkorn/watkorn.me/releases/tag/v1.0.0
