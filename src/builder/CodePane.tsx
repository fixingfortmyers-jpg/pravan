import { useEffect, useState } from 'react'
import type { CodeFileKey } from './script'
import { ALL_FILES, CODE_FILES } from './script'

type CodePaneProps = {
  revealedFiles: string[]
  activeCodeFile: CodeFileKey | null
}

export default function CodePane({ revealedFiles, activeCodeFile }: CodePaneProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  useEffect(() => {
    if (activeCodeFile) setSelectedPath(CODE_FILES[activeCodeFile].path)
  }, [activeCodeFile])

  const revealedSet = new Set(revealedFiles)
  const treeFiles = ALL_FILES.filter(f => revealedSet.has(f))
  const activeEntry = selectedPath
    ? (Object.values(CODE_FILES).find(f => f.path === selectedPath) ?? null)
    : null

  return (
    <div className="flex h-full min-h-0">
      <div className="w-44 shrink-0 overflow-y-auto border-r border-line bg-surface p-2">
        <p className="px-2 pb-2 text-[11px] uppercase tracking-wide text-zinc-500">Files</p>
        <ul className="space-y-0.5">
          {treeFiles.map(f => (
            <li key={f}>
              <button
                type="button"
                onClick={() => setSelectedPath(f)}
                title={f}
                className={`w-full truncate rounded px-2 py-1 text-left text-xs transition ${
                  selectedPath === f
                    ? 'bg-raised text-zinc-100'
                    : 'text-zinc-400 hover:bg-raised/60 hover:text-zinc-200'
                }`}
                style={{ paddingLeft: `${8 + (f.split('/').length - 1) * 10}px` }}
              >
                {f.split('/').pop()}
              </button>
            </li>
          ))}
          {treeFiles.length === 0 && <li className="px-2 py-1 text-xs text-zinc-600">Waiting for build…</li>}
        </ul>
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-ink p-4 font-mono text-xs leading-relaxed">
        {activeEntry ? (
          <>
            <p className="mb-3 text-zinc-500">{activeEntry.path}</p>
            {activeEntry.lines.map((line, i) => (
              <CodeLine key={i} text={line} lineNumber={i + 1} />
            ))}
          </>
        ) : selectedPath ? (
          <p className="text-zinc-600">{`// generating ${selectedPath}…`}</p>
        ) : (
          <p className="text-zinc-600">Select a file once it appears in the tree.</p>
        )}
      </div>
    </div>
  )
}

function CodeLine({ text, lineNumber }: { text: string; lineNumber: number }) {
  const tokens = tokenizeLine(text)
  return (
    <div className="flex">
      <span className="w-7 shrink-0 select-none pr-3 text-right text-zinc-600">{lineNumber}</span>
      <span className="whitespace-pre">
        {tokens.length === 0
          ? ' '
          : tokens.map((tok, i) => (
              <span key={i} className={tok.cls}>
                {tok.text}
              </span>
            ))}
      </span>
    </div>
  )
}

type Token = { text: string; cls: string }

const KEYWORDS = [
  'import',
  'export',
  'default',
  'from',
  'const',
  'let',
  'var',
  'function',
  'return',
  'interface',
  'type',
  'extends',
  'implements',
  'new',
  'typeof',
  'as',
  'async',
  'await',
  'if',
  'else',
  'for',
  'while',
  'of',
  'in',
  'void',
  'true',
  'false',
  'null',
  'undefined',
].join('|')

const TOKEN_PATTERN = new RegExp(
  `(\\/\\/.*$)|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)|(<\\/?[A-Za-z][\\w.]*|\\/>)|(\\b[A-Z][\\w]*\\b)|(\\b(?:${KEYWORDS})\\b)|(\\b\\d+(?:\\.\\d+)?\\b)`,
  'g',
)

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = []
  let lastIndex = 0
  TOKEN_PATTERN.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = TOKEN_PATTERN.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, match.index), cls: 'text-zinc-300' })
    }
    const [full, comment, str, jsx, typeName, keyword, num] = match
    if (comment) tokens.push({ text: full, cls: 'text-zinc-500 italic' })
    else if (str) tokens.push({ text: full, cls: 'text-emerald-400' })
    else if (jsx) tokens.push({ text: full, cls: 'text-cyan-400' })
    else if (keyword) tokens.push({ text: full, cls: 'text-fuchsia-400' })
    else if (typeName) tokens.push({ text: full, cls: 'text-amber-300' })
    else if (num) tokens.push({ text: full, cls: 'text-orange-300' })
    else tokens.push({ text: full, cls: 'text-zinc-300' })
    lastIndex = TOKEN_PATTERN.lastIndex
    if (match.index === TOKEN_PATTERN.lastIndex) TOKEN_PATTERN.lastIndex += 1
  }
  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex), cls: 'text-zinc-300' })
  }
  return tokens
}
