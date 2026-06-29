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
  position_id: number
  shift_id: number
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
  position_id: number
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
  status: string
  has_face: boolean
}

export const departments: Department[] = raw.departments
export const shifts: Shift[] = raw.shifts
export const positions: Position[] = raw.positions
export const permissions: Permission[] = raw.permissions
export const machines: Machine[] = raw.machines
export const employeeAuth: EmployeeAuth[] = raw.employeeAuth
export const employees: Employee[] = raw.employees

export interface DefectCause {
  id: number
  department: string
  cause: string
}

export interface Unit {
  id: number
  category: string
  unit: string
}

export interface ProductStandard {
  id: number
  description: string
  standardWidth: string
  widthTolerance: string
  standardThickness: string
  thicknessTolerance: string
  standardTension: string
}

export const defectCauses: DefectCause[] = raw.defectCauses
export const units: Unit[] = raw.units
export const productStandards: ProductStandard[] = raw.productStandards

export interface FirstArticleConfirmation {
  productKey: string
  productName?: string
  specification?: string
  count: number
  orders: number[]
  statusId: number
  statusName: string
  lastUpdate: string
  pass?: boolean
  defectCause?: string
  confirmedBy?: string
  confirmedAt?: string
  businessConfirmed?: boolean
  businessConfirmedBy?: string
  businessConfirmedAt?: string
}

export const firstArticleConfirmations: FirstArticleConfirmation[] = raw.firstArticleConfirmations

export interface IronTapeStatus {
  id: number
  name: string
  cssClass: string
}

export interface FirstArticleStatus {
  id: number
  name: string
  cssClass: string
  prodCssClass: string
}

export const ironTapeStatuses: IronTapeStatus[] = raw.ironTapeStatuses
export const firstArticleStatuses: FirstArticleStatus[] = raw.firstArticleStatuses

export interface WorkOrder {
  id: number
  workOrderNo: string
  customerCode: string
  scheduleDate: string
  productName: string
  specification: string
  colorName: string
  colorHex: string
  ironTapeStatusId: number
  ironTapeStatusName: string
  firstArticleStatusId: number
  firstArticleStatusName: string
  needsFirstArticle: boolean
  machineCode: string
  createdAt: string
  updatedAt: string
  tensionTest?: string
}

export const workOrders: WorkOrder[] = raw.workOrders as WorkOrder[]
