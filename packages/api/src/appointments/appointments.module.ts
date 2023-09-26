import { Module } from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { AppointmentsResolver } from './appointments.resolver'
import { Appointment } from './entities/appointment.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  providers: [AppointmentsResolver, AppointmentsService],
  imports: [TypeOrmModule.forFeature([Appointment])],

  exports: [AppointmentsService],
})
export class AppointmentsModule {}
