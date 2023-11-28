import { ObjectId } from 'mongodb'
import { Role, User } from '../entities/user.entity'
import { CreateClientInput } from '../dto/create-client.input'
import { CreateStaffInput } from '../dto/create-staff.input'

export const createclientInputStub = (): CreateClientInput => {
  const u = new CreateClientInput()
  u.uid = '652e5989204b1d8ef65ed992'
  u.locale = 'en'
  u.firstname = 'John'
  u.lastname = 'Doe'
  u.email = 'john@gmail.com'
  return u
}

export const createstaffInputStub = (): CreateStaffInput => {
  const u = new CreateStaffInput()
  u.locale = 'en'
  u.firstname = 'John'
  u.lastname = 'Doe'
  u.email = 'john@gmail.com'
  u.telephone = '123456789'
  return u
}

export const userClientStub = (): User => {
  const u = new User()
  u.id = new ObjectId('5f9d4a3f9d6c6a1d9c9bce1a')
  u.uid = '652e5989204b1d8ef65ed992'
  u.locale = 'en'
  u.role = Role.CLIENT
  u.firstname = 'John'
  u.lastname = 'Doe'
  u.fullname = 'John Doe'
  u.email = 'john@gmail.com'
  u.telephone = '123456789'
  u.invoiceOption = 'post'
  u.company = false
  u.btwNumber = null
  return u
}

export const userStaffStub = (): User => {
  const u = new User()
  u.id = new ObjectId('5f9d4a3f9d6c6a1d9c9bce1a')
  u.uid = '652e5989204b1d8ef65ed992'
  u.locale = 'en'
  u.role = Role.EMPLOYEE
  u.firstname = 'John'
  u.lastname = 'Doe'
  u.fullname = 'John Doe'
  u.email = 'john@gmail.com'
  u.telephone = '123456789'
  u.invoiceOption = 'post'
  u.absentCount = 0
  return u
}
