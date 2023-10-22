import { Injectable } from '@nestjs/common'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { Appointment } from 'src/appointments/entities/appointment.entity'
import { MaterialsService } from 'src/materials/materials.service'
import { Material } from 'src/materials/entities/material.entity'
import { LocationsService } from 'src/locations/locations.service'
import { Location } from 'src/locations/entities/location.entity'
import { UsersService } from 'src/users/users.service'
import { Role, User } from 'src/users/entities/user.entity'
import { Absence } from 'src/absences/entities/absence.entity'
import { AbsencesService } from 'src/absences/absences.service'
import { SchedulesService } from 'src/schedules/schedules.service'
import { MailService } from 'src/mail/mail.service'
import { Schedule } from 'src/schedules/entities/schedule.entity'

import * as materials from './data/materials.json'
import * as users from './data/users.json'
import { resetTime } from 'src/helpers/genericFunctions'

@Injectable()
export class SeedService {
  constructor(
    private appointmentsService: AppointmentsService,
    private materialsService: MaterialsService,
    private locationsService: LocationsService,
    private usersService: UsersService,
    private absencesService: AbsencesService,
    private schedulesService: SchedulesService,
    private mailService: MailService,
  ) {}

  //#region Appointments
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
      m.serialNumber = material.serialNumber

      theMaterials.push(m)
    }

    return this.materialsService.saveAll(theMaterials)
  }

  async deleteAllMaterials(): Promise<void> {
    return this.materialsService.truncate()
  }
  //#endregion

  // TODO: use dynamic date for appointments (now + 1 day, now + 2 days, etc.)
  // TODO: use dynamic date for absences (now + 1 day, now + 2 days, etc.)
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
      u.locationIds = []
      if (user.role === 'ADMIN' || user.role === 'EMPLOYEE') u.absentCount = 0

      theUsers.push(u)
    }

    const newUsers = await this.usersService.saveAll(theUsers)

    let num = 0
    theUsers = []
    for (let user of newUsers) {
      // Add some locations to users
      if (users[num].locations) {
        let theLocationIds: string[] = []
        for (let location of users[num].locations) {
          const l = new Location()
          l.address = location.address
          l.userId = user.id.toString()

          const newLoc = await this.locationsService.save(l)
          theLocationIds.push(newLoc.id.toString())
        }
        user.locationIds = theLocationIds
      }
      // Add some materials to staff
      if (user.role === 'EMPLOYEE' && users[num].materials) {
        let userMaterials: Material[] = []
        for (let material of users[num].materials) {
          const m = new Material()
          m.name = material.name.toLowerCase()
          m.isLoan = false
          m.userId = user.id.toString()
          m.serialNumber = material.serialNumber

          userMaterials.push(m)
        }
        await this.materialsService.saveAll(userMaterials)
      }

      // Add some appointments to users
      if (users[num].appointments) {
        let userAppointments: Appointment[] = []
        for (let appointment of users[num].appointments) {
          const a = new Appointment()
          a.user = await this.usersService.findOne(user.id.toString())
          a.type = appointment.type

          // appointment in past
          if (appointment.startProposedDate && appointment.endProposedDate) {
            a.startProposedDate = new Date(appointment.startProposedDate)
            a.endProposedDate = new Date(appointment.endProposedDate)
            a.finalDate = new Date(appointment.finalDate)
          }

          // appointment in future (dynamic date)
          if (
            appointment.startProposedDateNumber !== undefined &&
            appointment.endProposedDateNumber !== undefined
          ) {
            a.startProposedDate = resetTime(
              new Date(
                Date.now() +
                  appointment.startProposedDateNumber * 24 * 60 * 60 * 1000,
              ),
            )
            a.endProposedDate = resetTime(
              new Date(
                Date.now() +
                  appointment.endProposedDateNumber * 24 * 60 * 60 * 1000,
              ),
            )
          }
          a.isScheduled = appointment.isScheduled
          a.isDone = appointment.isDone
          a.description = appointment.description
          a.location = await this.locationsService.findOne(
            user.locationIds[0].toString(),
          )
          a.price = appointment.price
          a.priority = appointment.priority

          userAppointments.push(a)
        }
        await this.appointmentsService.saveAll(userAppointments)
      }

      // TODO: make some absences dynamic
      // Add some absences to staff
      if (users[num].absences) {
        let absences: Absence[] = []
        for (let absence of users[num].absences) {
          const a = new Absence()
          a.startDate = new Date(absence.startDate)
          a.endDate = new Date(absence.endDate)
          a.userId = user.id.toString()
          a.type = absence.type
          a.description = absence.description
          a.totalDays =
            Math.round(
              (a.endDate.getTime() - a.startDate.getTime()) / 86400000,
            ) + 1

          absences.push(a)
        }
        await this.absencesService.saveAll(absences)
      }

      num++
      console.info(`🙋 user ${num} is added`)
    }

    await this.usersService.saveAll(newUsers)

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

  //#region Schedules
  async addSchedules(): Promise<Schedule[]> {
    let schedules: Schedule[] = []
    // TODO: make schedules
    // get all admin users

    // MAKE SCHEDULES
    // STOP WHEN ALL EMPLOYEES ARE SCHEDULED
    // DO THIS FOR 1 WEEK (5 DAYS)
    // choose a date (now + 1 day, now + 2 days, etc.) no weekends

    // APPOINTMENTS
    // find all appointments for that date (filter by ND)
    // choose 3, 2 or 1 appointments
    // add price for each appointment (random between 0 and 600)
    // add finalDate for each appointment
    // set isScheduled to true for each appointment

    // EMPLOYEES
    // find all employees that are available for that date (not absent & not scheduled)
    // choose 1 or 2 employees

    // MATERIALS
    // find all materials (that are loanable)
    // choose 2-6 materials (random)

    // SCHEDULE
    // add finalDate to schedule
    // add appointments to schedule
    // add employees to schedule
    // add materials to schedule
    // add createdBy name of admin

    return schedules
  }

  async deleteAllSchedules(): Promise<void> {
    return this.schedulesService.truncate()
  }
  //#endregion

  //#region Mail
  async deleteAllMail(): Promise<void> {
    return this.mailService.truncate()
  }
  //#endregion
}
