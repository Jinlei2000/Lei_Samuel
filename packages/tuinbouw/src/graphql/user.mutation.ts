import gql from 'graphql-tag'

export const ADD_CLIENT = gql`
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
      locationId
      email
      telephone
      availability
      createdAt
      updatedAt
      absentCount
      InvoiceOption
      Company
      BtwNumber
    }
  }
`
