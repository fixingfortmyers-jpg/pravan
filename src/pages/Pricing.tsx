import { useState } from 'react'
import Button from '../components/Button'

type Tier = {
  name: string
  tagline: string
  monthly: number | null
  perUser?: boolean
  highlight?: boolean
  cta: string
  ctaHref: string
  ctaVariant: 'primary' | 'ghost'
  features: string[]
}

const tiers: Tier[] = [
  {
    name: 'Free',
    tagline: 'Try the full agent, no card required.',
    monthly: 0,
    cta: 'Start building',
    ctaHref: '/builder',
    ctaVariant: 'ghost',
    features: ['3 projects', 'Community support', 'Full code export — always free'],
  },
  {
    name: 'Maker',
    tagline: 'For builders shipping real projects solo.',
    monthly: 24,
    highlight: true,
    cta: 'Start building',
    ctaHref: '/builder',
    ctaVariant: 'primary',
    features: ['Unlimited projects', 'Custom domains', 'GitHub sync', 'Security scanning'],
  },
  {
    name: 'Team',
    tagline: 'For teams building and reviewing together.',
    monthly: 59,
    perUser: true,
    cta: 'Start building',
    ctaHref: '/builder',
    ctaVariant: 'ghost',
    features: ['Live collaboration', 'Roles & permissions', 'Shared design system', 'Staging environments', 'SSO'],
  },
  {
    name: 'Scale',
    tagline: 'For organizations with dedicated needs.',
    monthly: null,
    cta: 'Talk to us',
    ctaHref: '/faq',
    ctaVariant: 'ghost',
    features: ['Dedicated infrastructure', 'Audit logs', 'SLA'],
  },
]

type Row = {
  feature: string
  values: [string, string, string, string]
}

const comparisonRows: Row[] = [
  { feature: 'Projects', values: ['3', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { feature: 'Code export', values: ['Full, always free', 'Full, always free', 'Full, always free', 'Full, always free'] },
  { feature: 'Failed builds billed', values: ['Never', 'Never', 'Never', 'Never'] },
  { feature: 'Custom domains', values: ['—', '✓', '✓', '✓'] },
  { feature: 'GitHub sync', values: ['—', '✓', '✓', '✓'] },
  { feature: 'Security scanning before deploy', values: ['—', '✓', '✓', '✓'] },
  { feature: 'Live collaboration', values: ['—', '—', '✓', '✓'] },
  { feature: 'Roles & permissions', values: ['—', '—', '✓', '✓'] },
  { feature: 'Shared design system', values: ['—', '—', '✓', '✓'] },
  { feature: 'Staging environments', values: ['—', '—', '✓', '✓'] },
  { feature: 'SSO', values: ['—', '—', '✓', '✓'] },
  { feature: 'Dedicated infrastructure', values: ['—', '—', '—', '✓'] },
  { feature: 'Audit logs', values: ['—', '—', '—', '✓'] },
  { feature: 'SLA', values: ['—', '—', '—', '✓'] },
]

function annualEquivalent(monthly: number): number {
  // Annual billing charges 10 months up front (2 months free); the number
  // shown is that annual total spread back over 12 for a monthly read.
  return Math.round((monthly * 10) / 12)
}

function priceDisplay(tier: Tier, isAnnual: boolean): string {
  if (tier.monthly === null) return 'Custom'
  if (tier.monthly === 0) return '$0'
  const amount = isAnnual ? annualEquivalent(tier.monthly) : tier.monthly
  return `$${amount}`
}

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Pricing that doesn't <span className="text-gradient">gamble with your budget</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            No credits, no per-message meter, no watching a balance drain while you debug.
            Pick a plan, build as much as the plan allows, and know the bill before it arrives.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-line bg-surface p-1">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                !isAnnual ? 'bg-raised text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                isAnnual ? 'bg-raised text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Annual <span className="text-accent2">— 2 months free</span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map(tier => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-xl border p-6 ${
                tier.highlight ? 'border-accent bg-surface shadow-2xl shadow-accent/10' : 'border-line bg-surface'
              }`}
            >
              {tier.highlight && (
                <span className="mb-3 inline-block w-fit rounded-full bg-gradient-to-r from-accent to-accent2 px-3 py-1 text-xs font-semibold text-ink">
                  Most popular
                </span>
              )}
              <h2 className="text-xl font-bold text-zinc-100">{tier.name}</h2>
              <p className="mt-1 text-sm text-zinc-400">{tier.tagline}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-zinc-100">{priceDisplay(tier, isAnnual)}</span>
                {tier.monthly !== null && tier.monthly > 0 && (
                  <span className="text-sm text-zinc-400">/{tier.perUser ? 'user/mo' : 'mo'}</span>
                )}
              </div>
              {tier.monthly !== null && tier.monthly > 0 && isAnnual && (
                <p className="mt-1 text-xs text-zinc-500">billed annually</p>
              )}
              <ul className="mt-6 flex-1 space-y-3 text-sm text-zinc-300">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-accent2">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button href={tier.ctaHref} variant={tier.ctaVariant} className="mt-8 w-full">
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-accent/40 bg-glow p-8">
          <h2 className="text-2xl font-bold text-zinc-100">Why flat pricing</h2>
          <p className="mt-3 max-w-3xl text-zinc-300">
            Most AI app builders charge per message or per credit — every prompt, every
            regeneration, every failed attempt burns down a balance you bought up front.
            That turns debugging into a cost decision: do you re-prompt to fix the bug,
            or eat the loss and work around it by hand? Users end up rationing their own
            tool.
          </p>
          <p className="mt-3 max-w-3xl text-zinc-300">
            Pravan doesn't meter individual generations. If the agent's first attempt fails
            a type check, hits a flaky install, or needs a self-healing retry, that never
            shows up as a line item — it's the cost of doing the job right, not something
            you're billed for. Your plan gives you a project ceiling and a support tier, not
            a ticking counter you have to watch mid-build.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-zinc-100">Compare plans</h2>
          <div className="mt-8 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-surface text-left text-zinc-100">
                  <th className="px-4 py-3 font-semibold">Feature</th>
                  {tiers.map(tier => (
                    <th key={tier.name} className="px-4 py-3 text-center font-semibold">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-transparent' : 'bg-surface/50'}>
                    <td className="px-4 py-3 text-zinc-300">{row.feature}</td>
                    {row.values.map((v, idx) => (
                      <td key={idx} className="px-4 py-3 text-center text-zinc-400">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
