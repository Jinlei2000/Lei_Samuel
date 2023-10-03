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

  findAllByPersonId(personId: string): Promise<Material[]> {
    return this.materialRepository.find(
      // @ts-ignore
      { personId: personId },
    )
  }

  findOne(id: string): Promise<Material> {
    // @ts-ignore
    return this.materialRepository.findOne({ _id: new ObjectId(id) })
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
  ): Promise<Material> {
    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateMaterialInput

    await this.materialRepository.update(id, updatedData)

    return this.findOne(id.toString())
  }

  // TODO: What to return here? if delete was successful, return null?
  remove(id: string): Promise<string> {
    const materialFounded = this.findOne(id)
    console.log('materialFounded', materialFounded)
    if (!materialFounded) {
      new GraphQLError('Material dont exist!')
    }

    // this.materialRepository.delete(id)

    // return id if delete was successful
    return Promise.resolve(id)
  }

  // Seeding functions
  saveAll(materials: Material[]): Promise<Material[]> {
    return this.materialRepository.save(materials)
  }

  truncate(): Promise<void> {
    return this.materialRepository.clear()
  }
}
