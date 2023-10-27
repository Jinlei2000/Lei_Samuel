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
import { MailService } from 'src/mail/mail.service'
import { SchedulesService } from 'src/schedules/schedules.service'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { MaterialsService } from 'src/materials/materials.service'
import { resetTime } from 'src/helpers/genericFunctions'

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
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
    @Inject(forwardRef(() => SchedulesService))
    private readonly scheduleService: SchedulesService,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentService: AppointmentsService,
    @Inject(forwardRef(() => MaterialsService))
    private readonly materialsService: MaterialsService,
  ) {}

  findAll(
    filters?: Array<string>,
    order?: OrderByInput,
    searchString?: string,
  ): Promise<User[]> {
    // filter and order users
    const whereQuery = filterUsers(filters)
    const orderQuery = orderUsers(order)

    return this.userRepository.find({
      where: {
        ...whereQuery,
        // @ts-ignore
        fullname: { $regex: new RegExp(searchString, 'i') },
      },
      order: orderQuery,
    })
  }

  async findAllByIds(ids: string[]): Promise<User[]> {
    const users: User[] = []
    for (const id of ids) {
      const user = await this.findOne(id)
      users.push(user)
    }
    return users
  }

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

  // find all employees that are available on a specific date (not absent && not scheduled)
  async findAvailableEmployeesByDate(date: Date): Promise<User[]> {
    const absentIds = await this.absenceService.findAllUsersByDate(date)
    const scheduledIds =
      await this.scheduleService.findAllScheduledUsersByDate(date)

    // dont show users that are absent or scheduled or null or empty (account not made yet)
    const ids = [...absentIds, ...scheduledIds, null, '']

    const users = await this.userRepository.find({
      where: {
        // check if id is not in absentIds and not in scheduledIds
        // @ts-ignore
        uid: { $nin: ids }, // not in
        role: Role.EMPLOYEE,
      },
    })

    return users
  }

  // find of a user is available today (absent && scheduled)
  async findStaffIsAvailableToday(userId: string): Promise<boolean> {
    const user = await this.findOne(userId)
    // delete all behind the time of today
    let date = resetTime(new Date()) // reset time to 00:00:00

    // check if user is absent today
    const isAbsent = await this.absenceService.findOneByDateAndUserId(
      userId,
      date,
    )

    // check if user is scheduled today
    const isScheduled = await this.scheduleService.findOneByDateAndUserId(
      userId,
      date,
    )

    // if user is absent or scheduled, return false
    if (isAbsent || isScheduled) return false

    return true
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
      (updateUserInput.firstname &&
        updateUserInput.firstname.toLowerCase() != user.firstname) ||
      (updateUserInput.lastname &&
        updateUserInput.lastname.toLowerCase() != user.lastname)
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

    // TODO: delete also firebase user

    // Check that user is not trying to delete someone else if not admin & employee cant delete himself
    if (
      currentUser.role !== Role.ADMIN &&
      currentUser.uid !== user.uid &&
      user.role !== Role.EMPLOYEE
    )
      throw new GraphQLError('You are not allowed to delete')

    // delete user
    await this.userRepository.delete(id)

    // delete all locations of user
    await this.locationsService.removeAllByUserId(user.id.toString())

    // delete all mail tokens of user
    await this.mailService.removeAllByUserId(user.id.toString())

    // delete all appointments of user & delete schedule appointments (client)
    if (user.role === Role.CLIENT)
      await this.appointmentService.removeAllByUser(user)

    if (user.role === Role.EMPLOYEE) {
      // update schedules of employee where finalDate is in the future
      await this.scheduleService.updateAllByEmployee(user)
      // remove user from all materials
      await this.materialsService.updateAllByUserId(user.id.toString())
    }

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
    s.absentCount = 0

    const newUser = await this.userRepository.save(s)

    return newUser
  }

  // CREATECLIENT
  async createClient(
    createClientInput: CreateClientInput,
  ): Promise<User> {
    // Check if user already exists with email
    const user = await this.userRepository.findOneBy({
      email: createClientInput.email,
    })
    if (user) throw new GraphQLError('User already exists')

    const s = new User()
    s.uid = createClientInput.uid
    s.locale = createClientInput.locale ?? 'en'
    s.role = Role.CLIENT
    s.firstname = createClientInput.firstname.toLowerCase()
    s.lastname = createClientInput.lastname.toLowerCase()
    s.fullname = `${createClientInput.firstname.toLowerCase()} ${createClientInput.lastname.toLowerCase()}`
    s.email = createClientInput.email

    const newUser = this.userRepository.save(s)

    return newUser
  }

  // Absences
  async incrementAbsencesCount(staffId: string): Promise<void> {
    const user = await this.findOne(staffId)

    this.userRepository.update(
      { id: new ObjectId(staffId) },
      { absentCount: user.absentCount + 1 },
    )
  }

  async decrementAbsencesCount(staffId: string): Promise<void> {
    const user = await this.findOne(staffId)

    this.userRepository.update(
      { id: new ObjectId(staffId) },
      { absentCount: user.absentCount - 1 },
    )
  }

  //  TODO: use this function everywhere
  // Check that user is not trying to do something to someone else if not admin
  async checkUserPermissions(
    currentUserUid: string,
    id: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      // @ts-ignore
      _id: new ObjectId(id),
    })
    const currentUser = await this.userRepository.findOneBy({
      uid: currentUserUid,
    })

    // Check that user is not trying to something to someone else if not admin
    if (currentUser.role !== Role.ADMIN && currentUser.uid !== user.uid)
      throw new GraphQLError('You are not allowed')
  }

  // Seeding functions
  saveAll(users: User[]): Promise<User[]> {
    return this.userRepository.save(users)
  }

  truncate(): Promise<void> {
    return this.userRepository.clear()
  }
}
