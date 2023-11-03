import type { Location } from './location.interface'

export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT',
}

// TODO: is this the right way to do this? add every field to the interface?
export interface CustomUser {
  id: string
  uid?: string
  locale?: string
  role: Role
  firstname: string
  lastname: string
  fullname: string
  url?: string
  locations?: Location[]
  email: string
  telephone?: string
  createdAt?: Date
  updatedAt?: Date
  // STAFF ONLY
  absentCount: number
  // CLIENT ONLY
  invoiceOption: string // post or email
  company: boolean
  btwNumber?: string
}
