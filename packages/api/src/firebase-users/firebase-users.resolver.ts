import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FirebaseUsersService } from './firebase-users.service';
import { FirebaseUser } from './entities/firebase-user.entity';
import { CreateFirebaseUserInput } from './dto/create-firebase-user.input';
import { UpdateFirebaseUserInput } from './dto/update-firebase-user.input';

@Resolver(() => FirebaseUser)
export class FirebaseUsersResolver {
  constructor(private readonly firebaseUsersService: FirebaseUsersService) {}

  @Mutation(() => FirebaseUser)
  createFirebaseUser(@Args('createFirebaseUserInput') createFirebaseUserInput: CreateFirebaseUserInput) {
    return this.firebaseUsersService.create(createFirebaseUserInput);
  }

  @Query(() => [FirebaseUser], { name: 'firebaseUsers' })
  findAll() {
    return this.firebaseUsersService.findAll();
  }

  @Query(() => FirebaseUser, { name: 'firebaseUser' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.firebaseUsersService.findOne(id);
  }

  @Mutation(() => FirebaseUser)
  updateFirebaseUser(@Args('updateFirebaseUserInput') updateFirebaseUserInput: UpdateFirebaseUserInput) {
    return this.firebaseUsersService.update(updateFirebaseUserInput.id, updateFirebaseUserInput);
  }

  @Mutation(() => FirebaseUser)
  removeFirebaseUser(@Args('id', { type: () => Int }) id: number) {
    return this.firebaseUsersService.remove(id);
  }
}
