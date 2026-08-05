import type { ReactNode } from 'react'
import Button from '../components/Button'

type QA = {
  question: string
  answer: ReactNode
}

const faqs: QA[] = [
  {
    question: 'Do I own the code Pravan generates?',
    answer: (
      <p>
        Yes, outright. Generated code ships under a permissive, MIT-style license that's
        yours to use — modify it, relicense your own project however you want, deploy it
        anywhere, no attribution requirement back to Pravan. Full export is available on
        every plan, including Free, at any time.
      </p>
    ),
  },
  {
    question: 'What happens if I cancel my plan?',
    answer: (
      <p>
        You can export everything — full source, schema and migration history, and
        environment variable names — before or after cancelling. Cancelling stops billing
        and downgrades project limits; it doesn't hold your code hostage or time-box your
        ability to get it out.
      </p>
    ),
  },
  {
    question: 'How is this different from credit-based builders?',
    answer: (
      <p>
        Credit-based builders charge per message or per generation, so a failed build or
        a debugging round trip burns real money. Pravan's plans are flat: a failed
        generation, a self-healing retry, or an extra round of iteration never shows up
        as a charge. You pay for a plan tier, not for the agent's attempts.
      </p>
    ),
  },
  {
    question: 'Can I bring my own backend?',
    answer: (
      <p>
        Yes. If you already have a database or API you want the app to use, point the
        project at your existing connection details and the agent generates against your
        schema instead of provisioning a new one. You're not required to use Pravan's
        managed Postgres.
      </p>
    ),
  },
  {
    question: 'Is generated code reviewed for security before it goes live?',
    answer: (
      <p>
        Every deploy is scanned for exposed secrets, known dependency vulnerabilities, and
        common misconfigurations, and generated backends are checked for row-level
        security policies that actually match your intended access rules. High-severity
        findings block the deploy until resolved or explicitly overridden by you.
      </p>
    ),
  },
  {
    question: 'How does handing a project off to my team work?',
    answer: (
      <p>
        On the Team plan, invite teammates with a role (owner, editor, viewer) and they
        see the same project, knowledge files, and build history you do — no separate
        export-and-reimport step. Live collaboration means two people can be in the same
        project at once without stepping on each other's changes.
      </p>
    ),
  },
  {
    question: 'Can I use my own custom domain?',
    answer: (
      <p>
        Yes, on Maker and above. Point a CNAME at the address Pravan provides and TLS is
        provisioned and renewed automatically. Once attached, future promotions to
        production go live on your domain without extra configuration.
      </p>
    ),
  },
  {
    question: 'Do you offer refunds?',
    answer: (
      <p>
        If a paid plan isn't working out within the first 14 days, contact support for a
        full refund. After that window, cancelling stops future billing but we don't
        prorate the current billing period.
      </p>
    ),
  },
  {
    question: "How is my data and my project's data handled?",
    answer: (
      <p>
        Secrets and credentials are stored in a vaulted store scoped to your project and
        injected at runtime — they're never written into generated source, so they can't
        leak through an export or a GitHub push. Your project data isn't used to train
        models for other customers.
      </p>
    ),
  },
  {
    question: 'Can I choose which model powers the agent?',
    answer: (
      <p>
        Pravan defaults to the model combination that tests best for planning and
        code generation, and we upgrade it as better options become available. Team and
        Scale plans can pin a specific model version for reproducibility if your workflow
        needs a fixed target.
      </p>
    ),
  },
  {
    question: 'What if the agent gets something wrong?',
    answer: (
      <p>
        When a build step fails, the agent traces the actual error back to its root cause
        and retries with a scoped fix, capped at a few attempts. If it still can't resolve
        the issue cleanly, it reports the failure honestly instead of shipping a
        workaround — you always see real status, not a green checkmark papering over a
        broken build.
      </p>
    ),
  },
  {
    question: 'Do projects support multiple environments?',
    answer: (
      <p>
        Every project separates development, staging, and production, each with its own
        environment variables and secrets. Team plans add persistent staging environments
        that survive independently of any single build, so your team has a stable
        pre-production URL to review against.
      </p>
    ),
  },
]

export default function Faq() {
  return (
    <div className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Frequently asked <span className="text-gradient">questions</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Everything that doesn't fit neatly in the docs or the pricing table.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map(item => (
            <details
              key={item.question}
              className="group rounded-xl border border-line bg-surface open:border-accent/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-zinc-100 marker:content-none">
                {item.question}
                <span className="shrink-0 text-zinc-400 transition group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-zinc-300">{item.answer}</div>
            </details>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-line bg-glow p-8 text-center">
          <h2 className="text-xl font-bold text-zinc-100">Still have questions?</h2>
          <p className="mt-2 text-zinc-400">
            The fastest way to find out if Pravan fits is to describe the app you actually want to build.
          </p>
          <Button href="/builder" className="mt-6">
            Start building
          </Button>
        </div>
      </div>
    </div>
  )
}
