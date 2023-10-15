import { Injectable } from '@nestjs/common'
import { CreateMaterialInput } from './dto/create-material.input'
import { UpdateMaterialInput } from './dto/update-material.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Material } from './entities/material.entity'
import { ObjectId } from 'mongodb'
import { GraphQLError } from 'graphql'
import { OrderByInput } from '../interfaces/order.input'
import { filterMaterials, orderMaterials } from '../helpers/materialsFunctions'

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  findAll(filters?: Array<string>, order?: OrderByInput): Promise<Material[]> {
    // filter and order materials
    const whereQuery = filterMaterials(filters)
    const orderQuery = orderMaterials(order)

    const materials = this.materialRepository.find({
      where: {
        ...whereQuery,
      },
      order: {
        ...orderQuery,
      },
    })

    return materials
  }

  async findAllByPersonId(
    personId: string,
    filters?: Array<string>,
    order?: OrderByInput,
  ): Promise<Material[]> {
    // filter and order materials
    const whereQuery = filterMaterials(filters)
    const orderQuery = orderMaterials(order)

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

    return material
  }

  findMaterialsBySearchString(searchString: string): Promise<Material[]> {
    searchString = searchString.toLowerCase()

    const materials = this.materialRepository.find({
      // @ts-ignore
      name: { $regex: new RegExp(searchString, 'i') },
    })

    return materials
  }

  create(createMaterialInput: CreateMaterialInput): Promise<Material> {
    const m = new Material()
    m.name = createMaterialInput.name.toLowerCase()
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
    await this.findOne(id.toString())

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

  // TODO resolve field of personId

  // Seeding functions
  saveAll(materials: Material[]): Promise<Material[]> {
    return this.materialRepository.save(materials)
  }

  truncate(): Promise<void> {
    return this.materialRepository.clear()
  }
}
