import gql from 'graphql-tag'

export const SEND_MAIL_TO_EMPLOYEE = gql`
  mutation sendEmailToNewEmployeeById($userId: String!) {
    sendEmailToNewEmployeeById(userId: $userId)
  }
`

export const DELETE_ALL_MAILTOKENS_BY_USERID = gql`
  mutation removeAllMailTokensByUserId($userId: String!) {
    removeAllMailTokensByUserId(userId: $userId)
  }
`
