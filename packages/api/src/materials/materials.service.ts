import { Injectable } from '@nestjs/common';
import { CreateMaterialInput } from './dto/create-material.input';
import { UpdateMaterialInput } from './dto/update-material.input';

@Injectable()
export class MaterialsService {
  create(createMaterialInput: CreateMaterialInput) {
    return 'This action adds a new material';
  }

  findAll() {
    return `This action returns all materials`;
  }

  findOne(id: number) {
    return `This action returns a #${id} material`;
  }

  update(id: number, updateMaterialInput: UpdateMaterialInput) {
    return `This action updates a #${id} material`;
  }

  remove(id: number) {
    return `This action removes a #${id} material`;
  }
}
