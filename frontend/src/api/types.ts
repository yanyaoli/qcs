export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface LoginRequest {
  employee_id: number
}

export interface LoginResponse {
  token: string
  employee_id: number
  name: string
  position: string
}

export interface User {
  id: number
  name: string
  position: string
}
