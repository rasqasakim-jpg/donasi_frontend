import { Loader2 } from "lucide-react"

type LoadingStateProps = {
  label?: string
}

export default function LoadingState({ label = "Memuat data..." }: LoadingStateProps) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-sm">
      <Loader2 className="mx-auto mb-3 animate-spin text-emerald-600" size={30} />
      <p className="font-semibold text-slate-600">{label}</p>
    </div>
  )
}
