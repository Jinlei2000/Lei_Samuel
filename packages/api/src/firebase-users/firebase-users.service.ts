import { Injectable } from '@nestjs/common';
import { CreateFirebaseUserInput } from './dto/create-firebase-user.input';
import { UpdateFirebaseUserInput } from './dto/update-firebase-user.input';

@Injectable()
export class FirebaseUsersService {
  create(createFirebaseUserInput: CreateFirebaseUserInput) {
    return 'This action adds a new firebaseUser';
  }

  findAll() {
    return `This action returns all firebaseUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} firebaseUser`;
  }

  update(id: number, updateFirebaseUserInput: UpdateFirebaseUserInput) {
    return `This action updates a #${id} firebaseUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} firebaseUser`;
  }
}
