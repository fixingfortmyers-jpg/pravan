// Prompt -> AppSpec interpreter for the /builder demo.
//
// This is a real parser, not a script: the output is a pure function of what
// the user typed. There is no model call and no API key, which is what lets
// the demo run on static hosting — the tradeoff is a fixed intent grammar
// rather than open-ended understanding, so unmatched prompts say so plainly
// instead of pretending to have made a change.

import type { AccentKey, AppSpec, DomainKey, FieldKey, SpecItem } from './spec'
import { DEFAULT_SLOTS, EVENING_SLOTS, specForDomain } from './spec'

export type InterpretResult = {
  spec: AppSpec
  reply: string
  changed: boolean
}

type Rule = {
  /** Runs against the lowercased prompt; returns a patch + human summary. */
  match: (text: string, spec: AppSpec) => { spec: AppSpec; summary: string } | null
  /** Domain/rename rules reshape the app wholesale, so generic item-add is
   *  suppressed when one of these fires (see `structural` handling below). */
  structural?: boolean
}

const DOMAIN_WORDS: Array<{ domain: DomainKey; pattern: RegExp }> = [
  { domain: 'restaurant', pattern: /\b(restaurant|dining|table|reservation|pizza|cafe|bistro|food)\b/ },
  { domain: 'salon', pattern: /\b(salon|hair|barber|stylist|nail|spa|beauty)\b/ },
  { domain: 'clinic', pattern: /\b(clinic|dentist|dental|doctor|medical|patient|therapist|vet)\b/ },
  { domain: 'fitness', pattern: /\b(gym|fitness|yoga|pilates|class|studio|workout|trainer)\b/ },
  { domain: 'auto', pattern: /\b(auto|car|mechanic|garage|tire|oil change|repair shop)\b/ },
]

const ACCENT_WORDS: Array<{ accent: AccentKey; pattern: RegExp }> = [
  { accent: 'emerald', pattern: /\b(green|emerald|mint)\b/ },
  { accent: 'rose', pattern: /\b(red|rose|pink|crimson)\b/ },
  { accent: 'amber', pattern: /\b(orange|amber|yellow|gold)\b/ },
  { accent: 'sky', pattern: /\b(blue|sky|cyan|teal)\b/ },
  { accent: 'violet', pattern: /\b(purple|violet|magenta)\b/ },
  { accent: 'indigo', pattern: /\b(indigo|default colou?r)\b/ },
]

const FIELD_WORDS: Array<{ field: FieldKey; pattern: RegExp }> = [
  { field: 'phone', pattern: /\b(phone|mobile|cell|number)\b/ },
  { field: 'email', pattern: /\b(email|e-mail)\b/ },
  { field: 'address', pattern: /\b(address|location|street)\b/ },
  { field: 'notes', pattern: /\b(note|notes|comment|message|instructions)\b/ },
  { field: 'name', pattern: /\bname\b/ },
]

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item'
}

function titleCase(value: string): string {
  return value.replace(/\s+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase())
}

const RULES: Rule[] = [
  // --- Domain switch: rebuild from a preset, carrying styling choices over.
  {
    structural: true,
    match: (text, spec) => {
      const hit = DOMAIN_WORDS.find(d => d.pattern.test(text))
      if (!hit || hit.domain === spec.domain) return null
      const next = specForDomain(hit.domain, spec)
      return { spec: next, summary: `rebuilt the app as ${next.title.toLowerCase()}` }
    },
  },

  // --- Accent colour.
  {
    match: (text, spec) => {
      if (!/\b(colou?r|accent|theme|make it|style)\b/.test(text)) return null
      const hit = ACCENT_WORDS.find(a => a.pattern.test(text))
      if (!hit || hit.accent === spec.accent) return null
      return { spec: { ...spec, accent: hit.accent }, summary: `switched the accent to ${hit.accent}` }
    },
  },

  // --- Add / remove a captured field on the booking form.
  {
    match: (text, spec) => {
      const adding = /\b(add|include|collect|ask for|capture|need)\b/.test(text)
      const removing = /\b(remove|drop|delete|hide|without|don't|dont|no longer)\b/.test(text)
      if (!adding && !removing) return null
      if (!/\b(field|input|box|form)\b/.test(text) && !adding && !removing) return null
      const hit = FIELD_WORDS.find(f => f.pattern.test(text))
      if (!hit) return null

      if (removing && spec.fields.includes(hit.field)) {
        return {
          spec: { ...spec, fields: spec.fields.filter(f => f !== hit.field) },
          summary: `removed the ${hit.field} field`,
        }
      }
      if (adding && !removing && !spec.fields.includes(hit.field)) {
        return { spec: { ...spec, fields: [...spec.fields, hit.field] }, summary: `added a ${hit.field} field` }
      }
      return null
    },
  },

  // --- Price visibility.
  {
    match: (text, spec) => {
      if (!/\bprices?|pricing|cost\b/.test(text)) return null
      const hide = /\b(hide|remove|drop|without|no)\b/.test(text)
      const show = /\b(show|add|display|with)\b/.test(text)
      if (hide && spec.showPrices) return { spec: { ...spec, showPrices: false }, summary: 'hid prices' }
      if (show && !spec.showPrices) return { spec: { ...spec, showPrices: true }, summary: 'showed prices' }
      return null
    },
  },

  // --- Time-slot coverage.
  {
    match: (text, spec) => {
      if (!/\b(slot|time|hour|evening|night|late|morning)\b/.test(text)) return null
      const wantsEvening = /\b(evening|night|late|after work|later)\b/.test(text)
      const wantsFewer = /\b(fewer|less|reduce|shorter|trim)\b/.test(text)

      if (wantsEvening && !spec.slots.includes(EVENING_SLOTS[0])) {
        return { spec: { ...spec, slots: [...spec.slots, ...EVENING_SLOTS] }, summary: 'added evening time slots' }
      }
      if (wantsFewer && spec.slots.length > 3) {
        return { spec: { ...spec, slots: spec.slots.slice(0, 3) }, summary: 'trimmed the schedule to three slots' }
      }
      return null
    },
  },

  // --- Rename the generated app.
  {
    structural: true,
    match: (text, spec) => {
      const m = text.match(/(?:call it|rename (?:it )?to|name it|title it)\s+"?([a-z0-9 &'-]{2,40})"?\s*$/)
      if (!m) return null
      const title = titleCase(m[1])
      if (title === spec.title) return null
      return { spec: { ...spec, title }, summary: `renamed the app to "${title}"` }
    },
  },

  // --- Remove a named item.
  {
    match: (text, spec) => {
      if (!/\b(remove|delete|drop|get rid of)\b/.test(text)) return null
      const target = spec.items.find(i => text.includes(i.name.toLowerCase()))
      if (!target || spec.items.length <= 1) return null
      return {
        spec: { ...spec, items: spec.items.filter(i => i.id !== target.id) },
        summary: `removed "${target.name}"`,
      }
    },
  },

  // --- Add a named item, optionally with a price.
  {
    match: (text, spec) => {
      const m = text.match(
        /\badd (?:a |an |the )?(?:new )?(?:service|item|option|class|dish|table|treatment )?\s*(?:called |named |for )?"?([a-z0-9 &'-]{2,32}?)"?(?:\s+(?:for|at)\s*\$?(\d+))?\s*$/,
      )
      if (!m) return null
      const rawName = m[1].trim()
      // Guard against swallowing prompts the field/slot rules own.
      if (/\b(field|input|box|form|slot|time|price|colou?r|evening)\b/.test(rawName)) return null
      const name = titleCase(rawName)
      const id = slug(name)
      if (spec.items.some(i => i.id === id)) return null
      const price = m[2] ? Number(m[2]) : 0
      const item: SpecItem = { id, name, price, icon: '✨' }
      return { spec: { ...spec, items: [...spec.items, item] }, summary: `added "${name}"` }
    },
  },
]

export const SUGGESTIONS: string[] = [
  'make it a salon booking app',
  'change the accent to green',
  'add a phone field',
  'add evening time slots',
  'add Diagnostics for $89',
  'hide prices',
]

const CAPABILITIES =
  "I can change the app type (auto, restaurant, salon, clinic, fitness), the accent colour, " +
  'which fields the form collects, price visibility, the time slots, the app name, and add or ' +
  'remove services.'

export function interpret(raw: string, spec: AppSpec): InterpretResult {
  const text = raw.toLowerCase().trim()
  if (!text) return { spec, reply: 'Type what you want changed and the preview updates live.', changed: false }

  let next = spec
  const summaries: string[] = []
  let structuralFired = false

  for (const rule of RULES) {
    // A domain rebuild resets items wholesale, so the generic add/remove-item
    // rules below it would be operating on a list the user never saw.
    if (structuralFired && !rule.structural) {
      const isItemRule = rule === RULES[RULES.length - 1] || rule === RULES[RULES.length - 2]
      if (isItemRule) continue
    }
    const result = rule.match(text, next)
    if (!result) continue
    next = result.spec
    summaries.push(result.summary)
    if (rule.structural) structuralFired = true
  }

  if (summaries.length === 0) {
    return {
      spec,
      reply: `I couldn't map that to a change in this demo — nothing was altered. ${CAPABILITIES}`,
      changed: false,
    }
  }

  const joined =
    summaries.length === 1
      ? summaries[0]
      : `${summaries.slice(0, -1).join(', ')} and ${summaries[summaries.length - 1]}`

  return { spec: next, reply: `Done — ${joined}. The preview is updated.`, changed: true }
}

export { DEFAULT_SLOTS }
