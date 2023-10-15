import { Injectable } from '@nestjs/common'
import { CreateAbsenceInput } from './dto/create-absence.input'
import { UpdateAbsenceInput } from './dto/update-absence.input'
import { Absence } from './entities/absence.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(Absence)
    private readonly absenceRepository: Repository<Absence>,
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

  // TODO: find all users that is a absent on a specific date (return array of users id's)
  async findAllUserByDate(date: Date): Promise<Absence[]> {
    return []
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
    const a = new Absence()
    a.discription = createAbsenceInput.discription
    a.userId = createAbsenceInput.userId
    if (!['sick', 'vacation', 'other'].includes(createAbsenceInput.type))
      throw new GraphQLError(
        'Type not found! Type must be sick, vacation or other',
      )
    a.type = createAbsenceInput.type
    a.startDate = createAbsenceInput.startDate
    a.endDate = createAbsenceInput.endDate
    a.totalDays =
      new Date(createAbsenceInput.endDate).getDate() -
      new Date(createAbsenceInput.startDate).getDate() +
      1

    return this.absenceRepository.save(a)
  }

  async update(
    id: ObjectId,
    updateAbsenceInput: UpdateAbsenceInput,
  ): Promise<Absence> {
    await this.findOne(id.toString())

    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateAbsenceInput

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
