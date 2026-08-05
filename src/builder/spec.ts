// The live app spec that /builder's preview renders from.
//
// This replaces the old fixed FAKE_SERVICES/FAKE_SLOTS constants as the
// preview's source of truth. Everything the preview draws is derived from an
// AppSpec value, so a user prompt that returns a new AppSpec changes the
// rendered app immediately — see interpret.ts for the prompt -> spec step.

export type AccentKey = 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky' | 'violet'
export type FieldKey = 'name' | 'phone' | 'email' | 'address' | 'notes'
export type DomainKey = 'auto' | 'restaurant' | 'salon' | 'clinic' | 'fitness'

export type SpecItem = { id: string; name: string; price: number; icon: string }

export type AppSpec = {
  title: string
  locality: string
  domain: DomainKey
  accent: AccentKey
  itemNoun: string
  items: SpecItem[]
  slots: string[]
  fields: FieldKey[]
  showPrices: boolean
  confirmPrefix: string
}

// Tailwind scans source for literal class strings, so accent classes must be
// written out in full here rather than composed at runtime from the key.
export const ACCENT_CLASSES: Record<
  AccentKey,
  { ring: string; chip: string; button: string; dot: string }
> = {
  indigo: {
    ring: 'border-indigo-400 bg-indigo-50',
    chip: 'bg-indigo-100 text-indigo-700',
    button: 'bg-gradient-to-r from-indigo-500 to-cyan-400',
    dot: 'bg-indigo-500',
  },
  emerald: {
    ring: 'border-emerald-400 bg-emerald-50',
    chip: 'bg-emerald-100 text-emerald-700',
    button: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    dot: 'bg-emerald-500',
  },
  rose: {
    ring: 'border-rose-400 bg-rose-50',
    chip: 'bg-rose-100 text-rose-700',
    button: 'bg-gradient-to-r from-rose-500 to-orange-400',
    dot: 'bg-rose-500',
  },
  amber: {
    ring: 'border-amber-400 bg-amber-50',
    chip: 'bg-amber-100 text-amber-700',
    button: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    dot: 'bg-amber-500',
  },
  sky: {
    ring: 'border-sky-400 bg-sky-50',
    chip: 'bg-sky-100 text-sky-700',
    button: 'bg-gradient-to-r from-sky-500 to-blue-400',
    dot: 'bg-sky-500',
  },
  violet: {
    ring: 'border-violet-400 bg-violet-50',
    chip: 'bg-violet-100 text-violet-700',
    button: 'bg-gradient-to-r from-violet-500 to-fuchsia-400',
    dot: 'bg-violet-500',
  },
}

export const FIELD_LABELS: Record<FieldKey, { label: string; placeholder: string; type: string }> = {
  name: { label: 'Your name', placeholder: 'Jane Doe', type: 'text' },
  phone: { label: 'Phone', placeholder: '(239) 555-0142', type: 'tel' },
  email: { label: 'Email', placeholder: 'jane@example.com', type: 'email' },
  address: { label: 'Address', placeholder: '123 Palm Ave', type: 'text' },
  notes: { label: 'Notes', placeholder: 'Anything we should know?', type: 'text' },
}

export const DEFAULT_SLOTS = ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM']
export const EVENING_SLOTS = ['6:00 PM', '7:30 PM']

export const DOMAIN_PRESETS: Record<DomainKey, Omit<AppSpec, 'accent' | 'fields' | 'showPrices'>> = {
  auto: {
    title: 'Auto Shop Booking',
    locality: 'Fort Myers, FL',
    domain: 'auto',
    itemNoun: 'service',
    items: [
      { id: 'oil', name: 'Oil Change', price: 49, icon: '🛢️' },
      { id: 'brake', name: 'Brake Inspection', price: 39, icon: '🛑' },
      { id: 'tire', name: 'Tire Rotation', price: 29, icon: '🛞' },
      { id: 'inspect', name: 'State Inspection', price: 59, icon: '✅' },
    ],
    slots: DEFAULT_SLOTS,
    confirmPrefix: 'PT',
  },
  restaurant: {
    title: 'Table Reservations',
    locality: 'Fort Myers, FL',
    domain: 'restaurant',
    itemNoun: 'table',
    items: [
      { id: 'two', name: 'Table for 2', price: 0, icon: '🍽️' },
      { id: 'four', name: 'Table for 4', price: 0, icon: '🍝' },
      { id: 'patio', name: 'Patio Seating', price: 0, icon: '🌤️' },
      { id: 'bar', name: 'Bar Seating', price: 0, icon: '🍷' },
    ],
    slots: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],
    confirmPrefix: 'RSV',
  },
  salon: {
    title: 'Salon Booking',
    locality: 'Fort Myers, FL',
    domain: 'salon',
    itemNoun: 'service',
    items: [
      { id: 'cut', name: 'Haircut', price: 45, icon: '✂️' },
      { id: 'color', name: 'Color', price: 120, icon: '🎨' },
      { id: 'blowout', name: 'Blowout', price: 40, icon: '💨' },
      { id: 'nails', name: 'Manicure', price: 35, icon: '💅' },
    ],
    slots: DEFAULT_SLOTS,
    confirmPrefix: 'SLN',
  },
  clinic: {
    title: 'Clinic Appointments',
    locality: 'Fort Myers, FL',
    domain: 'clinic',
    itemNoun: 'visit type',
    items: [
      { id: 'checkup', name: 'Check-up', price: 90, icon: '🩺' },
      { id: 'cleaning', name: 'Cleaning', price: 110, icon: '🪥' },
      { id: 'consult', name: 'Consultation', price: 75, icon: '💬' },
      { id: 'followup', name: 'Follow-up', price: 60, icon: '📋' },
    ],
    slots: DEFAULT_SLOTS,
    confirmPrefix: 'CLN',
  },
  fitness: {
    title: 'Class Booking',
    locality: 'Fort Myers, FL',
    domain: 'fitness',
    itemNoun: 'class',
    items: [
      { id: 'yoga', name: 'Yoga', price: 20, icon: '🧘' },
      { id: 'spin', name: 'Spin', price: 25, icon: '🚴' },
      { id: 'lift', name: 'Strength', price: 30, icon: '🏋️' },
      { id: 'hiit', name: 'HIIT', price: 25, icon: '🔥' },
    ],
    slots: ['6:00 AM', '7:30 AM', '12:00 PM', '5:30 PM', '7:00 PM'],
    confirmPrefix: 'FIT',
  },
}

export function specForDomain(domain: DomainKey, carryOver?: Partial<AppSpec>): AppSpec {
  return {
    ...DOMAIN_PRESETS[domain],
    accent: carryOver?.accent ?? 'indigo',
    fields: carryOver?.fields ?? [],
    showPrices: carryOver?.showPrices ?? true,
  }
}

export const INITIAL_SPEC: AppSpec = specForDomain('auto')

// Deterministic so a given booking always renders the same code; the demo has
// no server to allocate one and Math.random() would churn on every re-render.
export function confirmationCode(spec: AppSpec, itemId: string, slot: string): string {
  const seed = `${spec.domain}:${itemId}:${slot}`
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 10000
  }
  return `${spec.confirmPrefix}-${String(hash).padStart(4, '0')}`
}
