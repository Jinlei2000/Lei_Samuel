import { Injectable } from '@nestjs/common'
import { CreateStaffInput } from './dto/create-staff.input'
import { UpdateStaffInput } from './dto/update-staff.input'
import { Staff } from './entities/staff.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId, Repository } from 'typeorm'
import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'
import { filterStaffs, orderStaffs } from 'src/helpers/staffsFunctions'

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  findAll(filters?: Array<string>, order?: OrderByInput) {
    // filter and order staffs
    const whereQuery = filterStaffs(filters)
    const orderQuery = orderStaffs(order)

    const staffs = this.staffRepository.find({
      where: whereQuery,
      order: orderQuery,
    })

    return staffs
  }

  findOne(id: string) {
    const staff = this.staffRepository.findOne({
      // @ts-ignore
      _id: new ObjectId(id),
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
      name: { $regex: new RegExp(searchString, 'i') },
    })

    return staffs
  }

  create(createStaffInput: CreateStaffInput) {
    const s = new Staff()
    s.firstname = createStaffInput.firstname
    s.lastname = createStaffInput.lastname
    s.fullname = createStaffInput.fullname
    s.locationIds = createStaffInput.locationIds
    s.email = createStaffInput.email
    s.telephone = createStaffInput.telephone
    s.availability = true
    s.absentCount = 0
    s.isAdmin = false

    return this.staffRepository.save(s)
  }

  async update(id: ObjectId, updateStaffInput: UpdateStaffInput) {
    await this.findOne(id.toString())

    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateStaffInput

    await this.staffRepository.update(id, updatedData)

    return this.findOne(id.toString())
  }

  async remove(id: string) {
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
