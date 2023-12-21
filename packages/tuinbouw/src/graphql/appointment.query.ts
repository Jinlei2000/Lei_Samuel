import gql from 'graphql-tag'

export const GET_ALL_APPOINTMENT_BY_USERID = gql`
  query appointmentsByUserId(
    $userId: String!
    $filters: [String!]
    $order: OrderByInput
    $searchString: String
  ) {
    appointmentsByUserId(
      userId: $userId
      filters: $filters
      order: $order
      searchString: $searchString
    ) {
      id
      user {
        id
        fullname
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
        fullname
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
  query appointments(
    $filters: [String!]
    $order: OrderByInput
    $searchString: String
  ) {
    appointments(
      filters: $filters
      order: $order
      searchString: $searchString
    ) {
      id
      user {
        id
        fullname
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

export const GET_RECENT_APPOINTMENTS_BY_USERID = gql`
  query appointmentsRecentByUserId($userId: String!, $amount: Int!) {
    appointmentsRecentByUserId(
      userId: $userId
      amount: $amount
      filters: []
      order: { field: "createdAt", direction: "DESC" }
    ) {
      id
      user {
        id
        fullname
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

export const GET_UPCOMING_APPOINTMENTS_BY_USERID = gql`
  query appointmentsUpcomingByUserId($userId: String!, $amount: Int!) {
    appointmentsUpcomingByUserId(userId: $userId, amount: $amount) {
      id
      user {
        id
        fullname
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
