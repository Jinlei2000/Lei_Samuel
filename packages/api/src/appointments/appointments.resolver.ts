import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { AppointmentsService } from './appointments.service'
import { Appointment } from './entities/appointment.entity'
import { CreateAppointmentInput } from './dto/create-appointment.input'
import { UpdateAppointmentInput } from './dto/update-appointment.input'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Resolver(() => Appointment)
export class AppointmentsResolver {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  @Mutation(() => Appointment)
  createAppointment(
    @Args('createAppointmentInput')
    createAppointmentInput: CreateAppointmentInput,
  ) {
    return this.appointmentsService.create(createAppointmentInput)
  }

  @Query(() => [Appointment], { name: 'appointments' })
  findAll() {
    return this.appointmentRepository.find()
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
