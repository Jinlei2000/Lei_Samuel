import { Test, TestingModule } from '@nestjs/testing'
import { MaterialsService } from './materials.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Material } from './entities/material.entity'
import { CreateMaterialInput } from './dto/create-material.input'
import { materialStub, createMaterialInputStub } from './stubs/materials.stub'

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
            save: jest.fn().mockResolvedValue(materialStub()),
            find: jest.fn().mockResolvedValue([materialStub()]),
            findOne: jest.fn().mockResolvedValue(materialStub()),
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

      materialTestInput = createMaterialInputStub()
      materialResult = await service.create(materialTestInput)
    })

    describe('when create material', () => {
      it('should call materialRepository.save one time', async () => {
        const saveSpy = jest.spyOn(mockMaterialsRepository, 'save')
        expect(saveSpy).toHaveBeenCalledTimes(1)
      })

      it('should call materialRepository.save with correct params', async () => {
        const saveSpy = jest.spyOn(mockMaterialsRepository, 'save')
        const myInput: Partial<Material> = createMaterialInputStub()
        expect(saveSpy).toHaveBeenCalledWith(myInput)
      })

      it('should return material', async () => {
        expect(materialResult).toEqual(materialStub())
      })

      // ERRORS
      it('should throw an error if material name is too short', async () => {
        materialTestInput.name = ''
        console.log('test', materialTestInput)
        const result = service.create(materialTestInput)
        console.log(result)
        await expect(result).rejects.toThrow('Material name cannot be empty!')
      })
    })
  })

  describe('findAll', () => {
    let materialsResult: Material[]

    beforeEach(async () => {
      materialsResult = await service.findAll()
    })

    describe('when findAll is called', () => {
      it('should call materialRepository.find one time', async () => {
        const findSpy = jest.spyOn(mockMaterialsRepository, 'find')
        expect(findSpy).toHaveBeenCalledTimes(1)
      })

      it('should return an array of materials', async () => {
        expect(materialsResult).toEqual([materialStub()])
      })

      it('should return an array of materials filtered by material type', async () => {
        const filters = ['l', 'a']
        const result = await service.findAll(filters)
        expect(result).toEqual([materialStub()])
      })

      it('should throw an error if material type is not valid', async () => {
        const filters = ['invalid']
        const result = service.findAll(filters)

        await expect(result).rejects.toThrow(
          `Invalid filter in filters = [${filters.map(f =>
            f.toUpperCase(),
          )}]! Supported filters are: A = Available, NA = Not Available, L = Loanable, NL = Not Loanable`,
        )
      })
    })
  })

  describe('findOne', () => {
    let materialResult: Material

    beforeEach(async () => {
      materialResult = await service.findOne('5f9d4a3f9d6c6a1d9c9bce1a')
    })

    describe('when findOne is called', () => {
      it('should call materialRepository.findOne one time', async () => {
        const findOneSpy = jest.spyOn(mockMaterialsRepository, 'findOne')
        expect(findOneSpy).toHaveBeenCalledTimes(1)
      })

      it('should return a material', async () => {
        expect(materialResult).toEqual(materialStub())
      })

      it('should throw an error if material is not found', async () => {
        try {
          // invalid id
          await service.findOne('111111111111111111111111')
        } catch (e) {
          expect(e.message).toEqual('Material not found!')
        }
      })
    })
  })

  describe('findAllByUserId', () => {
    let materialResult: Material[]

    beforeEach(async () => {
      materialResult = await service.findAllByUserId('5f9d4a3f9d6c6a1d9c9bce1a')
    })

    describe('when findAllByUserId is called', () => {
      it('should call materialRepository.find one time', async () => {
        const findSpy = jest.spyOn(mockMaterialsRepository, 'find')
        expect(findSpy).toHaveBeenCalledTimes(1)
      })

      it('should return an array of materials', async () => {
        expect(materialResult).toEqual([materialStub()])
      })
    })
  })

  describe('findAllByIds', () => {
    let materialResult: Material[]

    beforeEach(async () => {
      materialResult = await service.findAllByIds(['5f9d4a3f9d6c6a1d9c9bce1a'])
    })

    describe('when findAllByIds is called', () => {
      it('should call materialRepository.findOne one time', async () => {
        const findOneSpy = jest.spyOn(mockMaterialsRepository, 'findOne')
        expect(findOneSpy).toHaveBeenCalledTimes(1)
      })

      it('should return an array of materials', async () => {
        expect(materialResult).toEqual([materialStub()])
      })

      it('should throw an error if material is not found', async () => {
        try {
          // invalid id
          await service.findAllByIds(['111111111111111111111111'])
        } catch (e) {
          expect(e.message).toEqual('Material not found!')
        }
      })
    })
  })
})
