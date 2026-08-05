type Step = {
  number: string
  title: string
  body: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Describe',
    body: 'Tell Pravan what you want to build in plain English — a booking system, a storefront, an internal tool. No spec document required.',
  },
  {
    number: '02',
    title: 'Watch it build',
    body: 'Pravan plans the schema, routes, and UI, then builds it live in front of you. You see every file as it lands, not a spinner.',
  },
  {
    number: '03',
    title: 'Ship it',
    body: 'Deploy to a live URL in one click, connect your own domain, and export the full source whenever you want to take it further.',
  },
]

export default function HowItWorks() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps. <span className="text-gradient">No detours.</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(s => (
            <div key={s.number} className="relative rounded-xl border border-line bg-surface p-6">
              <span className="text-gradient text-4xl font-bold">{s.number}</span>
              <h3 className="mt-4 text-lg font-semibold text-zinc-100">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
