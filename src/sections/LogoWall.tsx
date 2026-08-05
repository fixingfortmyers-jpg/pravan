const names = [
  'AutoShop Pro',
  'LedgerLite',
  'Northgate Studio',
  'Fieldwork Co.',
  'Bright Harbor',
  'Corevault',
]

export default function LogoWall() {
  return (
    <section className="border-y border-line px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-medium uppercase tracking-wide text-zinc-500">
          Built for people who ship
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {names.map(name => (
            <div
              key={name}
              className="flex items-center justify-center rounded-lg border border-line bg-surface px-4 py-3 text-center text-sm font-semibold text-zinc-400"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
