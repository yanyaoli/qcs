import raw from './data.json'

export interface Department {
  id: number
  name: string
}

export interface Employee {
  id: number
  name: string
  employee_no: string
  department_id: number
  position: string
  shift: string
  status: string
}

export interface Position {
  id: number
  name: string
}

export interface Shift {
  id: number
  name: string
}

export interface Permission {
  position: string
  canEditBasicDict: boolean
  canEditRelatedData: boolean
}

export interface Machine {
  id: number
  code: string
  department_id: number
  location: string
}

export interface EmployeeAuth {
  employee_id: number
  username: string
  has_face: boolean
}

export const departments: Department[] = raw.departments
export const shifts: Shift[] = raw.shifts
export const positions: Position[] = raw.positions
export const permissions: Permission[] = raw.permissions
export const machines: Machine[] = raw.machines
export const employeeAuth: EmployeeAuth[] = raw.employeeAuth
export const employees: Employee[] = raw.employees
