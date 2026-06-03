import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import api from "../api/axios"

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const emailFromQuery = searchParams.get("email") || ""

  const [email, setEmail] = useState(emailFromQuery)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await api.post("/auth/verify-email-otp", {
        email,
        code,
      })

      setSuccess("Email berhasil diverifikasi. Kamu akan diarahkan ke login.")

      setTimeout(() => {
        navigate("/login")
      }, 1200)
    } catch (err: any) {
      setError(err.response?.data?.message || "Verifikasi OTP gagal")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    setSuccess("")

    if (!email){
        setError("email wajib diisi untuk mengirim ulang otp")
        return
    }

    setResending(true)

    try {
        await api.post("/auth/resend-email-otp", {
            email
        })

        setSuccess("kode otp baru sudah dikirim ke email kamu")
    } catch (err: any) {
        setError(err.response?.data?.message || "gagal mengirim ulang otp")
    } finally {
        setResending(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-emerald-600">
          Verifikasi Email
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Masukkan Kode OTP
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Kami sudah mengirimkan kode OTP ke email kamu. Masukkan kode tersebut
          untuk mengaktifkan akun.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:border-emerald-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@gmail.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Kode OTP
            </span>
            <input
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-center text-2xl font-bold tracking-[0.35em] outline-none focus:border-emerald-500"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
            />
          </label>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Memverifikasi..." : "Verifikasi OTP"}
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending || !email}
            className="w-full rounded-2xl border border-emerald-200 px-4 py-3 font-bold text-emerald-700 disabled:opacity-60"
          >
            {resending ? "Mengirim ulang..." : "Kirim Ulang OTP"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Sudah verifikasi?{" "}
          <Link to="/login" className="font-bold text-emerald-600">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}
