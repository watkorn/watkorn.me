---
name: WATKORN.ME
description: Handheld Quest, a pocket game console for a CTF player's personal site.
colors:
  shell: "oklch(87% 0.15 92)"
  shell-deep: "oklch(83% 0.155 88)"
  shell-edge: "oklch(68% 0.14 78)"
  bezel: "oklch(29% 0.035 285)"
  bezel-ink: "oklch(78% 0.03 285)"
  screen: "oklch(98.5% 0.004 250)"
  screen-deep: "oklch(95% 0.008 250)"
  rule: "oklch(88% 0.012 260)"
  lcd: "oklch(86% 0.085 128)"
  lcd-ink: "oklch(28% 0.07 145)"
  lcd-prompt: "oklch(36% 0.13 300)"
  ink: "oklch(22% 0.03 285)"
  ink-muted: "oklch(38% 0.03 285)"
  ink-on-shell: "oklch(22% 0.04 70)"
  berry-a: "oklch(56% 0.2 12)"
  grape-b: "oklch(44% 0.15 300)"
  key: "oklch(97% 0.01 95)"
  link: "oklch(45% 0.17 258)"
  focus: "oklch(50% 0.21 258)"
typography:
  display:
    fontFamily: "Mali, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 5.5vw + 0.5rem, 5.25rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Mali, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.5vw + 1rem, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.1
  page:
    fontFamily: "Mali, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 4vw + 1rem, 4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Mali, ui-rounded, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Mali, ui-rounded, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.65
  input-touch:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "16px"
rounded:
  screen: "14px 14px 44px 14px"
  bezel: "22px 22px 64px 22px"
  key: "12px"
  chip: "6px"
  panel: "18px"
  pill: "999px"
spacing:
  3xs: "0.25rem"
  2xs: "0.5rem"
  xs: "0.75rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
  2xl: "4.5rem"
  3xl: "7rem"
components:
  key:
    backgroundColor: "{colors.key}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1.15rem"
    height: "44px"
  key-a:
    backgroundColor: "{colors.berry-a}"
    textColor: "{colors.screen}"
    rounded: "{rounded.pill}"
    height: "64px"
  key-b:
    backgroundColor: "{colors.grape-b}"
    textColor: "{colors.screen}"
    rounded: "{rounded.pill}"
    height: "64px"
  bezel:
    backgroundColor: "{colors.bezel}"
    rounded: "{rounded.bezel}"
  screen:
    backgroundColor: "{colors.screen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.screen}"
  lcd:
    backgroundColor: "{colors.lcd}"
    textColor: "{colors.lcd-ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.screen}"
---

# Design System: WATKORN.ME

The single source of truth for colours, type, spacing and motion is
[`src/styles/tokens.css`](src/styles/tokens.css). Component rules live in
[`src/styles/globals.css`](src/styles/globals.css). Frontmatter values above are the **light** theme.
The dark theme redefines the same token names under `.dark`.

## Overview

**Creative North Star: "Handheld Quest"**

The site is a pocket game console you hold, not a portfolio you scroll. The page ground is the console's plastic shell. Everything you read sits on a *screen* set into a dark *bezel* with the handheld's oversized bottom-right curve. The terminal lives on an LCD, and every control is a rubber key that physically presses down. The voice is Gen Z: lowercase dares, short lines, no corporate filler.

Home is the game (the terminal and the flag). Blogs and Projects are save-select menus. A post is the manual, calm and readable on a clean screen. The world refuses two defaults: the green-on-black "hacker terminal" portfolio and the pastel card-grid portfolio.

**Key Characteristics:**
- Committed colour: the shell colour owns the whole page (dandelion by day, grape by night).
- One button system: pressable keys with a solid edge that sinks on `:active`.
- Screens have asymmetric corners (`14px 14px 44px 14px`), which reads instantly as "handheld".
- Mali carries the voice; JetBrains Mono appears only for shell, code, dates and data.
- One authored motion moment: the LCD flashes when you capture the flag.

## Colors

Multi-accent handheld plastics: a shell, a dark bezel, an LCD, and two face buttons.

### Primary
- **Berry A** (`oklch(56% 0.2 12)`, dark `oklch(66% 0.2 12)`): the A key (primary action), the active nav pill, list cursors, post bullets, the reading progress bar and the dialog speaker name.

### Secondary
- **Grape B** (`oklch(44% 0.15 300)`, dark: pear `oklch(86% 0.16 95)`): the B key (secondary action) and the dark theme's highlight (active pill, focus ring, power slider).

### Neutral
- **Dandelion Shell** (`oklch(87% 0.15 92)`, dark grape `oklch(25% 0.07 300)`): the page ground.
- **Bezel** (`oklch(29% 0.035 285)`, dark `oklch(10% 0.02 290)`): frames around screens, the footer quote strip and the achievement toast.
- **Screen** (`oklch(98.5% 0.004 250)`, dark `oklch(22% 0.035 290)`): the reading surface for lists, posts and the dialog.
- **Pea LCD** (`oklch(86% 0.085 128)`, dark backlit `oklch(19% 0.035 110)` with pear ink): terminal only.
- **Ink** (`oklch(22% 0.03 285)`) and **Ink Muted** (`oklch(38% 0.03 285)`): text on screens. **Ink on Shell** (`oklch(22% 0.04 70)`) is text on the plastic.

### Named Rules
**The Surface Rule.** Text never sits directly on the bezel except silkscreen labels. Content goes on a screen or the LCD.
**The Two-Button Rule.** Berry means go (A), grape or pear means the alternative (B). There are no other accent colours for actions.

## Typography

**Display / Body:** Mali (Google Fonts, 400 to 700). **Mono:** JetBrains Mono (400, 600).

**Character:** rounded, hand-made Thai-Latin letterforms give the Gen Z warmth. Mono keeps the terminal honest.

### Hierarchy
- **Display** (700, `clamp(2.75rem, 5.5vw + .5rem, 5.25rem)`, lh 1): the home dare only ("find the flag.").
- **Page** (700, `clamp(2.5rem, 4vw + 1rem, 4rem)`): index page titles (Blogs, Projects).
- **Headline** (700, `clamp(2rem, 3.5vw + 1rem, 3.25rem)`): post titles.
- **Title** (700, 1.625rem): list item titles and group years or categories.
- **Body** (400, 1.0625rem, lh 1.6, ≤65ch): prose, ledes and the dialog.
- **Mono** (400/600, .75 to .875rem): terminal, code, dates, reading time, tags, quick-command chips and `kbd`. On touch devices the terminal input is 16px (`--text-input-touch`) so iOS doesn't zoom.

### Named Rules
**The No-Costume Mono Rule.** Mono only for things a machine would print. Nav labels, silkscreen and captions use Mali.
**The Upright Rule.** Headings are never italic.

## Layout

The container is `max-width: 72rem` with a `clamp(1rem, 4vw, 2.5rem)` gutter and a 4pt spacing scale (`--space-*`).

- **Home** (≥960px): a 5/7 two-column console hero (player on the left; bezel, terminal and A/B keys on the right). Below 600px the avatar sits beside the title and everything else stacks.
- **Lists:** single column, each group framed as one screen, with jump keys when there is more than one group.
- **Posts:** a 54rem reading column.
- **Responsive floor:** no horizontal scroll from 320px (`overflow-x: clip` on html and body), `minmax(0, 1fr)` tracks, 44px touch targets, 16px terminal input on coarse pointers, and safe-area insets on the header, footer and fixed controls.

## Elevation & Depth

Two kinds of depth, never mixed:
- **Pressables** (keys, nav pills, pager links) carry a solid bottom edge `0 4px 0 0 <edge>` plus a soft cast. Hover lifts them 2px. `:active` sinks them 3px (edge 1px, 70ms).
- **Static objects** (bezels, dialog, toast, list screens) carry only a soft cast `0 16px 32px -14px var(--color-shell-cast)`.

**The Pressable-Edge Rule.** The solid edge means "you can press this". Never put it on something static.

## Shapes

- Screen: `14px 14px 44px 14px`.
- Bezel: `22px 22px 64px 22px`. The bottom-right curve is the signature.
- Keys: pill (`999px`) or round (52px). Panels (dialog, toast, pager) use `18px`; list rows and images use `12px`; inline code and `kbd` use `6px`.
- Nav: Start/Select pills (38×11, rotated -22°) with the label below.
- Dashed 2px rules divide list rows and the post header.

## Components

- **Key** (`.key`, with `--a`, `--b`, `--sm`, `--xs`, `--lg` and `--round` variants): the only button. It has default, hover, focus-visible (3px focus outline), active and disabled states. Loading and error states use text changes. Links styled as keys stay `<a>`.
- **Pill nav** (`.pill-nav`): Home, Blogs, Projects. The active item's pill is pressed down and coloured. It is always visible and there is no hamburger.
- **Power switch** (`.power-switch`): a `role="switch"` theme toggle, with a ridged slider in a recessed track and a "light / dark" silkscreen legend.
- **Bezel + LCD terminal:** history (↑/↓), Tab completion, `Ctrl+L`, tap-to-focus and quick-command chips. The prompt label is tied to the input.
- **Quest list** (`.quest`): real links. A berry cursor appears on hover or focus (always visible on touch). It shows title, description, then mono meta.
- **Yeti logo** (`Yeti.jsx`, `brand/yeti.svg`): the mascot as an 8-layer vector. Each layer is coloured by a `--yeti-*` variable. The default follows the theme (light is the *dandelion* palette on a bezel background; dark is *night* on a key background). Named palettes are `snow`, `dandelion`, `night`, `lcd`, `berry` and `ink`. Backgrounds are `none`, `circle`, `screen` (the handheld curve) and `square`. Crops are `full` and `head` (use `head` at 48px and below). Palette tables and the Logo Lab are in `brand/README.md`.
- **RPG dialog** (`.dialog`): the About box, with a double-rule frame and the speaker name in berry.
- **Achievement toast** (`.achievement`): a `role="status"` toast with a trophy and an A-key call to action to the writeups. It pauses on hover or focus and auto-hides after 9s. It sits at the top on mobile and bottom-right on desktop.
- **Post chrome:** a back key, reading progress bar, copy buttons on `pre`, and an older/newer pager.

## Do's and Don'ts

- **Do** use tokens (`var(--color-*)`, `var(--space-*)`) for every colour and spacing value, and add a token before using a new value.
- **Do** keep one authored motion moment per page. Everything else is a state transition of 140 to 260ms using `--ease-out` or `--ease-press`.
- **Do** honour `prefers-reduced-motion`: no travel, fades of 120ms or less, and no LCD flash.
- **Don't** use gradients on text, glassmorphism, emoji or unicode as icons (use `Icon.jsx` SVGs), eyebrow labels above headings, or italic headings.
- **Don't** invent stats, rankings or testimonials. See PRODUCT.md › Evidence on Hand.
- **Don't** add inline `<script>` (it breaks the CSP), and don't add third-party scripts.

---

## Hallmark system record

- **Genre:** playful (custom theme, *designed-as-app*).
- **Macrostructure family:** Home is Console Hero (custom, terminal-as-thesis); lists are Index-First; posts are Long Document inside a screen; 404 is a single LCD "GAME OVER" screen.
- **Nav / footer:** Start/Select pill nav plus a power switch; the footer is Ft5 statement (a static quote strip) plus a copyright line.
- **CTA voice:** the primary action is the A key (berry, a pill with a circled "A" badge); the secondary is the B key (grape or pear). Copy is short and verb-first ("Read the blogs").
- **Per-page allowances:** enrichment is limited to the mascot art and CSS-built console objects. There is no stock imagery.
- **What pages MUST share:** the shell ground, bezel and screen shapes, key system, Mali + JetBrains Mono, pill nav and footer strip.
- **What pages MAY differ on:** macrostructure within the family above, and list grouping (by year or by category).

## Exports

### tokens.css
See [`src/styles/tokens.css`](src/styles/tokens.css). It is the canonical file, with light values on `:root` and dark values on `.dark`.

### Tailwind v4 `@theme`
```css
@theme {
  --color-shell: oklch(87% 0.15 92);
  --color-bezel: oklch(29% 0.035 285);
  --color-screen: oklch(98.5% 0.004 250);
  --color-lcd: oklch(86% 0.085 128);
  --color-ink: oklch(22% 0.03 285);
  --color-accent: oklch(56% 0.2 12);
  --color-accent-2: oklch(44% 0.15 300);
  --font-display: "Mali", ui-rounded, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --spacing-md: 1.5rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```
