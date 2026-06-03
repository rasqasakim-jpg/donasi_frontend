import { useState } from "react"
import type { FormEvent } from "react"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import api from "../api/axios"
import Button from "../components/common/Button"
import type { AuthResponse } from "../types"
import { setToken, setUser } from "../utils/auth"

const getErrorMessage = (error: unknown) => {
  const maybeError = error as { response?: { data?: { message?: string } } }
  return maybeError.response?.data?.message || "Login gagal. Periksa email dan password."
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo || "/dashboard"

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") || "")
    const password = String(form.get("password") || "")

    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password
      })

      const token = response.data.data?.token || response.data.token
      const user = response.data.data?.user || response.data.user

      if (!token) throw new Error("Token tidak ditemukan dari backend.")

      setToken(token)
      if (user) setUser(user)

      navigate(redirectTo, { replace: true })
    } catch (loginError) {
      const message = getErrorMessage(loginError)
      setError(message)

      if (message.toLowerCase().includes("verify")) {
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`)
        }, 1000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-82px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <section>
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-600">Login DonasiKita</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          Masuk untuk mulai berdonasi dan mengelola campaign.
        </h1>
        <p className="mt-5 max-w-xl leading-8 text-slate-600">
          Token login akan disimpan di browser dan otomatis dikirim ke backend lewat Axios interceptor.
        </p>
      </section>
      <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-100">
        <form className="space-y-5" onSubmit={submitLogin}>
          <div>
            <label className="text-sm font-bold text-slate-700" htmlFor="email">Email</label>
            <input className="mt-2 w-full rounded-2xl border border-emerald-100 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" id="email" name="email" required type="email" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700" htmlFor="password">Password</label>
            <div className="relative mt-2">
              <input className="w-full rounded-2xl border border-emerald-100 px-4 py-3 pr-12 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" id="password" name="password" required type={showPassword ? "text" : "password"} />
              <button
                aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
            Login
          </Button>
          <p className="text-center text-sm text-slate-600">
            Belum punya akun? <Link className="font-bold text-emerald-700" to="/register">Register</Link>
          </p>
        </form>
      </section>
    </main>
  )
}
