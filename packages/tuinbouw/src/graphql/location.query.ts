import gql from 'graphql-tag'

export const GET_LOCATIONS = gql`
  query {
  locationsByUserId(userId: String) {
    id
    userId
    address
    createdAt
    updatedAt
  }
}
`



// query materials($filters: [String!], $searchString: String) {
//     materials(filters: $filters, searchString: $searchString) {
//       id
//       name
//       isLoan
//       user {
//         id
//         fullname
//       }
//       serialNumber
//       createdAt
//       updatedAt
//     }
//   }