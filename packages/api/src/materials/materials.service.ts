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
    let where: { [key: string]: string | boolean } = {
      personId: personId,
    }

    if (!filters.every(filter => ['A', 'NA', 'D', 'ND'].includes(filter))) {
      throw new GraphQLError(
        `Invalid filter in filters = [${filters}]! Supported filters are: A = Available, NA = Not Available, D = Defect, ND = Not Defect`,
      )
    }

    if (filters?.includes('A') && filters?.includes('NA')) {
      throw new GraphQLError(
        'Cannot filter for A and NA at the same time! A = Available, NA = Not Available',
      )
    }
    if (filters?.includes('A')) {
      where.isAvailable = true
    } else if (filters?.includes('NA')) {
      where.isAvailable = false
    }

    if (filters?.includes('D') && filters?.includes('ND')) {
      throw new GraphQLError(
        'Cannot filter for D and ND at the same time! D = Defect, ND = Not Defect',
      )
    }
    if (filters?.includes('D')) {
      where.isDefect = true
    } else if (filters?.includes('ND')) {
      where.isDefect = false
    }

    const materials = await this.materialRepository.find({
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
