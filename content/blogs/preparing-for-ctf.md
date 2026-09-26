---
title: Preparing for CTF
description: "A no-fluff starter kit for your first Capture The Flag: pick a category, set up your tools, practise, and survive the weekend."
date: 2025-10-08
tags: [ctf, beginner]
---

Capture The Flag (CTF) competitions are the most fun way to learn security. Someone hides a string like `flag{...}` behind a broken web app, a weird binary or a suspicious PCAP, and you break things (legally) until it falls out. You'll fail a lot at first. That's the whole point.

This is the guide I wish I'd had before my first one.

![CTFtime, where you find upcoming CTFs](/images/blogs/ctftime.png)

## First, what kind of CTF is it?

- **Jeopardy.** A board of challenges by category and points. Solve any in any order. This is 90% of CTFs and where you should start.
- **Attack–Defense.** Every team gets the same vulnerable services. Patch yours, exploit everyone else's. Chaotic, amazing, not for week one.
- **King of the Hill.** Take over a box and hold it. Great on TryHackMe once you're comfortable.

Find events on [CTFtime](https://ctftime.org/). Look for ones tagged *beginner*, or with low "weight".

## Pick a lane (then another)

Nobody is good at everything. Start with one or two categories, then branch out.

| Category | What it is | Learn first |
|---|---|---|
| **web** | Break web apps | HTTP, cookies, SQLi, XSS, SSTI, IDOR, reading JS |
| **pwn** | Exploit binaries for a shell | C, stack layout, buffer overflows, ROP, `checksec` |
| **rev** | Figure out what a program does | x86-64 basics, Ghidra, `strace`/`ltrace`, patching |
| **crypto** | Break bad cryptography | XOR, RSA mistakes, padding, encodings vs encryption |
| **forensics** | Dig through files, memory, traffic | file formats, Wireshark, Volatility, steganography |
| **misc / OSINT** | Everything else | Linux-fu, scripting, search skills |

If you don't know where to start: **web** or **forensics**. You get quick wins without needing assembly first.

## Set up your toolkit

A Linux VM (Kali, Parrot or plain Ubuntu) keeps everything in one place and your host clean. Core tools:

- **Everywhere:** Python 3, [CyberChef](https://gchq.github.io/CyberChef/), `file`, `strings`, a good text editor
- **Web:** Burp Suite Community, browser DevTools, `ffuf`, `curl`
- **Pwn / rev:** `pwntools`, GDB + [pwndbg](https://github.com/pwndbg/pwndbg) or GEF, Ghidra, `checksec`
- **Forensics:** Wireshark, `binwalk`, `exiftool`, Volatility 3
- **Crypto / cracking:** `hashcat`, John the Ripper, SageMath or plain Python

```bash
sudo apt install -y python3-pip gdb binwalk exiftool wireshark john hashcat
pip install pwntools
git clone https://github.com/pwndbg/pwndbg && cd pwndbg && ./setup.sh
```

## Practise before the weekend

- [picoCTF](https://picoctf.org/): the best place to start. Challenges go from gentle to genuinely hard.
- [OverTheWire: Bandit](https://overthewire.org/wargames/bandit/): Linux basics, one level at a time.
- [TryHackMe](https://tryhackme.com/): guided rooms and learning paths.
- [Hack The Box](https://www.hackthebox.com/): realistic machines, plus a "Challenges" section in CTF style.
- [pwn.college](https://pwn.college/): the free university course for pwn and rev.
- [CryptoHack](https://cryptohack.org/): crypto, taught through puzzles.

Aim for something small every day rather than one huge weekend. Ten solved easy challenges beat one hard one you gave up on.

## The first 10 minutes of any challenge

Before anything clever, run the boring stuff. It solves more challenges than you'd think.

```bash
file chall                      # what is this, really?
strings -n 8 chall | less       # readable text, sometimes the flag itself
exiftool image.png              # metadata
binwalk -e firmware.bin         # files hidden inside files
checksec --file=./chall         # which protections does this binary have?
```

For web challenges: read the page source, open DevTools, check `/robots.txt`, look at cookies, and watch every request in Burp.

## During the CTF

- **Read every challenge first.** Sort by number of solves; the most-solved ones are usually the easiest.
- **Timebox.** If you've made no progress in 45–60 minutes, switch challenges and come back later.
- **Write everything down.** What you tried, what failed, and every weird thing you noticed. Future-you will thank you.
- **Read the rules.** Don't attack the infrastructure, don't brute-force the flag submission, don't share flags.
- **Sleep and eat.** Seriously. Tired brains don't find off-by-one bugs.

## Play with a team

- One channel or thread per challenge. Post what you've tried.
- "Claim" a challenge so two people don't silently do the same thing.
- Share notes in one place (Obsidian, HedgeDoc or Notion) so nothing lives only in your head.
- Pair up: someone strong in rev plus someone strong in pwn is a very good combo.

## After the CTF (the part everyone skips)

This is where most of the learning actually happens:

1. **Read other teams' writeups** for the challenges you didn't solve. CTFtime links them on each event page.
2. **Write your own writeups**, even for easy ones. Explaining a solve is how it sticks. (On this site, it's `npm run new-post -- --writeup "Challenge name"`.)
3. **Turn repeated tricks into cheat sheets.** Payloads, one-liners, Python snippets.

## Quick checklist

- [ ] Picked 1–2 categories to focus on
- [ ] VM with the core tools installed
- [ ] Solved 10+ picoCTF or TryHackMe challenges
- [ ] Found an upcoming beginner CTF on CTFtime
- [ ] Notes app and team channel ready
- [ ] Plan to write at least one writeup afterwards

Want a warm-up right now? The [terminal on the home page](/) has five flags hidden around this site. Check your progress on the [achievements page](/achievements). Good luck, and have fun breaking things.
