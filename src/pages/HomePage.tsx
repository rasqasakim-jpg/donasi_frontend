import { ArrowRight, BadgeCheck, HandCoins, HeartHandshake, Search, ShieldCheck, Sparkles, Target } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import api from "../api/axios"
import CampaignCard from "../components/campaign/CampaignCard"
import Button from "../components/common/Button"
import EmptyState from "../components/common/EmptyState"
import LoadingState from "../components/common/LoadingState"
import SectionHeader from "../components/common/SectionHeader"
import type { Campaign, CampaignListResponse } from "../types"
import { formatCurrency } from "../utils/format"

const steps = [
  { icon: Search, title: "Pilih Campaign", text: "Cari campaign yang sesuai dengan kepedulianmu." },
  { icon: HandCoins, title: "Isi Nominal", text: "Tentukan nominal donasi dengan proses yang sederhana." },
  { icon: BadgeCheck, title: "Donasi Terkirim", text: "Donasi masuk ke sistem dan progress campaign bertambah." }
]

const reasons = [
  { icon: ShieldCheck, title: "Aman dan Terhubung", text: "Frontend langsung terhubung ke backend production DonasiKita." },
  { icon: Target, title: "Progress Jelas", text: "Setiap campaign menampilkan target, terkumpul, dan persentase." },
  { icon: HeartHandshake, title: "Mudah Dipakai", text: "Alur login, buat campaign, dan donasi dibuat sederhana." }
]

const faqs = [
  ["Apakah harus login untuk donasi?", "Ya, endpoint donasi backend membutuhkan token login."],
  ["Bisa membuat campaign sendiri?", "Bisa. Setelah login, buka menu Buat Campaign."],
  ["Apakah data campaign real?", "Ya. Data campaign diambil dari backend production kamu."]
]

const normalizeCampaigns = (payload: CampaignListResponse | Campaign[]) =>
  Array.isArray(payload) ? payload : payload.data || payload.campaigns || []

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const response = await api.get<CampaignListResponse | Campaign[]>("/campaigns", {
          params: { page: 1, limit: 3 }
        })
        setCampaigns(normalizeCampaigns(response.data))
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  const totalRaised = useMemo(
    () => campaigns.reduce((sum, campaign) => sum + Number(campaign.currentAmount || 0), 0),
    [campaigns]
  )

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(20,184,166,.18),transparent_32%)]" />
        <div className="mx-auto grid min-h-[calc(100vh-82px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-extrabold text-emerald-700 shadow-sm">
              <Sparkles size={17} />
              Platform donasi untuk aksi baik
            </div>
            <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Bersama bantu mereka yang membutuhkan.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              DonasiKita membantu kamu menemukan campaign sosial, berdonasi dengan mudah, dan
              membuat penggalangan dana secara cepat.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/campaigns">
                Donasi Sekarang <ArrowRight size={18} />
              </Button>
              <Button to="/campaigns/create" variant="secondary">
                Buat Campaign
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-2xl shadow-emerald-900/10">
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(5,150,105,.92),rgba(20,184,166,.72)),url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-6 text-white">
              <p className="text-sm font-bold text-emerald-50">Ringkasan Platform</p>
              <h2 className="mt-16 text-4xl font-black">DonasiKita</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-emerald-50">
                Campaign berjalan dengan tampilan transparan dan alur donasi yang familiar.
              </p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-emerald-50 p-4">
                <p className="text-2xl font-black text-emerald-700">{campaigns.length}</p>
                <p className="text-sm font-semibold text-slate-600">Campaign</p>
              </div>
              <div className="rounded-3xl bg-teal-50 p-4 sm:col-span-2">
                <p className="text-2xl font-black text-emerald-700">{formatCurrency(totalRaised)}</p>
                <p className="text-sm font-semibold text-slate-600">Terkumpul dari campaign terbaru</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Campaign terbaru"
          title="Pilih campaign yang ingin kamu bantu"
          description="Beberapa campaign terbaru dari backend production DonasiKita."
          action={<Button to="/campaigns" variant="secondary">Lihat Semua</Button>}
        />
        {loading ? (
          <LoadingState />
        ) : campaigns.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard campaign={campaign} key={campaign.id} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada campaign" description="Campaign terbaru akan muncul di sini." />
        )}
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Kenapa DonasiKita?"
            title="Dibuat agar donasi terasa mudah dan terpercaya"
            description="Tampilan clean, data jelas, dan akses campaign yang rapi untuk kebutuhan frontend kamu."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {reasons.map((item) => (
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6" key={item.title}>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Cara berdonasi"
          title="Tiga langkah sederhana untuk ikut membantu"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100" key={step.title}>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <step.icon size={24} />
                </div>
                <span className="text-4xl font-black text-emerald-100">0{index + 1}</span>
              </div>
              <h3 className="text-xl font-black text-slate-950">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-emerald-950 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="FAQ"
            title="Pertanyaan singkat"
            description="Beberapa hal yang sering ditanyakan sebelum mulai memakai DonasiKita."
          />
          <div className="grid gap-4">
            {faqs.map(([question, answer]) => (
              <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10" key={question}>
                <h3 className="font-black">{question}</h3>
                <p className="mt-2 text-emerald-50/80">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
