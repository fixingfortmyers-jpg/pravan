# Pravan — build & orchestration plan

Product: **Pravan** — AI app builder competing with lovable.dev.
Live target: https://pravan.fixingfortmyers.com (GitHub Pages under fixingfortmyers-jpg, CNAME to be added by Tony in Google Cloud DNS).

## Architecture
Vite + React 19 + TS + Tailwind v4. No router dependency — App.tsx switches on
`location.pathname`; plain `<a>` navigation (full reload is fine for a marketing
site). GH Pages SPA fallback: copy `index.html` → `404.html` at build.

## Ownership map (disjoint file sets — no agent touches another's files)
- **Fable (me)**: vite.config.ts, index.html, src/main.tsx, src/App.tsx,
  src/index.css, src/components/{Nav,Footer,Button}.tsx, deploy pipeline.
- **Agent A (Sonnet)**: src/pages/Landing.tsx + src/sections/*.tsx
  (Hero, LogoWall, FeatureGrid, HowItWorks, Showcase, Testimonials, FinalCta).
- **Agent B (Sonnet)**: src/pages/Builder.tsx + src/builder/*.tsx —
  interactive scripted builder demo (chat pane + live preview + code view).
- **Agent C (Sonnet)**: src/pages/Pricing.tsx, src/pages/Docs.tsx,
  src/pages/Faq.tsx.
- **Gap-fill pass**: after recon agents return, one Sonnet pass adds missing
  feature parity content. Escalate any failed agent to Opus 5.

## Done-criteria
- Each agent: `npx tsc -p tsconfig.app.json --noEmit` clean for the whole tree.
- Integration: `npm run build` exit 0; every route renders in browser without
  console errors.
- Fable review at end; advice actioned; then deploy + ping.

## Design tokens (in src/index.css, Tailwind v4)
Dark theme. bg #0a0a0f, surface #12121a, border white/8%, text zinc-100/zinc-400,
accent gradient indigo-500 → cyan-400. Font: system stack. Rounded-xl cards,
subtle borders, generous whitespace. Classes only — no per-component CSS files.
