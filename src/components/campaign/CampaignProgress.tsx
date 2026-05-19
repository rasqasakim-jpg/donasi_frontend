import { formatCurrency, getCampaignPercent } from "../../utils/format"

type CampaignProgressProps = {
  currentAmount: number
  targetAmount: number
  large?: boolean
}

export default function CampaignProgress({
  currentAmount,
  targetAmount,
  large = false
}: CampaignProgressProps) {
  const percentage = getCampaignPercent(currentAmount, targetAmount)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-extrabold text-emerald-700">{formatCurrency(currentAmount)}</span>
        <span className="font-bold text-slate-500">{percentage}%</span>
      </div>
      <div className={`overflow-hidden rounded-full bg-emerald-100 ${large ? "h-4" : "h-3"}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-4 text-xs font-semibold text-slate-500">
        <span>Terkumpul</span>
        <span>Target {formatCurrency(targetAmount)}</span>
      </div>
    </div>
  )
}
