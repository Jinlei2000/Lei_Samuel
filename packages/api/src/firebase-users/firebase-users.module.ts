import { Module } from '@nestjs/common';
import { FirebaseUsersService } from './firebase-users.service';
import { FirebaseUsersResolver } from './firebase-users.resolver';

@Module({
  providers: [FirebaseUsersResolver, FirebaseUsersService],
})
export class FirebaseUsersModule {}
