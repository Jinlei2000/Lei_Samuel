import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseUsersService } from './firebase-users.service';

describe('FirebaseUsersService', () => {
  let service: FirebaseUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseUsersService],
    }).compile();

    service = module.get<FirebaseUsersService>(FirebaseUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
