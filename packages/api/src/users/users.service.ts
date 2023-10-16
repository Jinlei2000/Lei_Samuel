import { Inject, Injectable, forwardRef } from '@nestjs/common'
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
import { LocationsService } from 'src/locations/locations.service'
import { AbsencesService } from 'src/absences/absences.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // use forwardRef to avoid circular dependency
    @Inject(forwardRef(() => LocationsService))
    private readonly locationsService: LocationsService,
    @Inject(forwardRef(() => AbsencesService))
    private readonly absenceService: AbsencesService,
  ) {}

  findAll(filters?: Array<string>, order?: OrderByInput): Promise<User[]> {
    // filter and order users
    const whereQuery = filterUsers(filters)
    const orderQuery = orderUsers(order)

    return this.userRepository.find({
      where: whereQuery,
      order: orderQuery,
    })
  }

  // TODO: create own error, but than or roles guard dont work
  async findOneByUid(uid: string): Promise<User> {
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

  // TODO find all users that is not a absent on a specific date (return array of users) & find all users that is not scheduled on a specific date (return array of users)
  // use the absenceService to find all absent users on a specific date
  // use the scheduleService to find all scheduled users on a specific date
  async findAvailableUsersByDate(date: Date): Promise<User[]> {
    const absentIds = await this.absenceService.findAllUserByDate(date)

    const users = await this.userRepository.find({
      where: {
        // check if id is not in absentIds
        // @ts-ignore
        id: { $nin: absentIds }, // nin = not in

        // TODO: check if user is not scheduled on date
      },
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

    // Update the fullname if firstname or lastname is updated
    if (
      updateUserInput.firstname.toLowerCase() != user.firstname ||
      updateUserInput.lastname.toLowerCase() != user.lastname
    ) {
      updateUserInput.fullname = `${updateUserInput.firstname.toLowerCase()} ${updateUserInput.lastname.toLowerCase()}`
    }

    // Check that user is not trying to update someone else if not admin
    if (currentUser.role !== Role.ADMIN && currentUser.uid !== user.uid)
      throw new GraphQLError('You are not allowed to update someone else')

    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateUserInput

    await this.userRepository.update(id, updatedData)

    return this.findOne(id.toString())
  }

  // Delete user and all locations of user
  async removeUser(currentUserUid: string, id: string) {
    const user = await this.findOne(id)
    const currentUser = await this.findOneByUid(currentUserUid)

    // TODO employee cant not delete himself

    // Check that user is not trying to delete someone else if not admin
    if (currentUser.role !== Role.ADMIN && currentUser.uid !== user.uid)
      throw new GraphQLError('You are not allowed to delete someone else')

    await this.userRepository.delete(id)

    // delete all locations of user
    await this.locationsService.removeAllByUid(user.uid)

    // return id if delete was successful
    return id
  }

  // CREATESTAFF: Admin can only create employees
  async createStaff(createStaffInput: CreateStaffInput): Promise<User> {
    // Check if user already exists with email
    const user = await this.userRepository.findOneBy({
      email: createStaffInput.email,
    })
    if (user) throw new GraphQLError('User already exists')

    const s = new User()
    s.locale = createStaffInput.locale ?? 'en'
    s.role = Role.EMPLOYEE
    s.firstname = createStaffInput.firstname.toLowerCase()
    s.lastname = createStaffInput.lastname.toLowerCase()
    s.fullname = `${createStaffInput.firstname.toLowerCase()} ${createStaffInput.lastname.toLowerCase()}`
    s.email = createStaffInput.email
    s.telephone = createStaffInput.telephone
    s.availability = true
    s.absentCount = 0

    const newUser = await this.userRepository.save(s)

    return newUser
  }

  // CREATECLIENT
  async createClient(
    currentUserUid: string,
    createClientInput: CreateClientInput,
  ): Promise<User> {
    // Check if user already exists with email
    const user = await this.userRepository.findOneBy({
      email: createClientInput.email,
    })
    if (user) throw new GraphQLError('User already exists')

    const s = new User()
    s.uid = currentUserUid
    s.locale = createClientInput.locale ?? 'en'
    s.role = Role.CLIENT
    s.firstname = createClientInput.firstname.toLowerCase()
    s.lastname = createClientInput.lastname.toLowerCase()
    s.fullname = `${createClientInput.firstname.toLowerCase()} ${createClientInput.lastname.toLowerCase()}`
    s.email = createClientInput.email
    s.availability = true

    const newUser = this.userRepository.save(s)

    return newUser
  }

  // TODO: make a functions start automaticly on a time & check if a user is absent today and if so, set availability to false

  // Absences
  async incrementAbsencesCount(staffId: string): Promise<void> {
    const user = await this.findOne(staffId)

    this.userRepository.update(
      { id: new ObjectId(staffId) },
      { absentCount: user.absentCount + 1 },
    )
  }

  // Make a function
  // Check that user is not trying to do something to someone else if not admin
  // async checkUserPermissions(
  //   currentUserUid: string,
  //   id: string,
  // ): Promise<void> {
  //   const user = await this.userRepository.findOne({
  //     // @ts-ignore
  //     _id: new ObjectId(id),
  //   })
  //   const currentUser = await this.userRepository.findOneBy({
  //     uid: currentUserUid,
  //   })

  //   // Check that user is not trying to something to someone else if not admin
  //   if (currentUser.role !== Role.ADMIN && currentUser.uid !== user.uid)
  //     throw new GraphQLError('You are not allowed')
  // }

  // Seeding functions
  saveAll(users: User[]): Promise<User[]> {
    return this.userRepository.save(users)
  }

  truncate(): Promise<void> {
    return this.userRepository.clear()
  }
}
