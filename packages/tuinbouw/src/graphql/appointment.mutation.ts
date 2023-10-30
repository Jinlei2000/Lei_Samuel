import gql from 'graphql-tag'

export const DELETE_APPOINTMENT = gql`
  mutation removeAppointment($id: String!) {
    removeAppointment(id: $id)
  }
`
