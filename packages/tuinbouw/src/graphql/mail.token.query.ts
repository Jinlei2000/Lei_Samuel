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




