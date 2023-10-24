import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesResolver } from './schedules.resolver';
import { SchedulesService } from './schedules.service';

describe('SchedulesResolver', () => {
  let resolver: SchedulesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulesResolver, SchedulesService],
    }).compile();

    resolver = module.get<SchedulesResolver>(SchedulesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
