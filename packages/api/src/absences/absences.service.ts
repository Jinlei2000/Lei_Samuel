import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { CreateAbsenceInput } from './dto/create-absence.input'
import { UpdateAbsenceInput } from './dto/update-absence.input'
import { Absence } from './entities/absence.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(Absence)
    private readonly absenceRepository: Repository<Absence>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  // TODO: add order and filter (type)
  async findAll(): Promise<Absence[]> {
    return this.absenceRepository.find()
  }

  // TODO: add order and filter (type)
  async findAllByUserId(userId: string): Promise<Absence[]> {
    const absences = await this.absenceRepository.find({
      where: {
        userId: userId,
      },
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

    // TODO check if user allready has an absence on the same date

    const a = new Absence()
    a.discription = createAbsenceInput.discription
    a.userId = createAbsenceInput.userId
    a.type = createAbsenceInput.type
    a.startDate = createAbsenceInput.startDate
    a.endDate = createAbsenceInput.endDate
    a.dates = []

    // loop through all dates between start and end date and add them to dates array
    for (
      let currentDate = new Date(a.startDate);
      currentDate <= new Date(a.endDate);
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      a.dates.push(new Date(currentDate))
    }
    a.dates.push(new Date(a.endDate))
    a.totalDays = a.dates.length

    const newAbsence = await this.absenceRepository.save(a)

    // increment user absences
    await this.userService.incrementAbsencesCount(createAbsenceInput.userId)

    return newAbsence
  }

  async update(
    id: ObjectId,
    updateAbsenceInput: UpdateAbsenceInput,
  ): Promise<Absence> {
    const currentAbsence = await this.findOne(id.toString())

    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateAbsenceInput

    if (
      updatedData.startDate != currentAbsence.startDate ||
      updatedData.endDate != currentAbsence.endDate
    ) {
      updatedData.dates = []
      // loop through all dates between start and end date and add them to dates array
      for (
        let currentDate = new Date(updatedData.startDate);
        currentDate <= new Date(updatedData.endDate);
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        updatedData.dates.push(new Date(currentDate))
      }
      updatedData.dates.push(new Date(updatedData.endDate))
      updatedData.totalDays = updatedData.dates.length
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
