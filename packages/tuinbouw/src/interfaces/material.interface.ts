import type { CustomUser } from './custom.user.interface'

export interface Material {
  id: string
  name: string
  isLoan: boolean
  user: CustomUser
  serialNumber: string
  createdAt: string
  updatedAt: string
}
