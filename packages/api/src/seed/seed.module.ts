import { Module } from '@nestjs/common'
import { AppointmentsModule } from 'src/appointments/appointments.module'
import { CommandModule } from 'nestjs-command'
import { SeedService } from './seed.service'
import { DatabaseSeedCommand } from './seed.command'
import { MaterialsModule } from 'src/materials/materials.module'

@Module({
  imports: [
    AppointmentsModule,
    MaterialsModule,
    CommandModule,
  ],
  providers: [DatabaseSeedCommand, SeedService],
})
export class SeedModule {}
