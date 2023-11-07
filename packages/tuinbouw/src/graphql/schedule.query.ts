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

export const GET_SCHEDULE_BY_ID = gql`
  query schedule($id: String!) {
    schedule(id: $id) {
      id
      appointments {
        id
        type
      }
      employees {
        id
        email
        fullname
      }
      materials {
        id
        name
        serialNumber
      }
      finalDate
      createdBy
      createdAt
      updatedAt
    }
  }
`


export const GET_SCHEDULE_BY_USER_AND_DATE = gql`
  query scheduleByDateAndUserId($date: String!, $userId: String!) {
  scheduleByDateAndUserId(date: $date, userId: $userId) {
    id
    appointments {
      id
      user {
        fullname
      }
      location {
        address
      }
      price
      type
      finalDate
      isDone
      description
      priority
    }
    materials {
      name
    }
    employees {
      id
      fullname
    }
  }
}
`
