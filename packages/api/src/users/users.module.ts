import { Module, forwardRef } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { LocationsModule } from 'src/locations/locations.module'
import { AbsencesModule } from 'src/absences/absences.module'
import { MailModule } from 'src/mail/mail.module'
import { SchedulesModule } from 'src/schedules/schedules.module'
import { AppointmentsModule } from 'src/appointments/appointments.module'
import { MaterialsModule } from 'src/materials/materials.module'
import { FirebaseUsersModule } from 'src/firebase-users/firebase-users.module'

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    FirebaseUsersModule,
    // Use forwardRef to avoid undefined errors
    // Because 2 modules depend on each other
    // https://docs.nestjs.com/fundamentals/circular-dependency
    forwardRef(() => LocationsModule),
    forwardRef(() => AbsencesModule),
    forwardRef(() => MailModule),
    forwardRef(() => SchedulesModule),
    forwardRef(() => AppointmentsModule),
    forwardRef(() => MaterialsModule),
  ],

  exports: [UsersService],
})
export class UsersModule {}
