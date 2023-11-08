import gql from 'graphql-tag'

export const GET_ALL_ABSENCES = gql`
  query absences($filters: [String!], $order: OrderByInput) {
    absences(filters: $filters, order: $order) {
      id
      user {
        id
        firstname
      }
      description
      type
      startDate
      endDate
      totalDays
      createdAt
      updatedAt
    }
  }
`

export const GET_ALL_ABSENCES_BY_USERID = gql`
  query absencesByUserId($filters: [String!], $order: OrderByInput) {
    absencesByUserId(filters: $filters, order: $order) {
      id
      user {
        id
        firstname
      }
      description
      type
      startDate
      endDate
      totalDays
      createdAt
      updatedAt
    }
  }
`
