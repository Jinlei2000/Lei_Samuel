import { Module } from '@nestjs/common'
import { AppointmentsModule } from 'src/appointments/appointments.module'
import { CommandModule } from 'nestjs-command'
import { SeedService } from './seed.service'
import { DatabaseSeedCommand } from './seed.command'
import { MaterialsModule } from 'src/materials/materials.module'
import { LocationsModule } from 'src/locations/locations.module'
import { UsersModule } from 'src/users/users.module'

@Module({
  imports: [
    UsersModule,
    LocationsModule,
    AppointmentsModule,
    MaterialsModule,
    CommandModule,
  ],
  providers: [DatabaseSeedCommand, SeedService],
})
export class SeedModule {}
