import { Module } from '@nestjs/common'
import { AppointmentsModule } from 'src/appointments/appointments.module'
import { CommandModule } from 'nestjs-command'
import { SeedService } from './seed.service'
import { DatabaseSeedCommand } from './seed.command'
import { MaterialsModule } from 'src/materials/materials.module'
import { LocationsModule } from 'src/locations/locations.module'
import { UsersModule } from 'src/users/users.module'
import { AbsencesModule } from 'src/absences/absences.module'
import { SchedulesModule } from 'src/schedules/schedules.module'
import { MailModule } from 'src/mail/mail.module'
import { FirebaseUsersModule } from 'src/firebase-users/firebase-users.module'

@Module({
  imports: [
    UsersModule,
    LocationsModule,
    AppointmentsModule,
    MaterialsModule,
    AbsencesModule,
    SchedulesModule,
    MailModule,
    CommandModule,
    FirebaseUsersModule,
  ],
  providers: [DatabaseSeedCommand, SeedService],
})
export class SeedModule {
  async seedE2ETestData() {
    console.log('🌱 Seeding E2E test data for frontend (playwright)')
    await this.seedCommand.seedMaterials()
    await this.seedCommand.seedUsers()
    await this.seedCommand.seedSchedules()
    // TODO: seed firebase users in auth emulator
  }

  constructor(private readonly seedCommand: DatabaseSeedCommand) {
    // A spy is obviously better than an if-statement
    if (process.env.FIREBASE_AUTH_EMULATOR_HOST) this.seedE2ETestData()
  }
}
