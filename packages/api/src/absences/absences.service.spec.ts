import { Test, TestingModule } from '@nestjs/testing'
import { AbsencesService } from './absences.service'
import { Absence } from './entities/absence.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UsersService } from 'src/users/users.service'
import { SchedulesService } from 'src/schedules/schedules.service'
import { CreateAbsenceInput } from './dto/create-absence.input'
import { absenceStub, createabsenceInputStub } from './stubs/absences.stub'
import { userStaffStub } from 'src/users/stubs/users.stub'
import { scheduleStub } from 'src/schedules/stubs/schedules.stub'

describe('AbsencesService', () => {
  let service: AbsencesService
  let mockAbsencesService: Repository<Absence>
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
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(userStaffStub()),
            incrementAbsencesCount: jest
              .fn()
              .mockResolvedValue(userStaffStub()),
          },
        },
        {
          provide: SchedulesService,
          useValue: {
            // TODO: use schedule stub
            updateAllByEmployeeWithDateRange: jest
              .fn()
              .mockResolvedValue(scheduleStub()),
          },
        },
      ],
    }).compile()

    service = module.get<AbsencesService>(AbsencesService)
    mockAbsencesService = module.get<Repository<Absence>>(
      getRepositoryToken(Absence),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    describe('when create is called', () => {
      it('should call absenceRepository.create one time', async () => {
        const absenceTest = new Absence()
        const saveSPy = jest.spyOn(mockAbsencesService, 'save')
        await service.create(absenceTest)
        expect(saveSPy).toBeCalledTimes(1)
      })

      it('should call absenceRepository.save with the correct parameters', async () => {
        const absenceTest: CreateAbsenceInput = createabsenceInputStub()
        const saveSPy = jest.spyOn(mockAbsencesService, 'save')

        await service.create(absenceTest)

        expect(saveSPy).toBeCalledWith(absenceTest)
      })

      it('should return the created absence', async () => {
        const absenceTestInput = createabsenceInputStub()
        const absenceOutput = absenceStub()

        const r = await service.create(absenceTestInput)
        expect(r).toEqual(absenceOutput)
      })
    })
  })
})
