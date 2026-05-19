import { HeartHandshake, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import Button from "../common/Button"
import { clearAuth, getUser, isLoggedIn } from "../../utils/auth"

const publicLinks = [
  { label: "Beranda", to: "/" },
  { label: "Tentang Kami", to: "/about" },
  { label: "Donasi Sekarang", to: "/campaigns" },
  { label: "FAQ", to: "/faq" },
  { label: "Kontak", to: "/contact" }
]

export default function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const user = getUser()
  const authenticated = isLoggedIn()

  const logout = () => {
    clearAuth()
    setOpen(false)
    navigate("/")
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-2xl px-4 py-2 text-sm font-bold transition ${
      isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100/80 bg-white/85 shadow-sm shadow-emerald-900/5 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" to="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
            <HeartHandshake size={24} />
          </span>
          <span className="text-xl font-black tracking-tight text-slate-950">DonasiKita</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {publicLinks.map((link) => (
            <NavLink className={linkClass} key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {authenticated ? (
            <>
              <Button to="/dashboard" variant="secondary">
                Dashboard
              </Button>
              <Button to="/campaigns/create">Buat Campaign</Button>
              <button
                className="rounded-2xl p-3 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                type="button"
                onClick={logout}
                title={`Logout ${user?.name || ""}`}
              >
                <LogOut size={19} />
              </button>
            </>
          ) : (
            <>
              <Button to="/login" variant="ghost">
                Login
              </Button>
              <Button to="/register">Register</Button>
            </>
          )}
        </div>

        <button
          className="rounded-2xl p-3 text-slate-700 transition hover:bg-emerald-50 lg:hidden"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-emerald-100 bg-white px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {publicLinks.map((link) => (
              <NavLink className={linkClass} key={link.to} to={link.to} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 grid gap-2 border-t border-emerald-100 pt-3">
              {authenticated ? (
                <>
                  <Button to="/dashboard" variant="secondary">
                    Dashboard
                  </Button>
                  <Button to="/campaigns/create">Buat Campaign</Button>
                  <Button type="button" variant="danger" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button to="/login" variant="secondary">
                    Login
                  </Button>
                  <Button to="/register">Register</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
