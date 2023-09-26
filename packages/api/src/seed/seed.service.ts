import { Injectable } from '@nestjs/common'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { Appointment } from 'src/appointments/entities/appointment.entity'

import * as appointments from './data/appointments.json' // set  "resolveJsonModule": true in tsconfig.json

@Injectable()
export class SeedService {
  constructor(private appointmentsService: AppointmentsService) {}

  async addAppointmentsFromJson(): Promise<Appointment[]> {
    let theAppointments: Appointment[] = []
    for (let appointment of appointments) {
      const a = new Appointment()
      a.name = appointment.name
      a.date = new Date(appointment.date)

      theAppointments.push(a)
    }

    return this.appointmentsService.saveAll(theAppointments)
  }

  async deleteAllAppointments(): Promise<void> {
    return this.appointmentsService.truncate()
  }
}
