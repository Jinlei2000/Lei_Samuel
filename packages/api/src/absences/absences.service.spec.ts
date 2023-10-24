import { Test, TestingModule } from '@nestjs/testing';
import { AbsencesService } from './absences.service';
import { UsersModule } from 'src/users/users.module';

describe('AbsencesService', () => {
  let service: AbsencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbsencesService],
    }).compile()

    service = module.get<AbsencesService>(AbsencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
