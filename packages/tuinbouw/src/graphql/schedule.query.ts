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
      employees {
        id
        uid
        locale
        role
        firstname
        lastname
        fullname
        url
        locations {
          id
          userId
          address
          createdAt
          updatedAt
        }
        email
        telephone
        createdAt
        updatedAt
        absentCount
      }
      materials {
        id
        name
        isLoan
        user {
          id
          fullname
        }
        serialNumber
        createdAt
        updatedAt
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
