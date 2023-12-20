import { ObjectId } from 'mongodb'
import { CreateScheduleInput } from '../dto/create-schedule.input'
import { Schedule } from '../entities/schedule.entity'
import { Role } from 'src/users/entities/user.entity'

export const createscheduleInputStub = (): CreateScheduleInput => {
  const s = new CreateScheduleInput()
  s.appointmentIds = ['5f9d4a3f9d6c6a1d9c9bce1a', '5f9d4a3f9d6c6a1d9c9bce1b']
  s.employeeIds = ['6561ed9f07fb2186f67360b1', '6561ed9f07fb2186f67360b2']
  s.materialIds = ['6561ed9f07fb2186f6736091', '6561ed9f07fb2186f6736092']
  s.finalDate = new Date('2021-01-01')
  s.createdBy = 'john doe'
  return s
}

export const scheduleStub = (): Schedule => {
  const s = new Schedule()
  s.id = new ObjectId('5f9d4a3f9d6c6a1d9c9bce1a')
  s.appointmentIds = []
  s.employees = [
    {
      id: new ObjectId('6561ed9f07fb2186f67360b1'),
      uid: '1Bo190WC69ezEJmgjioUmwindPN2',
      locale: 'en',
      role: Role.EMPLOYEE,
      firstname: 'lei',
      lastname: 'jin',
      fullname: 'lei jin',
      locationIds: ['6561ed9f07fb2186f67360c4'],
      email: 'lei.jin@student.howest.be',
      absentCount: 2,
      invoiceOption: null,
      company: null,
    },
    {
      id: new ObjectId('6561ed9f07fb2186f67360b2'),
      uid: 'bEk4f8zWwSYAQykpfxTgXnmrcRG2',
      locale: 'en',
      role: Role.EMPLOYEE,
      firstname: 'john',
      lastname: 'doe',
      fullname: 'john doe',
      locationIds: ['6561ed9f07fb2186f67360cd'],
      email: 'john.doe@gmail.com',
      absentCount: 1,
      invoiceOption: null,
      company: null,
    },
  ]
  s.materials = [
    {
      id: new ObjectId('6561ed9f07fb2186f6736091'),
      name: 'knee pads',
      serialNumber: 74125,
      isLoan: true,
    },
    {
      id: new ObjectId('6561ed9f07fb2186f6736092'),
      name: 'sprinkler system',
      serialNumber: 63541,
      isLoan: true,
    },
  ]
  s.finalDate = new Date('2021-01-01')
  s.createdBy = 'john doe'
  return s
}
