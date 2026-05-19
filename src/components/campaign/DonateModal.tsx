import { useState } from "react"
import type { FormEvent } from "react"
import { HeartHandshake, Loader2, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import type { Campaign } from "../../types"
import { isLoggedIn } from "../../utils/auth"
import { formatCurrency } from "../../utils/format"
import Button from "../common/Button"

type DonateModalProps = {
  campaign: Campaign | null
  onClose: () => void
  onSuccess?: () => void
}

export default function DonateModal({ campaign, onClose, onSuccess }: DonateModalProps) {
  const navigate = useNavigate()
  const [amount, setAmount] = useState("50000")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  if (!campaign) return null

  const submitDonation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isLoggedIn()) {
      navigate("/login", { state: { redirectTo: `/campaigns/${campaign.id}` } })
      return
    }

    setLoading(true)
    setMessage("")

    try {
      await api.post(`/donations/campaigns/${campaign.id}/donate`, {
        amount: Number(amount)
      })
      setMessage("Donasi berhasil dikirim. Terima kasih sudah ikut membantu.")
      onSuccess?.()
      window.setTimeout(onClose, 900)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Donasi gagal diproses.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-600">
              Donasi Campaign
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">{campaign.title}</h2>
          </div>
          <button
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            type="button"
            onClick={onClose}
            aria-label="Tutup modal donasi"
          >
            <X size={20} />
          </button>
        </div>
        <form className="space-y-5 p-6" onSubmit={submitDonation}>
          <div>
            <label className="text-sm font-bold text-slate-700" htmlFor="amount">
              Nominal Donasi
            </label>
            <input
              id="amount"
              className="mt-2 w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              min="1000"
              required
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <p className="mt-2 text-sm font-semibold text-emerald-700">
              {formatCurrency(Number(amount || 0))}
            </p>
          </div>
          {message && (
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {message}
            </div>
          )}
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <HeartHandshake size={18} />}
            Kirim Donasi
          </Button>
        </form>
      </div>
    </div>
  )
}
