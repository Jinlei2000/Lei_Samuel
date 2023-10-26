import gql from 'graphql-tag'

export const ADD_CLIENT = gql`
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

export const UPDATE_LOCALE = gql`
  mutation updateUserInput($id: ID!, $locale: String!) {
    updateUser(updateUserInput: { id: $id, locale: $locale }) {
      id
      locale
      role
      fullname
    }
  }
`
