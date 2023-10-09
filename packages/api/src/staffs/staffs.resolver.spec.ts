import { Test, TestingModule } from '@nestjs/testing';
import { StaffsResolver } from './staffs.resolver';
import { StaffsService } from './staffs.service';

describe('StaffsResolver', () => {
  let resolver: StaffsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffsResolver, StaffsService],
    }).compile();

    resolver = module.get<StaffsResolver>(StaffsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
