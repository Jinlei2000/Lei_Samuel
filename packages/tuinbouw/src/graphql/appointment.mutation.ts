import gql from 'graphql-tag'

export const DELETE_APPOINTMENT = gql`
  mutation removeAppointment($id: String!) {
    removeAppointment(id: $id)
  }
`

export const UPDATE_APPOINTMENT = gql`
  mutation updateAppointment($updateAppointmentInput: UpdateAppointmentInput!) {
    updateAppointment(updateAppointmentInput: $updateAppointmentInput) {
      id
      user {
        id
      }
      location {
        id
      }
      price
      type
      startProposedDate
      endProposedDate
      isScheduled
      finalDate
      isDone
      description
      priority
      createdAt
      updatedAt
    }
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
