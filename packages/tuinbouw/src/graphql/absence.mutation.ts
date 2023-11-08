import gql from 'graphql-tag'

export const DELETE_ABSENCE = gql`
  mutation removeAbsence($id: String!) {
    removeAbsence(id: $id)
  }
`

export const UPDATE_ABSENCE = gql`
  mutation updateAbsence($updateAbsenceInput: UpdateAbsenceInput!) {
    updateAbsence(updateAbsenceInput: $updateAbsenceInput) {
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

export const CREATE_ABSENCE = gql`
  mutation createAbsence($createAbsenceInput: CreateAbsenceInput!) {
    createAbsence(createAbsenceInput: $createAbsenceInput) {
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
