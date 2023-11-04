import type { Appointment } from './appointment.user.interface'
import type { CustomUser } from './custom.user.interface'
import type { Material } from './material.interface'

export interface Schedule {
  id: string
  appointments: Appointment[]
  employees: CustomUser[]
  materials: Material[]
  finalDate: Date
  createdBy: string
  createdAt?: Date
  updatedAt?: Date
}
