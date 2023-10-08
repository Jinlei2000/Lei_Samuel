import { Injectable } from '@nestjs/common';
import { CreateStaffInput } from './dto/create-staff.input';
import { UpdateStaffInput } from './dto/update-staff.input';

@Injectable()
export class StaffsService {
  create(createStaffInput: CreateStaffInput) {
    return 'This action adds a new staff';
  }

  findAll() {
    return `This action returns all staffs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staff`;
  }

  update(id: number, updateStaffInput: UpdateStaffInput) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
