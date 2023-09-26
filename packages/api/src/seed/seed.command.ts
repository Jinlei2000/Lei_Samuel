import { Command } from 'nestjs-command'
import { Injectable } from '@nestjs/common'
import { SeedService } from './seed.service'

@Injectable()
export class DatabaseSeedCommand {
  constructor(private readonly seedService: SeedService) {}

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
  async delete() {
    console.info('🔪 Start deleting appointments')
    await this.seedService.deleteAllAppointments()
    console.info('🪶 Removed appointments')
  }
}
