import gql from 'graphql-tag'

export const GET_MAILTOKEN_BY_TOKEN = gql`
  query getMailTokenByToken($token: String!) {
    getMailTokenByToken(token: $token) {
      id
      userId
      token
      expirationDate
      createdAt
    }
  }
`

export const DELETE_ALL_MAILTOKENS_BY_USERID = gql`
  mutation removeAllMailTokensByUserId($userId: String!) {
    removeAllMailTokensByUserId(userId: $userId)
  }
`
