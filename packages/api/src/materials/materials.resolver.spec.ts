import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsResolver } from './materials.resolver';
import { MaterialsService } from './materials.service';

describe('MaterialsResolver', () => {
  let resolver: MaterialsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialsResolver, MaterialsService],
    }).compile();

    resolver = module.get<MaterialsResolver>(MaterialsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
