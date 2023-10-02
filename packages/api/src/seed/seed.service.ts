import { Injectable } from '@nestjs/common'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { Appointment } from 'src/appointments/entities/appointment.entity'
import { MaterialsService } from 'src/materials/materials.service'
import { Material } from 'src/materials/entities/material.entity'

import * as appointments from './data/appointments.json' // set  "resolveJsonModule": true in tsconfig.json
import * as materials from './data/materials.json'

@Injectable()
export class SeedService {
  constructor(
    private appointmentsService: AppointmentsService,
    private materialsService: MaterialsService,
  ) {}

  //#region Appointments
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
  //#endregion

  //#region Materials
  async addMaterialsFromJson(): Promise<Material[]> {
    let theMaterials: Material[] = []
    for (let material of materials) {
      const m = new Material()
      m.name = material.name
      m.isAvailable = material.isAvailable
      // TODO: How to add personId here? Make a User.
      m.personId = '4423846543213256'
      m.isDefect = material.isDefect
      m.serialNumber = material.serialNumber

      theMaterials.push(m)
    }

    return this.materialsService.saveAll(theMaterials)
  }

  async deleteAllMaterials(): Promise<void> {
    return this.materialsService.truncate()
  }
  //#endregion
}
