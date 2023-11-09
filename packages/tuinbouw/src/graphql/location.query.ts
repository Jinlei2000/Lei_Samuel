import gql from 'graphql-tag'

export const GET_LOCATIONS_BY_USERID = gql`
  query getLocationsByUserId($userId: String!) {
    locationsByUserId(userId: $userId) {
      id
      userId
      address
      lat
      lng
      createdAt
      updatedAt
    }
  }
`
