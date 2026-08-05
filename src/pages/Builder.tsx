import { useEffect, useReducer, useRef, useState } from 'react'
import Button from '../components/Button'
import ChatPane from '../builder/ChatPane'
import CodePane from '../builder/CodePane'
import PreviewPane from '../builder/PreviewPane'
import type { ChatEntry, CodeFileKey, PreviewStage, TimelineEvent } from '../builder/script'
import { DEMO_REPLY, FINAL_MESSAGE, PROJECT_NAME, STEPS, TIMELINE, USER_PROMPT } from '../builder/script'

type BuilderState = {
  chat: ChatEntry[]
  typing: boolean
  activeStep: number
  completedSteps: number
  previewStage: PreviewStage
  files: string[]
  codeFile: CodeFileKey | null
  done: boolean
}

const initialState: BuilderState = {
  chat: [],
  typing: false,
  activeStep: -1,
  completedSteps: 0,
  previewStage: 0,
  files: [],
  codeFile: null,
  done: false,
}

type Action =
  | { type: 'RESET' }
  | { type: 'ADD_USER_MESSAGE' }
  | { type: 'SET_TYPING'; value: boolean }
  | { type: 'ADD_PLAN' }
  | { type: 'START_STEP'; stepIndex: number }
  | { type: 'ADD_STATUS_LINE'; stepIndex: number; lineIndex: number }
  | { type: 'COMPLETE_STEP'; stepIndex: number }
  | { type: 'ADD_FINAL_MESSAGE' }
  | { type: 'USER_SUBMIT'; text: string }
  | { type: 'ADD_DEMO_REPLY' }

let uid = 0
function nextId(): string {
  uid += 1
  return `entry-${uid}`
}

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case 'RESET':
      return initialState
    case 'ADD_USER_MESSAGE':
      return { ...state, chat: [...state.chat, { id: nextId(), kind: 'user', text: USER_PROMPT }] }
    case 'SET_TYPING':
      return { ...state, typing: action.value }
    case 'ADD_PLAN':
      return { ...state, typing: false, chat: [...state.chat, { id: nextId(), kind: 'plan' }] }
    case 'START_STEP':
      return { ...state, activeStep: action.stepIndex }
    case 'ADD_STATUS_LINE': {
      const text = STEPS[action.stepIndex].statusLines[action.lineIndex]
      return { ...state, chat: [...state.chat, { id: nextId(), kind: 'status', text }] }
    }
    case 'COMPLETE_STEP': {
      const step = STEPS[action.stepIndex]
      return {
        ...state,
        completedSteps: action.stepIndex + 1,
        previewStage: step.stageAfter,
        files: [...state.files, ...step.reveals],
        codeFile: step.codeFile ?? state.codeFile,
      }
    }
    case 'ADD_FINAL_MESSAGE':
      return {
        ...state,
        done: true,
        chat: [...state.chat, { id: nextId(), kind: 'assistant', text: FINAL_MESSAGE }],
      }
    case 'USER_SUBMIT':
      return { ...state, chat: [...state.chat, { id: nextId(), kind: 'user', text: action.text }] }
    case 'ADD_DEMO_REPLY':
      return { ...state, chat: [...state.chat, { id: nextId(), kind: 'assistant', text: DEMO_REPLY }] }
  }
}

function eventToAction(evt: TimelineEvent): Action {
  switch (evt.kind) {
    case 'user-message':
      return { type: 'ADD_USER_MESSAGE' }
    case 'typing':
      return { type: 'SET_TYPING', value: evt.value }
    case 'plan':
      return { type: 'ADD_PLAN' }
    case 'start-step':
      return { type: 'START_STEP', stepIndex: evt.stepIndex }
    case 'status-line':
      return { type: 'ADD_STATUS_LINE', stepIndex: evt.stepIndex, lineIndex: evt.lineIndex }
    case 'complete-step':
      return { type: 'COMPLETE_STEP', stepIndex: evt.stepIndex }
    case 'final-message':
      return { type: 'ADD_FINAL_MESSAGE' }
  }
}

export default function Builder() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [runId, setRunId] = useState(0)
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const timersRef = useRef<number[]>([])

  // Schedule the whole scripted timeline. Every timer id lands in the same
  // ref-held array that the cleanup below clears, so a React 19 StrictMode
  // dev double-invoke (mount -> cleanup -> mount, all synchronous) cancels
  // the first pass before any timeout has a chance to fire, and Replay
  // (bumping runId) gets the same clean-slate guarantee.
  useEffect(() => {
    dispatch({ type: 'RESET' })
    const timers: number[] = []
    for (const evt of TIMELINE) {
      const id = window.setTimeout(() => dispatch(eventToAction(evt)), evt.t)
      timers.push(id)
    }
    timersRef.current = timers
    return () => {
      timers.forEach(id => window.clearTimeout(id))
    }
  }, [runId])

  function handleUserSubmit(text: string) {
    dispatch({ type: 'USER_SUBMIT', text })
    const id = window.setTimeout(() => dispatch({ type: 'ADD_DEMO_REPLY' }), 600)
    timersRef.current.push(id)
  }

  function handleReplay() {
    setTab('preview')
    setRunId(id => id + 1)
  }

  const isBuilding = state.activeStep >= 0 && !state.done

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-ink text-zinc-100">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-zinc-300">{PROJECT_NAME}</span>
          <StatusPill active={isBuilding} done={state.done} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleReplay}>
            Replay
          </Button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Sign up to enable deploys"
            className="cursor-not-allowed rounded-lg bg-gradient-to-r from-accent to-accent2 px-4 py-2 text-sm font-semibold text-ink opacity-40"
          >
            Deploy — sign up to enable
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="flex h-[45%] min-h-0 w-full flex-col border-b border-line md:h-auto md:w-[380px] md:shrink-0 md:border-b-0 md:border-r">
          <ChatPane
            chat={state.chat}
            typing={state.typing}
            activeStepIndex={state.activeStep}
            completedSteps={state.completedSteps}
            onSubmit={handleUserSubmit}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 gap-1 border-b border-line px-3 py-2">
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                tab === 'preview' ? 'bg-raised text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setTab('code')}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                tab === 'code' ? 'bg-raised text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Code
            </button>
          </div>
          <div className="min-h-0 flex-1">
            {tab === 'preview' ? (
              <PreviewPane stage={state.previewStage} />
            ) : (
              <CodePane revealedFiles={state.files} activeCodeFile={state.codeFile} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusPill({ active, done }: { active: boolean; done: boolean }) {
  const label = done ? 'Build complete' : active ? 'Building…' : 'Idle'
  const dot = done ? 'bg-emerald-400' : active ? 'animate-pulse bg-amber-400' : 'bg-zinc-500'
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-2.5 py-1 text-xs text-zinc-300">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
