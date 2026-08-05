import type { ReactNode } from 'react'
import Button from '../components/Button'

type TimelineItem = {
  date: string
  title: string
  body: ReactNode
  source: string
}

const timeline: TimelineItem[] = [
  {
    date: '2025-03-21 reported / 2025-05-29 published',
    title: 'CVE-2025-48757 — missing Row-Level Security',
    body: (
      <>
        Systemic missing RLS in Lovable-generated Supabase backends. 170+ apps /
        303 endpoints exposed names, emails, phones, payment status, and
        third-party API keys to anyone holding the public anon key.
      </>
    ),
    source: 'superblocks.com/blog/lovable-vulnerabilities · vibeappscanner.com/lovable-security',
  },
  {
    date: 'April 2026',
    title: 'Platform BOLA leak',
    body: (
      <>
        Free-tier accounts could pull other users' source code, DB credentials,
        and chat histories through Lovable's own API. The vendor first called
        it "intentional behavior," then admitted a February 2026 permissions
        change had re-enabled the access — roughly 48 days from report to
        disclosure.
      </>
    ),
    source: 'theregister.com/2026/04/20/lovable_denies_data_leak',
  },
  {
    date: 'ongoing',
    title: 'Inverted auth logic, ~18,000 users exposed',
    body: (
      <>
        An app-level defect in a Lovable-built app — not a platform issue —
        inverted its own auth check and exposed roughly 18,000 users' data.
      </>
    ),
    source: 'news.ycombinator.com/item?id=47182659',
  },
  {
    date: 'recurring',
    title: 'Hardcoded API keys in generated frontends',
    body: (
      <>
        A repeat scanner finding across generated projects: API keys baked
        directly into shipped frontend code instead of injected at runtime.
      </>
    ),
    source: 'vibeappscanner.com/security-issue/lovable-exposed-api-keys',
  },
]

type Trap = {
  title: string
  body: string
}

const traps: Trap[] = [
  {
    title: 'Credits expire in 2 months',
    body: 'Monthly-billed plan credits lapse two months after issuance, so unused spend is simply forfeited.',
  },
  {
    title: 'Free tier quantity is unstated',
    body: "The pricing page doesn't say how many credits the free tier actually includes.",
  },
  {
    title: 'No cost calculator',
    body: 'Credit value varies by plan and feature with no tool to estimate spend before you commit to a build.',
  },
  {
    title: 'Single-branch git sync, no repo import',
    body: 'Sync works with exactly one branch, and you cannot connect an existing repository — reconnecting creates a brand-new one.',
  },
  {
    title: 'Reverts restore code only',
    body: 'Rolling back a change never restores data, only the generated code — a partial undo dressed up as a full one.',
  },
  {
    title: 'Secrets are write-only',
    body: 'Once a secret is saved you cannot read it back through the product to verify or copy it elsewhere.',
  },
  {
    title: 'Region is permanent',
    body: 'Cloud hosting region is locked in at first choice, with no supported path to move a project later.',
  },
  {
    title: 'Verification only on request',
    body: "Tests and browser checks run only when explicitly asked — not a default gate before a change is reported \"fixed.\"",
  },
]

type PlanStep = {
  title: string
  body: string
}

const plan: PlanStep[] = [
  {
    title: 'Flat pricing with a live usage ledger',
    body: 'Charge a flat rate where failed runs cost nothing, and show a running ledger of what each action spent. This kills the unpredictable-spend problem credit expiry and no-calculator create together.',
  },
  {
    title: 'Security as a publish gate, not a suggestion',
    body: 'Block publish outright when a table would be world-readable, the same way a broken build blocks deploy. This is the direct fix for the missing-RLS pattern behind CVE-2025-48757.',
  },
  {
    title: 'Auth-path CI test on every generated app',
    body: 'Automatically generate and run a test that checks a user cannot read another user\'s records. This is the direct fix for the inverted-auth-logic class of bug that exposed 18,000 users.',
  },
  {
    title: 'Verify-then-report agent loop',
    body: 'Require the agent to run tests and browser checks before it is allowed to say a change is done. This removes the "verification only on request" gap and stops false "fixed" reports.',
  },
  {
    title: 'Diff-scoped edits',
    body: 'Show every change as a reviewable diff against exactly the files touched, never a silent full-file rewrite. This gives builders confidence to approve changes without re-reading an entire project.',
  },
  {
    title: 'Handoff-quality code',
    body: 'Generate code a human engineer could take over without a rewrite — consistent naming, no dead scaffolding, real comments where they matter. This kills the "looks generated" trust gap that stops teams from shipping AI-built code to production.',
  },
  {
    title: 'Real support SLA',
    body: 'Publish and honor an actual response-time commitment instead of best-effort community support. This addresses the credibility gap that shows up whenever an incident needs a fast, accountable answer.',
  },
  {
    title: 'Performance budgets',
    body: 'Set and enforce bundle-size and load-time budgets on generated apps so early velocity does not quietly become an unusable app. This prevents "it works today, it\'s unshippable in three months."',
  },
  {
    title: 'Day-one table stakes',
    body: 'Ship MCP support, a plan-before-execute mode, real browser testing, and multiplayer editing from day one rather than bolting them on later. These are the features builders now expect before they will even trial a tool.',
  },
  {
    title: 'Honest incident response',
    body: 'When something breaks, disclose it plainly and on a fast timeline instead of calling it "intentional behavior." This is the direct fix for the trust damage the April 2026 BOLA leak response caused.',
  },
]

export default function Teardown() {
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-4xl space-y-16">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">The honest teardown</h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Pravan, to Pravan — the builder, not the product. You run a
            Lovable-class app builder and you want to know what's actually
            wrong with the category and what to do about it, not a sales
            pitch dressed as analysis. Every claim below cites its source.
            This is why we built what we built.
          </p>
        </div>

        <section className="border-t border-line pt-10">
          <h2 className="text-2xl font-bold text-zinc-100">Security record</h2>
          <p className="mt-4 text-zinc-300">
            This is the part that matters most to anyone evaluating the
            category: a track record, in order, with sources.
          </p>
          <ol className="mt-8 space-y-8 border-l border-line pl-6">
            {timeline.map(item => (
              <li key={item.title} className="relative">
                <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">{item.date}</div>
                <h3 className="mt-1 text-lg font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-2 text-zinc-300">{item.body}</p>
                <p className="mt-2 text-xs text-zinc-500">[{item.source}]</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-zinc-500">
            One unverified item, flagged as such: a Trustpilot allegation of
            paid reviews rests on a single source and is treated as anecdote,
            not fact.
          </p>
        </section>

        <section className="border-t border-line pt-10">
          <h2 className="text-2xl font-bold text-zinc-100">Product traps</h2>
          <p className="mt-4 text-zinc-300">
            Beyond security, a set of product decisions that quietly cost
            builders money, time, or control.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {traps.map(t => (
              <div key={t.title} className="rounded-xl border border-line bg-surface p-5">
                <h3 className="font-semibold text-zinc-100">{t.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-line pt-10">
          <h2 className="text-2xl font-bold text-zinc-100">The plan</h2>
          <p className="mt-4 text-zinc-300">
            Ten steps, prioritized, each tied to a specific pain above rather
            than a generic feature-list promise.
          </p>
          <ol className="mt-8 space-y-6">
            {plan.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-xl border border-line bg-surface p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 text-sm font-bold text-ink">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-zinc-100">{step.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-line pt-10 text-center">
          <h2 className="text-2xl font-bold text-zinc-100">Ship it live today</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
            An orchestrated agent swarm — a planner model coordinating parallel
            worker agents — can take a real site from a single prompt to a
            live domain in under an hour. This page, and the site around it,
            is the proof: it was built exactly that way.
          </p>
          <div className="mt-8">
            <Button href="/builder">Watch the swarm build</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
