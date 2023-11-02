import gql from 'graphql-tag'

export const GET_USER_BY_UID = gql`
  query userByUid($uid: String!) {
    userByUid(uid: $uid) {
      id
      uid
      locale
      role
      firstname
      lastname
      fullname
      url
      locations {
        id
        userId
        address
        createdAt
        updatedAt
      }
      email
      telephone
      createdAt
      updatedAt
      absentCount
      invoiceOption
      company
      btwNumber
    }
  }
`

export const GET_USERS = gql`
  query users(
    $filters: [String!]
    $order: OrderByInput
    $searchString: String
  ) {
    users(filters: $filters, order: $order, searchString: $searchString) {
      id
      uid
      locale
      role
      firstname
      lastname
      fullname
      url
      locations {
        id
        userId
        address
        createdAt
        updatedAt
      }
      email
      telephone
      createdAt
      updatedAt
      absentCount
      invoiceOption
      company
      btwNumber
    }
  }
`
