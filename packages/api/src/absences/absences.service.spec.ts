import { Test, TestingModule } from '@nestjs/testing'
import { AbsencesService } from './absences.service'
import { Absence } from './entities/absence.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UsersService } from 'src/users/users.service'
import { SchedulesService } from 'src/schedules/schedules.service'
import { CreateAbsenceInput } from './dto/create-absence.input'
import { absenceStub, createabsenceInputStub } from './stubs/absences.stub'
import { UsersModule } from 'src/users/users.module'
import { SchedulesModule } from 'src/schedules/schedules.module'

describe('AbsencesService', () => {
  let absencesService: AbsencesService
  let mockAbsencesService: Repository<Absence>

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
      ],
    }).compile()

    absencesService = module.get<AbsencesService>(AbsencesService)
    mockAbsencesService = module.get<Repository<Absence>>(
      getRepositoryToken(Absence),
    )
  })

  it('should be defined', () => {
    expect(absencesService).toBeDefined()
  })

  // describe('create', () => {
  //   describe('when create is called', () => {
  //     it('should call absenceRepository.create one time', async () => {
  //       const absenceTest = new Absence()
  //       const saveSPy = jest.spyOn(mockAbsencesService, 'save')
  //       await service.create(absenceTest)
  //       expect(saveSPy).toBeCalledTimes(1)
  //     })

  //     it('should call absenceRepository.save with the correct parameters', async () => {
  //       const absenceTest: CreateAbsenceInput = createabsenceInputStub()
  //       const saveSPy = jest.spyOn(mockAbsencesService, 'save')

  //       await service.create(absenceTest)

  //       expect(saveSPy).toBeCalledWith(absenceTest)
  //     })

  //     it('should return the created absence', async () => {
  //       const absenceTestInput = createabsenceInputStub()
  //       const absenceOutput = absenceStub()

  //       const r = await service.create(absenceTestInput)
  //       expect(r).toEqual(absenceOutput)
  //     })
  //   })
  // })
})
