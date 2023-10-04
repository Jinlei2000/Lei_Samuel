import { Injectable } from '@nestjs/common'
import { CreateMaterialInput } from './dto/create-material.input'
import { UpdateMaterialInput } from './dto/update-material.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Material } from './entities/material.entity'
import { ObjectId } from 'mongodb'
import { GraphQLError } from 'graphql'

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
    orderBy?: string,
  ): Promise<Material[]> {
    // const where = {
    //   isAvailable: filters?.includes('A')
    //     ? true
    //     : filters?.includes('NA')
    //     ? false
    //     : undefined,
    //   isDefect: filters?.includes('D') ? true : undefined,
    // }

    // const materials = await this.materialRepository.find({
    //   // @ts-ignore
    //   personId: personId,
    //   where: where,

    // })

    const filterMap = {
      A: { isAvailable: true },
      NA: { isAvailable: false },
      D: { isDefect: true },
    }

    const where = filters?.reduce((acc, filter) => {
      return { ...acc, ...filterMap[filter] }
    }, {})

    const materials = await this.materialRepository.find({
      // @ts-ignore
      personId,
      where,
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

  async remove(id: string): Promise<string | GraphQLError> {
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
