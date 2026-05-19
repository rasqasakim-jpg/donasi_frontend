import { ArrowRight, HeartHandshake } from "lucide-react"
import { Link } from "react-router-dom"
import type { Campaign } from "../../types"
import { formatDate } from "../../utils/format"
import Button from "../common/Button"
import CampaignProgress from "./CampaignProgress"

type CampaignCardProps = {
  campaign: Campaign
  onDonate?: (campaign: Campaign) => void
}

export default function CampaignCard({ campaign, onDonate }: CampaignCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm shadow-emerald-900/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10">
      <Link to={`/campaigns/${campaign.id}`} className="block">
        <div className="h-44 bg-[linear-gradient(135deg,rgba(5,150,105,.9),rgba(20,184,166,.72)),url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
      </Link>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold text-slate-500">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
            {campaign.owner?.name || "DonasiKita"}
          </span>
          <span>{formatDate(campaign.createdAt)}</span>
        </div>
        <Link to={`/campaigns/${campaign.id}`} className="block">
          <h3 className="line-clamp-2 text-xl font-black tracking-tight text-slate-950 group-hover:text-emerald-700">
            {campaign.title}
          </h3>
        </Link>
        <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-600">
          {campaign.description}
        </p>
        <div className="mt-5">
          <CampaignProgress
            currentAmount={campaign.currentAmount || 0}
            targetAmount={campaign.targetAmount || 0}
          />
        </div>
        <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
          <Button type="button" onClick={() => onDonate?.(campaign)}>
            <HeartHandshake size={17} />
            Donasi
          </Button>
          <Button to={`/campaigns/${campaign.id}`} variant="secondary" className="px-4">
            <ArrowRight size={17} />
          </Button>
        </div>
      </div>
    </article>
  )
}
