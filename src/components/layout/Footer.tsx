import { HeartHandshake, Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_.8fr_.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <HeartHandshake size={24} />
            </span>
            <span className="text-xl font-black text-slate-950">DonasiKita</span>
          </div>
          <p className="mt-4 max-w-md leading-7 text-slate-600">
            Platform donasi modern untuk membantu campaign sosial berjalan transparan, mudah, dan
            dipercaya.
          </p>
        </div>
        <div>
          <h3 className="font-black text-slate-950">Navigasi</h3>
          <div className="mt-4 grid gap-3 text-slate-600">
            <Link className="hover:text-emerald-700" to="/campaigns">Donasi Sekarang</Link>
            <Link className="hover:text-emerald-700" to="/about">Tentang Kami</Link>
            <Link className="hover:text-emerald-700" to="/faq">FAQ</Link>
            <Link className="hover:text-emerald-700" to="/contact">Kontak</Link>
          </div>
        </div>
        <div>
          <h3 className="font-black text-slate-950">Kontak</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <span className="flex items-center gap-2"><Mail size={16} /> halo@donasikita.id</span>
            <span className="flex items-center gap-2"><Phone size={16} /> +62 812 0000 0000</span>
            <span className="flex items-center gap-2"><MapPin size={16} /> Indonesia</span>
          </div>
        </div>
      </div>
      <div className="border-t border-emerald-100 px-4 py-5 text-center text-sm text-slate-500">
        © 2026 DonasiKita. Dibuat untuk campaign baik.
      </div>
    </footer>
  )
}
