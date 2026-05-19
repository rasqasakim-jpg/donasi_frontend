import { useState } from "react"
import type { FormEvent } from "react"
import { Loader2, Lock } from "lucide-react"
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

  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo || "/dashboard"

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    const form = new FormData(event.currentTarget)

    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email: String(form.get("email") || ""),
        password: String(form.get("password") || "")
      })
      const token = response.data.data?.token || response.data.token
      const user = response.data.data?.user || response.data.user

      if (!token) throw new Error("Token tidak ditemukan dari backend.")
      setToken(token)
      if (user) setUser(user)
      navigate(redirectTo, { replace: true })
    } catch (loginError) {
      setError(getErrorMessage(loginError))
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
            <input className="mt-2 w-full rounded-2xl border border-emerald-100 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" id="password" name="password" required type="password" />
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
