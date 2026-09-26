---
title: Thoth
description: "A case-management portal and in-browser investigation toolbox for investigators in Thailand. In production, MFA-protected, security-reviewed every release."
category: Web
order: 2
tags: [nextjs, bun, security, forensics, osint]
screenshots:
  - src: /images/projects/thoth-home-light.webp
    alt: "Thoth landing page in the light theme: the Thai headline 'บันทึกทุกคดี อย่างชาญฉลาด', sign-in buttons, and sample cards for case documents, active cases and a link chart"
    label: Light theme
  - src: /images/projects/thoth-home-dark.webp
    alt: "The same Thoth landing page in the dark theme"
    label: Dark theme
---

Thoth is a case-management web app plus an investigation toolbox for investigators in Thailand. Case files, Thai legal documents and the analysis of phone records, bank statements and provider logs live in one place. It's in production, and most of the heavy analysis runs in the browser, so raw evidence files don't have to leave the officer's machine.

> **Out of scope.** Thoth handles real cases, so it is **not** part of this site's CTF. Please don't test it. If you think you've spotted a problem, tell me privately instead (LinkedIn is linked on the home page).

## Goals

- One place for a case: the file, the people, the documents and the evidence analysis.
- Keep evidence files on the client wherever possible.
- Security that holds up in real use, not just on paper.
- Usable on a phone inside LINE, because that's where officers actually are.

## Features

- Case files with Thai document generation (.docx) and request letters to providers
- Phone record (CDR) analysis with charts, cell-tower positions and i2 (.anx) export
- Bank statement analysis with an editable money-trail graph and i2 export
- Provider log tools: IP to provider/ASN lookup and request sheets
- Save analysis results into a case: bank accounts, transfers, person profiles
- LINE (LIFF) sign-in and mobile-friendly flows

## Security

Only the principles here. The details stay off the internet on purpose.

- **MFA on every account**, with extra verification before anyone is given admin rights.
- **Least privilege everywhere:** the app gets only the database rights it needs, and the audit trail can't be rewritten by the app.
- **Strict input validation, rate limits and security headers** (HSTS, a Content-Security-Policy, nosniff and friends).
- **Isolated deployment and encrypted backups**, with a release process that backs up first and can roll back in one step.
- **Safe exports:** spreadsheet formula injection is neutralised in every CSV, XLSX and i2 file.
- **A security review before every release.** A finding blocks the release until it's fixed.

## Design

A Thai-first interface with a written design system, light and dark themes, and layouts checked at 375 px and inside the LINE in-app browser. Accessibility checks with axe run as part of the end-to-end tests.

## Numbers

Measured on 26 September 2026:

- About **3,200 unit tests** passing (1,956 backend, 1,238 frontend)
- **412 Playwright end-to-end tests** across desktop, 375 px mobile and LINE profiles
- axe: **0 serious or critical issues** across about 55 routes and the key dialogs

## What I learned

- **Fix permissions from inside the thing that owns them.** One recursive permission change on the host took the database offline for hours.
- **A deploy script can't upgrade itself.** The copy on the server is the old one until the new release is checked out, so the first upgrade has to run the new release's own script.
- **Isolate at the account boundary, not on the code.** Tightening file modes on the source broke the build in surprising ways; a separate account did the job cleanly.

## Stack

Next.js · TypeScript · Bun · Elysia · PostgreSQL · Playwright · axe

## What's next

- Faster analysis for very large bank statements (tens of thousands of rows)
- Self-hosted map tiles
- A phone-first "work mode" for the analysis tools

The source isn't public.
