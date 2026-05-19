import { Navigate, Outlet, useLocation } from "react-router-dom"
import { isLoggedIn } from "../utils/auth"

export default function ProtectedRoute() {
  const location = useLocation()

  if (!isLoggedIn()) {
    return <Navigate replace state={{ redirectTo: location.pathname }} to="/login" />
  }

  return <Outlet />
}
