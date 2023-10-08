import { Injectable } from '@nestjs/common'
import { CreateStaffInput } from './dto/create-staff.input'
import { UpdateStaffInput } from './dto/update-staff.input'
import { Staff } from './entities/staff.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'
import { filterStaffs, orderStaffs } from 'src/helpers/staffsFunctions'

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

  async findOne(id: string): Promise<Staff | GraphQLError> {
    const staff = await this.staffRepository.findOne({
      // @ts-ignore
      _id: new ObjectId(id),
    })

    if (!staff) {
      throw new GraphQLError('Staff not found!')
    }

    return staff
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

  findStaffsBySearchString(searchString: string): Promise<Staff[]> {
    searchString = searchString.toLowerCase()

    const staffs = this.staffRepository.find({
      // @ts-ignore
      fullname: { $regex: new RegExp(searchString, 'i') },
    })

    return staffs
  }

  create(createStaffInput: CreateStaffInput): Promise<Staff> {
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

    return this.staffRepository.save(s)
  }

  async update(
    id: ObjectId,
    updateStaffInput: UpdateStaffInput,
  ): Promise<Staff | GraphQLError> {
    await this.findOne(id.toString())

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

  // Seeding functions
  saveAll(staffs: Staff[]): Promise<Staff[]> {
    return this.staffRepository.save(staffs)
  }

  truncate(): Promise<void> {
    return this.staffRepository.clear()
  }
}
