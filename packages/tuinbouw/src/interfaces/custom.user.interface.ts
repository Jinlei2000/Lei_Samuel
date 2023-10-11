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
  locationId?: string[] //TODO: change this later locationId: string
  email: string
  telephone?: string
  availability: boolean
  createdAt?: Date
  updatedAt?: Date
  // STAFF ONLY
  absentCount: number
  // CLIENT ONLY
  InvoiceOption: string // post or email
  Company: boolean
  BtwNumber?: string
}
