import gql from 'graphql-tag'

export const GET_MATERIALS = gql`
  query getMaterials {
    getMaterials {
      id
      name
      isAvailable
      personId
      isDefect
      serialNumber
      createdAt
      updatedAt
    }
  }
`
