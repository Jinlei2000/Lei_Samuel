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

  update(id: number, updateMaterialInput: UpdateMaterialInput) {
    throw new Error('Method not implemented.')
  }

  remove(id: number) {
    throw new Error('Method not implemented.')
  }
}
