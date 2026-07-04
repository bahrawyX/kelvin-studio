import type { ReactNode } from 'react'
import FadeIn from './FadeIn'

export default function SectionHeader({
  index,
  label,
  right,
}: {
  index: string
  label: string
  right?: ReactNode
}) {
  return (
    <FadeIn className="mb-14">
      <div className="flex items-baseline gap-4">
        <span className="type-mono text-[11px] text-bone-dim sm:text-[12px]">{index}</span>
        <span className="type-mono text-[11px] text-bone-dim sm:text-[12px]">{label}</span>
        <span className="h-px flex-1 self-center bg-hairline" />
        {right}
      </div>
    </FadeIn>
  )
}
