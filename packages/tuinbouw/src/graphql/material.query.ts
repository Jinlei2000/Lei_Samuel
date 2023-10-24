import gql from 'graphql-tag'

export const GET_MATERIALS = gql`
  query materials($filters: [String!]) {
    materials(filters: $filters) {
      id
      name
      isLoan
      personId
      serialNumber
      createdAt
      updatedAt
    }
  }
`

export const FIND_MATERIALS_BY_SEARCH_STRING = gql`
  query materialsBySearchString($searchString: String!) {
    materialsBySearchString(searchString: $searchString) {
      id
      name
      isLoan
      personId
      serialNumber
      createdAt
      updatedAt
    }
  }
`
