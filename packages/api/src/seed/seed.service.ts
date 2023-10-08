import { Injectable } from '@nestjs/common'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { Appointment } from 'src/appointments/entities/appointment.entity'
import { MaterialsService } from 'src/materials/materials.service'
import { Material } from 'src/materials/entities/material.entity'
import { StaffsService } from 'src/staffs/staffs.service'
import { Staff } from 'src/staffs/entities/staff.entity'

import * as appointments from './data/appointments.json' // set  "resolveJsonModule": true in tsconfig.json
import * as materials from './data/materials.json'
import * as staffs from './data/staffs.json'

@Injectable()
export class SeedService {
  constructor(
    private appointmentsService: AppointmentsService,
    private materialsService: MaterialsService,
    private staffsService: StaffsService,
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
      m.name = material.name.toLowerCase()
      m.isAvailable = material.isAvailable
      // TODO: How to add personId here? Make a User.
      m.personId = '333'
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

  //#region Staffs
  async addStaffsFromJson(): Promise<Staff[]> {
    let theStaffs: any[] = []
    for (let staff of staffs) {
      const s = new Staff()
      s.firstname = staff.firstname.toLowerCase()
      s.lastname = staff.lastname.toLowerCase()
      s.fullname = `${staff.firstname.toLowerCase()} ${staff.lastname.toLowerCase()}`
      s.email = staff.email
      s.absentCount = 0
      s.availability = true
      s.isAdmin = staff.isAdmin ? staff.isAdmin : false
      s.uid = staff.uid
      //TODO: How to add locationId here? Make a Location.
      // s.locationId = staff.locationId

      theStaffs.push(s)
    }

    return this.staffsService.saveAll(theStaffs)
  }

  async deleteAllStaffs(): Promise<void> {
    return this.staffsService.truncate()
  }
  //#endregion
}
