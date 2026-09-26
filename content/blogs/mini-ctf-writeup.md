---
title: "Writeup: the watkorn.me mini CTF"
description: "Full solutions for season 1 of the mini CTF on this site: dotfiles, view-source, robots.txt and a yeti with a secret. Spoilers, obviously."
date: 2026-09-26
event: "watkorn.me mini CTF"
category: web
difficulty: easy
tags: [ctf, writeup, beginner]
---

> **Spoiler alert.** This post solves every level of the mini CTF on this site. If you haven't tried it yet, go to the [home page](/), type `ls`, and come back when you're stuck. Hints are free on the [achievements page](/achievements). The flags themselves are folded away below each level, so you can read the method without seeing the answer. This post covers **season 1** (levels 1–5). Season 2 (levels 6–8) is still live, so no spoilers for it here yet.

Season 1 has five levels, worth 10 to 50 points (150 of the 360 in total). The terminal checks your answers with `submit <flag>`, and it only knows the **SHA-256 hashes** of the flags, so the answers aren't sitting in the JavaScript in plain text. Well, mostly. Let's go.

## Level 1: Warm-up (10 pts)

*"Some files are just lying around in the home folder."*

The classic first move in any shell is to look around:

```bash
watkorn@me:~$ ls
flag.txt  README.md
watkorn@me:~$ cat flag.txt
```

That's it. The warm-up is literally a file called `flag.txt`. There's also a sneaky second path: `echo` with the word "flag" in it prints the flag too.

<details>
<summary>Show flag</summary>

`my_w3b_is_c00ler_th4n_u_th1nk`

</details>

**Lesson:** always enumerate before you get clever. `ls`, `cat`, `file`, `strings`.

## Level 2: Hidden in plain sight (20 pts)

*"ls shows files. ls -la shows all of them."*

On Linux, files starting with a dot are hidden from a plain `ls`. Add `-a` (all) and `-l` (long):

```bash
watkorn@me:~$ ls -la
drwxr-xr-x 3 watkorn users 4096 Oct 8 2025 .
drwxr-xr-x 3 watkorn users 4096 Oct 8 2025 ..
drwx------ 2 watkorn users 4096 Oct 8 2025 .secret
-rw-r--r-- 1 watkorn users   67 Oct 8 2025 flag.txt
-rw-r--r-- 1 watkorn users  123 Oct 8 2025 README.md
watkorn@me:~$ cd .secret
watkorn@me:~/.secret$ cat note.b64
d2F0a29ybntkMHRmMWwzc180cjNfbjB0X3MzY3IzdHN9
```

The `.b64` extension gives it away: letters, digits and a length that's a multiple of 4 all scream **Base64**. Decode it anywhere except the site's terminal:

```bash
echo 'd2F0a29ybntkMHRmMWwzc180cjNfbjB0X3MzY3IzdHN9' | base64 -d
```

Or use [CyberChef](https://gchq.github.io/CyberChef/) with the "From Base64" operation.

<details>
<summary>Show flag</summary>

`watkorn{d0tf1l3s_4r3_n0t_s3cr3ts}`

</details>

**Lesson:** Base64 is **encoding, not encryption**. Anyone can reverse it, no key needed. And "hidden" dotfiles hide nothing from someone who types `-a`.

## Level 3: View source (30 pts)

*"The page you see isn't the whole page."*

What the browser renders is only part of what the server sends. Open the raw HTML with **Ctrl+U** (or `view-source:https://watkorn.me/`), or fetch it:

```bash
curl -s https://watkorn.me/ | grep -i "note to self"
```

Near the top of `<body>` there's an HTML comment:

```html
<!-- note to self (level 3): jngxbea{i13j_f0hep3_o3s0e3_l0h_u4px}  ·  rot13, obviously -->
```

It even tells you the cipher. ROT13 shifts every letter 13 places, and applying it twice gets you back where you started:

```bash
echo 'jngxbea{i13j_f0hep3_o3s0e3_l0h_u4px}' | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

Digits and symbols are left alone, which is why `{`, `_` and the leetspeak numbers survive untouched.

<details>
<summary>Show flag</summary>

`watkorn{v13w_s0urc3_b3f0r3_y0u_h4ck}`

</details>

**Lesson:** comments ship to production more often than you'd think. On real web challenges (and real bug bounties), read the source, the JavaScript bundles and the HTML comments first.

## Level 4: Robots only (40 pts)

*"Every well-behaved crawler reads one file before anything else. Be badly behaved."*

That file is `/robots.txt`, a polite request to search engines about what not to index:

```bash
curl -s https://watkorn.me/robots.txt
```

```
User-agent: *
Disallow: /y3t1-l41r/
```

"Please don't look at /y3t1-l41r/" is basically an invitation. Visit [the yeti's lair](/y3t1-l41r/) and you'll find a wall of bytes: `77 61 74 6b 6f 72 6e 7b …`. That's **hex**: every pair of characters is one byte, and `77 61 74` is `wat`. Convert it back:

```bash
echo '77 61 74 6b 6f 72 6e 7b 72 30 62 30 74 73 5f 74 78 74 5f 31 73 5f 34 5f 74 72 33 34 73 75 72 33 5f 6d 34 70 7d' | xxd -r -p
```

No `xxd`? Python works anywhere (and CyberChef's "From Hex" does too):

```bash
python3 -c "print(bytes.fromhex('77 61 74 6b 6f 72 6e 7b 72 30 62 30 74 73 5f 74 78 74 5f 31 73 5f 34 5f 74 72 33 34 73 75 72 33 5f 6d 34 70 7d').decode())"
```

<details>
<summary>Show flag</summary>

`watkorn{r0b0ts_txt_1s_4_tr34sur3_m4p}`

</details>

**Lesson:** `robots.txt` is **not access control**. It lists exactly the paths someone wanted to hide, which makes it one of the first files to check in any web challenge or recon.

## Level 5: Pixel secrets (50 pts)

*"The yeti is an SVG. Open the file on its own and look past the pixels."*

The pixel yeti isn't an image tag; it's drawn from an SVG sprite. In DevTools (**F12 → Elements**), inspect the yeti and you'll find something like:

```html
<use href="/assets/yeti-XXXXXXXX.svg#yeti"></use>
```

(the part after `yeti-` is a content hash, so yours may differ). Open that SVG file directly in a new tab and view its source. SVG is just XML, and next to the drawing there's a `<metadata>` element the browser never renders:

```xml
<metadata>yeti-says: d2F0a29ybntwMXgzbHNfYzRuX2gxZDNfc3Q0ZmZfdDAwfQ==</metadata>
```

The `==` padding at the end is a Base64 tell, again:

```bash
echo 'd2F0a29ybntwMXgzbHNfYzRuX2gxZDNfc3Q0ZmZfdDAwfQ==' | base64 -d
```

Command-line route, no DevTools needed:

```bash
js=$(curl -s https://watkorn.me/ | grep -o '/assets/index-[^"]*\.js')
svg=$(curl -s "https://watkorn.me$js" | grep -o '/assets/yeti-[^"`]*\.svg' | head -1)
curl -s "https://watkorn.me$svg" | grep -o 'yeti-says: [^<]*'
```

<details>
<summary>Show flag</summary>

`watkorn{p1x3ls_c4n_h1d3_st4ff_t00}`

</details>

**Lesson:** images can carry data. SVGs are text files that can hold metadata, comments and even scripts. That's why real sites sanitise user-uploaded SVGs, and why steganography challenges love image files.

## How the checking works (and its limits)

- The terminal hashes whatever you `submit` with SHA-256 in your browser (`crypto.subtle.digest`) and compares it against the stored hashes. The hashes are public, but a hash can't be reversed back into the flag.
- Your progress is stored in your browser's `localStorage`. Nothing is sent to a server, because there isn't one.
- Honest limits: flags 1 and 2 have to live in the JavaScript, because the terminal prints them. And the whole site is [open source](https://github.com/watkorn/watkorn.me), so reading the repo is a valid, if slightly cheeky, strategy. For a warm-up CTF, that's a feature.

## What this mini CTF teaches

| Level | Technique | Real-world version |
|---|---|---|
| 1 | Enumerate first | `ls`, `strings`, reading every file you're given |
| 2 | Hidden files + Base64 | dotfiles, `.git/`, encoded config values |
| 3 | View source + ROT13 | leaked comments, secrets in JS bundles |
| 4 | robots.txt + hex | recon on `robots.txt`, `sitemap.xml`, `.well-known/` |
| 5 | File metadata | EXIF data, SVG/Office metadata, steganography |

Got all five? Season 2 is waiting: three harder levels involving a cookie, a vault and a picture. The hints are on the [achievements page](/achievements).
