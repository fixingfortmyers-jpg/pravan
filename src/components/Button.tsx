import type { ReactNode } from 'react'

type Props = {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  children: ReactNode
  className?: string
}

export default function Button({ href, onClick, variant = 'primary', children, className = '' }: Props) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition'
  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-accent to-accent2 text-ink hover:opacity-90'
      : 'border border-line text-zinc-200 hover:bg-raised'
  const cls = `${base} ${styles} ${className}`
  if (href) return <a href={href} className={cls}>{children}</a>
  return <button onClick={onClick} className={cls}>{children}</button>
}
