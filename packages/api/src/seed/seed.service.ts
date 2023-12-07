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
import { resetTime } from 'src/helpers/genericFunctions'
import { FirebaseService } from 'src/authentication/services/firebase.service'
import { FirebaseUser } from 'src/authentication/models/firebase-user.model'
import {
  chooseRandomItems,
  generateNonWeekendDates,
} from 'src/helpers/seedingFunctions'

import * as materials from './data/materials.json'
import * as users from './data/users.json'

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
    private firebaseService: FirebaseService,
  ) {}

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
      if (user.role === 'CLIENT') u.invoiceOption = user.invoiceOption
      if (user.role === 'ADMIN' || user.role === 'EMPLOYEE')
        u.absentCount = user.absences.length

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
          l.title = location.title
          l.address = location.address
          l.userId = user.id.toString()
          l.lat = location.lat
          l.lng = location.lng

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
          //  add locationIds to user (if not already added)
          const userData = await this.usersService.findOne(user.id.toString())
          const locationsIds =
            await this.locationsService.findAllByUserIdAndGetIds(
              user.id.toString(),
            )
          a.user = {
            ...userData,
            locationIds: locationsIds,
          }
          // console.log('a.user', a.user)
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

      // Add some absences to staff (some are in the past, some in the future)
      if (users[num].absences) {
        let absences: Absence[] = []
        for (let absence of users[num].absences) {
          const a = new Absence()
          // absence in past
          if (absence.startDate && absence.endDate) {
            a.startDate = new Date(absence.startDate)
            a.endDate = new Date(absence.endDate)
          }
          // absence in future (dynamic date)
          if (
            absence.startDateNumber !== undefined &&
            absence.endDateNumber !== undefined
          ) {
            a.startDate = resetTime(
              new Date(
                Date.now() + absence.startDateNumber * 24 * 60 * 60 * 1000,
              ),
            )
            a.endDate = resetTime(
              new Date(
                Date.now() + absence.endDateNumber * 24 * 60 * 60 * 1000,
              ),
            )
          }
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
    }

    await this.usersService.saveAll(newUsers)

    return newUsers
  }

  async deleteAllUsers(): Promise<void> {
    return this.usersService.truncate()
  }
  //#endregion

  //#region Schedules
  async addSchedules(): Promise<Schedule[]> {
    let schedules: Schedule[] = []
    // get all non-weekend days for next amount of days
    const dates = await generateNonWeekendDates(5)
    // console.log('dates', dates)

    for (const selectDate of dates) {
      // console.log('💠', selectDate)

      // GET DATA
      // find all appointments that is not done (filter by ND)
      let availableAppointments =
        await this.appointmentsService.findAllAvailableByDate(selectDate)

      // console.log(
      //   'ALL APPOINTMENTS',
      //   availableAppointments.map(appointment => appointment.id.toString()),
      // )

      // find all employees that are available for that date (not absent & not scheduled)
      let availableEmployees =
        await this.usersService.findAvailableEmployeesByDate(selectDate)

      // find all materials (that are loanable)
      const availableMaterials = await this.materialsService.findAll(['L'])

      // find all admins and choose one randomly
      const admins = await this.usersService.findAll(['A'])
      const adminName =
        admins[Math.floor(Math.random() * admins.length)].fullname

      // make schedules on same day until no appointments left or no employees left for that day
      while (true) {
        // APPOINTMENTS
        // stop if no appointments available
        if (availableAppointments.length === 0) {
          // console.log(
          //   `no appointments available for ${selectDate.toISOString()}`,
          // )
          break // stop while loop
        }
        // choose random amount of appointments (1-3) from available appointments
        const {
          chosenItems: chosenAppointments,
          remainingItems: remainingAppointments,
        } = chooseRandomItems(availableAppointments, 3)
        availableAppointments = remainingAppointments
        // add random price between 0 and 600, finalDate and isScheduled is true to each appointment
        chosenAppointments.forEach((appointment: Appointment) => {
          appointment.price = Math.floor(Math.floor(Math.random() * 600))
          appointment.finalDate = selectDate
          appointment.isScheduled = true
        })

        // EMPLOYEES
        // stop if no employees available
        if (availableEmployees.length === 0) {
          // console.log(`no employees available for ${selectDate.toISOString()}`)
          break // stop while loop
        }
        // choose random amount of employees (1-2) from available employees
        const {
          chosenItems: chosenEmployees,
          remainingItems: remainingEmployees,
        } = chooseRandomItems(availableEmployees, 2)
        availableEmployees = remainingEmployees

        // MATERIALS
        // choose random amount of materials (2-6) from available materials
        const randomAmountOfMaterials = Math.floor(Math.random() * 5) + 2
        const chosenMaterials = []
        const usedIndices = new Set()

        // choose random materials
        while (chosenMaterials.length < randomAmountOfMaterials) {
          const randomIndex = Math.floor(
            Math.random() * availableMaterials.length,
          )

          if (!usedIndices.has(randomIndex)) {
            chosenMaterials.push(availableMaterials[randomIndex])
            usedIndices.add(randomIndex)
          }
        }
        // console.log('get available employees')
        // console.log(
        //   'chosenMaterials',
        //   chosenMaterials.map(m => m.name),
        // )

        // update appointments
        await this.appointmentsService.saveAll(chosenAppointments)

        // console.log('saved appointments')
        // console.log(
        //   'chosenAppointments',
        //   chosenAppointments.map(appointment => appointment.id.toString()),
        // )

        // SCHEDULE
        const schedule = new Schedule()
        schedule.finalDate = selectDate
        schedule.appointmentIds = chosenAppointments.map(appointment =>
          appointment.id.toString(),
        )
        schedule.employees = chosenEmployees
        schedule.materials = chosenMaterials
        schedule.createdBy = adminName

        // add schedule to schedules
        schedules.push(schedule)
      }
    }

    // save schedules
    await this.schedulesService.saveAll(schedules)

    return schedules
  }

  async deleteAllSchedules(): Promise<void> {
    return this.schedulesService.truncate()
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

  //#region Appointments
  async deleteAllAppointments(): Promise<void> {
    return this.appointmentsService.truncate()
  }
  //#endregion

  //#region Mail
  async deleteAllMail(): Promise<void> {
    return this.mailService.truncate()
  }
  //#endregion

  //#region Firebase users
  async addFirebaseUsersFromJson(): Promise<FirebaseUser[]> {
    const theUsers: FirebaseUser[] = []
    for (let user of users) {
      const u = new FirebaseUser()
      u.email = user.email
      u.uid = user.uid
      u.password = user.password

      const createdUser: FirebaseUser = await this.firebaseService.createUser(u)
      theUsers.push(createdUser)
    }

    return theUsers
  }

  async deleteAllFirebaseUsers(): Promise<void> {
    await this.firebaseService.removeUsers()
  }
  //#endregion
}
