# WATKORN.ME

[![Deploy](https://github.com/watkorn/watkorn.me/actions/workflows/deploy.yml/badge.svg)](https://github.com/watkorn/watkorn.me/actions/workflows/deploy.yml)
[![Release](https://img.shields.io/github/v/release/watkorn/watkorn.me)](https://github.com/watkorn/watkorn.me/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live site](https://img.shields.io/badge/live-watkorn.me-f2d54c)](https://watkorn.me)

> The personal site of **Watcharakorn Khambung (watkorn)**: CTF writeups, security side projects,
> and a terminal on the home page with a flag hidden in it. Go find it.

| Light | Dark |
|---|---|
| ![Light theme](public/screenshot_light.png) | ![Dark theme](public/screenshot_dark.png) |

---

## Features

- **A terminal you can play with.** `whoami`, `ls -la`, `cat`, `echo`, `help`… and a flag. It has history (↑/↓), Tab completion, `Ctrl+L`, and tap-to-run buttons on phones.
- **Blogs and projects in Markdown.** Drop a `.md` file in `content/` and push; no React code to touch.
- **Handheld Quest design.** Console-shell light and dark themes, an LCD terminal and rubber push buttons. Works from 320 px phones up to wide desktops.
- **Reading comforts.** Syntax highlighting, copy buttons on code blocks, reading time, a progress bar, and older/newer navigation.
- **Static and locked down.** Plain HTML/CSS/JS on GitHub Pages: no server, no database, no third-party scripts, a strict CSP, and no source maps.

## Quick start

Requires **Node 20+**.

```bash
npm install
npm start        # http://localhost:3000 (drafts are visible in dev)
```

| Command | What it does |
|---|---|
| `npm start` | Dev server; rebuilds content when any `.md` changes |
| `npm run new-post -- "My Title"` | Creates `content/blogs/my-title.md` as a draft |
| `npm run build` | Production build in `build/` (drafts excluded, CSP added, no source maps) |
| `npm run deploy` | Manual deploy of `build/` to `gh-pages` (CI normally does this) |

## Writing a post

```bash
npm run new-post -- "HTB Machine Writeup"
```

This creates `content/blogs/htb-machine-writeup.md`. The file name becomes the URL (`/#/blogs/htb-machine-writeup`).

````markdown
---
title: HTB Machine Writeup
description: One line shown in the list
date: 2026-09-25          # the post is grouped by this year
tags: [htb, web]
draft: true               # delete this line to publish
---

## Recon

```bash
nmap -sC -sV 10.10.10.10
```

![Burp request](/images/blogs/burp.png)
````

- Images go in `public/images/blogs/`; reference them as `/images/blogs/<file>`.
- Code blocks get syntax highlighting at build time, and external links open in a new tab.
- Commit and push to `main`; the site redeploys by itself.

**Projects** work the same way in `content/projects/*.md`, with a few extra fields:

```yaml
---
title: My Tool
description: What it does
category: Security Tools     # projects are grouped by this
order: 1                     # sort order inside the category
github: https://github.com/watkorn/my-tool
screenshots:
  - { src: /images/projects/my-tool.png, alt: Main screen, label: Main screen }
---
```

<details>
<summary>ภาษาไทย: เขียนบล็อกใหม่ใน 3 ขั้น</summary>

1. `npm run new-post -- "ชื่อเรื่องภาษาอังกฤษ"` (ชื่อไฟล์/URL ต้องเป็น a-z, 0-9, -)
2. เขียนเนื้อหาด้วย Markdown ใน `content/blogs/<ชื่อ>.md` แล้วดูตัวอย่างด้วย `npm start`
3. ลบบรรทัด `draft: true` แล้ว commit + push ขึ้น `main` เว็บจะ build และ deploy เองอัตโนมัติ

</details>

## Project structure

```
content/            Markdown for blogs and projects (edit these)
public/             Static files: CNAME, images, icons, theme-init.js
brand/              Yeti logo: master SVG, palettes, exports, Logo Lab
scripts/            Build-time tools: content.mjs, csp.mjs, new-post.mjs, start.mjs
src/
  components/       Header, Footer, QuestList, DetailTemplate, Icon, ...
  pages/            Home, Blogs, Projects, detail pages, 404
  styles/           tokens.css (design tokens) + globals.css
  generated/        Built from content/ (git-ignored, never edit)
.github/workflows/  deploy.yml (Pages) · release.yml (Releases)
.claude/skills/     Hallmark + Impeccable design skills for Claude Code
PRODUCT.md          Who the site is for and what it must keep
DESIGN.md           The design system: tokens, components, rules
```

## Deployment and releases

- **`main`** holds the source. Every push runs [`deploy.yml`](.github/workflows/deploy.yml), which builds and publishes `build/` to the **`gh-pages`** branch.
- In **Settings → Pages**, set Source to *Deploy from a branch* → `gh-pages` / `(root)`. The custom domain comes from `public/CNAME`.
- **Releases:** add a section to [`CHANGELOG.md`](CHANGELOG.md), bump `version` in `package.json`, then:

  ```bash
  git tag v1.1.0 && git push origin v1.1.0
  ```

  [`release.yml`](.github/workflows/release.yml) builds the site and creates a GitHub Release. It uses that CHANGELOG section as the notes and attaches the built site as a zip.
  No terminal handy? Use **Actions → Release → Run workflow** and type the version (e.g. `v1.1.0`). It creates the tag on `main` for you.

## Security

- The live site is static files only; there is nothing server-side to exploit.
- Production HTML carries a `Content-Security-Policy` (`script-src 'self'`, no inline scripts). The theme bootstrap lives in `public/theme-init.js` for that reason.
- Markdown is rendered at build time from files in this repo; visitor input is never rendered as HTML.
- Everything in the frontend bundle is public, the terminal flag included (that's the game). Never put real secrets in `src/` or `content/`.

Found a real issue? Please open a GitHub issue or email **fkub0011@gmail.com**.

## Logo

The yeti is a layered vector you can recolour, put on any background, or leave transparent.
Open **[`brand/lab.html`](brand/lab.html)** to make your own version, or see [`brand/README.md`](brand/README.md) for palettes, exports and the `<Yeti>` component.

## Design

The UI follows the **Handheld Quest** system documented in [`DESIGN.md`](DESIGN.md). All colours, fonts, spacing and motion come from the tokens in [`src/styles/tokens.css`](src/styles/tokens.css). It was designed with the [Hallmark](https://github.com/Nutlope/hallmark) (MIT) and [Impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0) skills, which ship in `.claude/skills/` under their own licenses.

## Tech

React 18 · React Router 6 · Tailwind CSS 3 (+ typography) · gray-matter · marked · highlight.js · GitHub Actions · GitHub Pages

## License

[MIT](LICENSE) © 2025-2026 Watcharakorn Khambung. The mascot artwork and the blog content are © Watcharakorn Khambung.
