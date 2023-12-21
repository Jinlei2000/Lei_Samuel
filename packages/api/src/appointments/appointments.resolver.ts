import {
  Resolver,
  Query,
  Mutation,
  Args,
  Subscription,
  ObjectType,
  Field,
  Int,
} from '@nestjs/graphql'
import { AppointmentsService } from './appointments.service'
import { Appointment } from './entities/appointment.entity'
import { CreateAppointmentInput } from './dto/create-appointment.input'
import { UpdateAppointmentInput } from './dto/update-appointment.input'
import { OrderByInput } from 'src/interfaces/order.input'
import { UsersService } from 'src/users/users.service'
import { Role } from 'src/users/entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { AllowedRoles } from 'src/users/decorators/role.decorator'
import { RolesGuard } from 'src/users/guards/roles.guard'
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub()

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
    @Args('searchString', { type: () => String, nullable: true })
    searchString?: string,
  ) {
    return this.appointmentsService.findAll(filters, order, searchString)
  }

  @AllowedRoles(Role.CLIENT)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Appointment], { name: 'appointmentsByUserId' })
  findAllByUserId(
    @Args('userId', { type: () => String }) userId: string,
    @Args('filters', { type: () => [String], nullable: true })
    filters?: Array<string>,
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
    @Args('searchString', { type: () => String, nullable: true })
    searchString?: string,
  ) {
    return this.appointmentsService.findAllByUserId(
      userId,
      filters,
      order,
      searchString,
    )
  }

  @AllowedRoles(Role.CLIENT)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Appointment], { name: 'appointmentsRecentByUserId' })
  findAllRecentByUserId(
    @Args('userId', { type: () => String }) userId: string,
    @Args('amount', { type: () => Int }) amount: number,
    @Args('filters', { type: () => [String], nullable: true })
    filters?: Array<string>,
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ) {
    return this.appointmentsService.findAllRecentByUserId(
      userId,
      amount,
      filters,
      order,
    )
  }

  @AllowedRoles(Role.CLIENT)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Appointment], { name: 'appointmentsUpcomingByUserId' })
  findAllUpcomingByUserId(
    @Args('userId', { type: () => String }) userId: string,
    @Args('amount', { type: () => Int }) amount: number,
    @Args('filters', { type: () => [String], nullable: true })
    filters?: Array<string>,
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ) {
    return this.appointmentsService.findAllUpcomingByUserId(
      userId,
      amount,
      filters,
      order,
    )
  }

  @UseGuards(FirebaseGuard)
  @Query(() => Appointment, { name: 'appointment' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.appointmentsService.findOne(id)
  }

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Appointment], { name: 'appointmentsAvailableByDate' })
  findAllAvailableByDate(@Args('date', { type: () => String }) date: Date) {
    return this.appointmentsService.findAllAvailableByDate(date)
  }

  @AllowedRoles(Role.ADMIN, Role.CLIENT)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Appointment)
  createAppointment(
    @Args('createAppointmentInput')
    createAppointmentInput: CreateAppointmentInput,
  ) {
    const myMsg = new NewAppointmentMessage(
      'A new appointment was created',
      createAppointmentInput.description,
    )
    pubSub.publish('newAppointmentAdded', { newAppointmentAdded: myMsg }) // <-- publish the message
    return this.appointmentsService.create(createAppointmentInput)
  }

  @AllowedRoles(Role.ADMIN, Role.CLIENT, Role.EMPLOYEE)
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

  @Subscription(() => NewAppointmentMessage)
  newAppointmentAdded() {
    return pubSub.asyncIterator('newAppointmentAdded') // <-- subscribe to the message
  }
}

@ObjectType() // <-- create a graphql ObjectType for the subscription
class NewAppointmentMessage {
  constructor(content: string, who: string) {
    this.content = content
    this.who = who
  }

  @Field()
  content: string
  @Field()
  who: string
}
