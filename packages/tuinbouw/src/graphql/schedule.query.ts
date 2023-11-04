import gql from 'graphql-tag'

export const GET_ALL_SCHEDULES = gql`
  query schedules($filters: [String!], $order: OrderByInput) {
    schedules(filters: $filters, order: $order) {
      id
      appointments {
        id
      }
      employees {
        id
      }
      materials {
        id
      }
      finalDate
      createdBy
      createdAt
      updatedAt
    }
  }
`
