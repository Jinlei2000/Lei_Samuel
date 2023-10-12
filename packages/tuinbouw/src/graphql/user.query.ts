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
        uid
        address
        createdAt
        updatedAt
      }
      email
      telephone
      availability
      createdAt
      updatedAt
      absentCount
      invoiceOption
      company
      btwNumber
    }
  }
`
