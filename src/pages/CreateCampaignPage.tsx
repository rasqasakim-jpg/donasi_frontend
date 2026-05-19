import { useState } from "react"
import type { FormEvent } from "react"
import { Loader2, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Button from "../components/common/Button"
import SectionHeader from "../components/common/SectionHeader"
import type { Campaign } from "../types"

const extractCampaign = (payload: unknown): Campaign | null => {
  const response = payload as { data?: Campaign; campaign?: Campaign }
  return response.data || response.campaign || null
}

export default function CreateCampaignPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submitCampaign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    const form = new FormData(event.currentTarget)

    try {
      const response = await api.post("/campaigns", {
        title: String(form.get("title") || ""),
        description: String(form.get("description") || ""),
        targetAmount: Number(form.get("targetAmount") || 0)
      })
      const campaign = extractCampaign(response.data)
      navigate(campaign?.id ? `/campaigns/${campaign.id}` : "/dashboard")
    } catch {
      setError("Gagal membuat campaign. Pastikan data sudah lengkap.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Buat campaign"
        title="Mulai penggalangan dana baru"
        description="Tuliskan judul, cerita, dan target donasi dengan jelas agar donatur memahami tujuan campaign."
      />
      <form className="space-y-5 rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-100" onSubmit={submitCampaign}>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="title">Judul Campaign</label>
          <input className="mt-2 w-full rounded-2xl border border-emerald-100 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" id="title" name="title" required />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="description">Deskripsi</label>
          <textarea className="mt-2 min-h-40 w-full rounded-2xl border border-emerald-100 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" id="description" name="description" required />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="targetAmount">Target Donasi</label>
          <input className="mt-2 w-full rounded-2xl border border-emerald-100 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" id="targetAmount" min="1000" name="targetAmount" required type="number" />
        </div>
        {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
        <Button disabled={loading} type="submit">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          Simpan Campaign
        </Button>
      </form>
    </main>
  )
}
