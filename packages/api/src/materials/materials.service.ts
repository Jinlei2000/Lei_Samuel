import { Injectable } from '@nestjs/common'
import { CreateMaterialInput } from './dto/create-material.input'
import { UpdateMaterialInput } from './dto/update-material.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Material } from './entities/material.entity'

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  create(createMaterialInput: CreateMaterialInput) {
    throw new Error('Method not implemented.')
  }

  findAll() {
    return this.materialRepository.find()
  }

  findOne(id: number) {
    throw new Error('Method not implemented.')
  }

  update(id: number, updateMaterialInput: UpdateMaterialInput) {
    throw new Error('Method not implemented.')
  }

  remove(id: number) {
    throw new Error('Method not implemented.')
  }
}
