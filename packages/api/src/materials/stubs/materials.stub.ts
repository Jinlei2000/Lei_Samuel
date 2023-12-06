import { ObjectId } from 'mongodb'
import { CreateMaterialInput } from '../dto/create-material.input'
import { Material } from '../entities/material.entity'

export const createMaterialInputStub = (): CreateMaterialInput => {
  const m = new CreateMaterialInput()
  m.name = 'Example name'
  m.isLoan = true
  m.serialNumber = 123456789
  m.userId = '652e5989204b1d8ef65ed992'
  return m
}

export const materialStub = (): Material => {
  const m = new Material()
  m.id = new ObjectId('5f9d4a3f9d6c6a1d9c9bce1a')
  m.name = 'Example name'
  m.isLoan = true
  m.serialNumber = 123456789
  m.userId = '652e5989204b1d8ef65ed992'
  return m
}
