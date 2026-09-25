# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Primary:** people in the CTF / pentest / security community (players, learners, teammates) who land on the site to poke at the terminal, look for the flag, and read writeups.
- **Secondary:** recruiters and hiring managers in security who want to see who Watcharakorn is, what they build, and how to reach them.

## Product Purpose
WATKORN.ME is the personal site of Watcharakorn Khambung ("watkorn"), a cybersecurity hobbyist who builds tools and writes CTF writeups for fun and to level up. Success means a visitor (1) plays with the Home terminal and hunts the flag, (2) goes on to read a blog post or writeup, and (3) checks out a project or follows a contact link (LinkedIn, GitHub, TryHackMe).

## Positioning
The site is itself a tiny CTF: the Home page is an interactive fake shell (`whoami`, `ls`, `cat flag.txt`, `echo`, `help`…) with a real flag to find. A generic portfolio can't copy that without copying the challenge.

## Operating Context
- Visitors arrive from CTF team chats, TryHackMe/CTFtime profiles, LinkedIn and GitHub.
- Many are on desktop with a keyboard (terminal use); mobile must still work.
- Content is authored as Markdown in `content/blogs` and `content/projects`, built to static files and served from GitHub Pages (`gh-pages` branch, custom domain watkorn.me).

## Capabilities and Constraints
- Static React SPA (Create React App, HashRouter, Tailwind CSS 3). No server, no backend, no user data.
- Routes: Home (`/`), Blogs (`/blogs`, `/blogs/:slug`), Projects (`/projects`, `/projects/:slug`).
- Blogs are grouped by year with "Load More"; projects are grouped by category.
- Production CSP: `script-src 'self'`, fonts only from Google Fonts; no third-party scripts.
- Interface copy is English.

## Brand Commitments
- Keep the Home terminal and its commands and flag behaviour (styling may change).
- Keep the dark/light theme toggle; both themes must be first-class.
- Keep the yeti mascot. Since v1.1 it is a layered vector (`brand/yeti.svg`, traced from the original artwork in `brand/source/`) that can be recoloured and placed on any background.
- Keep the **Mali** typeface.
- Tone: Gen Z (confirmed by the owner).
- Footer line: "Flags don't hide. You just haven't looked hard enough."

## Evidence on Hand
- 1 blog post (`content/blogs/preparing-for-ctf.md`), 1 project (`content/projects/create-website.md`).
- Profile links: linkedin.com/in/watkorn, github.com/watkorn, tryhackme.com/p/watkorn.
- Icons in `src/assets/` (GitHub, LinkedIn, TryHackMe, light/dark variants).
- No testimonials, rankings, CTF placements, certifications or stats have been supplied; do not invent them.

## Product Principles
1. The terminal is the front door: play first, read second, hire third.
2. Reading writeups must be comfortable: code, images and long text come first.
3. Adding a post should never mean touching layout code.
4. Keep the attack surface near zero: static output only, no third-party scripts.
