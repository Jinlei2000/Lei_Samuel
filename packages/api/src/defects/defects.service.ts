import { Injectable } from '@nestjs/common'
import { CreateDefectInput } from './dto/create-defect.input'
import { UpdateDefectInput } from './dto/update-defect.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Defect } from './entities/defect.entity'
import { ObjectId } from 'mongodb'
import { GraphQLError } from 'graphql'
import { OrderByInput } from '../interfaces/order.input'
// TODO
import { filterDefects } from '../helpers/defectsFunctions'

@Injectable()
export class DefectsService {
  constructor(
    @InjectRepository(Defect)
    private readonly defectRepository: Repository<Defect>,
  ) {}

  findAll(filters?: Array<string>, order?: OrderByInput): Promise<Defect[]> {
    // filter and order defects
    const whereQuery = filterDefects(filters)
    const orderQuery = orderDefects(order)

    const defects = this.defectRepository.find({
      where: {
        ...whereQuery,
      },
      order: {
        ...orderQuery,
      },
    })

    return defects
  }

  async findAllByPersonId(
    personId: string,
    filters?: Array<string>,
    order?: OrderByInput,
  ): Promise<Defect[]> {
    // filter and order defects
    const whereQuery = filterDefects(filters)
    const orderQuery = orderDefects(order)

    const defects = await this.defectRepository.find({
      where: {
        personId: personId,
        ...whereQuery,
      },
      order: {
        ...orderQuery,
      },
    })

    return defects
  }

  async findOne(id: string): Promise<Defect | GraphQLError> {
    const defect = await this.defectRepository.findOne({
      // @ts-ignore
      _id: new ObjectId(id),
    })

    if (!defect) {
      throw new GraphQLError('Defect not found!')
    }

    return defect
  }

  findDefectsBySearchString(searchString: string): Promise<Defect[]> {
    searchString = searchString.toLowerCase()

    const defects = this.defectRepository.find({
      // @ts-ignore
      name: { $regex: new RegExp(searchString, 'i') },
    })

    return defects
  }

  create(createDefectInput: CreateDefectInput): Promise<Defect> {
    const m = new Defect()
    m.description = createDefectInput.name
    m.status = createDefectInput.status
    m.personId = createDefectInput.personId
    m.material = createDefectInput.material

    return this.defectRepository.save(m)
  }

  async update(
    id: ObjectId,
    updateDefectInput: UpdateDefectInput,
  ): Promise<Defect | GraphQLError> {
    await this.findOne(id.toString())

    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateDefectInput

    await this.defectRepository.update(id, updatedData)

    return this.findOne(id.toString())
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id)

    await this.defectRepository.delete(id)

    // return id if delete was successful
    return id
  }

  // Seeding functions
  saveAll(defects: Defect[]): Promise<Defect[]> {
    return this.defectRepository.save(defects)
  }

  truncate(): Promise<void> {
    return this.defectRepository.clear()
  }
}
