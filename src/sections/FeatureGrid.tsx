import type { ReactNode } from 'react'

type IconProps = { children: ReactNode }

function Icon({ children }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent2"
    >
      {children}
    </svg>
  )
}

type Feature = {
  title: string
  body: string
  icon: ReactNode
}

const features: Feature[] = [
  {
    title: 'Plan-then-execute AI builder',
    body: 'Pravan writes a plan before it writes code, so changes land coherent instead of guessed one file at a time.',
    icon: (
      <Icon>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </Icon>
    ),
  },
  {
    title: 'Full code export & GitHub sync',
    body: 'Every app is real source code. Push to your own repo any time — there is no proprietary format holding it hostage.',
    icon: (
      <Icon>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </Icon>
    ),
  },
  {
    title: 'Built-in auth, DB & storage',
    body: 'Login, a real database, and file storage are wired in from the first prompt — no separate services to stitch together.',
    icon: (
      <Icon>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
      </Icon>
    ),
  },
  {
    title: 'One-click deploy & custom domains',
    body: 'Ship to a live URL instantly, then point your own domain at it whenever you are ready — no DevOps required.',
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" />
      </Icon>
    ),
  },
  {
    title: 'Security scanning on every generation',
    body: 'Each build is checked for exposed secrets and missing row-level security before it ever reaches production.',
    icon: (
      <Icon>
        <path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z" />
        <path d="M9.5 12l1.8 1.8L15 10" />
      </Icon>
    ),
  },
  {
    title: 'Visual edit mode',
    body: 'Click any element on the live preview to tweak copy, spacing, or color directly — changes sync straight back to code.',
    icon: (
      <Icon>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
      </Icon>
    ),
  },
  {
    title: 'Error self-healing',
    body: 'When something breaks, Pravan explains the root cause in plain language and fixes it — instead of silently retrying forever.',
    icon: (
      <Icon>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </Icon>
    ),
  },
  {
    title: 'Predictable flat pricing',
    body: 'One flat monthly price. No credit roulette, no surprise metering when a build takes a few extra passes.',
    icon: (
      <Icon>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </Icon>
    ),
  },
  {
    title: 'Team workspaces & live collab',
    body: 'Invite your team into the same project and watch changes appear together, in real time, with no merge drama.',
    icon: (
      <Icon>
        <circle cx="9" cy="7" r="4" />
        <path d="M2.5 21a6.5 6.5 0 0 1 13 0" />
        <circle cx="18" cy="8" r="3" />
        <path d="M15.5 21a5 5 0 0 1 6.4-4.8" />
      </Icon>
    ),
  },
]

export default function FeatureGrid() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything a real app needs, <span className="text-gradient">not just a demo</span>
          </h2>
          <p className="mt-4 text-zinc-400">
            The parts every "AI builder" leaves for later, built in from prompt one.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(f => (
            <div
              key={f.title}
              className="rounded-xl border border-line bg-surface p-6 transition hover:border-accent/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-raised">
                {f.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-100">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
