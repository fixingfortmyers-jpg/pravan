import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PreviewStage } from './script'
import { CONFIRMATION_CODE, FAKE_SERVICES, FAKE_SLOTS, PROJECT_NAME } from './script'

type PreviewPaneProps = {
  stage: PreviewStage
}

export default function PreviewPane({ stage }: PreviewPaneProps) {
  return (
    <div className="h-full min-h-0 p-4">
      <BrowserChrome>
        {stage === 0 && <BlankStage />}
        {stage === 1 && <SkeletonStage />}
        {(stage === 2 || stage === 3) && <FakeBookingApp stage={stage} />}
      </BrowserChrome>
    </div>
  )
}

function BrowserChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-raised">
      <div className="flex shrink-0 items-center gap-2 border-b border-line bg-surface px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <div className="ml-3 flex-1 truncate rounded-md bg-ink/60 px-3 py-1 text-xs text-zinc-400">
          {PROJECT_NAME}.pravan.app
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

function FakeBookingApp({ stage }: { stage: 2 | 3 }) {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [booked, setBooked] = useState(false)

  const service = FAKE_SERVICES.find(s => s.id === selectedService) ?? null
  const slot = FAKE_SLOTS.find(s => s.id === selectedSlot) ?? null

  if (booked && service && slot) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-white p-6 text-center text-zinc-900">
        <div className="text-3xl">✅</div>
        <h2 className="text-lg font-semibold">You're booked!</h2>
        <p className="text-sm text-zinc-600">
          {service.name} at {slot.label}
        </p>
        <p className="font-mono text-xs text-zinc-400">Confirmation {CONFIRMATION_CODE}</p>
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
        <h1 className="text-lg font-bold">Auto Shop Booking</h1>
        <span className="text-xs text-zinc-400">Fort Myers, FL</span>
      </header>

      <section className="mb-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Pick a service</h2>
        <div className="grid grid-cols-2 gap-3">
          {FAKE_SERVICES.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedService(s.id)}
              className={`rounded-lg border p-3 text-left transition ${
                selectedService === s.id ? 'border-indigo-400 bg-indigo-50' : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="text-xl">{s.icon}</div>
              <div className="text-sm font-medium">{s.name}</div>
              <div className="text-xs text-zinc-500">${s.price}</div>
            </button>
          ))}
        </div>
      </section>

      {stage === 3 && selectedService && (
        <section className="mb-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Pick a time</h2>
          <div className="grid grid-cols-3 gap-2">
            {FAKE_SLOTS.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedSlot(t.id)}
                className={`rounded-lg border px-2 py-1.5 text-sm transition ${
                  selectedSlot === t.id ? 'border-indigo-400 bg-indigo-50' : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {stage === 3 && (
        <button
          type="button"
          disabled={!selectedService || !selectedSlot}
          onClick={() => setBooked(true)}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Book appointment
        </button>
      )}
    </div>
  )
}
