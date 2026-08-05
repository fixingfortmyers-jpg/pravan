import { useMemo, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'

// Setting this to a form-service URL (e.g. a Formspree or Basin endpoint)
// switches submission from a mailto: handoff to a JSON POST via fetch.
// Left null because this site is a static host with no backend.
const FORM_ENDPOINT: string | null = null

const CONTACT_EMAIL = 'fixingfortmyers@gmail.com'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type BudgetOption = '' | 'under-5k' | '5k-15k' | '15k-50k' | '50k-plus'

type FormValues = {
  name: string
  email: string
  company: string
  budget: BudgetOption
  message: string
}

type RequiredField = 'name' | 'email' | 'message'
type Errors = Partial<Record<RequiredField, string>>
type Touched = Partial<Record<RequiredField, boolean>>
type Status = 'idle' | 'submitting' | 'success' | 'error'

const initialValues: FormValues = {
  name: '',
  email: '',
  company: '',
  budget: '',
  message: '',
}

const budgetLabels: Record<Exclude<BudgetOption, ''>, string> = {
  'under-5k': 'Under $5k',
  '5k-15k': '$5k – $15k',
  '15k-50k': '$15k – $50k',
  '50k-plus': '$50k+',
}

function validateField(field: RequiredField, values: FormValues): string | undefined {
  if (field === 'name') {
    return values.name.trim() ? undefined : 'Name is required.'
  }
  if (field === 'email') {
    const v = values.email.trim()
    if (!v) return 'Email is required.'
    if (!EMAIL_REGEX.test(v)) return 'Enter a valid email address.'
    return undefined
  }
  return values.message.trim() ? undefined : 'Tell us a bit about your project.'
}

function validateAll(values: FormValues): Errors {
  return {
    name: validateField('name', values),
    email: validateField('email', values),
    message: validateField('message', values),
  }
}

function buildMailtoUrl(values: FormValues): string {
  const subject = `Quote request — ${values.name}`
  const lines = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    values.company.trim() ? `Company: ${values.company}` : null,
    values.budget ? `Budget: ${budgetLabels[values.budget]}` : null,
    '',
    'Project description:',
    values.message,
  ].filter((line): line is string => line !== null)
  const body = lines.join('\n').replace(/\n/g, '\r\n')
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function Contact() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [touched, setTouched] = useState<Touched>({})
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const isValid = useMemo(() => {
    const e = validateAll(values)
    return !e.name && !e.email && !e.message
  }, [values])

  function handleChange(field: keyof FormValues) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const next = { ...values, [field]: e.target.value }
      setValues(next)
      if (field === 'name' || field === 'email' || field === 'message') {
        if (touched[field]) {
          setErrors(prev => ({ ...prev, [field]: validateField(field, next) }))
        }
      }
    }
  }

  function handleBlur(field: RequiredField) {
    return (_e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTouched(prev => ({ ...prev, [field]: true }))
      setErrors(prev => ({ ...prev, [field]: validateField(field, values) }))
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const allErrors = validateAll(values)
    setErrors(allErrors)
    setTouched({ name: true, email: true, message: true })
    if (allErrors.name || allErrors.email || allErrors.message) return

    setStatus('submitting')
    setErrorMessage('')

    if (FORM_ENDPOINT) {
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        if (!res.ok) throw new Error(`Form service responded with ${res.status}`)
        setStatus('success')
      } catch (err) {
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Something went wrong sending the form.')
      }
      return
    }

    window.location.href = buildMailtoUrl(values)
    setStatus('success')
  }

  function handleReset() {
    setValues(initialValues)
    setTouched({})
    setErrors({})
    setStatus('idle')
    setErrorMessage('')
  }

  return (
    <div className="px-4 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Get a <span className="text-gradient">quote</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
            Tell us what you're building. We'll reply with scope, timeline, and pricing —
            no sales call required.
          </p>
        </div>

        <div className="mt-14 rounded-xl border border-line bg-surface p-6 sm:p-8">
          {status === 'success' ? (
            <div>
              <h2 className="text-xl font-bold text-zinc-100">
                {FORM_ENDPOINT ? 'Request sent' : 'Your email client should be open'}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {FORM_ENDPOINT
                  ? `Thanks, ${values.name}. We received your request and will reply to ${values.email} soon.`
                  : `We pre-filled a message to ${CONTACT_EMAIL} with the details below — hit send from your mail app to finish.`}
              </p>
              <dl className="mt-6 space-y-2 rounded-lg border border-line bg-raised p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Name</dt>
                  <dd className="text-zinc-200">{values.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Email</dt>
                  <dd className="text-zinc-200">{values.email}</dd>
                </div>
                {values.company.trim() && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Company</dt>
                    <dd className="text-zinc-200">{values.company}</dd>
                  </div>
                )}
                {values.budget && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Budget</dt>
                    <dd className="text-zinc-200">{budgetLabels[values.budget]}</dd>
                  </div>
                )}
                <div className="pt-2">
                  <dt className="text-zinc-500">Project</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-zinc-200">{values.message}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={handleReset}
                className="mt-6 inline-flex items-center justify-center rounded-lg border border-line px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-raised"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="contact-name" className="text-sm font-semibold text-zinc-200">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={values.name}
                  onChange={handleChange('name')}
                  onBlur={handleBlur('name')}
                  aria-invalid={Boolean(touched.name && errors.name)}
                  aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
                  className={`mt-2 w-full rounded-lg border bg-ink px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-accent ${
                    touched.name && errors.name ? 'border-red-400/60' : 'border-line'
                  }`}
                  placeholder="Jane Doe"
                />
                {touched.name && errors.name && (
                  <p id="contact-name-error" role="alert" className="mt-1.5 text-sm text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label htmlFor="contact-email" className="text-sm font-semibold text-zinc-200">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby={touched.email && errors.email ? 'contact-email-error' : undefined}
                  className={`mt-2 w-full rounded-lg border bg-ink px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-accent ${
                    touched.email && errors.email ? 'border-red-400/60' : 'border-line'
                  }`}
                  placeholder="jane@company.com"
                />
                {touched.email && errors.email && (
                  <p id="contact-email-error" role="alert" className="mt-1.5 text-sm text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-company" className="text-sm font-semibold text-zinc-200">
                    Company <span className="font-normal text-zinc-500">(optional)</span>
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    value={values.company}
                    onChange={handleChange('company')}
                    className="mt-2 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-accent"
                    placeholder="Acme Inc."
                  />
                </div>

                <div>
                  <label htmlFor="contact-budget" className="text-sm font-semibold text-zinc-200">
                    Budget <span className="font-normal text-zinc-500">(optional)</span>
                  </label>
                  <select
                    id="contact-budget"
                    value={values.budget}
                    onChange={handleChange('budget')}
                    className="mt-2 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-accent"
                  >
                    <option value="">Not sure yet</option>
                    <option value="under-5k">Under $5k</option>
                    <option value="5k-15k">$5k – $15k</option>
                    <option value="15k-50k">$15k – $50k</option>
                    <option value="50k-plus">$50k+</option>
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="contact-message" className="text-sm font-semibold text-zinc-200">
                  Project description
                </label>
                <textarea
                  id="contact-message"
                  value={values.message}
                  onChange={handleChange('message')}
                  onBlur={handleBlur('message')}
                  aria-invalid={Boolean(touched.message && errors.message)}
                  aria-describedby={touched.message && errors.message ? 'contact-message-error' : undefined}
                  rows={5}
                  className={`mt-2 w-full rounded-lg border bg-ink px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-accent ${
                    touched.message && errors.message ? 'border-red-400/60' : 'border-line'
                  }`}
                  placeholder="What are you building, and what does done look like?"
                />
                {touched.message && errors.message && (
                  <p id="contact-message-error" role="alert" className="mt-1.5 text-sm text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>

              {status === 'error' && (
                <p role="alert" className="mt-5 text-sm text-red-400">
                  {errorMessage || 'Something went wrong sending the form. Please try again.'}
                </p>
              )}

              <button
                type="submit"
                disabled={!isValid || status === 'submitting'}
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-accent to-accent2 px-4 py-2.5 text-sm font-semibold text-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === 'submitting' ? 'Sending…' : 'Send request'}
              </button>
              <p className="mt-3 text-center text-xs text-zinc-500">
                {FORM_ENDPOINT ? 'Sent directly — no email client needed.' : `Opens your email client, addressed to ${CONTACT_EMAIL}.`}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
