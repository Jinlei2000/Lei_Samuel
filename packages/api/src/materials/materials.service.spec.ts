import { Test, TestingModule } from '@nestjs/testing'
import { MaterialsService } from './materials.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Material } from './entities/material.entity'
import { CreateMaterialInput } from './dto/create-material.input'

describe('MaterialsService', () => {
  let service: MaterialsService
  let mockMaterialsRepository: Repository<Material>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialsService,
        {
          provide: getRepositoryToken(Material),
          useValue: {
            save: jest.fn().mockResolvedValue(new Material()),
            find: jest.fn().mockResolvedValue([new Material()]),
            findOne: jest.fn().mockResolvedValue(new Material()),
          },
        },
      ],
    }).compile()

    service = module.get<MaterialsService>(MaterialsService)
    mockMaterialsRepository = module.get<Repository<Material>>(
      getRepositoryToken(Material),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    let materialTestInput: CreateMaterialInput
    let materialResult: Material

    beforeEach(async () => {
      jest.spyOn(mockMaterialsRepository, 'find').mockResolvedValueOnce([])

      materialTestInput = new CreateMaterialInputStub()
      materialResult = await service.create(materialTestInput)
    })
  })
})
