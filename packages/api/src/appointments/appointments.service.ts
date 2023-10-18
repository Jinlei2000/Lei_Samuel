import { Injectable } from '@nestjs/common'
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

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
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
    a.userId = createAppointmentInput.userId
    a.location = createAppointmentInput.location
    a.type = createAppointmentInput.type
    a.endProposedDate = createAppointmentInput.endProposedDate
    a.startProposedDate = createAppointmentInput.startProposedDate
    a.isDone = false
    a.isScheduled = false
    a.description = createAppointmentInput.description

    return this.appointmentRepository.save(a)
  }

  async update(
    id: ObjectId,
    updateAppointmentInput: UpdateAppointmentInput,
  ): Promise<Appointment> {
    await this.findOne(id.toString())

    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateAppointmentInput

    await this.appointmentRepository.update(id, updatedData)

    return this.findOne(id.toString())
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id.toString())

    await this.appointmentRepository.delete(id)

    // return id if delete was successful
    return id
  }

  // Seeding functions
  saveAll(appointments: Appointment[]): Promise<Appointment[]> {
    return this.appointmentRepository.save(appointments)
  }

  truncate(): Promise<void> {
    return this.appointmentRepository.clear()
  }
}
