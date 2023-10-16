import { Injectable } from '@nestjs/common'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { Appointment } from 'src/appointments/entities/appointment.entity'
import { MaterialsService } from 'src/materials/materials.service'
import { Material } from 'src/materials/entities/material.entity'
import { LocationsService } from 'src/locations/locations.service'
import { Location } from 'src/locations/entities/location.entity'
import { UsersService } from 'src/users/users.service'
import { Role, User } from 'src/users/entities/user.entity'
import { ObjectId } from 'typeorm'

import * as appointments from './data/appointments.json' // set  "resolveJsonModule": true in tsconfig.json
import * as materials from './data/materials.json'
import * as users from './data/users.json'

@Injectable()
export class SeedService {
  constructor(
    private appointmentsService: AppointmentsService,
    private materialsService: MaterialsService,
    private locationsService: LocationsService,
    private usersService: UsersService,
    private absencesService: UsersService,
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

  //#region Users
  async addUsersFromJson(): Promise<User[]> {
    let theUsers: User[] = []
    for (let user of users) {
      const u = new User()
      u.firstname = user.firstname.toLowerCase()
      u.lastname = user.lastname.toLowerCase()
      u.fullname = `${user.firstname.toLowerCase()} ${user.lastname.toLowerCase()}`
      u.email = user.email
      u.role = user.role as Role
      u.uid = user.uid
      u.locale = user.locale
      u.availability = true
      u.locationIds = []
      if (user.role === 'ADMIN' || user.role === 'EMPLOYEE') u.absentCount = 0

      // Add some locations to users
      if (user.locations) {
        let theLocationIds: ObjectId[] = []
        for (let location of user.locations) {
          const l = new Location()
          l.address = location.address
          l.uid = user.uid

          const newLoc = await this.locationsService.save(l)
          theLocationIds.push(newLoc.id)
        }
        u.locationIds = theLocationIds
      }

      theUsers.push(u)
    }

    //TODO: Add some random materials to staff

    //TODO: Add some absences to staff

    const newUsers = await this.usersService.saveAll(theUsers)

    return newUsers
  }

  async deleteAllUsers(): Promise<void> {
    return this.usersService.truncate()
  }
  //#endregion

  //#region Locations
  async deleteAllLocations(): Promise<void> {
    return this.locationsService.truncate()
  }
  //#endregion

  //#region Absences
  async deleteAllAbsences(): Promise<void> {
    return this.absencesService.truncate()
  }
  //#endregion

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
}
