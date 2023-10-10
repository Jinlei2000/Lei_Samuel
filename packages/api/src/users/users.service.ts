import { Injectable, UseGuards } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(FirebaseGuard)
  create(createUserInput: CreateUserInput) {
    return new Error('This action adds a new user');
  }

  findAll() {
    return new Error(`This action returns all users`);
  }

  findOne(id: string) {
    return new Error(`This action returns a #${id} user`);
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return new Error(`This action updates a #${id} user`);
  }

  remove(id: string) {
    return new Error(`This action removes a #${id} user`);
  }
}
