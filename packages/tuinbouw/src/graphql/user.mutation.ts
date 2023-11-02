import gql from 'graphql-tag'

export const CREATE_CLIENT = gql`
  mutation createClient($createClientInput: CreateClientInput!) {
    createClient(createClientInput: $createClientInput) {
      id
      uid
      locale
      role
      firstname
      lastname
      fullname
      url
      email
      telephone
      createdAt
      updatedAt
      locations {
        id
        userId
        address
        createdAt
        updatedAt
      }
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
export const UPDATE_EMPLOYEE_REGISTER = gql`
  mutation updateEmployeeRegister($updateUserInput: UpdateUserInput!) {
    updateEmployeeRegister(updateUserInput: $updateUserInput) {
      id
      uid
      locale
      role
      firstname
      lastname
      fullname
      url
      email
      telephone
      createdAt
      updatedAt
      locations {
        id
        userId
        address
        createdAt
        updatedAt
      }
      absentCount
      invoiceOption
      company
      btwNumber
    }
  }
`

export const DELETE_USER = gql`
  mutation removeUser($id: String!) {
    removeUser(id: $id)
  }
`
