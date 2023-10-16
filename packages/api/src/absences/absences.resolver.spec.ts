import { Test, TestingModule } from '@nestjs/testing';
import { AbsencesResolver } from './absences.resolver';
import { AbsencesService } from './absences.service';

describe('AbsencesResolver', () => {
  let resolver: AbsencesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbsencesResolver, AbsencesService],
    }).compile();

    resolver = module.get<AbsencesResolver>(AbsencesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
