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

  // Delete all data from appointments, materials, staffs... tables
  @Command({
    command: 'seed:reset',
    describe: 'Delete all data from appointments, materials, staffs... tables',
  })
  async deleteAll() {
    console.info('🔪 Start deleting all data')
    await this.deleteAppointments()
    await this.deleteMaterials()
    console.info('🪶 Removed all data')
  }
}
