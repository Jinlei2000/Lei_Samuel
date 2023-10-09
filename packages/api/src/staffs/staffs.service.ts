import { Injectable } from '@nestjs/common'
import { CreateStaffInput } from './dto/create-staff.input'
import { UpdateStaffInput } from './dto/update-staff.input'
import { Staff } from './entities/staff.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'
import {
  filterStaffs,
  orderStaffs,
  sendMailToStaff,
} from 'src/helpers/staffsFunctions'
import { UserRecord } from 'firebase-admin/auth'

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  findAll(filters?: Array<string>, order?: OrderByInput): Promise<Staff[]> {
    // filter and order staffs
    const whereQuery = filterStaffs(filters)
    const orderQuery = orderStaffs(order)

    const staffs = this.staffRepository.find({
      where: whereQuery,
      order: orderQuery,
    })

    return staffs
  }

  async findOne(id: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      // @ts-ignore
      _id: new ObjectId(id),
    })

    if (!staff) {
      throw new GraphQLError('Staff not found!')
    }

    return staff
  }

  findByUid(uid: string): Promise<Staff> {
    const staff = this.staffRepository.findOne({
      // @ts-ignore
      uid: uid,
    })

    if (!staff) {
      throw new GraphQLError('Staff not found!')
    }

    return staff
  }

  findStaffsBySearchString(searchString: string): Promise<Staff[]> {
    searchString = searchString.toLowerCase()

    const staffs = this.staffRepository.find({
      // @ts-ignore
      fullname: { $regex: new RegExp(searchString, 'i') },
    })

    return staffs
  }

  findByEmail(email: string): Promise<Staff> {
    const staff = this.staffRepository.findOne({
      // @ts-ignore
      email: email,
    })

    if (!staff) {
      throw new GraphQLError('Staff not found!')
    }

    return staff
  }

  async upgradeToAdmin(id: string, currentUser: UserRecord): Promise<Staff> {
    const employee = await this.findOne(id)

    // check if the user is an admin
    const admin = await this.findByUid(currentUser.uid)

    console.log('admin', admin)
    if (!admin.isAdmin) {
      throw new GraphQLError('You are not an admin!')
    }

    await this.staffRepository.update(id, { isAdmin: true })

    return employee
  }

  create(createStaffInput: CreateStaffInput): Promise<Staff> {
    // check if the email is already in use
    const staff = this.findByEmail(createStaffInput.email)
    if (staff) {
      throw new GraphQLError('Email already in use!')
    }

    const s = new Staff()
    s.firstname = createStaffInput.firstname.toLowerCase()
    s.lastname = createStaffInput.lastname.toLowerCase()
    s.fullname = `${createStaffInput.firstname.toLowerCase()} ${createStaffInput.lastname.toLowerCase()}`
    s.locationId = createStaffInput.locationId
    s.email = createStaffInput.email
    s.telephone = createStaffInput.telephone
    s.availability = true
    s.absentCount = 0
    s.isAdmin = false

    // TODO: send email to staff with a link to make a account (make a function for this)
    sendMailToStaff(s)

    return this.staffRepository.save(s)
  }

  async update(
    id: ObjectId,
    updateStaffInput: UpdateStaffInput,
  ): Promise<Staff> {
    const staff = await this.findOne(id.toString())

    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateStaffInput

    await this.staffRepository.update(id, updatedData)

    return this.findOne(id.toString())
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id)

    await this.staffRepository.delete(id)

    // return id if delete was successful
    return id
  }

  async incrementAbsencesCount(staffId: string): Promise<void> {
    const staff = await this.findOne(staffId)

    this.staffRepository.update(
      { id: new ObjectId(staffId) },
      { absentCount: staff.absentCount + 1 },
    )
  }

  // Seeding functions
  saveAll(staffs: Staff[]): Promise<Staff[]> {
    return this.staffRepository.save(staffs)
  }

  truncate(): Promise<void> {
    return this.staffRepository.clear()
  }
}
