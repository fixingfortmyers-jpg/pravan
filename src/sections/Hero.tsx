import Button from '../components/Button'

const fileTree = [
  'booking-app/',
  '├─ src/routes/appointments.ts',
  '├─ src/routes/customers.ts',
  '├─ src/db/schema.sql',
  '├─ src/components/Calendar.tsx',
  '└─ src/components/BookingForm.tsx',
]

export default function Hero() {
  return (
    <section className="bg-glow relative overflow-hidden px-4 pb-20 pt-20 sm:pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            From idea to <span className="text-gradient">deployed app</span> in minutes
          </h1>
          <p className="mt-6 max-w-xl text-lg text-zinc-400">
            Describe what you want. Pravan plans, builds, and ships it — with real,
            exportable code you actually own. No black box, no lock-in.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/builder" className="px-6 py-3 text-base">
              Start building
            </Button>
            <Button href="/pricing" variant="ghost" className="px-6 py-3 text-base">
              See pricing
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-surface shadow-2xl shadow-black/40">
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-zinc-500">pravan — terminal</span>
          </div>
          <div className="space-y-3 p-5 font-mono text-sm">
            <p className="text-zinc-400">
              <span className="text-accent2">$</span> build me a booking app for my auto shop
              <span className="cursor-blink text-zinc-100">▍</span>
            </p>
            <p className="text-zinc-500">Planning schema, routes, and UI...</p>
            <pre className="whitespace-pre-wrap text-zinc-300">
              {fileTree.join('\n')}
            </pre>
            <p className="text-accent2">✓ Build complete — ready to preview</p>
          </div>
        </div>
      </div>
    </section>
  )
}
