export interface User {
  id: string
  name: string
  email: string
  another_name?: string
  avatar?: string
  settings?: Record<string, any>
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user?: User
  roles?: string[]
  permissions?: string[]
}
