import { Module, forwardRef } from '@nestjs/common'
import { SchedulesService } from './schedules.service'
import { SchedulesResolver } from './schedules.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/users/users.module'
import { Schedule } from './entities/schedule.entity'
import { AppointmentsModule } from 'src/appointments/appointments.module'
import { MaterialsModule } from 'src/materials/materials.module'

@Module({
  providers: [SchedulesResolver, SchedulesService],

  imports: [
    TypeOrmModule.forFeature([Schedule]),
    forwardRef(() => UsersModule),
    forwardRef(() => AppointmentsModule),
    forwardRef(() => MaterialsModule),
  ],

  exports: [SchedulesService],
})
export class SchedulesModule {}
