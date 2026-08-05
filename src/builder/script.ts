// Scripted, fully client-side data for the /builder demo. Nothing here calls
// a real model — every message, status line, and file is pre-authored so the
// timeline in Builder.tsx can play it back deterministically.

export const PROJECT_NAME = 'auto-shop-booking'

export const USER_PROMPT =
  'Build me a booking app for my auto repair shop — customers pick a service, a time slot, and get a confirmation.'

export const FINAL_MESSAGE =
  "Build complete. auto-shop-booking is ready in preview — try selecting a service and time slot on the right. Sign up to deploy it live and connect real data."

export const DEMO_REPLY = 'This is the demo script — sign up to build with live AI.'

export type PreviewStage = 0 | 1 | 2 | 3

export type CodeFileKey = 'types' | 'bookingForm'

export type ChatEntry =
  | { id: string; kind: 'user'; text: string }
  | { id: string; kind: 'assistant'; text: string }
  | { id: string; kind: 'plan' }
  | { id: string; kind: 'status'; text: string }

export type PlanStep = {
  label: string
  statusLines: string[]
  stageAfter: PreviewStage
  reveals: string[]
  codeFile?: CodeFileKey
}

export const STEPS: PlanStep[] = [
  {
    label: 'Design booking data schema',
    statusLines: ['Creating schema…', 'Defining Service & TimeSlot types…', 'Seeding sample services…'],
    stageAfter: 1,
    reveals: ['package.json', 'index.html', 'src/main.tsx', 'src/types.ts', 'src/data/services.ts'],
    codeFile: 'types',
  },
  {
    label: 'Scaffold app shell & navigation',
    statusLines: ['Scaffolding App.tsx…', 'Generating Header.tsx…', 'Wiring nav skeleton…'],
    stageAfter: 2,
    reveals: ['src/App.tsx', 'src/components/Header.tsx'],
  },
  {
    label: 'Build service selection & time-slot grid',
    statusLines: ['Generating ServiceCard.tsx…', 'Building TimeSlotGrid.tsx…', 'Wiring selection state…'],
    stageAfter: 3,
    reveals: ['src/components/ServiceCard.tsx', 'src/components/TimeSlotGrid.tsx'],
  },
  {
    label: 'Wire booking confirmation flow',
    statusLines: [
      'Wiring auth…',
      'Generating BookingForm.tsx…',
      'Generating ConfirmationCard.tsx…',
      'Running build…',
    ],
    stageAfter: 3,
    reveals: ['src/components/BookingForm.tsx', 'src/components/ConfirmationCard.tsx', 'src/styles.css'],
    codeFile: 'bookingForm',
  },
]

export const PLAN_LABELS: string[] = STEPS.map(s => s.label)
export const ALL_FILES: string[] = STEPS.flatMap(s => s.reveals)

// --- Timeline -------------------------------------------------------------
// A flat, time-ordered list of events. Builder.tsx schedules one setTimeout
// per event (all cleared together on unmount/replay) and maps each to a
// reducer action. Kept as pure data so the pacing can be tuned in one place.

export type TimelineEvent =
  | { t: number; kind: 'user-message' }
  | { t: number; kind: 'typing'; value: boolean }
  | { t: number; kind: 'plan' }
  | { t: number; kind: 'start-step'; stepIndex: number }
  | { t: number; kind: 'status-line'; stepIndex: number; lineIndex: number }
  | { t: number; kind: 'complete-step'; stepIndex: number }
  | { t: number; kind: 'final-message' }

const LINE_INTERVAL_MS = 1600
const STEP_BUFFER_MS = 1400

function buildTimeline(): TimelineEvent[] {
  const events: TimelineEvent[] = []
  events.push({ t: 200, kind: 'user-message' })
  events.push({ t: 1000, kind: 'typing', value: true })
  events.push({ t: 2600, kind: 'typing', value: false })
  events.push({ t: 2600, kind: 'plan' })

  let t = 2600 + 800
  STEPS.forEach((step, stepIndex) => {
    events.push({ t, kind: 'start-step', stepIndex })
    step.statusLines.forEach((_, lineIndex) => {
      events.push({ t: t + lineIndex * LINE_INTERVAL_MS, kind: 'status-line', stepIndex, lineIndex })
    })
    const lastLineT = t + (step.statusLines.length - 1) * LINE_INTERVAL_MS
    const completeT = lastLineT + STEP_BUFFER_MS
    events.push({ t: completeT, kind: 'complete-step', stepIndex })
    t = completeT
  })

  events.push({ t: t + 900, kind: 'final-message' })
  return events
}

export const TIMELINE: TimelineEvent[] = buildTimeline()
export const TOTAL_DURATION_MS: number = TIMELINE[TIMELINE.length - 1].t

// --- Fake generated code (shown, hand-highlighted, in CodePane) -----------

export const CODE_FILES: Record<CodeFileKey, { path: string; lines: string[] }> = {
  types: {
    path: 'src/types.ts',
    lines: [
      'export type Service = {',
      '  id: string',
      '  name: string',
      '  durationMin: number',
      '  price: number',
      '}',
      '',
      'export type TimeSlot = {',
      '  id: string',
      '  label: string',
      '  available: boolean',
      '}',
      '',
      'export type Booking = {',
      '  service: Service',
      '  slot: TimeSlot',
      '  confirmationCode: string',
      '}',
    ],
  },
  bookingForm: {
    path: 'src/components/BookingForm.tsx',
    lines: [
      "import { useState } from 'react'",
      "import { SERVICES, TIME_SLOTS } from '../data/services'",
      "import type { Service, TimeSlot } from '../types'",
      "import ConfirmationCard from './ConfirmationCard'",
      '',
      'export default function BookingForm() {',
      '  const [service, setService] = useState<Service | null>(null)',
      '  const [slot, setSlot] = useState<TimeSlot | null>(null)',
      '  const [booked, setBooked] = useState(false)',
      '',
      '  if (booked && service && slot) {',
      '    return <ConfirmationCard service={service} slot={slot} />',
      '  }',
      '',
      '  return (',
      '    <section className="space-y-6">',
      '      <ServiceGrid value={service} onSelect={setService} items={SERVICES} />',
      '      <TimeSlotGrid value={slot} onSelect={setSlot} items={TIME_SLOTS} />',
      '      <button disabled={!service || !slot} onClick={() => setBooked(true)}>',
      '        Book appointment',
      '      </button>',
      '    </section>',
      '  )',
      '}',
    ],
  },
}

// --- Fake interactive booking app (rendered live in PreviewPane) ---------

export type FakeService = { id: string; name: string; price: number; icon: string }
export type FakeSlot = { id: string; label: string }

export const FAKE_SERVICES: FakeService[] = [
  { id: 'oil', name: 'Oil Change', price: 49, icon: '🛢️' },
  { id: 'brake', name: 'Brake Inspection', price: 39, icon: '🛑' },
  { id: 'tire', name: 'Tire Rotation', price: 29, icon: '🛞' },
  { id: 'inspect', name: 'State Inspection', price: 59, icon: '✅' },
]

export const FAKE_SLOTS: FakeSlot[] = [
  { id: 's1', label: '9:00 AM' },
  { id: 's2', label: '10:30 AM' },
  { id: 's3', label: '12:00 PM' },
  { id: 's4', label: '1:30 PM' },
  { id: 's5', label: '3:00 PM' },
  { id: 's6', label: '4:30 PM' },
]

export const CONFIRMATION_CODE = 'PT-4471'
