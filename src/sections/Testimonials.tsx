type Testimonial = {
  quote: string
  name: string
  role: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      'We rebuilt our internal tools stack in a weekend and still own every line of the code. Try doing that with the other guys.',
    name: 'Marcus D.',
    role: 'Founder, small logistics startup',
  },
  {
    quote:
      'The self-healing actually explains what broke instead of just retrying and hoping. First time I have trusted an AI builder in production.',
    name: 'Priya K.',
    role: 'Solo developer',
  },
  {
    quote:
      'Flat pricing meant our bill did not spike the month we shipped the most. That alone got us to switch.',
    name: 'Sam O.',
    role: 'Operations lead, retail chain',
  },
]

export default function Testimonials() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            People who left <span className="text-gradient">other builders</span> behind
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map(t => (
            <figure key={t.name} className="rounded-xl border border-line bg-surface p-6">
              <blockquote className="text-sm text-zinc-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-zinc-100">{t.name}</span>
                <span className="text-zinc-500"> — {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
