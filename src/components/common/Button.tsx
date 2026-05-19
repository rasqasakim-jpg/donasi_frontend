import { Link } from "react-router-dom"
import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  className?: string
  href?: string
  to?: string
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700",
  secondary: "bg-white text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50",
  ghost: "bg-transparent text-slate-700 hover:bg-emerald-50 hover:text-emerald-700",
  danger: "bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700"
}

export default function Button({
  children,
  className = "",
  href,
  to,
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
