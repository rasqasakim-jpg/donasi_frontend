import { Mail, MapPin, Phone } from "lucide-react"
import Button from "../components/common/Button"
import SectionHeader from "../components/common/SectionHeader"

export default function ContactPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.8fr_1fr] lg:px-8">
      <section>
        <SectionHeader
          eyebrow="Kontak"
          title="Hubungi DonasiKita"
          description="Form ini masih dummy untuk kebutuhan tampilan frontend. Kamu bisa sambungkan ke backend kontak nanti."
        />
        <div className="grid gap-4 text-slate-600">
          <div className="flex items-center gap-3 rounded-3xl bg-white p-5 ring-1 ring-emerald-100">
            <Mail className="text-emerald-600" /> rasqasakim@gmail.com
          </div>
          <div className="flex items-center gap-3 rounded-3xl bg-white p-5 ring-1 ring-emerald-100">
            <Phone className="text-emerald-600" /> +6281334362970
          </div>
          <div className="flex items-center gap-3 rounded-3xl bg-white p-5 ring-1 ring-emerald-100">
            <MapPin className="text-emerald-600" /> Indonesia
          </div>
        </div>
      </section>
      <form className="space-y-5 rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-100">
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="name">Nama</label>
          <input className="mt-2 w-full rounded-2xl border border-emerald-100 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" id="name" />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="email">Email</label>
          <input className="mt-2 w-full rounded-2xl border border-emerald-100 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" id="email" type="email" />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor="message">Pesan</label>
          <textarea className="mt-2 min-h-36 w-full rounded-2xl border border-emerald-100 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" id="message" />
        </div>
        <Button type="button">Kirim Pesan</Button>
      </form>
    </main>
  )
}
