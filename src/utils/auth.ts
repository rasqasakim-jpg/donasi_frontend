import type { User } from "../types"

const TOKEN_KEY = "donasi_token"
const USER_KEY = "donasi_user"

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const isLoggedIn = () => Boolean(getToken())

export const setUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUser = (): User | null => {
  const rawUser = localStorage.getItem(USER_KEY)

  if (!rawUser) return null

  try {
    return JSON.parse(rawUser) as User
  } catch {
    removeUser()
    return null
  }
}

export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
}

export const clearAuth = () => {
  removeToken()
  removeUser()
}
