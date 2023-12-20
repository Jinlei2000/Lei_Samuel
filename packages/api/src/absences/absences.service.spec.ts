import { Test, TestingModule } from '@nestjs/testing'
import { AbsencesService } from './absences.service'
import { Absence } from './entities/absence.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UsersService } from 'src/users/users.service'
import { SchedulesService } from 'src/schedules/schedules.service'
import { CreateAbsenceInput } from './dto/create-absence.input'
import { absenceStub, createabsenceInputStub } from './stubs/absences.stub'
import { userEmployeeStub } from 'src/users/stubs/users.stub'
import { scheduleStub } from 'src/schedules/stubs/schedules.stub'

describe('AbsencesService', () => {
  let service: AbsencesService
  let mockAbsencesRepository: Repository<Absence>
  let mockUsersService: UsersService
  let mockSchedulesService: SchedulesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbsencesService,
        {
          provide: getRepositoryToken(Absence),
          useValue: {
            save: jest.fn().mockResolvedValue(absenceStub()),
            find: jest.fn().mockResolvedValue([absenceStub()]),
            findOne: jest.fn().mockResolvedValue(absenceStub()),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEmployeeStub()),
            incrementAbsencesCount: jest
              .fn()
              .mockResolvedValue(userEmployeeStub()),
          },
        },
        {
          provide: SchedulesService,
          useValue: {
            updateAllByEmployeeWithDateRange: jest
              .fn()
              .mockResolvedValue(scheduleStub()),
          },
        },
      ],
    }).compile()

    service = module.get<AbsencesService>(AbsencesService)
    mockAbsencesRepository = module.get<Repository<Absence>>(
      getRepositoryToken(Absence),
    )
    mockUsersService = module.get<UsersService>(UsersService)
    mockSchedulesService = module.get<SchedulesService>(SchedulesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    let absenceTestInput: CreateAbsenceInput
    let absenceResult: Absence

    beforeEach(async () => {
      // set mockAbsencesRepository.find to return an empty array
      // so that the absence can be created without any errors
      jest.spyOn(mockAbsencesRepository, 'find').mockResolvedValueOnce([])

      absenceTestInput = createabsenceInputStub()
      absenceResult = await service.create(absenceTestInput)
    })

    describe('when create is called', () => {
      it('should call absenceRepository.save one time', async () => {
        const saveSPy = jest.spyOn(mockAbsencesRepository, 'save')
        expect(saveSPy).toHaveBeenCalledTimes(1)
      })

      it('should call absenceRepository.save with the correct parameters', async () => {
        const saveSPy = jest.spyOn(mockAbsencesRepository, 'save')
        const myInput: Partial<Absence> = createabsenceInputStub()
        myInput.totalDays = 2
        expect(saveSPy).toHaveBeenCalledWith(myInput)
      })

      it('should return the created absence', async () => {
        expect(absenceResult).toEqual(absenceStub())
      })

      it('should call userService.findOne with the correct parameters', async () => {
        const findOneSpy = jest.spyOn(mockUsersService, 'findOne')
        expect(findOneSpy).toHaveBeenCalledWith(absenceTestInput.userId)
      })

      it('should call userService.incrementAbsencesCount with the correct parameters', async () => {
        const incrementAbsencesCountSpy = jest.spyOn(
          mockUsersService,
          'incrementAbsencesCount',
        )
        expect(incrementAbsencesCountSpy).toHaveBeenCalledWith(
          absenceTestInput.userId,
        )
      })

      it('should call scheduleService.updateAllByEmployeeWithDateRange with the correct parameters', async () => {
        const updateAllByEmployeeWithDateRangeSpy = jest.spyOn(
          mockSchedulesService,
          'updateAllByEmployeeWithDateRange',
        )
        expect(updateAllByEmployeeWithDateRangeSpy).toHaveBeenCalledWith(
          userEmployeeStub(),
          new Date(absenceTestInput.startDate),
          new Date(absenceTestInput.endDate),
        )
      })

      // ERROR
      it('should throw an error if absence type is not valid', async () => {
        absenceTestInput.type = 'invalid'
        const result = service.create(absenceTestInput)
        await expect(result).rejects.toThrow(
          'Type not found! Type must be sick, vacation or other',
        )
      })

      it('should throw an error if user already has an absence on the same date', async () => {
        const findSpy = jest.spyOn(mockAbsencesRepository, 'find')
        findSpy.mockResolvedValueOnce([absenceStub()])
        const result = service.create(absenceTestInput)
        await expect(result).rejects.toThrow(
          'User already has an absence on the same date!',
        )
      })
    })
  })

  describe('findAll', () => {
    let absenceResult: Absence[]

    beforeEach(async () => {
      absenceResult = await service.findAll()
    })

    describe('when findAll is called', () => {
      it('should call absenceRepository.find one time', async () => {
        const findSpy = jest.spyOn(mockAbsencesRepository, 'find')
        expect(findSpy).toHaveBeenCalledTimes(1)
      })

      it('should return an array of absences', async () => {
        expect(absenceResult).toEqual([absenceStub()])
      })

      // VALID FILTERS (S, V, O)
      it('should return an array of absences filtered by absence type', async () => {
        const filters = ['s', 'v', 'o']
        const result = await service.findAll(filters)
        expect(result).toEqual([absenceStub()])
      })

      // ERROR
      it('should throw an error if absence type is not valid', async () => {
        const filters = ['invalid']
        const result = service.findAll(filters)
        console.log(result)
        // ALL UPPER CASE FILTERS
        await expect(result).rejects.toThrow(
          `Invalid filter in filters = [${filters.map(f =>
            f.toUpperCase(),
          )}]! Supported filters are: S = Sick, V = Vacation, O = Other`,
        )
      })
    })
  })

  describe('findOne', () => {
    let absenceResult: Absence

    beforeEach(async () => {
      absenceResult = await service.findOne('5f9d4a3f9d6c6a1d9c9bce1a')
    })

    describe('when findOne is called', () => {
      it('should call absenceRepository.findOne one time', async () => {
        const findOneSpy = jest.spyOn(mockAbsencesRepository, 'findOne')
        expect(findOneSpy).toHaveBeenCalledTimes(1)
      })

      it('should return an absence', async () => {
        expect(absenceResult).toEqual(absenceStub())
      })

      it('should throw an error if absence is not found', async () => {
        try {
          // invalid id
          await service.findOne('111111111111111111111111')
        } catch (e) {
          expect(e.message).toEqual('Absence not found!')
        }
      })
    })
  })

  describe('findAllByUserId', () => {
    let absenceResult: Absence[]

    beforeEach(async () => {
      absenceResult = await service.findAllByUserId('5f9d4a3f9d6c6a1d9c9bce1a')
    })

    describe('when findAllByUserId is called', () => {
      it('should call absenceRepository.find one time', async () => {
        const findSpy = jest.spyOn(mockAbsencesRepository, 'find')
        expect(findSpy).toHaveBeenCalledTimes(1)
      })

      it('should return an array of absences', async () => {
        expect(absenceResult).toEqual([absenceStub()])
      })
    })
  })
})
