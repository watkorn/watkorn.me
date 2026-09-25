---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: ["src/pages/Home.jsx","src/pages/Blogs.jsx","src/pages/Projects.jsx","src/components/DetailTemplate.jsx"]
---

# Surface brief: whole site (Home, Blogs, Projects, detail pages)

Scope: site-wide redesign. Visitor modes: Home = experience; Blogs/Projects index = operate-light (browse); detail pages = read.
Audience: CTF/security community first, recruiters second. Path: play the terminal → read a writeup → check projects/contact.
Constraints: keep terminal commands + flag, dark/light toggle, mascot images, Mali typeface; English copy; static build with strict CSP (no inline scripts).
Proof on hand: 1 post, 1 project, 3 profile links. No stats, rankings or testimonials; never invent them.

## Direction contract

THESIS: The site is a handheld game you hold, not a portfolio you scroll; the terminal is the cartridge and the flag is the win condition. Refuses the dark-green "hacker terminal portfolio" and the pastel card-grid portfolio.
OWN-WORLD: Page ground is console-shell plastic (light: dandelion yellow; dark: grape). Content lives on screens set in dark bezels with the Game Boy's big bottom-right curve. Terminal on a pea-green LCD (light) or dark backlit LCD with pear text (dark). Rubber push buttons with a solid edge that press down; Start/Select pills for nav; a slide power switch for theme. Mali for voice, JetBrains Mono for shell/code.
STORY: Visitor meets the challenge ("find the flag."), plays, earns an achievement, then follows A (blogs) or B (projects).
FIRST VIEWPORT: Left: mascot portrait, "find the flag." in large Mali, one-line dare, profile buttons. Right: bezel + LCD terminal filling ~60% width. Primary action is typing in the terminal; A/B buttons sit directly below.
FORM: Handheld Quest, candidate 6 of 7 (seed key cd768327, degraded roll).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
