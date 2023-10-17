import { Module } from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { AppointmentsResolver } from './appointments.resolver'
import { UsersModule } from 'src/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Appointment } from './entities/appointment.entity'

@Module({
  providers: [AppointmentsResolver, AppointmentsService],

  imports: [TypeOrmModule.forFeature([Appointment]), UsersModule],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
