import { Injectable } from '@nestjs/common'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { Appointment } from 'src/appointments/entities/appointment.entity'
import { MaterialsService } from 'src/materials/materials.service'
import { Material } from 'src/materials/entities/material.entity'

import * as appointments from './data/appointments.json' // set  "resolveJsonModule": true in tsconfig.json
import * as materials from './data/materials.json'
import * as staffs from './data/staffs.json'

// TODO: seed users
@Injectable()
export class SeedService {
  constructor(
    private appointmentsService: AppointmentsService,
    private materialsService: MaterialsService, // private staffsService: StaffsService,
    // private defectsService: DefectsService,
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
      // m.personId = '333'
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
  // async addStaffsFromJson(): Promise<Staff[]> {
  //   let theStaffs: any[] = []
  //   let result: Staff[] = []
  //   try {
  //     for (let staff of staffs) {
  //       const s = new Staff()
  //       s.firstname = staff.firstname.toLowerCase()
  //       s.lastname = staff.lastname.toLowerCase()
  //       s.fullname = `${staff.firstname.toLowerCase()} ${staff.lastname.toLowerCase()}`
  //       s.email = staff.email
  //       s.absentCount = 0
  //       s.availability = true
  //       s.isAdmin = staff.isAdmin ? staff.isAdmin : false
  //       s.uid = staff.uid
  //       //TODO: How to add locationId here? Make a Location.
  //       // s.locationId = staff.locationId

  //       theStaffs.push(s)
  //     }
  //     result = await this.staffsService.saveAll(theStaffs)
  //   } catch (error) {
  //     console.log(error)
  //     throw error
  //   }

  //   try {
  //     // Add some random materials to staff that is not admin
  //     const getAllNonAdminStaffs = await this.staffsService.findAll(['E'])
  //     for (let s of getAllNonAdminStaffs) {
  //       const materials = await this.materialsService.findAll(['A'])
  //       // random max 5 materials
  //       const randomMaterials = materials
  //         .sort(() => 0.5 - Math.random())
  //         .slice(0, 5)
  //       for (let m of randomMaterials) {
  //         await this.materialsService.update(m.id, {
  //           personId: String(s.id),
  //           isAvailable: false,
  //           ...m,
  //         })
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     throw error
  //   }

  //   return result
  // }

  // async deleteAllStaffs(): Promise<void> {
  //   return this.staffsService.truncate()
  // }
  //#endregion
}
