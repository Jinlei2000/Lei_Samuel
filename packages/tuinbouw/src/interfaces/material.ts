// TODO: change name of this file to material.interface.ts
export interface Material {
  id: string
  name: string
  isAvailable: boolean
  personId: string
  isDefect: boolean
  serialNumber: string
  createdAt: string
  updatedAt: string
}
