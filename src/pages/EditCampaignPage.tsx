import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Loader2, Save } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"
import Button from "../components/common/Button"
import EmptyState from "../components/common/EmptyState"
import LoadingState from "../components/common/LoadingState"
import SectionHeader from "../components/common/SectionHeader"
import type { Campaign, CampaignListResponse } from "../types"

const normalizeCampaigns = (payload: CampaignListResponse | Campaign[]) =>
  Array.isArray(payload) ? payload : payload.data || payload.campaigns || []

const extractCampaign = (payload: unknown): Campaign | null => {
  const response = payload as { data?: Campaign; campaign?: Campaign }
  return response.data || response.campaign || (payload as Campaign)
}

export default function EditCampaignPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadCampaign = async () => {
      if (!id) return
      setLoading(true)
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
          setError("Campaign tidak ditemukan.")
        }
      } finally {
        setLoading(false)
      }
    }

    loadCampaign()
  }, [id])

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError("")
    const form = new FormData(event.currentTarget)

    try {
      await api.put(`/campaigns/${id}`, {
        title: String(form.get("title") || ""),
        description: String(form.get("description") || ""),
        targetAmount: Number(form.get("targetAmount") || 0)
      })
      navigate("/dashboard")
    } catch (editError) {
      const maybeError = editError as { response?: { data?: { message?: string } } }
      setError(maybeError.response?.data?.message || "Gagal mengupdate campaign.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <main className="mx-auto max-w-4xl px-4 py-12"><LoadingState /></main>
  if (!campaign) return <main className="mx-auto max-w-4xl px-4 py-12"><EmptyState title="Campaign tidak ditemukan" description={error} /></main>

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Edit campaign"
        title="Perbarui informasi campaign"
        description="Backend akan menolak perubahan jika kamu bukan pemilik campaign."
      />
      <form className="space-y-5 rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-100" onSubmit={submitEdit}>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="title">Judul Campaign</label>
          <input className="mt-2 w-full rounded-2xl border border-emerald-100 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" defaultValue={campaign.title} id="title" name="title" required />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="description">Deskripsi</label>
          <textarea className="mt-2 min-h-40 w-full rounded-2xl border border-emerald-100 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" defaultValue={campaign.description} id="description" name="description" required />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="targetAmount">Target Donasi</label>
          <input className="mt-2 w-full rounded-2xl border border-emerald-100 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" defaultValue={campaign.targetAmount} id="targetAmount" min="1000" name="targetAmount" required type="number" />
        </div>
        {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
        <Button disabled={saving} type="submit">
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Simpan Perubahan
        </Button>
      </form>
    </main>
  )
}
