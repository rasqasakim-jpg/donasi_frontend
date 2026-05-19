export type User = {
  id: number
  name: string
  email: string
}

export type Campaign = {
  id: number
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  ownerId?: number
  createdAt?: string
  owner?: User
}

export type AuthResponse = {
  message: string
  token?: string
  user?: User
  data?: {
    token?: string
    user?: User
  }
}

export type CampaignListResponse = {
  data?: Campaign[]
  campaigns?: Campaign[]
  meta?: {
    page: number
    limit: number
    total: number
    totalPage?: number
    totalpages?: number
  }
}

export type ApiMessage = {
  message?: string
}
