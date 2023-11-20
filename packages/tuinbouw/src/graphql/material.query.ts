import gql from 'graphql-tag'

export const GET_MATERIALS = gql`
  query materials($filters: [String!], $searchString: String) {
    materials(filters: $filters, searchString: $searchString) {
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

export const GET_MATERIALS_BY_USERID = gql`
  query materialsByUserId($userId: String!) {
    materialsByUserId(userId: $userId) {
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

export const GET_MATERIALS_AVAILABLE = gql`
  query {
    materials(filters: ["A", "L"]) {
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
