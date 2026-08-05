import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { ChatEntry } from './script'
import { PLAN_LABELS } from './script'

type ChatPaneProps = {
  chat: ChatEntry[]
  typing: boolean
  activeStepIndex: number
  completedSteps: number
  onSubmit: (text: string) => void
}

export default function ChatPane({ chat, typing, activeStepIndex, completedSteps, onSubmit }: ChatPaneProps) {
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [chat.length, typing])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSubmit(text)
    setDraft('')
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3 py-3">
        {chat.map(entry => {
          if (entry.kind === 'plan') {
            return <PlanCard key={entry.id} activeStepIndex={activeStepIndex} completedSteps={completedSteps} />
          }
          if (entry.kind === 'status') {
            return <StatusLineBubble key={entry.id} text={entry.text} />
          }
          return <MessageBubble key={entry.id} role={entry.kind} text={entry.text} />
        })}
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 border-t border-line p-3">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Ask Pravan to change something…"
          className="min-w-0 flex-1 rounded-lg border border-line bg-ink px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-gradient-to-r from-accent to-accent2 px-3 py-2 text-sm font-semibold text-ink transition hover:opacity-90"
        >
          Send
        </button>
      </form>
    </div>
  )
}

function MessageBubble({ role, text }: { role: 'user' | 'assistant'; text: string }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
          isUser ? 'bg-accent/90 text-ink' : 'border border-line bg-raised text-zinc-200'
        }`}
      >
        {text}
      </div>
    </div>
  )
}

function StatusLineBubble({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 pl-1 text-xs text-zinc-500">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent2" />
      <span className="font-mono">{text}</span>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-xl border border-line bg-raised px-3 py-2.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:300ms]" />
      </div>
    </div>
  )
}

function PlanCard({ activeStepIndex, completedSteps }: { activeStepIndex: number; completedSteps: number }) {
  return (
    <div className="rounded-lg border border-line bg-raised p-3 text-sm">
      <p className="mb-2 font-semibold text-zinc-200">Plan</p>
      <ol className="space-y-1.5">
        {PLAN_LABELS.map((label, i) => {
          const isDone = i < completedSteps
          const isActive = i === activeStepIndex && !isDone
          return (
            <li key={label} className="flex items-center gap-2 text-zinc-300">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isActive
                      ? 'animate-pulse bg-accent/20 text-accent2'
                      : 'bg-ink text-zinc-500'
                }`}
              >
                {isDone ? '✓' : i + 1}
              </span>
              <span className={isDone ? 'text-zinc-500 line-through' : ''}>{label}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
