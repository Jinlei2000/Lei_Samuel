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

// export const FIND_MATERIALS_BY_SEARCH_STRING = gql`
//   query materialsBySearchString($searchString: String!) {
//     materialsBySearchString(searchString: $searchString) {
//       id
//       name
//       isLoan
//       personId
//       serialNumber
//       createdAt
//       updatedAt
//     }
//   }
// `
