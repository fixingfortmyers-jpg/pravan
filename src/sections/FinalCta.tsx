import Button from '../components/Button'

export default function FinalCta() {
  return (
    <section className="px-4 py-20">
      <div className="bg-glow mx-auto max-w-6xl overflow-hidden rounded-2xl border border-line bg-surface px-8 py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Your next app is a <span className="text-gradient">prompt away</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          No lock-in, no credit roulette, no black box. Just working code, shipped fast.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/builder" className="px-6 py-3 text-base">
            Start building
          </Button>
        </div>
      </div>
    </section>
  )
}
