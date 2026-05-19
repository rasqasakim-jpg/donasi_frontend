import { CalendarDays, HeartHandshake, UserRound } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"
import CampaignProgress from "../components/campaign/CampaignProgress"
import DonateModal from "../components/campaign/DonateModal"
import Button from "../components/common/Button"
import EmptyState from "../components/common/EmptyState"
import LoadingState from "../components/common/LoadingState"
import type { Campaign, CampaignListResponse } from "../types"
import { isLoggedIn } from "../utils/auth"
import { formatDate } from "../utils/format"

const normalizeCampaigns = (payload: CampaignListResponse | Campaign[]) =>
  Array.isArray(payload) ? payload : payload.data || payload.campaigns || []

const extractCampaign = (payload: unknown): Campaign | null => {
  const response = payload as { data?: Campaign; campaign?: Campaign }
  return response.data || response.campaign || (payload as Campaign)
}

export default function CampaignDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [donateOpen, setDonateOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadCampaign = async () => {
    if (!id) return
    setLoading(true)
    setError("")

    try {
      const response = await api.get(`/campaigns/${id}`)
      setCampaign(extractCampaign(response.data))
    } catch {
      try {
        const response = await api.get<CampaignListResponse | Campaign[]>("/campaigns", {
          params: { page: 1, limit: 100 }
        })
        const found = normalizeCampaigns(response.data).find((item) => item.id === Number(id))
        if (!found) throw new Error("Campaign tidak ditemukan.")
        setCampaign(found)
      } catch {
        setError("Campaign tidak ditemukan atau backend belum menyediakan endpoint detail.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaign()
  }, [id])

  const handleDonate = () => {
    if (!isLoggedIn()) {
      navigate("/login", { state: { redirectTo: `/campaigns/${id}` } })
      return
    }

    setDonateOpen(true)
  }

  if (loading) {
    return <main className="mx-auto max-w-5xl px-4 py-12"><LoadingState /></main>
  }

  if (error || !campaign) {
    return <main className="mx-auto max-w-5xl px-4 py-12"><EmptyState title="Campaign tidak tersedia" description={error} /></main>
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-100">
        <div className="h-72 bg-[linear-gradient(135deg,rgba(5,150,105,.88),rgba(20,184,166,.66)),url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
          <section>
            <div className="mb-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                <UserRound size={16} /> {campaign.owner?.name || "DonasiKita"}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                <CalendarDays size={16} /> {formatDate(campaign.createdAt)}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">{campaign.title}</h1>
            <p className="mt-6 whitespace-pre-line text-lg leading-8 text-slate-600">{campaign.description}</p>
          </section>

          <aside className="rounded-3xl bg-emerald-50 p-5">
            <CampaignProgress
              currentAmount={campaign.currentAmount || 0}
              targetAmount={campaign.targetAmount || 0}
              large
            />
            <Button className="mt-6 w-full" type="button" onClick={handleDonate}>
              <HeartHandshake size={18} />
              Donasi Campaign Ini
            </Button>
          </aside>
        </div>
      </div>

      <DonateModal campaign={donateOpen ? campaign : null} onClose={() => setDonateOpen(false)} onSuccess={loadCampaign} />
    </main>
  )
}
