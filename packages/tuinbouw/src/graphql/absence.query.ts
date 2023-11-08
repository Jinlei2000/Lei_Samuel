import gql from 'graphql-tag'

export const GET_ALL_ABSENCES = gql`
  query absences($filters: [String!], $order: OrderByInput) {
    absences(filters: $filters, order: $order) {
      id
      user {
        id
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
