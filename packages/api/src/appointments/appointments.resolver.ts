import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { AppointmentsService } from './appointments.service'
import { Appointment } from './entities/appointment.entity'
import { CreateAppointmentInput } from './dto/create-appointment.input'
import { UpdateAppointmentInput } from './dto/update-appointment.input'

@Resolver(() => Appointment)
export class AppointmentsResolver {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Mutation(() => Appointment)
  createAppointment(
    @Args('createAppointmentInput')
    createAppointmentInput: CreateAppointmentInput,
  ) {
    return this.appointmentsService.create(createAppointmentInput)
  }

  @Query(() => [Appointment], { name: 'appointments' })
  findAll() {
    return [
      {
        id: '1',
        name: 'Appointment 1',
        date: new Date(),
        location: 'Room A',
        description: 'Test appointment',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  }

  @Query(() => Appointment, { name: 'appointment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.appointmentsService.findOne(id)
  }

  @Mutation(() => Appointment)
  updateAppointment(
    @Args('updateAppointmentInput')
    updateAppointmentInput: UpdateAppointmentInput,
  ) {
    return this.appointmentsService.update(
      updateAppointmentInput.id,
      updateAppointmentInput,
    )
  }

  @Mutation(() => Appointment)
  removeAppointment(@Args('id', { type: () => Int }) id: number) {
    return this.appointmentsService.remove(id)
  }
}
