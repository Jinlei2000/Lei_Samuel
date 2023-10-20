import gql from 'graphql-tag'

export const GET_MATERIALS = gql`
  query {
    materials {
      id
      name
      userId
      serialNumber
      createdAt
      updatedAt
    }
  }
`
