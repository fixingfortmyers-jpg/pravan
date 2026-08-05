import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PreviewStage } from './script'
import type { AppSpec } from './spec'
import { ACCENT_CLASSES, FIELD_LABELS, confirmationCode } from './spec'

type PreviewPaneProps = {
  stage: PreviewStage
  spec: AppSpec
}

export default function PreviewPane({ stage, spec }: PreviewPaneProps) {
  return (
    <div className="h-full min-h-0 p-4">
      <BrowserChrome spec={spec}>
        {stage === 0 && <BlankStage />}
        {stage === 1 && <SkeletonStage />}
        {(stage === 2 || stage === 3) && (
          // Remount on a structural rebuild so a stale selection from the
          // previous app can't survive into one whose items no longer exist.
          <GeneratedApp key={`${spec.domain}:${spec.title}`} stage={stage} spec={spec} />
        )}
      </BrowserChrome>
    </div>
  )
}

function hostname(spec: AppSpec): string {
  const slug = spec.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${slug || 'app'}.pravan.app`
}

function BrowserChrome({ spec, children }: { spec: AppSpec; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-raised">
      <div className="flex shrink-0 items-center gap-2 border-b border-line bg-surface px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <div className="ml-3 flex-1 truncate rounded-md bg-ink/60 px-3 py-1 text-xs text-zinc-400">
          {hostname(spec)}
        </div>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}

function BlankStage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-white text-zinc-400">
      <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-300" />
      <p className="text-sm">Waiting for the first build…</p>
    </div>
  )
}

function SkeletonStage() {
  return (
    <div className="h-full space-y-6 overflow-y-auto bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="flex gap-3">
          <div className="h-4 w-12 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-12 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-12 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
      <div className="h-40 w-full animate-pulse rounded-xl bg-zinc-100" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-20 animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-20 animate-pulse rounded-lg bg-zinc-100" />
      </div>
    </div>
  )
}

function GeneratedApp({ stage, spec }: { stage: 2 | 3; spec: AppSpec }) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [booked, setBooked] = useState(false)

  const accent = ACCENT_CLASSES[spec.accent]
  // Re-derived every render rather than stored, so removing an item mid-session
  // silently clears the selection instead of booking a service that's gone.
  const item = spec.items.find(i => i.id === selectedItem) ?? null
  const slot = spec.slots.includes(selectedSlot ?? '') ? selectedSlot : null
  const missingFields = spec.fields.filter(f => !(fieldValues[f] ?? '').trim())
  const canBook = Boolean(item && slot && missingFields.length === 0)

  if (booked && item && slot) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-white p-6 text-center text-zinc-900">
        <div className="text-3xl">✅</div>
        <h2 className="text-lg font-semibold">You're booked!</h2>
        <p className="text-sm text-zinc-600">
          {item.name} at {slot}
        </p>
        <p className="font-mono text-xs text-zinc-400">Confirmation {confirmationCode(spec, item.id, slot)}</p>
        <button
          type="button"
          onClick={() => {
            setBooked(false)
            setSelectedSlot(null)
          }}
          className="mt-2 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
        >
          Book another
        </button>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-white p-6 text-zinc-900">
      <header className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-bold">{spec.title}</h1>
        <span className="text-xs text-zinc-400">{spec.locality}</span>
      </header>

      <section className="mb-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Pick a {spec.itemNoun}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {spec.items.map(i => (
            <button
              key={i.id}
              type="button"
              onClick={() => setSelectedItem(i.id)}
              className={`rounded-lg border p-3 text-left transition ${
                selectedItem === i.id ? accent.ring : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="text-xl">{i.icon}</div>
              <div className="text-sm font-medium">{i.name}</div>
              {spec.showPrices && i.price > 0 && <div className="text-xs text-zinc-500">${i.price}</div>}
            </button>
          ))}
        </div>
      </section>

      {stage === 3 && item && (
        <section className="mb-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Pick a time</h2>
          <div className="grid grid-cols-3 gap-2">
            {spec.slots.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedSlot(t)}
                className={`rounded-lg border px-2 py-1.5 text-sm transition ${
                  selectedSlot === t ? accent.ring : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>
      )}

      {stage === 3 && spec.fields.length > 0 && (
        <section className="mb-6 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Your details</h2>
          {spec.fields.map(f => {
            const meta = FIELD_LABELS[f]
            return (
              <div key={f}>
                <label htmlFor={`preview-${f}`} className="mb-1 block text-xs text-zinc-600">
                  {meta.label}
                </label>
                <input
                  id={`preview-${f}`}
                  type={meta.type}
                  value={fieldValues[f] ?? ''}
                  placeholder={meta.placeholder}
                  onChange={e => setFieldValues(v => ({ ...v, [f]: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none"
                />
              </div>
            )
          })}
        </section>
      )}

      {stage === 3 && (
        <button
          type="button"
          disabled={!canBook}
          onClick={() => setBooked(true)}
          className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${accent.button}`}
        >
          Book {spec.itemNoun === 'table' ? 'table' : 'appointment'}
        </button>
      )}
    </div>
  )
}
