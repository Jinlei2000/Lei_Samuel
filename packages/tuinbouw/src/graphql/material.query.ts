import gql from 'graphql-tag'

export const GET_MATERIALS = gql`
  query materials {
    id
    name
    isAvailable
    personId
    isDefect
    serialNumber
    createdAt
    updatedAt
  }
`
