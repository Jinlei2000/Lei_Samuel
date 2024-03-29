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
import { User } from 'src/users/entities/user.entity'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { filterSchedules, orderSchedules } from 'src/helpers/schedulesFunctions'
import { resetTime } from 'src/helpers/genericFunctions'

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
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async findAll(
    filters?: Array<string>,
    order?: OrderByInput,
  ): Promise<Schedule[]> {
    // filter and order schedules
    const whereQuery = filterSchedules(filters)
    const orderQuery = orderSchedules(order)

    return this.scheduleRepository.find({
      where: whereQuery,
      order: orderQuery,
    })
  }

  // find all schedules for certain date
  async findSchedulesByDate(date: string): Promise<Schedule[]> {
    const schedules = await this.scheduleRepository.find({
      where: {
        finalDate: new Date(date),
      },
    })

    return schedules
  }

  // find all scheduled employees on a specific date (return uids)
  async findAllScheduledUsersByDate(date: Date): Promise<string[]> {
    const schedules = await this.scheduleRepository.find({
      where: {
        finalDate: date,
      },
    })

    let uids: string[] = []
    for (const schedule of schedules) {
      for (const e of schedule.employees) {
        uids.push(e.uid.toString())
      }
    }

    return uids
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      //@ts-ignore
      where: { _id: new ObjectId(id) },
    })

    if (!schedule) throw new GraphQLError('Schedule not found')

    return schedule
  }

  // check if user is already scheduled on this date (return true or false)
  async findOneByDateAndUserId(userId: string, date: string): Promise<boolean> {
    const schedules = await this.scheduleRepository.find({
      where: {
        finalDate: new Date(date),
        employees: {
          // @ts-ignore
          $elemMatch: { id: new ObjectId(userId) }, // $elemMatch is needed to search in array of objects
        },
      },
    })

    return schedules.length > 0
  }

  async findTodayScheduleByDateAndUserId(
    userId: string,
    date: string,
  ): Promise<Schedule[]> {
    const schedules = await this.scheduleRepository.find({
      where: {
        finalDate: new Date(date),
        employees: {
          // @ts-ignore
          $elemMatch: { id: new ObjectId(userId) }, // $elemMatch is needed to search in array of objects
        },
      },
    })

    return schedules
  }

  async findSchedulesFromDateForDaysByUserId(
    userId: string,
    date: string,
    days: number,
  ): Promise<Schedule[]> {
    const schedules = await this.scheduleRepository.find({
      where: {
        // finalDate is between date and date + days
        finalDate: {
          // @ts-ignore
          $gte: new Date(date),
          $lte: new Date(
            new Date(date).setDate(new Date(date).getDate() + days),
          ),
        },
        employees: {
          // @ts-ignore
          $elemMatch: { id: new ObjectId(userId) }, // $elemMatch is needed to search in array of objects
        },
      },
    })

    return schedules
  }

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
    await this.findOne(id.toString())

    // remove id from updateScheduleInput
    delete updateScheduleInput.id

    let updatedSchedule = {
      // update when not null (if null, keep current value)
      ...(updateScheduleInput.employeeIds && {
        employees: await this.usersService.findAllByIds(
          updateScheduleInput.employeeIds,
        ),
      }),
      ...(updateScheduleInput.materialIds && {
        materials: await this.materialsService.findAllByIds(
          updateScheduleInput.materialIds,
        ),
      }),
    }

    delete updateScheduleInput.employeeIds
    delete updateScheduleInput.materialIds

    updatedSchedule = {
      ...updateScheduleInput,
      ...updatedSchedule,
    }

    await this.scheduleRepository.update(id, updatedSchedule)

    return this.findOne(id.toString())
  }

  // remove all appointments id from schedules & delete schedule if empty appointmentIds
  async updateAllByAppointment(appointmentId: string): Promise<string[]> {
    let ids: string[] = []

    // find all schedules where appointmentIds is in ids
    const schedules = await this.scheduleRepository.find({
      where: {
        appointmentIds: {
          // @ts-ignore
          $elemMatch: { id: new ObjectId(appointmentId) },
        },
      },
    })

    // return empty array if no schedules found
    if (schedules.length === 0) return []

    // update schedule appointmentIds with the remaining ids
    const updatedSchedules = schedules.map(schedule => ({
      id: schedule.id,
      appointmentIds: schedule.appointmentIds.filter(
        id => id.toString() !== appointmentId,
      ),
    }))

    for (const updatedSchedule of updatedSchedules) {
      // if schedule appointmentIds is empty, delete schedule
      if (updatedSchedule.appointmentIds.length === 0) {
        await this.remove(updatedSchedule.id.toString())
      } else {
        await this.update(updatedSchedule.id, updatedSchedule)
      }
      ids.push(updatedSchedule.id.toString())
    }

    return ids
  }

  // remove all employees from schedules & delete schedule if empty employees
  async updateAllByEmployee(user: User): Promise<string[]> {
    let ids: string[] = []
    const date = resetTime(new Date()) // reset time to 00:00:00
    const schedules = await this.scheduleRepository.find({
      where: {
        // check if user is in employees array
        employees: {
          // @ts-ignore
          $elemMatch: { uid: user.uid },
        },
        // find all schedules that are not in the past
        // @ts-ignore
        finalDate: { $gte: date },
      },
    })

    // return empty array if no schedules found
    if (schedules.length === 0) return []

    // update schedule employees with the remaining employees
    const updatedSchedules = schedules.map(schedule => ({
      id: schedule.id,
      employees: schedule.employees.filter(e => e.uid !== user.uid),
    }))

    for (const updatedSchedule of updatedSchedules) {
      // if schedule employees is empty, delete schedule
      if (updatedSchedule.employees.length === 0) {
        await this.remove(updatedSchedule.id.toString())
      } else {
        await this.update(updatedSchedule.id, updatedSchedule)
      }

      if (updatedSchedule.id) ids.push(updatedSchedule.id.toString())
    }

    return ids
  }

  // remove all employees from schedules & delete schedule if empty employees (with date range)
  async updateAllByEmployeeWithDateRange(
    user: User,
    startDate: Date,
    endDate: Date,
  ): Promise<string[]> {
    let ids: string[] = []
    const schedules = await this.scheduleRepository.find({
      where: {
        // check if user is in employees array
        employees: {
          // @ts-ignore
          $elemMatch: { uid: user.uid },
        },
        // find all schedules that are between start and end date
        // @ts-ignore
        finalDate: { $gte: startDate, $lte: endDate },
      },
    })

    // return empty array if no schedules found
    if (schedules.length === 0) return []

    // update schedule employees with the remaining employees
    const updatedSchedules = schedules.map(schedule => ({
      id: schedule.id,
      employees: schedule.employees.filter(e => e.uid !== user.uid),
    }))

    for (const updatedSchedule of updatedSchedules) {
      // if schedule employees is empty, delete schedule
      if (updatedSchedule.employees.length === 0) {
        await this.remove(updatedSchedule.id.toString())
      } else {
        await this.update(updatedSchedule.id, updatedSchedule)
      }
      ids.push(updatedSchedule.id.toString())
    }

    return ids
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id)

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
