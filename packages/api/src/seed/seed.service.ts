import { Injectable } from '@nestjs/common'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { Appointment } from 'src/appointments/entities/appointment.entity'
import { MaterialsService } from 'src/materials/materials.service'
import { Material } from 'src/materials/entities/material.entity'
import { LocationsService } from 'src/locations/locations.service'
import { Location } from 'src/locations/entities/location.entity'
import { UsersService } from 'src/users/users.service'
import { Role, User } from 'src/users/entities/user.entity'
import { ObjectId } from 'mongodb'

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
      m.isLoan = material.isLoan
      // m.isAvailable = material.isAvailable
      // TODO: How to add personId here? Make a User.
      m.personId = material.personId
      // m.isDefect = material.isDefect
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

      // let userMaterials: Material[] = []
      // if (user.role === 'EMPLOYEE') {
      //   for (let material of user.materials) {
      //     const m = new Material()
      //     m.name = material.name.toLowerCase()
      //     m.isLoan = material.isLoan
      //     m.personId = u.id.toString()
      //     m.serialNumber = material.serialNumber

      //     userMaterials.push(m)
      //   }
      //   this.materialsService.saveAll(userMaterials)
      // }

      // Add some locations to users
      // if (user.locations) {
      //   let theLocationIds: ObjectId[] = []
      //   for (let location of user.locations) {
      //     const l = new Location()
      //     l.address = location.address
      //     l.uid = user.uid

      //     // TODO: change to u.id instead of user.uid

      //     const newLoc = await this.locationsService.save(l)
      //     theLocationIds.push(newLoc.id)
      //   }
      //   u.locationIds = theLocationIds
      // }

      theUsers.push(u)
    }

    const newUsers = await this.usersService.saveAll(theUsers)

    let num = 0
    theUsers = []
    for (let user of newUsers) {
      // console.log('DBuser', user.uid)
      // console.log('jsonUser', users[num].uid)
      // TODO: Add some locations to users
      if (users[num].locations) {
        let theLocationIds: ObjectId[] = []
        for (let location of users[num].locations) {
          const l = new Location()
          l.address = location.address
          // TODO: change to u.id instead of user.uid
          l.id = user.id

          const newLoc = await this.locationsService.save(l)
          theLocationIds.push(newLoc.id)
        }
        user.locationIds = theLocationIds
      }
      //TODO: Add some materials to staff
      //TODO: Add some absences to staff
      // TODO: Add some appointments to users

      num++
    }

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
}
