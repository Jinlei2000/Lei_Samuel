import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { CreateScheduleInput } from './dto/create-schedule.input'
import { UpdateScheduleInput } from './dto/update-schedule.input'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
import { Schedule } from './entities/schedule.entity'

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    // use forwardRef to avoid circular dependency
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  findAll() {
    return `This action returns all schedules`
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`
  }

  create(createScheduleInput: CreateScheduleInput) {
    return 'This action adds a new schedule'
  }

  update(id: number, updateScheduleInput: UpdateScheduleInput) {
    return `This action updates a #${id} schedule`
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`
  }
}
