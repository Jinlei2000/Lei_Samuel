import { Injectable } from '@nestjs/common'
import { CreateAppointmentInput } from './dto/create-appointment.input'
import { UpdateAppointmentInput } from './dto/update-appointment.input'
import { Appointment } from './entities/appointment.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  create(createAppointmentInput: CreateAppointmentInput): Promise<Appointment> {
    const a = new Appointment()
    a.name = createAppointmentInput.name
    a.date = createAppointmentInput.date

    return this.appointmentRepository.save(a)
  }

  findAll() {
    return this.appointmentRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`
  }

  update(id: number, updateAppointmentInput: UpdateAppointmentInput) {
    return `This action updates a #${id} appointment`
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`
  }
}
