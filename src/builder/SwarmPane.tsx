import type { SwarmAgentId, SwarmStatus } from './script'
import { SWARM_AGENT_ORDER, SWARM_AGENTS } from './script'

type SwarmPaneProps = {
  status: Record<SwarmAgentId, SwarmStatus>
  lines: Record<SwarmAgentId, string[]>
}

export default function SwarmPane({ status, lines }: SwarmPaneProps) {
  const plannerId = SWARM_AGENT_ORDER[0]
  const workerIds = SWARM_AGENT_ORDER.slice(1)

  return (
    <div className="h-full overflow-y-auto p-4">
      <AgentCard
        agentId={plannerId}
        status={status[plannerId]}
        lines={lines[plannerId]}
        emphasis
      />
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {workerIds.map(id => (
          <AgentCard key={id} agentId={id} status={status[id]} lines={lines[id]} />
        ))}
      </div>
      <p className="mt-4 text-xs text-zinc-500">
        This is a replay of a real orchestration pattern — planner decomposes, workers build in parallel, failures
        escalate.
      </p>
    </div>
  )
}

function AgentCard({
  agentId,
  status,
  lines,
  emphasis,
}: {
  agentId: SwarmAgentId
  status: SwarmStatus
  lines: string[]
  emphasis?: boolean
}) {
  const config = SWARM_AGENTS[agentId]
  return (
    <div
      className={`rounded-lg border p-3 ${
        emphasis ? 'border-accent/40 bg-raised' : 'border-line bg-raised'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-zinc-200">
          {config.name} <span className="font-normal text-zinc-500">— {config.role}</span>
        </span>
        <StatusChip status={status} />
      </div>
      <div className="min-h-[4.5rem] space-y-1 font-mono text-xs leading-relaxed text-zinc-400">
        {lines.length === 0 && status === 'queued' && <span className="text-zinc-600">waiting…</span>}
        {lines.map((line, i) => (
          <p
            key={i}
            className={
              line.startsWith('test failed')
                ? 'text-red-400'
                : line.startsWith('escalating')
                  ? 'text-amber-300'
                  : ''
            }
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}

function StatusChip({ status }: { status: SwarmStatus }) {
  const styles: Record<SwarmStatus, string> = {
    queued: 'bg-ink text-zinc-500',
    thinking: 'animate-pulse bg-accent/20 text-accent2',
    failed: 'bg-red-500/20 text-red-400',
    escalating: 'animate-pulse bg-amber-500/20 text-amber-300',
    done: 'bg-emerald-500/20 text-emerald-400',
  }
  const labels: Record<SwarmStatus, string> = {
    queued: 'queued',
    thinking: 'thinking',
    failed: 'failed',
    escalating: 'escalating',
    done: 'done',
  }
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
