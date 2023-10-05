import { Injectable } from '@nestjs/common'
import { CreateMaterialInput } from './dto/create-material.input'
import { UpdateMaterialInput } from './dto/update-material.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Material } from './entities/material.entity'
import { ObjectId } from 'mongodb'
import { GraphQLError } from 'graphql'
import { OrderByInput } from './dto/order.input'
import { filterMaterials, orderMaterials } from '../helpers/materialsFunctions'

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  findAll(): Promise<Material[]> {
    return this.materialRepository.find()
  }

  async findAllByPersonId(
    personId: string,
    filters?: Array<string>,
    order?: OrderByInput,
  ): Promise<Material[]> {
    // Use uppercase for filters and direction
    filters = filters?.map(filter => filter.toUpperCase())
    order.direction = order.direction.toUpperCase()

    // where object for query
    const whereQuery: { [key: string]: string | boolean } = {}
    const filtersList = ['A', 'NA', 'D', 'ND']

    // order object for query
    const { field, direction } = order || {
      field: 'createdAt',
      direction: 'ASC',
    }
    const orderQuery = { [field]: direction }
    const orderFieldsList = ['name', 'createdAt', 'updatedAt']
    const orderDirectionsList = ['ASC', 'DESC']

    // check if filters are valid
    if (filters) {
      // check if all filters are valid (A, NA, D, ND)
      if (!filters?.every(filter => filtersList.includes(filter))) {
        throw new GraphQLError(
          `Invalid filter in filters = [${filters}]! Supported filters are: A = Available, NA = Not Available, D = Defect, ND = Not Defect`,
        )
      }

      // not available and not available cannot be used at the same time
      if (filters?.includes('A') && filters?.includes('NA')) {
        throw new GraphQLError(
          'Cannot filter for A and NA at the same time! A = Available, NA = Not Available',
        )
      }

      // defect and not defect cannot be used at the same time
      if (filters?.includes('D') && filters?.includes('ND')) {
        throw new GraphQLError(
          'Cannot filter for D and ND at the same time! D = Defect, ND = Not Defect',
        )
      }

      // set whereQuery depending on filters
      if (filters?.includes('A')) {
        whereQuery.isAvailable = true
      } else if (filters?.includes('NA')) {
        whereQuery.isAvailable = false
      }
      if (filters?.includes('D')) {
        whereQuery.isDefect = true
      } else if (filters?.includes('ND')) {
        whereQuery.isDefect = false
      }
    }

    // check if order is valid
    if (order) {
      // check field
      if (!orderFieldsList.includes(field)) {
        throw new GraphQLError(
          `Invalid field in order = ${field}! Supported fields are: ${orderFieldsList}`,
        )
      }
      // check direction
      if (!orderDirectionsList.includes(direction)) {
        throw new GraphQLError(
          `Invalid direction in order = ${direction}! Supported directions are: ${orderDirectionsList}`,
        )
      }
    }

    const materials = await this.materialRepository.find({
      where: {
        personId: personId,
        ...whereQuery,
      },
      order: {
        ...orderQuery,
      },
    })

    return materials
  }

  async findOne(id: string): Promise<Material | GraphQLError> {
    const material = await this.materialRepository.findOne({
      // @ts-ignore
      _id: new ObjectId(id),
    })

    if (!material) {
      throw new GraphQLError('Material not found!')
    }

    // @ts-ignore
    return material
  }

  create(createMaterialInput: CreateMaterialInput): Promise<Material> {
    const m = new Material()
    m.name = createMaterialInput.name
    m.isAvailable = createMaterialInput.isAvailable
    m.personId = createMaterialInput.personId
    m.isDefect = false
    m.serialNumber = createMaterialInput.serialNumber

    return this.materialRepository.save(m)
  }

  async update(
    id: ObjectId,
    updateMaterialInput: UpdateMaterialInput,
  ): Promise<Material | GraphQLError> {
    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateMaterialInput

    await this.materialRepository.update(id, updatedData)

    return this.findOne(id.toString())
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id)

    await this.materialRepository.delete(id)

    // return id if delete was successful
    return id
  }

  // Seeding functions
  saveAll(materials: Material[]): Promise<Material[]> {
    return this.materialRepository.save(materials)
  }

  truncate(): Promise<void> {
    return this.materialRepository.clear()
  }
}
