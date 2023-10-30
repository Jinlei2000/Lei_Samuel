import gql from 'graphql-tag'

export const GET_ALL_APPOINTMENT_BY_CLIENT = gql`
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
