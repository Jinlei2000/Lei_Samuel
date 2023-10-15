import { Injectable } from '@nestjs/common'
import { CreateAbsenceInput } from './dto/create-absence.input'
import { UpdateAbsenceInput } from './dto/update-absence.input'
import { Absence } from './entities/absence.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GraphQLError } from 'graphql'

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

  async findOne(id: string): Promise<Absence> {
    const location = await this.absenceRepository.findOne({
      // @ts-ignore
      _id: new ObjectId(id),
    })

    if (!location) {
      throw new GraphQLError('Location not found!')
    }

    return location
  }

  create(createAbsenceInput: CreateAbsenceInput) {
    return 'This action adds a new absence'
  }

  update(id: number, updateAbsenceInput: UpdateAbsenceInput) {
    return `This action updates a #${id} absence`
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id)

    await this.absenceRepository.delete(id)

    // return id if delete was successful
    return id
  }

  // TODO: find all users that is a absent on a specific date (return array of users id's)

  // TODO resolve field for personId
}
