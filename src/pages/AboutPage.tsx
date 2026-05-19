import { BadgeCheck, HeartHandshake, ShieldCheck } from "lucide-react"
import SectionHeader from "../components/common/SectionHeader"

export default function AboutPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tentang Kami"
            title="DonasiKita membantu campaign baik tampil lebih dipercaya"
            description="Website ini dibuat sebagai frontend modern untuk backend donasi kamu. Fokusnya sederhana: campaign jelas, donasi mudah, dan pengalaman pengguna terasa profesional."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: HeartHandshake, title: "Berpihak pada kebaikan", text: "Setiap fitur diarahkan untuk memudahkan orang membantu." },
              { icon: ShieldCheck, title: "Alur aman", text: "Endpoint protected memakai token dari backend." },
              { icon: BadgeCheck, title: "Tampilan tepercaya", text: "UI clean dengan informasi progress yang mudah dibaca." }
            ].map((item) => (
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100" key={item.title}>
                <item.icon className="mb-5 text-emerald-600" size={30} />
                <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
