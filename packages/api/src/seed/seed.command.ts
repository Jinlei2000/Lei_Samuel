import { Command } from 'nestjs-command'
import { Injectable } from '@nestjs/common'
import { SeedService } from './seed.service'

@Injectable()
export class DatabaseSeedCommand {
  constructor(private readonly seedService: SeedService) {}

  //#region Appointments
  @Command({
    command: 'seed:database:appointments',
    describe: 'Seed the database with appointments',
  })
  async seedAppointments() {
    console.info('🪺 Start seeding of appointments')
    const appointments = await this.seedService.addAppointmentsFromJson()
    console.info(`🐣 ${appointments.length} Appointments are added`)
  }

  @Command({
    command: 'seed:reset:appointments',
    describe: 'Delete all data from the appointments table',
  })
  async deleteAppointments() {
    console.info('🔪 Start deleting appointments')
    await this.seedService.deleteAllAppointments()
    console.info('🪶 Removed appointments')
  }
  //#endregion

  //#region Materials
  @Command({
    command: 'seed:database:materials',
    describe: 'Seed the database with materials',
  })
  async seedMaterials() {
    console.info('🪺 Start seeding of materials')
    const materials = await this.seedService.addMaterialsFromJson()
    console.info(`🐣 ${materials.length} Materials are added`)
  }

  @Command({
    command: 'seed:reset:materials',
    describe: 'Delete all data from the materials table',
  })
  async deleteMaterials() {
    console.info('🔪 Start deleting materials')
    await this.seedService.deleteAllMaterials()
    console.info('🪶 Removed materials')
  }
  //#endregion

  //#region Users
  @Command({
    command: 'seed:database:users',
    describe: 'Seed the database with users',
  })
  async seedUsers() {
    console.info('🪺 Start seeding of users')
    const users = await this.seedService.addUsersFromJson()
    console.info(`🐣 ${users.length} Users are added`)
  }

  @Command({
    command: 'seed:reset:users',
    describe: 'Delete all data from the users table',
  })
  async deleteUsers() {
    console.info('🔪 Start deleting users')
    await this.seedService.deleteAllUsers()
    console.info('🪶 Removed users')
  }
  //#endregion

  //#region Locations
  @Command({
    command: 'seed:reset:locations',
    describe: 'Delete all data from the locations table',
  })
  async deleteLocations() {
    console.info('🔪 Start deleting locations')
    await this.seedService.deleteAllLocations()
    console.info('🪶 Removed locations')
  }
  //#endregion

  //#region Absences
  @Command({
    command: 'seed:reset:absences',
    describe: 'Delete all data from the absences table',
  })
  async deleteAbsences() {
    console.info('🔪 Start deleting absences')
    await this.seedService.deleteAllAbsences()
    console.info('🪶 Removed absences')
  }
  //#endregion

  // Delete all data from appointments, materials, users, locations... tables
  @Command({
    command: 'seed:reset',
    describe:
      'Delete all data from appointments, materials, users, locations... tables',
  })
  async deleteAll() {
    console.info('🔪 Start deleting all data')
    await this.deleteAppointments()
    await this.deleteMaterials()
    await this.deleteUsers()
    await this.deleteLocations()
    await this.deleteAbsences()
    console.info('🪶 Removed all data')
  }
}
