import { Injectable } from '@nestjs/common';
import { CreateAbsenceInput } from './dto/create-absence.input';
import { UpdateAbsenceInput } from './dto/update-absence.input';

@Injectable()
export class AbsencesService {
  create(createAbsenceInput: CreateAbsenceInput) {
    return 'This action adds a new absence';
  }

  findAll() {
    return `This action returns all absences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} absence`;
  }

  update(id: number, updateAbsenceInput: UpdateAbsenceInput) {
    return `This action updates a #${id} absence`;
  }

  remove(id: number) {
    return `This action removes a #${id} absence`;
  }
}
