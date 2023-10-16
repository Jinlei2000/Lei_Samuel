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
import { filterAbsences, orderAbsences } from 'src/helpers/absencesFunctions'

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(Absence)
    private readonly absenceRepository: Repository<Absence>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async findAll(
    filters?: Array<string>,
    order?: OrderByInput,
  ): Promise<Absence[]> {
    // filter and order absences
    const whereQuery = filterAbsences(filters)
    const orderQuery = orderAbsences(order)

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

  // find all users that is a absent on a specific date (return array of users id's)
  async findAllUserByDate(date: Date): Promise<string[]> {
    const absences = await this.absenceRepository.find({
      where: {
        // check if date is between start and end date of absence
        // @ts-ignore
        startDate: { $lte: date }, // lte = less than or equal
        // @ts-ignore
        endDate: { $gte: date }, // gte = greater than or equal
      },
    })

    const ids = absences.map(absence => absence.userId)
    return ids
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
    a.discription = createAbsenceInput.discription
    a.userId = createAbsenceInput.userId
    a.type = createAbsenceInput.type
    a.startDate = createAbsenceInput.startDate
    a.endDate = createAbsenceInput.endDate

    // calculate total days
    const startDate = new Date(a.startDate)
    const endDate = new Date(a.endDate)
    const totalDays =
      Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1
    a.totalDays = totalDays

    const newAbsence = await this.absenceRepository.save(a)

    // increment user absences
    await this.userService.incrementAbsencesCount(createAbsenceInput.userId)

    return newAbsence
  }

  // TODO make a function that checks if user has an absence on the same date & calculate total days

  async update(
    id: ObjectId,
    updateAbsenceInput: UpdateAbsenceInput,
  ): Promise<Absence> {
    const currentAbsence = await this.findOne(id.toString())

    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateAbsenceInput

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
      console.log(absences)
      if (absences.length > 0)
        throw new GraphQLError('User already has an absence on the same date!')

      // calculate total days
      const startDate = new Date(updateAbsenceInput.startDate)
      const endDate = new Date(updateAbsenceInput.endDate)
      const totalDays =
        Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1
      updatedData.totalDays = totalDays
    }

    await this.absenceRepository.update(id, updatedData)

    return this.findOne(id.toString())
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id)

    await this.absenceRepository.delete(id)

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
