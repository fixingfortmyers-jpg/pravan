import { useMemo, useState } from 'react'
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

// Pravan's actual flat price (Maker plan — see /pricing). Not an assumption:
// it's what we charge, so it's the one number in this calculator that isn't editable.
const PRAVAN_FLAT_MONTHLY = 24

// Documented behavior, not a tunable input: monthly-billed credits lapse two
// months after issuance (see "Credits expire in 2 months" above).
const CREDIT_EXPIRY_MONTHS = 2

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

type CalcInputs = {
  promptsPerMonth: number
  creditsPerRun: number
  failureRatePct: number
  months: number
  monthlyPlanPrice: number
  includedCredits: number
  overageRate: number
}

function useCostComparison(inputs: CalcInputs) {
  return useMemo(() => {
    const promptsPerMonth = clampNumber(inputs.promptsPerMonth, 0, 2000)
    const creditsPerRun = clampNumber(inputs.creditsPerRun, 0, 200)
    const failureRatePct = clampNumber(inputs.failureRatePct, 0, 100)
    const months = clampNumber(inputs.months, 1, 24)
    const monthlyPlanPrice = clampNumber(inputs.monthlyPlanPrice, 0, 100000)
    const includedCredits = clampNumber(inputs.includedCredits, 0, 1000000)
    const overageRate = clampNumber(inputs.overageRate, 0, 1000)

    const totalRuns = promptsPerMonth * months
    // Failed runs still consume credits, so failure rate doesn't discount
    // credit usage — it only tells you how many of those runs bought nothing.
    const wastedRuns = Math.round(totalRuns * (failureRatePct / 100))
    const totalCreditsConsumed = totalRuns * creditsPerRun
    const wastedCredits = wastedRuns * creditsPerRun

    // Credits are issued in a fixed monthly batch and expire after
    // CREDIT_EXPIRY_MONTHS. Usage is modeled as a constant monthly rate, so a
    // month that runs a surplus never gets a later deficit month to absorb
    // it before the batch lapses — the whole surplus is forfeited.
    const creditsUsedPerMonth = promptsPerMonth * creditsPerRun
    const monthlySurplus = Math.max(includedCredits - creditsUsedPerMonth, 0)
    const monthlyDeficit = Math.max(creditsUsedPerMonth - includedCredits, 0)
    const expiredCredits = monthlySurplus * months
    const overageCredits = monthlyDeficit * months
    const overageCost = overageCredits * overageRate

    const competitorCost = monthlyPlanPrice * months + overageCost
    const pravanCost = PRAVAN_FLAT_MONTHLY * months
    const delta = competitorCost - pravanCost
    const deltaPct = competitorCost > 0 ? (delta / competitorCost) * 100 : 0

    return {
      totalRuns,
      wastedRuns,
      totalCreditsConsumed,
      wastedCredits,
      expiredCredits,
      overageCredits,
      overageCost,
      competitorCost,
      pravanCost,
      delta,
      deltaPct: clampNumber(deltaPct, -100000, 100),
      months,
    }
  }, [inputs])
}

type SliderFieldProps = {
  id: string
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  formatValue: (value: number) => string
}

function SliderField({ id, label, min, max, step, value, onChange, formatValue }: SliderFieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
        <span className="text-sm font-semibold text-zinc-100">{formatValue(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        aria-valuetext={formatValue(value)}
        className="mt-2 w-full accent-accent"
      />
    </div>
  )
}

type NumberFieldProps = {
  id: string
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
}

function NumberField({ id, label, min, max, step, value, onChange, prefix, suffix }: NumberFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-1 rounded-lg border border-line bg-ink px-3 py-2">
        {prefix && <span className="text-sm text-zinc-500">{prefix}</span>}
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => {
            const parsed = Number(e.target.value)
            onChange(clampNumber(parsed, min, max))
          }}
          className="w-full bg-transparent text-sm text-zinc-100 outline-none"
        />
        {suffix && <span className="text-sm text-zinc-500">{suffix}</span>}
      </div>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="font-semibold text-zinc-100">{value}</dd>
    </div>
  )
}

function CostCalculator() {
  const [promptsPerMonth, setPromptsPerMonth] = useState(150)
  const [creditsPerRun, setCreditsPerRun] = useState(4)
  const [failureRatePct, setFailureRatePct] = useState(25)
  const [months, setMonths] = useState(3)
  const [monthlyPlanPrice, setMonthlyPlanPrice] = useState(25)
  const [includedCredits, setIncludedCredits] = useState(100)
  const [overageRate, setOverageRate] = useState(0.35)

  const result = useCostComparison({
    promptsPerMonth,
    creditsPerRun,
    failureRatePct,
    months,
    monthlyPlanPrice,
    includedCredits,
    overageRate,
  })

  const cheaperWithPravan = result.delta >= 0

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="space-y-6 rounded-xl border border-line bg-surface p-6">
        <div>
          <h3 className="font-semibold text-zinc-100">Your usage</h3>
          <div className="mt-4 space-y-5">
            <SliderField
              id="prompts-per-month"
              label="Prompts / edits per month"
              min={10}
              max={400}
              step={10}
              value={promptsPerMonth}
              onChange={setPromptsPerMonth}
              formatValue={v => `${v}`}
            />
            <SliderField
              id="credits-per-run"
              label="Avg credits consumed per run"
              min={1}
              max={20}
              step={0.5}
              value={creditsPerRun}
              onChange={setCreditsPerRun}
              formatValue={v => `${v}`}
            />
            <SliderField
              id="failure-rate"
              label="Failure / retry rate"
              min={0}
              max={100}
              step={5}
              value={failureRatePct}
              onChange={setFailureRatePct}
              formatValue={v => `${v}%`}
            />
            <SliderField
              id="usage-months"
              label="Months of usage"
              min={1}
              max={12}
              step={1}
              value={months}
              onChange={setMonths}
              formatValue={v => `${v} mo`}
            />
          </div>
        </div>

        <div className="border-t border-line pt-5">
          <h3 className="font-semibold text-zinc-100">Competitor pricing — your assumptions</h3>
          <p className="mt-2 text-xs text-zinc-500">
            Credit value varies by plan and feature and there's no public calculator, so
            these three numbers are assumptions you set, not facts we're asserting. Change
            them to match the plan you're actually comparing.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <NumberField
              id="plan-price"
              label="Monthly plan price"
              min={0}
              max={1000}
              step={1}
              value={monthlyPlanPrice}
              onChange={setMonthlyPlanPrice}
              prefix="$"
            />
            <NumberField
              id="included-credits"
              label="Credits included / mo"
              min={0}
              max={5000}
              step={10}
              value={includedCredits}
              onChange={setIncludedCredits}
            />
            <NumberField
              id="overage-rate"
              label="Overage price / credit"
              min={0}
              max={10}
              step={0.05}
              value={overageRate}
              onChange={setOverageRate}
              prefix="$"
            />
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Fixed, not editable: credits expire {CREDIT_EXPIRY_MONTHS} months after issuance
            on monthly billing, and failed runs still consume credits — both documented
            above, not assumptions.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-line bg-surface p-6">
          <h3 className="font-semibold text-zinc-100">What actually happens to your spend</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <StatRow label="Total runs" value={`${result.totalRuns}`} />
            <StatRow label="Wasted runs (failed / retried)" value={`${result.wastedRuns}`} />
            <StatRow
              label="Credits consumed (incl. wasted runs)"
              value={`${result.totalCreditsConsumed.toFixed(1)}`}
            />
            <StatRow label="Credits burned on failed runs" value={`${result.wastedCredits.toFixed(1)}`} />
            <StatRow label="Credits expired unused" value={`${result.expiredCredits.toFixed(1)}`} />
            <StatRow
              label="Overage credits purchased"
              value={`${result.overageCredits.toFixed(1)} (${currency.format(result.overageCost)})`}
            />
          </dl>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="text-xs uppercase tracking-wide text-zinc-500">Competitor, effective cost</div>
            <div className="mt-2 text-2xl font-bold text-zinc-100">{currency.format(result.competitorCost)}</div>
            <div className="text-xs text-zinc-500">over {result.months} mo, credit-based</div>
          </div>
          <div className="rounded-xl border border-accent/40 bg-surface p-5">
            <div className="text-xs uppercase tracking-wide text-zinc-500">Pravan, flat</div>
            <div className="mt-2 text-2xl font-bold text-zinc-100">{currency.format(result.pravanCost)}</div>
            <div className="text-xs text-zinc-500">over {result.months} mo, failed runs cost nothing</div>
          </div>
        </div>

        <div className="rounded-xl border border-accent/40 bg-glow p-6 text-center">
          <div className="text-xs uppercase tracking-wide text-zinc-500">
            {cheaperWithPravan ? 'You save with Pravan' : 'Competitor is cheaper at these inputs'}
          </div>
          <div className="mt-2 text-3xl font-bold text-gradient">
            {currency.format(Math.abs(result.delta))}
            <span className="ml-2 text-lg">({Math.abs(result.deltaPct).toFixed(0)}%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

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
          <h2 className="text-2xl font-bold text-zinc-100">The cost calculator they don't have</h2>
          <p className="mt-4 text-zinc-300">
            "No cost calculator" is one of the traps above — spend is unpredictable by
            design. Set your own usage and pricing assumptions below and see exactly where
            the money goes, run by run, credit by credit.
          </p>
          <CostCalculator />
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
