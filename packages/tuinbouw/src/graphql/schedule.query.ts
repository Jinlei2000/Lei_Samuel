import gql from 'graphql-tag'

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
