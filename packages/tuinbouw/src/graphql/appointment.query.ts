import gql from 'graphql-tag'

export const GET_ALL_APPOINTMENT_BY_USERID = gql`
  query appointmentsByUserId(
    $userId: String!
    $filters: [String!]
    $order: OrderByInput
  ) {
    appointmentsByUserId(userId: $userId, filters: $filters, order: $order) {
      id
      user {
        id
      }
      location {
        id
        address
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

export const GET_ALL_APPOINTMENT_AVAILABLE_BY_DATE = gql`
  query appointmentsAvailableByDate($date: String!) {
    appointmentsAvailableByDate(date: $date) {
      id
      user {
        id
      }
      location {
        id
        address
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

export const GET_ALL_APPOINTMENT = gql`
  query appointments($filters: [String!], $order: OrderByInput) {
    appointments(filters: $filters, order: $order) {
      id
      user {
        id
      }
      location {
        id
        address
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
