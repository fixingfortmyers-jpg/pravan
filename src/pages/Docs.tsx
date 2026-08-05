import type { ReactNode } from 'react'

type Section = {
  id: string
  label: string
  title: string
  body: ReactNode
}

const sections: Section[] = [
  {
    id: 'quickstart',
    label: 'Quickstart',
    title: 'Quickstart',
    body: (
      <>
        <p className="text-zinc-300">
          Open the builder and describe the app you want in plain language — "a booking
          app for my auto shop with a calendar and customer intake form" is enough to
          start. Pravan doesn't need a spec document; it asks clarifying questions only
          when your prompt is genuinely ambiguous.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-zinc-300">
          <li>Describe your app in the chat pane, in as much or as little detail as you have.</li>
          <li>Review the plan the agent proposes — routes, schema, and file layout — before it touches disk.</li>
          <li>Watch the build stream in with a live preview running alongside the code view.</li>
          <li>Iterate with follow-up prompts; each change is scoped to what you asked for.</li>
        </ol>
      </>
    ),
  },
  {
    id: 'how-the-agent-works',
    label: 'How the agent works',
    title: 'How the agent works',
    body: (
      <>
        <p className="text-zinc-300">
          The agent plans before it executes. Given a prompt, it first drafts a concrete
          plan — which files it will create or touch, what the schema and routes look
          like, how the change fits your existing project — and surfaces that plan before
          writing anything. You're reviewing a diff-shaped intention, not reverse-engineering
          a pile of generated files after the fact.
        </p>
        <p className="mt-4 text-zinc-300">
          When execution hits a failure — a type error, a failed migration, a missing
          import — the agent doesn't reach for the nearest pattern-matched fix. It
          inspects the actual error output, traces it back to the root cause, and applies
          a scoped patch that addresses that cause. This self-healing loop is capped at a
          small number of retries; if it can't resolve the issue cleanly within that
          budget, it stops and reports the failure honestly instead of papering over it
          with a workaround you'd have to unwind later.
        </p>
      </>
    ),
  },
  {
    id: 'connecting-a-database',
    label: 'Connecting a database',
    title: 'Connecting a database',
    body: (
      <>
        <p className="text-zinc-300">
          Every project gets a managed Postgres database provisioned automatically the
          first time your app needs one — no separate signup, no connection string to
          copy in by hand. Schema changes the agent makes are written as tracked
          migration files in your project, so history is visible and reviewable, not
          hidden behind a dashboard.
        </p>
        <p className="mt-4 text-zinc-300">
          Prefer to run your own database? Point the project at an existing connection
          string and the agent will generate migrations and queries against your schema
          instead of provisioning a new one. Both paths go through the same review flow —
          you see the migration before it runs.
        </p>
      </>
    ),
  },
  {
    id: 'auth-in-one-prompt',
    label: 'Auth in one prompt',
    title: 'Auth in one prompt',
    body: (
      <>
        <p className="text-zinc-300">
          Ask for "add login with email and Google" and the agent scaffolds the full
          flow in one pass: session handling, protected routes, password reset, and OAuth
          callback configuration. It wires the pieces that are easy to get subtly wrong —
          session expiry, redirect handling, secure cookie flags — the same way each time.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-300">
          <li>Email/password and OAuth providers can be added independently or together.</li>
          <li>Protected routes and role checks are generated alongside the pages that need them.</li>
          <li>You review the generated auth code like any other change — nothing is hidden behind a managed black box.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'deploys-and-custom-domains',
    label: 'Deploys & custom domains',
    title: 'Deploys & custom domains',
    body: (
      <>
        <p className="text-zinc-300">
          Every successful build gets its own preview URL automatically, so you can share
          a working link before deciding to promote anything to production. Promoting a
          preview to production is a single click — there's no separate deploy pipeline
          to configure first.
        </p>
        <p className="mt-4 text-zinc-300">
          Custom domains are supported on paid plans: point a CNAME at the address
          Pravan gives you, and TLS is provisioned and renewed automatically. Once a
          domain is attached, future promotions go live on it without re-configuring
          anything.
        </p>
      </>
    ),
  },
  {
    id: 'github-sync-and-code-export',
    label: 'GitHub sync & code export',
    title: 'GitHub sync & code export',
    body: (
      <>
        <p className="text-zinc-300">
          Connect a GitHub repository and every generation can push a branch or commit
          directly, depending on how you configure sync. This runs in both directions —
          changes pushed to the connected branch are picked up by the agent as project
          context, so you're never forced to choose between hand-editing and prompting.
        </p>
        <p className="mt-4 text-zinc-300">
          Full code export is available as a zip download on every plan, including Free,
          at any time — not just when you cancel. The exported code has no runtime
          dependency on Pravan; it's a plain project you can build, deploy, and modify
          on your own.
        </p>
      </>
    ),
  },
  {
    id: 'security-model',
    label: 'Security model',
    title: 'Security model',
    body: (
      <>
        <p className="text-zinc-300">
          Secrets are never written into generated source. They're stored in a vaulted
          store scoped to your project and injected as environment variables at runtime,
          so a code export or a GitHub push can't leak a credential by accident.
        </p>
        <p className="mt-4 text-zinc-300">
          For generated backends, the agent checks that row-level security policies
          actually match your intended access rules — for example, that a customer can
          read their own records but not another customer's — rather than relying solely
          on application-layer checks that can be bypassed by a direct API call.
        </p>
        <p className="mt-4 text-zinc-300">
          Before every deploy, the project is scanned for exposed secrets, known
          dependency vulnerabilities, and common misconfiguration patterns. High-severity
          findings block the deploy until they're resolved or explicitly overridden by
          you.
        </p>
      </>
    ),
  },
  {
    id: 'knowledge-files-and-project-context',
    label: 'Knowledge files & project context',
    title: 'Knowledge files & project context',
    body: (
      <>
        <p className="text-zinc-300">
          Each project keeps a set of knowledge files — plain-language notes on
          decisions, conventions, and constraints that matter for that project, similar
          to a living design doc. The agent reads these before every generation, so a
          decision you made three prompts ago (naming conventions, which fields are
          required, which routes are off-limits) doesn't get silently reversed later.
        </p>
        <p className="mt-4 text-zinc-300">
          You can edit knowledge files directly, or ask the agent to update them as part
          of a change — "remember that all prices are stored in cents" sticks around for
          every future prompt in that project, not just the current one.
        </p>
      </>
    ),
  },
  {
    id: 'environments',
    label: 'Environments',
    title: 'Environments',
    body: (
      <>
        <p className="text-zinc-300">
          Projects distinguish development, staging, and production, each with its own
          scoped environment variables and secrets so a test API key never ends up live.
          Preview URLs from ordinary builds behave like development; promoting to
          production uses the production scope.
        </p>
        <p className="mt-4 text-zinc-300">
          Team plans add dedicated staging environments that persist independently of any
          single build, so a team can share a stable pre-production URL for review
          without it being overwritten by the next preview.
        </p>
      </>
    ),
  },
  {
    id: 'limits',
    label: 'Limits',
    title: 'Limits',
    body: (
      <>
        <p className="text-zinc-300">
          Pravan doesn't meter individual prompts or generations — a failed build or a
          self-healing retry never costs you anything extra. What does vary by plan is
          the number of concurrent projects (3 on Free, unlimited above it) and a fair-use
          build-time budget designed to catch abuse, not normal iteration.
        </p>
        <p className="mt-4 text-zinc-300">
          If you're consistently running into the build-time budget on a paid plan,
          that's a signal to talk to us about Scale rather than a wall you're expected to
          work around.
        </p>
      </>
    ),
  },
]

export default function Docs() {
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
        <nav className="mb-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs text-zinc-400 hover:bg-raised hover:text-zinc-100"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-1 text-sm">
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block rounded-md px-3 py-2 text-zinc-400 transition hover:bg-raised hover:text-zinc-100"
              >
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        <div className="min-w-0 space-y-16">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Docs</h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              Everything you need to go from a prompt to a deployed app you own outright.
            </p>
          </div>
          {sections.map(s => (
            <section key={s.id} id={s.id} className="scroll-mt-24 border-t border-line pt-10">
              <h2 className="text-2xl font-bold text-zinc-100">{s.title}</h2>
              <div className="mt-4">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
