import axios from "axios"
import { getToken } from "../utils/auth"

export const API_URL =
  import.meta.env.VITE_API_URL || "https://donasi-backend.vercel.app"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
