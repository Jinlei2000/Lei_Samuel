import { Injectable } from '@nestjs/common'
import { CreateMaterialInput } from './dto/create-material.input'
import { UpdateMaterialInput } from './dto/update-material.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Material } from './entities/material.entity'
import { ObjectId } from 'mongodb'

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  create(createMaterialInput: CreateMaterialInput) {
    const m = new Material()
    m.name = createMaterialInput.name
    m.isAvailable = createMaterialInput.isAvailable
    m.personId = createMaterialInput.personId
    m.isDefect = false
    m.serialNumber = createMaterialInput.serialNumber

    return this.materialRepository.save(m)
  }

  findAll() {
    return this.materialRepository.find()
  }

  findOne(id: string) {
    // @ts-ignore
    return this.materialRepository.findOne({ _id: new ObjectId(id) })
  }

  async update(id: ObjectId, updateMaterialInput: UpdateMaterialInput) {
    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateMaterialInput

    // @ts-ignore
    await this.materialRepository.update({ _id: new ObjectId(id) }, updatedData)

    return this.findOne(id.toString())
  }

  // TODO: What to return here? if delete was successful, return null?
  async remove(id: string) {
    const result = await this.materialRepository.delete({
      // @ts-ignore
      _id: new ObjectId(id),
    })

    // return null if the material was successfully deleted
    return null
  }
}
