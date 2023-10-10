import { Test, TestingModule } from '@nestjs/testing'
import { DefectsResolver } from './defects.resolver'
import { DefectsService } from './defects.service'

describe('DefectsResolver', () => {
  let resolver: DefectsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefectsResolver, DefectsService],
    }).compile()

    resolver = module.get<DefectsResolver>(DefectsResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
