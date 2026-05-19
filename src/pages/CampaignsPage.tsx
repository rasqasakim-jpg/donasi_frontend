import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import api from "../api/axios"
import CampaignCard from "../components/campaign/CampaignCard"
import DonateModal from "../components/campaign/DonateModal"
import Button from "../components/common/Button"
import EmptyState from "../components/common/EmptyState"
import LoadingState from "../components/common/LoadingState"
import SectionHeader from "../components/common/SectionHeader"
import type { Campaign, CampaignListResponse } from "../types"
import { isLoggedIn } from "../utils/auth"

const normalizeCampaigns = (payload: CampaignListResponse | Campaign[]) =>
  Array.isArray(payload) ? payload : payload.data || payload.campaigns || []

export default function CampaignsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [keyword, setKeyword] = useState(searchParams.get("q") || "")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadCampaigns = async (q = keyword) => {
    setLoading(true)
    setError("")

    try {
      const response = await api.get<CampaignListResponse | Campaign[]>("/campaigns", {
        params: { page: 1, limit: 9, q: q || undefined }
      })
      setCampaigns(normalizeCampaigns(response.data))
    } catch {
      setError("Gagal memuat campaign dari backend.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns(searchParams.get("q") || "")
  }, [])

  const searchCampaigns = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearchParams(keyword ? { q: keyword } : {})
    loadCampaigns(keyword)
  }

  const openDonation = (campaign: Campaign) => {
    if (!isLoggedIn()) {
      navigate("/login", { state: { redirectTo: `/campaigns/${campaign.id}` } })
      return
    }

    setSelectedCampaign(campaign)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Donasi sekarang"
        title="Temukan campaign yang ingin kamu dukung"
        description="Gunakan pencarian untuk menemukan campaign berdasarkan judul atau deskripsi."
        action={<Button to="/campaigns/create">Buat Campaign</Button>}
      />

      <form className="mb-8 flex flex-col gap-3 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-emerald-100 sm:flex-row" onSubmit={searchCampaigns}>
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-emerald-50/70 px-4">
          <Search className="text-emerald-600" size={19} />
          <input
            className="h-12 w-full bg-transparent outline-none placeholder:text-slate-400"
            placeholder="Cari campaign..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <Button type="submit">Cari Campaign</Button>
      </form>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <EmptyState title="Terjadi kesalahan" description={error} />
      ) : campaigns.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard campaign={campaign} key={campaign.id} onDonate={openDonation} />
          ))}
        </div>
      ) : (
        <EmptyState title="Campaign tidak ditemukan" description="Coba kata kunci lain atau buat campaign baru." />
      )}

      <DonateModal
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        onSuccess={() => loadCampaigns(keyword)}
      />
    </main>
  )
}
