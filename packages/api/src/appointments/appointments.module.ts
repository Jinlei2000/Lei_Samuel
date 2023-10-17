import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsResolver } from './appointments.resolver';

@Module({
  providers: [AppointmentsResolver, AppointmentsService],
})
export class AppointmentsModule {}
