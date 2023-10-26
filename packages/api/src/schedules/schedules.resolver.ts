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
import { UpdateScheduleInput } from './dto/update-schedule.input'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { Appointment } from 'src/appointments/entities/appointment.entity'
import { OrderByInput } from 'src/interfaces/order.input'

@Resolver(() => Schedule)
export class SchedulesResolver {
  constructor(
    private readonly schedulesService: SchedulesService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Query(() => [Schedule], { name: 'schedules' })
  findAll(
    @Args('filters', { type: () => [String], nullable: true })
    filters?: string[],
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ) {
    return this.schedulesService.findAll(filters, order)
  }

  @Query(() => Schedule, { name: 'schedule' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.schedulesService.findOne(id)
  }

  @Mutation(() => Schedule)
  createSchedule(
    @Args('createScheduleInput') createScheduleInput: CreateScheduleInput,
  ) {
    return this.schedulesService.create(createScheduleInput)
  }

  @Mutation(() => Schedule)
  updateSchedule(
    @Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput,
  ) {
    return this.schedulesService.update(
      updateScheduleInput.id,
      updateScheduleInput,
    )
  }

  @Mutation(() => Schedule)
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
