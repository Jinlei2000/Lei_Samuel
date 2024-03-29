import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql'
import { SchedulesService } from './schedules.service'
import { Schedule } from './entities/schedule.entity'
import { CreateScheduleInput } from './dto/create-schedule.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { UpdateScheduleInput } from './dto/update-schedule.input'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { Appointment } from 'src/appointments/entities/appointment.entity'
import { OrderByInput } from 'src/interfaces/order.input'
import { AllowedRoles } from 'src/users/decorators/role.decorator'
import { Role } from 'src/users/entities/user.entity'
import { RolesGuard } from 'src/users/guards/roles.guard'

@Resolver(() => Schedule)
export class SchedulesResolver {
  constructor(
    private readonly schedulesService: SchedulesService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Schedule], { name: 'schedules' })
  findAll(
    @Args('filters', { type: () => [String], nullable: true })
    filters?: string[],
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ) {
    return this.schedulesService.findAll(filters, order)
  }

  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => Schedule, { name: 'schedule' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.schedulesService.findOne(id)
  }

  // Get all schedules for certain date
  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Schedule], { name: 'schedulesByDate' })
  findSchedulesByDate(@Args('date', { type: () => String }) date: string) {
    return this.schedulesService.findSchedulesByDate(date)
  }

  // Get schedule for today by employeeId
  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Schedule], { name: 'scheduleByDateAndUserId' })
  findTodayScheduleByDateAndUserId(
    @Args('date', { type: () => String }) date: string,
    @Args('userId', { type: () => String }) userId: string,
  ) {
    return this.schedulesService.findTodayScheduleByDateAndUserId(userId, date)
  }

  // Get schedules from startdate for specified number of days by employeeId
  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Schedule], { name: 'schedulesFromDateForDaysByUserId' })
  findSchedulesFromDateForDaysByUserId(
    @Args('date', { type: () => String }) date: string,
    @Args('days', { type: () => Number }) days: number,
    @Args('userId', { type: () => String }) userId: string,
  ) {
    return this.schedulesService.findSchedulesFromDateForDaysByUserId(
      userId,
      date,
      days,
    )
  }

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Schedule)
  createSchedule(
    @Args('createScheduleInput') createScheduleInput: CreateScheduleInput,
  ) {
    return this.schedulesService.create(createScheduleInput)
  }

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Schedule)
  updateSchedule(
    @Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput,
  ) {
    return this.schedulesService.update(
      updateScheduleInput.id,
      updateScheduleInput,
    )
  }

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => String)
  removeSchedule(@Args('id', { type: () => String }) id: string) {
    return this.schedulesService.remove(id)
  }

  // Resolve field
  @ResolveField()
  async appointments(@Parent() s: Schedule): Promise<Appointment[]> {
    let appointments: Appointment[] = []
    for (let id of s.appointmentIds) {
      const appointment = await this.appointmentsService.findOne(id)

      appointments.push(appointment)
    }

    return appointments
  }
}
