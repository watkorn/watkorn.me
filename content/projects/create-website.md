---
title: My Website
description: Step-by-step guide to building a portfolio website
category: Web
order: 1
github: https://github.com/watkorn/watkorn.me
screenshots:
  - src: /screenshot_light.png
    alt: Light theme screenshot
    label: Light Theme
  - src: /screenshot_dark.png
    alt: Dark theme screenshot
    label: Dark Theme
---

## Why This Website?

A home for my CTF writeups and side projects, and a small challenge in its own right:
the home page is a terminal with a flag hidden in it.

## Key Features

- A playable terminal with history, Tab completion and quick commands on phones
- Blogs and projects written as Markdown files, built into a static site
- "Handheld Quest" design with light and dark themes, from 320 px phones up to wide desktops
- Syntax highlighting, copy buttons, reading time and a reading progress bar on posts
- Deployed by GitHub Actions to GitHub Pages, with a strict Content-Security-Policy

## Design Choices

Built with React and Tailwind CSS. Every colour, font and spacing value comes from one set of design tokens,
so the light and dark themes stay consistent. The site is fully static: no server, no database,
and no third-party scripts.

## Next Steps

- More CTF writeups
- More tools in the projects section
