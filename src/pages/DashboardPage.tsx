import { Edit, Plus, Trash2, UserRound } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import CampaignProgress from "../components/campaign/CampaignProgress"
import Button from "../components/common/Button"
import EmptyState from "../components/common/EmptyState"
import LoadingState from "../components/common/LoadingState"
import SectionHeader from "../components/common/SectionHeader"
import type { Campaign, CampaignListResponse, User } from "../types"
import { getUser, setUser } from "../utils/auth"
import { formatCurrency } from "../utils/format"

const normalizeCampaigns = (payload: CampaignListResponse | Campaign[]) =>
  Array.isArray(payload) ? payload : payload.data || payload.campaigns || []

export default function DashboardPage() {
  const [user, setCurrentUser] = useState<User | null>(getUser())
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const loadUser = async () => {
    try {
      const response = await api.get<{ user?: User; data?: User }>("/auth/me")
      const nextUser = response.data.user || response.data.data
      if (nextUser) {
        setUser(nextUser)
        setCurrentUser(nextUser)
      }
    } catch {
      try {
        const response = await api.get<{ user?: User; data?: User }>("/profile")
        const nextUser = response.data.user || response.data.data
        if (nextUser) {
          setUser(nextUser)
          setCurrentUser(nextUser)
        }
      } catch {
        setCurrentUser(getUser())
      }
    }
  }

  const loadCampaigns = async (ownerId?: number) => {
    setLoading(true)
    try {
      const response = await api.get<CampaignListResponse | Campaign[]>("/campaigns", {
        params: { page: 1, limit: 20, ownerId }
      })
      setCampaigns(normalizeCampaigns(response.data))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const prepareDashboard = async () => {
      await loadUser()
      const localUser = getUser()
      await loadCampaigns(localUser?.id)
    }

    prepareDashboard()
  }, [])

  const deleteCampaign = async (id: number) => {
    const confirmed = window.confirm("Hapus campaign ini?")
    if (!confirmed) return

    try {
      await api.delete(`/campaigns/${id}`)
      setCampaigns((items) => items.filter((item) => item.id !== id))
      setMessage("Campaign berhasil dihapus.")
    } catch {
      setMessage("Gagal menghapus campaign. Pastikan kamu pemilik campaign.")
    }
  }

  const totalRaised = campaigns.reduce((sum, campaign) => sum + Number(campaign.currentAmount || 0), 0)

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Dashboard"
        title={`Halo, ${user?.name || "Fundraiser"}`}
        description="Kelola campaign milikmu dan lihat ringkasan progress donasi."
        action={<Button to="/campaigns/create"><Plus size={18} /> Buat Campaign</Button>}
      />

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
          <UserRound className="mb-4 text-emerald-600" size={28} />
          <p className="text-sm font-semibold text-slate-500">Akun</p>
          <p className="mt-1 text-xl font-black text-slate-950">{user?.email || "-"}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
          <p className="text-sm font-semibold text-slate-500">Campaign Kamu</p>
          <p className="mt-1 text-4xl font-black text-emerald-700">{campaigns.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
          <p className="text-sm font-semibold text-slate-500">Total Terkumpul</p>
          <p className="mt-1 text-2xl font-black text-emerald-700">{formatCurrency(totalRaised)}</p>
        </div>
      </div>

      {message && <div className="mb-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div>}

      {loading ? (
        <LoadingState />
      ) : campaigns.length ? (
        <div className="grid gap-5">
          {campaigns.map((campaign) => (
            <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-emerald-100" key={campaign.id}>
              <div className="grid gap-5 lg:grid-cols-[1fr_320px_auto] lg:items-center">
                <div>
                  <Link className="text-xl font-black text-slate-950 hover:text-emerald-700" to={`/campaigns/${campaign.id}`}>
                    {campaign.title}
                  </Link>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{campaign.description}</p>
                </div>
                <CampaignProgress currentAmount={campaign.currentAmount || 0} targetAmount={campaign.targetAmount || 0} />
                <div className="flex gap-2">
                  <Button to={`/campaigns/${campaign.id}/edit`} variant="secondary" className="px-4">
                    <Edit size={17} />
                  </Button>
                  <Button type="button" variant="danger" className="px-4" onClick={() => deleteCampaign(campaign.id)}>
                    <Trash2 size={17} />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Kamu belum punya campaign" description="Mulai buat campaign pertama untuk menggalang donasi." />
      )}
    </main>
  )
}
