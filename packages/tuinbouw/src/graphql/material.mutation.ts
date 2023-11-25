import gql from 'graphql-tag'

export const DELETE_MATERIAL = gql`
  mutation removeMaterial($id: String!) {
    removeMaterial(id: $id)
  }
`

export const UPDATE_MATERIAL = gql`
  mutation updateMaterial($updateMaterialInput: UpdateMaterialInput!) {
    updateMaterial(updateMaterialInput: $updateMaterialInput) {
      id
      name
      isLoan
      user {
        id
        fullname
      }
      serialNumber
      createdAt
      updatedAt
    }
  }
`

export const CREATE_MATERIAL = gql`
  mutation createMaterial($createMaterialInput: CreateMaterialInput!) {
    createMaterial(createMaterialInput: $createMaterialInput) {
      id
      name
      isLoan
      user {
        id
        fullname
      }
      serialNumber
      createdAt
      updatedAt
    }
  }
`
