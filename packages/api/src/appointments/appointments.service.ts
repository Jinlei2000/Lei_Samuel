import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { CreateAppointmentInput } from './dto/create-appointment.input'
import { UpdateAppointmentInput } from './dto/update-appointment.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Appointment } from './entities/appointment.entity'
import { ObjectId } from 'mongodb'
import { OrderByInput } from 'src/interfaces/order.input'
import { GraphQLError } from 'graphql'
import {
  filterAppointments,
  orderAppointments,
} from 'src/helpers/appointmentsFunctions'
import { SchedulesService } from 'src/schedules/schedules.service'
import { UsersService } from 'src/users/users.service'
import { LocationsService } from 'src/locations/locations.service'
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @Inject(forwardRef(() => SchedulesService))
    private readonly scheduleService: SchedulesService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly locationsService: LocationsService,
  ) {}

  async findAll(
    filters?: Array<string>,
    order?: OrderByInput,
  ): Promise<Appointment[]> {
    // filter and order appointments
    const whereQuery = filterAppointments(filters)
    const orderQuery = orderAppointments(order)

    return this.appointmentRepository.find({
      where: whereQuery,
      order: orderQuery,
    })
  }

  // TODO: find all by date

  async findOne(id: string) {
    const appointment = await this.appointmentRepository.findOne({
      //@ts-ignore
      where: { _id: new ObjectId(id) },
    })

    if (!appointment) throw new GraphQLError('Appointment not found')

    return appointment
  }

  async create(
    createAppointmentInput: CreateAppointmentInput,
  ): Promise<Appointment> {
    const a = new Appointment()
    a.user = await this.usersService.findOne(createAppointmentInput.userId)
    a.location = await this.locationsService.findOne(
      createAppointmentInput.locationId,
    )
    a.type = createAppointmentInput.type
    a.endProposedDate = createAppointmentInput.endProposedDate
    a.startProposedDate = createAppointmentInput.startProposedDate
    a.isDone = false
    a.isScheduled = false
    a.description = createAppointmentInput.description
    a.priority = createAppointmentInput.priority

    return this.appointmentRepository.save(a)
  }

  async update(
    id: ObjectId,
    updateAppointmentInput: UpdateAppointmentInput,
  ): Promise<Appointment> {
    const currentAppointment = await this.findOne(id.toString())

    const updatedAppointment = {
      ...currentAppointment,
      // update when not null (if null, keep current value)
      ...(updateAppointmentInput.userId && {
        user: await this.usersService.findOne(updateAppointmentInput.userId),
      }),
      ...(updateAppointmentInput.locationId && {
        location: await this.locationsService.findOne(
          updateAppointmentInput.locationId,
        ),
      }),
    }

    await this.appointmentRepository.update(id, updatedAppointment)

    return this.findOne(id.toString())
  }

  // remove appointment only if not done & remove appointment id from schedules
  async remove(id: string): Promise<string> {
    const appointment = await this.findOne(id.toString())

    if (appointment.isDone)
      throw new GraphQLError('Cannot delete an appointment that is done')

    // remove all appointments id from schedules & delete schedule if empty appointmentIds
    await this.scheduleService.updateAllByAppointment(id)

    await this.appointmentRepository.delete(id)

    // return id if delete was successful
    return id
  }

  // remove all appointments by userId only if not done (client)
  async removeAllByUser(user: User): Promise<string[]> {
    const appointments = await this.appointmentRepository.find({
      where: {
        user: { uid: user.uid },
        isDone: false,
      },
    })

    if (appointments.length === 0) return []

    const ids = appointments.map(appointment => appointment.id.toString())

    for (const id of ids) {
      await this.remove(id)
    }

    return ids
  }

  // Seeding functions
  saveAll(appointments: Appointment[]): Promise<Appointment[]> {
    return this.appointmentRepository.save(appointments)
  }

  truncate(): Promise<void> {
    return this.appointmentRepository.clear()
  }
}
