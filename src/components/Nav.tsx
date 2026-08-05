import Button from './Button'

const links = [
  { href: '/', label: 'Product' },
  { href: '/teardown', label: 'Teardown' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
  { href: '/faq', label: 'FAQ' },
]

export default function Nav() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-accent to-accent2" />
          Pravan
        </a>
        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className={`transition hover:text-zinc-100 ${path === l.href ? 'text-zinc-100' : ''}`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Button href="/builder">Start building</Button>
      </div>
    </header>
  )
}
