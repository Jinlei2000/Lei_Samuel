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
