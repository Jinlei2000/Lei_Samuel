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

  findAll(
    filters?: Array<string>,
    order?: OrderByInput,
    searchString?: string,
  ): Promise<Material[]> {
    // filter and order materials
    const whereQuery = filterMaterials(filters)
    const orderQuery = orderMaterials(order)

    const materials = this.materialRepository.find({
      where: {
        ...whereQuery,
        // @ts-ignore
        name: { $regex: new RegExp(searchString, 'i') },
      },
      order: {
        ...orderQuery,
      },
    })

    return materials
  }

  async findAllByUserId(
    userId: string,
    filters?: Array<string>,
    order?: OrderByInput,
    searchString?: string,
  ): Promise<Material[]> {
    // filter and order materials
    const whereQuery = filterMaterials(filters)
    const orderQuery = orderMaterials(order)

    const materials = await this.materialRepository.find({
      where: {
        userId: userId,
        ...whereQuery,
        // @ts-ignore
        name: { $regex: new RegExp(searchString, 'i') },
      },
      order: {
        ...orderQuery,
      },
    })

    return materials
  }

  async findAllByIds(ids: string[]): Promise<Material[]> {
    const materials: Material[] = []
    for (const id of ids) {
      const material = await this.findOne(id)
      materials.push(material)
    }
    return materials
  }

  async findOne(id: string): Promise<Material> {
    const material = await this.materialRepository.findOne({
      // @ts-ignore
      _id: new ObjectId(id),
    })

    if (!material) {
      throw new GraphQLError('Material not found!')
    }

    return material
  }

  create(createMaterialInput: CreateMaterialInput): Promise<Material> {
    const m = new Material()
    m.name = createMaterialInput.name.toLowerCase()
    m.userId = createMaterialInput.userId
    m.isLoan = createMaterialInput.isLoan
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

  async updateAllByUserId(userId: string): Promise<Material[]> {
    const materials = await this.findAllByUserId(userId)

    for (const material of materials) {
      // @ts-ignore
      await this.update(material.id, { userId: null })
    }

    return materials
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
