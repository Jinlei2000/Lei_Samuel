import { Module, forwardRef } from '@nestjs/common'
import { SchedulesService } from './schedules.service'
import { SchedulesResolver } from './schedules.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/users/users.module'
import { Schedule } from './entities/schedule.entity'

@Module({
  providers: [SchedulesResolver, SchedulesService],

  imports: [
    TypeOrmModule.forFeature([Schedule]),
    forwardRef(() => UsersModule),
  ],

  exports: [SchedulesService],
})
export class SchedulesModule {}
