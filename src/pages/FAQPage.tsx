import SectionHeader from "../components/common/SectionHeader"

const faqs = [
  ["Bagaimana cara berdonasi?", "Buka halaman Donasi Sekarang, pilih campaign, login, lalu isi nominal donasi."],
  ["Bagaimana cara membuat campaign?", "Login terlebih dahulu, lalu pilih menu Buat Campaign dan isi form yang tersedia."],
  ["Kenapa saya diarahkan ke login?", "Beberapa endpoint backend seperti donasi dan create campaign membutuhkan token autentikasi."],
  ["Apakah ada riwayat donasi?", "Frontend siap menampung endpoint GET /donations/me jika nanti backend kamu menyediakannya."]
]

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="FAQ"
        title="Pertanyaan yang sering diajukan"
        description="Jawaban singkat seputar penggunaan DonasiKita."
      />
      <div className="grid gap-4">
        {faqs.map(([question, answer]) => (
          <details className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100" key={question}>
            <summary className="cursor-pointer list-none text-lg font-black text-slate-950">
              {question}
            </summary>
            <p className="mt-3 leading-7 text-slate-600">{answer}</p>
          </details>
        ))}
      </div>
    </main>
  )
}
