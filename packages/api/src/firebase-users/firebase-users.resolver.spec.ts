import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseUsersResolver } from './firebase-users.resolver';
import { FirebaseUsersService } from './firebase-users.service';

describe('FirebaseUsersResolver', () => {
  let resolver: FirebaseUsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseUsersResolver, FirebaseUsersService],
    }).compile();

    resolver = module.get<FirebaseUsersResolver>(FirebaseUsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
