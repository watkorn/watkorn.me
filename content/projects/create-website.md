---
title: My Website
description: "watkorn.me: a static, A+-hardened portfolio that is also a tiny CTF. How it's built, secured and shipped."
category: Web
order: 1
tags: [react, vite, security, ctf]
github: https://github.com/watkorn/watkorn.me
screenshots:
  - src: /screenshot_light.png
    alt: Home page in the light theme, with the pixel yeti, the "find the flags." dare and the LCD terminal
    label: Light theme
  - src: /screenshot_dark.png
    alt: Home page in the dark theme, with the grape console shell and the backlit terminal
    label: Dark theme
---

This site is my home for CTF writeups and side projects, and a challenge in its own right. The home page is a terminal with **eight flags** hidden around the site. If you're a security person, the fastest way to get to know me is to try to break my website.

## Goals

1. **Play first, read second, hire third.** The terminal is the front door. Writeups come next, then projects and contact links.
2. **Writing a post should never mean touching layout code.** A writeup is a Markdown file and a `git push`.
3. **Keep the attack surface close to zero.** No server, no database, no third-party scripts.

## How it works

```
content/*.md  ─▶  scripts/content.mjs  ─▶  JSON  ─▶  Vite + React
                                                   │
                     prerender every route to HTML ◀┘  (+ sitemap, RSS, CSP)
                                                   │
          GitHub Actions: build → Playwright tests → publish to gh-pages
                                                   │
                  GitHub Pages  ◀──  Cloudflare (TLS, HSTS, security headers)
```

- **Content:** blog posts and projects are Markdown with frontmatter. At build time, [marked](https://marked.js.org/) and highlight.js turn them into HTML, so no Markdown parser ships to the browser. Drafts are visible in dev and excluded from production.
- **Two languages:** every page exists in English at `/` and in Thai at `/th/`. A translation is a `post-name.th.md` file next to the original. Until a post is translated, the Thai page shows the original with a note, and `hreflang` links tell search engines which pages belong together.
- **Pages:** React 19 + React Router 7 on Vite. Every route is **prerendered to its own HTML file**, so posts are indexable and link previews in Discord or LINE show a real title and image. React then takes over for the interactive bits.
- **Deploys:** every push to `main` builds the site and runs **Playwright smoke tests on desktop and mobile**. Only if they pass does it publish the static files to the `gh-pages` branch. A failing test means the live site doesn't change.

## Security

Being a security person's website, it had better hold up:

- **A+ on [securityheaders.com](https://securityheaders.com/?q=watkorn.me&followRedirects=on).** Cloudflare adds HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and COOP, which GitHub Pages can't send.
- **A strict Content-Security-Policy** on every page: `script-src 'self'` and `style-src` without `'unsafe-inline'`. So no inline scripts **or** inline styles, and a test fails the build if any page triggers a CSP violation.
- **No source maps in production.**
- **Zero known vulnerable dependencies:** moving from Create React App to Vite took `npm audit` from 62 findings to 0. Dependabot keeps it that way, and every GitHub Action is pinned to a commit SHA.
- **Visitor input is never rendered as HTML.** All Markdown is rendered at build time from files in the repo.

## The CTF inside

The terminal speaks a little shell: `ls -la`, `cd`, `cat`, `open <post>`, `hint`, `submit <flag>`, with history and Tab completion. Eight levels in two seasons (10 to 80 points) are hidden in places a player should learn to look. Flags are checked by **SHA-256 hash only**, so reading the JavaScript doesn't hand over the answers. Progress lives on the [achievements page](/achievements), stored only in your browser.

A test proves every flag is reachable on the built site and matches its hash, so I can't accidentally ship an unsolvable level.

## Design: Handheld Quest

The look is a pocket game console. The page is the console's plastic shell: dandelion yellow by day, grape at night. Content sits on "screens" with the handheld's big bottom-right curve, the terminal is an LCD, and every button is a rubber key that physically presses down.

The mascot is a **32×32 pixel yeti** drawn in code. It has 8 recolourable layers, a 2-frame walk cycle, and a Logo Lab for exporting it in any palette. Everything comes from one set of design tokens, so both themes stay consistent. The site works from 320 px phones up. I used the [Hallmark](https://github.com/Nutlope/hallmark) and [Impeccable](https://github.com/pbakaus/impeccable) design skills to avoid the generic "AI portfolio" look.

## Numbers

- Lighthouse (local): **Performance 97 · Accessibility 100 · SEO 100**
- About **82 KB** of gzipped JavaScript; each post's content loads as its own small chunk
- Pixel yeti: **8 KB** for both frames of the sprite; every icon is under 10 KB

## What I learned

- **Prerendering beats a SPA for a content site.** Hash URLs were invisible to search engines and link previews.
- **A strict CSP pays for itself.** Dropping `'unsafe-inline'` surfaced two inline styles hiding in the prerendered HTML, and now a test keeps them from coming back.
- **Tests for the fun stuff matter too.** An unsolvable CTF level is a bug.

## Stack

React 19 · React Router 7 · Vite · Tailwind CSS 4 · marked · highlight.js · Playwright · Lighthouse CI · GitHub Actions · GitHub Pages · Cloudflare

The source is open on GitHub (link below). Found something? Tell me, or better yet, find the flags first.
