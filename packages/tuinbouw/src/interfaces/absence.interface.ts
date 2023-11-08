import type { CustomUser } from './custom.user.interface'

export interface Absence {
  id: string
  user?: CustomUser
  description?: string
  type?: string
  startDate?: string
  endDate?: string
  totalDays?: number
  createdAt?: string
  updatedAt?: string
}
