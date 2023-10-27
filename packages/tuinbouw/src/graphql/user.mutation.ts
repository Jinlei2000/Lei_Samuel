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
