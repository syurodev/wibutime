export interface ErrorDetail {
  code?: string
  message?: string
  details?: any
}

export interface StandardResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: ErrorDetail
  meta?: Record<string, any>
}

export interface UserInfo {
  sub: string
  name?: string
  email?: string
  picture?: string
  preferred_username?: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  refresh_token?: string
  expires_in?: number
  scope?: string
}