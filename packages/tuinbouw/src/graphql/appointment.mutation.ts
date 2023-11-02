import gql from 'graphql-tag'

export const DELETE_APPOINTMENT = gql`
  mutation removeAppointment($id: String!) {
    removeAppointment(id: $id)
  }
`

export const CREATE_APPOINTMENT = gql`
  mutation createAppointment($input: CreateAppointmentInput!) {
    createAppointment(createAppointmentInput: $input) {
      user {
        id
      }
      location {
        id
      }
      type
      startProposedDate
      endProposedDate
      isScheduled
      isDone
      description
      priority
    }
  }
`
  
