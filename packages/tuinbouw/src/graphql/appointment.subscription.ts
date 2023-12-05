import gql from 'graphql-tag'

export const APPOINTMENT_CREATED = gql`
  subscription newAppointmentMessage {
    newAppointmentAdded {
      content
      who
    }
  }
`
