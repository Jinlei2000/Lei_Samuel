import type { Location } from './location.interface'

export interface Appointment {
  id?: string
  user?: {
    id?: string
    fullname?: string
  }
  location?: Location
  price?: number
  type?: string
  startProposedDate?: Date
  endProposedDate?: Date
  isScheduled?: boolean
  finalDate?: string
  isDone?: boolean
  description?: string
  priority?: number
  createdAt?: Date
  updatedAt?: Date
}
