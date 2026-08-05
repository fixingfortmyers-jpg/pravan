import type { ReactNode } from 'react'

type App = {
  title: string
  description: string
  prompt: string
  mock: 'booking' | 'storefront' | 'dashboard'
}

const apps: App[] = [
  {
    title: 'Booking system',
    description: 'A scheduling app for a multi-bay auto shop with live availability.',
    prompt: '"build me a booking app for my auto shop with SMS reminders"',
    mock: 'booking',
  },
  {
    title: 'Storefront',
    description: 'A small-batch storefront with checkout and order tracking.',
    prompt: '"build a storefront for my ceramics shop with stripe checkout"',
    mock: 'storefront',
  },
  {
    title: 'Internal dashboard',
    description: 'An ops dashboard pulling live metrics for a small team.',
    prompt: '"build an internal dashboard for tracking team ticket volume"',
    mock: 'dashboard',
  },
]

function BrowserChrome({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink">
      <div className="flex items-center gap-1.5 border-b border-line bg-raised px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

function BookingMock() {
  return (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 21 }, (_, i) => (
        <div
          key={i}
          className={`h-4 rounded-sm ${i % 5 === 0 ? 'bg-accent/60' : i % 3 === 0 ? 'bg-accent2/40' : 'bg-raised'}`}
        />
      ))}
    </div>
  )
}

function StorefrontMock() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="space-y-1 rounded-sm bg-raised p-1.5">
          <div className="h-8 rounded-sm bg-gradient-to-br from-accent/40 to-accent2/30" />
          <div className="h-1.5 w-3/4 rounded-full bg-zinc-600" />
          <div className="h-1.5 w-1/2 rounded-full bg-zinc-700" />
        </div>
      ))}
    </div>
  )
}

function DashboardMock() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-sm bg-raised p-2">
            <div className="h-1.5 w-1/2 rounded-full bg-zinc-600" />
            <div className="mt-2 h-3 w-2/3 rounded-full bg-accent2/50" />
          </div>
        ))}
      </div>
      <div className="flex h-14 items-end gap-1 rounded-sm bg-raised p-2">
        {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-accent to-accent2"
          />
        ))}
      </div>
    </div>
  )
}

function Mock({ kind }: { kind: App['mock'] }) {
  if (kind === 'booking') return <BookingMock />
  if (kind === 'storefront') return <StorefrontMock />
  return <DashboardMock />
}

export default function Showcase() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Real apps, <span className="text-gradient">built from a prompt</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {apps.map(app => (
            <div key={app.title} className="rounded-xl border border-line bg-surface p-5">
              <BrowserChrome>
                <Mock kind={app.mock} />
              </BrowserChrome>
              <h3 className="mt-4 text-base font-semibold text-zinc-100">{app.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{app.description}</p>
              <p className="mt-3 font-mono text-xs text-zinc-500">{app.prompt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
