import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { CreateScheduleInput } from './dto/create-schedule.input'
import { UpdateScheduleInput } from './dto/update-schedule.input'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
import { Schedule } from './entities/schedule.entity'
import { OrderByInput } from 'src/interfaces/order.input'
import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'
import { MaterialsService } from 'src/materials/materials.service'

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    // use forwardRef to avoid circular dependency
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => MaterialsService))
    private readonly materialsService: MaterialsService,
  ) {}

  // TODO: filter and order schedules
  async findAll(
    filters?: Array<string>,
    order?: OrderByInput,
  ): Promise<Schedule[]> {
    // filter and order schedules
    // const whereQuery = filterSchedules(filters)
    // const orderQuery = orderSchedules(order)

    return this.scheduleRepository.find({
      // where: whereQuery,
      // order: orderQuery,
    })
  }

  // TODO: find all scheduled employees on a specific date (return ids)
  async findAllScheduledUsersByDate(date: Date): Promise<string[]> {
    const schedules = await this.scheduleRepository.find({
      where: {
        finalDate: date,
      },
    })

    let ids: string[] = []
    for (const schedule of schedules) {
      for (const employeeId of schedule.employees) {
        ids.push(employeeId.toString())
      }
    }

    return ids
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      //@ts-ignore
      where: { _id: new ObjectId(id) },
    })

    if (!schedule) throw new GraphQLError('Schedule not found')

    return schedule
  }

  // TODO: find of a specific user on a specific date is scheduled (return boolean)

  async create(createScheduleInput: CreateScheduleInput) {
    const s = new Schedule()
    s.appointmentIds = createScheduleInput.appointmentIds
    s.employees = await this.usersService.findAllByIds(
      createScheduleInput.employeeIds,
    )
    s.materials = await this.materialsService.findAllByIds(
      createScheduleInput.materialIds,
    )
    s.finalDate = createScheduleInput.finalDate
    s.createdBy = createScheduleInput.createdBy

    return this.scheduleRepository.save(s)
  }

  async update(id: ObjectId, updateScheduleInput: UpdateScheduleInput) {
    const currentSchedule = await this.findOne(id.toString())

    const s = new Schedule()
    s.appointmentIds = updateScheduleInput.appointmentIds
      ? updateScheduleInput.appointmentIds
      : currentSchedule.appointmentIds
    s.employees = updateScheduleInput.employeeIds
      ? await this.usersService.findAllByIds(updateScheduleInput.employeeIds)
      : currentSchedule.employees
    s.materials = updateScheduleInput.materialIds
      ? await this.materialsService.findAllByIds(updateScheduleInput.materialIds)
      : currentSchedule.materials
    s.finalDate = updateScheduleInput.finalDate
      ? updateScheduleInput.finalDate
      : currentSchedule.finalDate
    s.createdBy = updateScheduleInput.createdBy
      ? updateScheduleInput.createdBy
      : currentSchedule.createdBy

    await this.scheduleRepository.update(id, s)

    return this.findOne(id.toString())
  }

  // TODO: if a client is deleted, delete all his appointments that are isDone = false (return all ids)
  // search all schedules where appointmentIds is in ids (update schedule appointmentIds)
  // if schedule appointmentIds is empty, delete schedule
  // make a remove function in schedule service

  async remove(id: string): Promise<string> {
    await this.findOne(id.toString())

    await this.scheduleRepository.delete(id)

    // return id if delete was successful
    return id
  }

  // Seeding functions
  saveAll(schedules: Schedule[]): Promise<Schedule[]> {
    return this.scheduleRepository.save(schedules)
  }

  truncate(): Promise<void> {
    return this.scheduleRepository.clear()
  }
}
