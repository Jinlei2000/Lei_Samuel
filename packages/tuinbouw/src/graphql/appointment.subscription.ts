import gql from 'graphql-tag'

export const USER_CREATED = gql`
  subscription newAppointmentMessage {
    newAppointmentAdded {
      content
      who
    }
  }
`
