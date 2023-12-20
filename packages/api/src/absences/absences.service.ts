import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { CreateAbsenceInput } from './dto/create-absence.input'
import { UpdateAbsenceInput } from './dto/update-absence.input'
import { Absence } from './entities/absence.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'
import { UsersService } from 'src/users/users.service'
import { OrderByInput } from 'src/interfaces/order.input'
import {
  calculateTotalDays,
  filterAbsences,
  orderAbsences,
} from 'src/helpers/absencesFunctions'
import { SchedulesService } from 'src/schedules/schedules.service'

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(Absence)
    private readonly absenceRepository: Repository<Absence>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(forwardRef(() => SchedulesService))
    private readonly scheduleService: SchedulesService,
  ) {}

  async findAll(
    filters?: Array<string>,
    order?: OrderByInput,
  ): Promise<Absence[]> {
    // filter and order absences
    const whereQuery = filterAbsences(filters)
    const orderQuery = orderAbsences(order)

    console.log(whereQuery)

    return this.absenceRepository.find({
      where: whereQuery,
      order: orderQuery,
    })
  }

  async findAllByUserId(
    userId: string,
    filters?: Array<string>,
    order?: OrderByInput,
  ): Promise<Absence[]> {
    // filter and order absences
    const whereQuery = filterAbsences(filters)
    const orderQuery = orderAbsences(order)

    const absences = await this.absenceRepository.find({
      where: {
        userId: userId,
        ...whereQuery,
      },
      order: orderQuery,
    })

    return absences
  }

  async findAllByDate(date: string): Promise<Absence[]> {
    const absences = await this.absenceRepository.find({
      where: {
        // check if date is between start and end date of absence
        // @ts-ignore
        startDate: { $lte: new Date(date) }, // lte = less than or equal
        // @ts-ignore
        endDate: { $gte: new Date(date) }, // gte = greater than or equal
      },
    })

    return absences
  }

  // find all users that is a absent on a specific date (return array of users id's)
  async findAllUsersByDate(date: Date): Promise<string[]> {
    const absences = await this.absenceRepository.find({
      where: {
        // check if date is between start and end date of absence
        // @ts-ignore
        startDate: { $lte: date }, // lte = less than or equal
        // @ts-ignore
        endDate: { $gte: date }, // gte = greater than or equal
      },
    })

    const uids: string[] = []

    for (const absence of absences) {
      const user = await this.userService.findOne(absence.userId)

      uids.push(user.uid)
    }

    return uids
  }

  async findOne(id: string): Promise<Absence> {
    const absence = await this.absenceRepository.findOne({
      // @ts-ignore
      _id: new ObjectId(id),
    })

    if (!absence) {
      throw new GraphQLError('Absence not found!')
    }

    return absence
  }

  // check if user is already absent on this date (return true or false)
  async findOneByDateAndUserId(userId: string, date: Date): Promise<Boolean> {
    const absences = await this.absenceRepository.find({
      where: {
        // check if date is between start and end date of absence
        // @ts-ignore
        startDate: { $lte: date },
        // @ts-ignore
        endDate: { $gte: date },
        userId: userId,
      },
    })

    return absences.length > 0
  }

  async create(createAbsenceInput: CreateAbsenceInput) {
    if (!['sick', 'vacation', 'other'].includes(createAbsenceInput.type))
      throw new GraphQLError(
        'Type not found! Type must be sick, vacation or other',
      )

    // check if user allready has an absence on the same date
    const absences = await this.absenceRepository.find({
      where: {
        // check if date is between start and end date of absence
        // @ts-ignore
        $or: [
          {
            startDate: { $lte: createAbsenceInput.startDate },
            endDate: { $gte: createAbsenceInput.startDate },
          },
          {
            startDate: { $lte: createAbsenceInput.endDate },
            endDate: { $gte: createAbsenceInput.endDate },
          },
        ],

        userId: createAbsenceInput.userId,
      },
    })
    if (absences.length > 0)
      throw new GraphQLError('User already has an absence on the same date!')

    const a = new Absence()
    a.description = createAbsenceInput.description
    a.userId = createAbsenceInput.userId
    a.type = createAbsenceInput.type
    a.startDate = createAbsenceInput.startDate
    a.endDate = createAbsenceInput.endDate
    a.totalDays = calculateTotalDays(new Date(a.startDate), new Date(a.endDate))

    const newAbsence = await this.absenceRepository.save(a)

    // increment user absences
    await this.userService.incrementAbsencesCount(createAbsenceInput.userId)

    // remove user from schedules with date range
    const user = await this.userService.findOne(createAbsenceInput.userId)
    await this.scheduleService.updateAllByEmployeeWithDateRange(
      user,
      new Date(createAbsenceInput.startDate),
      new Date(createAbsenceInput.endDate),
    )

    return newAbsence
  }

  async update(
    id: ObjectId,
    updateAbsenceInput: UpdateAbsenceInput,
  ): Promise<Absence> {
    const currentAbsence = await this.findOne(id.toString())

    // remove id
    delete updateAbsenceInput.id

    // check if start or end date has changed
    if (
      currentAbsence.startDate !== updateAbsenceInput.startDate ||
      currentAbsence.endDate !== updateAbsenceInput.endDate
    ) {
      // check if user allready has an absence on the same date
      const absences = await this.absenceRepository.find({
        where: {
          // check if date is between start and end date of absence
          // @ts-ignore
          $or: [
            {
              startDate: { $lte: updateAbsenceInput.startDate },
              endDate: { $gte: updateAbsenceInput.startDate },
            },
            {
              startDate: { $lte: updateAbsenceInput.endDate },
              endDate: { $gte: updateAbsenceInput.endDate },
            },
          ],

          userId: currentAbsence.userId,
        },
      })
      // console.log(absences)
      // because the current absence is also in the array, we need to check if the array length is greater than 1
      if (absences.length > 1)
        throw new GraphQLError('User already has an absence on the same date!')

      // calculate total days
      updateAbsenceInput.totalDays = calculateTotalDays(
        new Date(updateAbsenceInput.startDate),
        new Date(updateAbsenceInput.endDate),
      )
    }

    await this.absenceRepository.update(id, updateAbsenceInput)

    return this.findOne(id.toString())
  }

  async remove(id: string): Promise<string> {
    const absence = await this.findOne(id)

    await this.absenceRepository.delete(id)

    // decrement user absences
    await this.userService.decrementAbsencesCount(absence.userId)

    // return id if delete was successful
    return id
  }

  // Delete all absences of user
  async removeAllByUserId(userId: string): Promise<string[]> {
    const absences = await this.findAllByUserId(userId)

    const ids = absences.map(absences => absences.id.toString())

    await this.absenceRepository.delete(ids)

    return ids
  }

  // Seeding functions
  saveAll(absences: Absence[]): Promise<Absence[]> {
    return this.absenceRepository.save(absences)
  }

  truncate(): Promise<void> {
    return this.absenceRepository.clear()
  }
}
