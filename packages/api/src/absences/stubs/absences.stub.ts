import { ObjectId } from 'mongodb'
import { CreateAbsenceInput } from '../dto/create-absence.input'
import { Absence } from '../entities/absence.entity'

export const createabsenceInputStub = (): CreateAbsenceInput => {
  const a = new CreateAbsenceInput()
  a.userId = '652e5989204b1d8ef65ed992'
  a.description = 'Example description'
  a.type = 'sick'
  a.startDate = new Date('2021-01-01')
  a.endDate = new Date('2021-01-02')
  return a
}

export const absenceStub = (): Absence => {
  const a = new Absence()
  a.id = new ObjectId('5f9d4a3f9d6c6a1d9c9bce1a')
  a.userId = '652e5989204b1d8ef65ed992'
  a.description = 'Example description'
  a.type = 'sick'
  a.startDate = new Date('2021-01-01')
  a.endDate = new Date('2021-01-02')
  a.totalDays = 2
  return a
}
