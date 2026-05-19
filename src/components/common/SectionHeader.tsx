import type { ReactNode } from "react"

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-600">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{title}</h2>
        {description && <p className="mt-3 leading-7 text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  )
}
