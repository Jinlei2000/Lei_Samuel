import gql from 'graphql-tag'

export const GET_MATERIALS = gql`
  query materials($filters: [String!], $order: OrderByInput!, $searchString: String!) {
    materials(filters: $filters, order: $order, searchString: $searchString) {
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
  }
`

export const GET_MATERIALS_BY_USERID = gql`
  query materialsByUserId($userId: String!, $filters: [String!], $order: OrderByInput!, $searchString: String!) {
    materialsByUserId(userId: $userId, filters: $filters, order: $order, searchString: $searchString) {
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
  }
`

export const GET_MATERIALS_AVAILABLE = gql`
  query {
    materials(filters: ["A", "L"]) {
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
  }
`
