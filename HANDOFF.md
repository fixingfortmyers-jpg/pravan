# Handoff packet — Pravan vs. lovable.dev

Audience: account executive at a cybersecurity company evaluating the
competitive/security landscape around Lovable-class AI app builders.
Prepared 2026-08-04. All claims below carry sources; items that could not be
independently verified are marked UNVERIFIED.

## What this project is
Pravan (https://github.com/fixingfortmyers-jpg/pravan) — a marketing site +
interactive demo for an AI app builder positioned directly against
lovable.dev. Live target: https://pravan.fixingfortmyers.com (GitHub Pages;
CNAME `pravan` → `fixingfortmyers-jpg.github.io`, DNS record being added by a
separate agent).

## Security track record of the incumbent (the AE-relevant part)
- **CVE-2025-48757** — systemic missing Row-Level Security in
  Lovable-generated Supabase backends: 170+ apps / 303 endpoints exposed
  names, emails, phones, payment status, and third-party API keys to anyone
  with the public anon key. Reported 2025-03-21; CVE published 2025-05-29.
  Source: superblocks.com/blog/lovable-vulnerabilities, vibeappscanner.com/lovable-security
- **April 2026 platform BOLA leak** — free-tier accounts could pull other
  users' source code, DB credentials, and chat histories via Lovable's own
  API. Vendor initially called it "intentional behavior," later admitted a
  February 2026 permissions change re-enabled access; ~48 days report-to-
  disclosure. Source: theregister.com/2026/04/20/lovable_denies_data_leak/
- **Inverted auth logic** in a Lovable-built app exposed ~18,000 users
  (app-level defect of the generated code, not platform infra).
  Source: news.ycombinator.com/item?id=47182659
- Recurring scanner finding: hardcoded API keys in generated frontends.
  Source: vibeappscanner.com/security-issue/lovable-exposed-api-keys
- Vendor mitigations since: RLS on by default, pre-publish basic scan,
  on-demand deep scan, Wiz/Aikido integrations, AIUC-1 + SOC 2 Type II +
  ISO 27001 (vendor-stated; not independently audited by us).
- UNVERIFIED: Trustpilot allegation of paid reviews — single source, treat
  as anecdote.

## Product-surface deltas we exploit (from recon of lovable.dev + docs)
- Plan credits expire (2 months after issuance, monthly billing); free-tier
  credit quantity not stated on the pricing page; credit value varies by
  plan/feature with no calculator — spend is unpredictable by design.
- Git sync is single-branch and cannot import an existing repo; reconnect
  creates a new repo. Reverts restore code only, never data. Secrets are
  write-only. Cloud hosting region is permanent once chosen.
- Verification tools (tests/browser checks) run only when explicitly asked;
  not a default gate before "fixed" is reported.
- Pravan positioning against each: flat pricing (failed runs cost nothing),
  export-everything on every tier, security scan as a publish *gate*, and
  verify-then-report agent behavior.

## Project state (for whoever picks this up)
- Repo: fixingfortmyers-jpg/pravan (public). Source on `master`, site on
  `gh-pages` (orphan, rebuilt by `deploy.ps1` at repo root).
- Stack: Vite + React 19 + TS + Tailwind v4. No router dep — path switch in
  src/App.tsx; 404.html = SPA fallback; public/CNAME sets the domain.
- Full recon transcripts live in the session task outputs; this file is the
  distilled record.
- Done-criteria: `npm run build` exit 0; all 5 routes render clean;
  https://pravan.fixingfortmyers.com serves once DNS + Pages cert settle.
