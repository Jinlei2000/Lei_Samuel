import gql from 'graphql-tag'

export const DELETE_SCHEDULE = gql`
  mutation removeSchedule($id: String!) {
    removeSchedule(id: $id)
  }
`
