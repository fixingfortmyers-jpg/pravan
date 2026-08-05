export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm text-zinc-400 md:grid-cols-4">
        <div>
          <div className="mb-2 flex items-center gap-2 font-bold text-zinc-100">
            <span className="inline-block h-5 w-5 rounded-md bg-gradient-to-br from-accent to-accent2" />
            Pravan
          </div>
          <p>Idea to app, before the coffee gets cold.</p>
        </div>
        <div>
          <div className="mb-2 font-semibold text-zinc-100">Product</div>
          <ul className="space-y-1">
            <li><a className="hover:text-zinc-100" href="/builder">Builder</a></li>
            <li><a className="hover:text-zinc-100" href="/pricing">Pricing</a></li>
            <li><a className="hover:text-zinc-100" href="/docs">Docs</a></li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-semibold text-zinc-100">Company</div>
          <ul className="space-y-1">
            <li><a className="hover:text-zinc-100" href="/faq">FAQ</a></li>
            <li><a className="hover:text-zinc-100" href="/docs">Security</a></li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-semibold text-zinc-100">Promise</div>
          <p>Your code. Your data. Export everything, any time.</p>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-zinc-500">
        © 2026 Pravan. Built fast, on purpose.
      </div>
    </footer>
  )
}
