import gql from 'graphql-tag'

export const DELETE_SCHEDULE = gql`
  mutation removeSchedule($id: String!) {
    removeSchedule(id: $id)
  }
`

export const CREATE_SCHEDULE = gql`
  mutation createSchedule($createScheduleInput: CreateScheduleInput!) {
    createSchedule(createScheduleInput: $createScheduleInput) {
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

export const UPDATE_SCHEDULE = gql`
  mutation updateSchedule($updateScheduleInput: UpdateScheduleInput!) {
    updateSchedule(updateScheduleInput: $updateScheduleInput) {
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
