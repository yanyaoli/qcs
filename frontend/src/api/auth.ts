import { departments, employees, positions, shifts } from '../mock/data'
import type { LoginRequest, LoginResponse, ApiResponse } from './types'

function delay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function generateToken(): string {
  return 'mock-jwt-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await delay()
    const emp = employees.find(e => e.id === credentials.employee_id)
    if (!emp) {
      throw new Error('Employee not found')
    }
    const token = generateToken()
    localStorage.setItem('auth_token', token)
    return {
      token,
      employee_id: emp.id,
      name: emp.name,
      position: positions.find(p => p.id === emp.position_id)?.name || '',
    }
  },

  getDepartments: async () => {
    await delay(200)
    return departments.map(d => ({ id: d.id, name: d.name }))
  },

  getEmployees: async (departmentId: number) => {
    await delay(200)
    return employees
      .filter(e => e.department_id === departmentId)
      .map(e => ({
        id: e.id,
        name: e.name,
        dept_id: e.department_id,
        position: positions.find(p => p.id === e.position_id)?.name || '',
        shift: shifts.find(s => s.id === e.shift_id)?.name || '',
        employee_no: e.employee_no,
      }))
  },

  logout: async (): Promise<ApiResponse> => {
    await delay()
    localStorage.removeItem('auth_token')
    return { success: true }
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    await delay()
    const token = generateToken()
    localStorage.setItem('auth_token', token)
    return { success: true, data: { token } }
  },

  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    await delay()
    return { success: true, data: null }
  },
}
