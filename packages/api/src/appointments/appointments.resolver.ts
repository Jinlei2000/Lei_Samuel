import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql'
import { AppointmentsService } from './appointments.service'
import { Appointment } from './entities/appointment.entity'
import { CreateAppointmentInput } from './dto/create-appointment.input'
import { UpdateAppointmentInput } from './dto/update-appointment.input'
import { OrderByInput } from 'src/interfaces/order.input'
import { UsersService } from 'src/users/users.service'
import { Role, User } from 'src/users/entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { AllowedRoles } from 'src/users/decorators/role.decorator'
import { RolesGuard } from 'src/users/guards/roles.guard'

@Resolver(() => Appointment)
export class AppointmentsResolver {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly usersService: UsersService,
  ) {}

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Appointment], { name: 'appointments' })
  findAll(
    @Args('filters', { type: () => [String], nullable: true })
    filters?: Array<string>,
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ) {
    return this.appointmentsService.findAll()
  }

  @UseGuards(FirebaseGuard)
  @Query(() => Appointment, { name: 'appointment' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.appointmentsService.findOne(id)
  }

  @AllowedRoles(Role.ADMIN, Role.CLIENT)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Appointment)
  createAppointment(
    @Args('createAppointmentInput')
    createAppointmentInput: CreateAppointmentInput,
  ) {
    return this.appointmentsService.create(createAppointmentInput)
  }

  @AllowedRoles(Role.ADMIN, Role.CLIENT)
  @UseGuards(FirebaseGuard, RolesGuard)
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

  @AllowedRoles(Role.ADMIN, Role.CLIENT)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => String)
  removeAppointment(@Args('id', { type: () => String }) id: string) {
    return this.appointmentsService.remove(id)
  }

  // // Resolve fields
  @ResolveField()
  user(@Parent() a: Appointment): Promise<User> {
    return this.usersService.findOne(a.userId)
  }
}
