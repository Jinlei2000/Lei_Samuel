import { Injectable } from '@nestjs/common'
import { CreateStaffInput } from './dto/create-staff.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role, User } from './entities/user.entity'
import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'
import { filterUsers, orderUsers } from 'src/helpers/usersFunctions'
import { ObjectId } from 'mongodb'
import { UpdateUserInput } from './dto/update-user.input'
import { CreateClientInput } from './dto/create-client.input'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(filters?: Array<string>, order?: OrderByInput): Promise<User[]> {
    // filter and order users
    const whereQuery = filterUsers(filters)
    const orderQuery = orderUsers(order)

    const users = this.userRepository.find({
      where: whereQuery,
      order: orderQuery,
    })

    return users
  }

  findOneByUid(uid: string): Promise<User> {
    return this.userRepository.findOneByOrFail({ uid })
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      //@ts-ignore
      where: { _id: new ObjectId(id) },
    })

    if (!user) throw new GraphQLError('User not found')

    return user
  }

  findUsersBySearchString(searchString: string): Promise<User[]> {
    searchString = searchString.toLowerCase()

    const users = this.userRepository.find({
      // @ts-ignore
      fullname: { $regex: new RegExp(searchString, 'i') },
    })

    return users
  }

  async upgradeToAdmin(id: string): Promise<User> {
    await this.userRepository.update(id, { role: Role.ADMIN })

    return this.findOne(id)
  }

  async updateUser(
    currentUserUid: string,
    id: ObjectId,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.findOne(id.toString())
    const currentUser = await this.findOneByUid(currentUserUid)

    // Check that user is not trying to update someone else if not admin
    if (currentUser.role !== Role.ADMIN && currentUser.uid !== user.uid)
      throw new GraphQLError('You are not allowed to update someone else')

    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateUserInput

    await this.userRepository.update(id, updatedData)

    return this.findOne(id.toString())
  }

  async removeUser(currentUserUid: string, id: string) {
    const user = await this.findOne(id)
    const currentUser = await this.findOneByUid(currentUserUid)

    // Check that user is not trying to delete someone else if not admin
    if (currentUser.role !== Role.ADMIN && currentUser.uid !== user.uid)
      throw new GraphQLError('You are not allowed to delete someone else')

    await this.userRepository.delete(id)

    // return id if delete was successful
    return id
  }

  // CREATESTAFF: Admin can only create employees
  async createStaff(
    uid: string, // TODO: Remove uid maybe?
    createStaffInput: CreateStaffInput,
  ): Promise<User> {
    // Check if user already exists with email
    const user = await this.userRepository.findOneBy({
      email: createStaffInput.email,
    })
    if (user) throw new GraphQLError('User already exists')

    const s = new User()
    // TODO: How to empty uid?
    // s.uid = uid
    s.locale = createStaffInput.locale ?? 'en'
    s.role = Role.EMPLOYEE
    s.firstname = createStaffInput.firstname.toLowerCase()
    s.lastname = createStaffInput.lastname.toLowerCase()
    s.fullname = `${createStaffInput.firstname.toLowerCase()} ${createStaffInput.lastname.toLowerCase()}`
    s.locationId = createStaffInput.locationId
    s.email = createStaffInput.email
    s.telephone = createStaffInput.telephone
    s.availability = true
    s.absentCount = 0

    const newUser = this.userRepository.save(s)

    // TODO: Send email to new employee

    return newUser
  }

  //#region Client
  async createClient(createClientInput: CreateClientInput): Promise<User> {
    // Check if user already exists with email
    const user = await this.userRepository.findOneBy({
      email: createClientInput.email,
    })
    if (user) throw new GraphQLError('User already exists')

    const s = new User()
    // TODO: How to empty uid?
    // s.uid = uid
    s.locale = createClientInput.locale ?? 'en'
    s.role = Role.CLIENT
    s.firstname = createClientInput.firstname.toLowerCase()
    s.lastname = createClientInput.lastname.toLowerCase()
    s.fullname = `${createClientInput.firstname.toLowerCase()} ${createClientInput.lastname.toLowerCase()}`
    s.email = createClientInput.email
    s.availability = true

    const newUser = this.userRepository.save(s)

    // TODO: Send email to new employee

    return newUser
  }

  //#endregion

  async incrementAbsencesCount(staffId: string): Promise<void> {
    const user = await this.findOne(staffId)

    this.userRepository.update(
      { id: new ObjectId(staffId) },
      { absentCount: user.absentCount + 1 },
    )
  }

  // Seeding functions
  saveAll(users: User[]): Promise<User[]> {
    return this.userRepository.save(users)
  }

  truncate(): Promise<void> {
    return this.userRepository.clear()
  }
}
