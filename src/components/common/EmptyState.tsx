import { Inbox } from "lucide-react"

type EmptyStateProps = {
  title?: string
  description?: string
}

export default function EmptyState({
  title = "Belum ada data",
  description = "Coba ubah pencarian atau kembali lagi nanti."
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <Inbox size={26} />
      </div>
      <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    </div>
  )
}
