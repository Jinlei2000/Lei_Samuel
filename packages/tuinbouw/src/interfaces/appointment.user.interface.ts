export interface Appointment {
  id: string
  user: {
    id: string
  }
  location: {
    id: string
  }
  price: number
  type: string
  startProposedDate: Date
  endProposedDate: Date
  isScheduled: boolean
  finalDate: Date
  isDone: boolean
  description: string
  priority: number
  createdAt: Date
  updatedAt: Date
}
