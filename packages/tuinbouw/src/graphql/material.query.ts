import gql from 'graphql-tag'

export const GET_MATERIALS = gql`
  query materials {
    materials {
      id
      name
      isLoan
      personId
      serialNumber
      createdAt
      updatedAt
    }
  }
`

export const FIND_MATERIALS_BY_SEARCH_STRING = gql`
  query findMaterialsBySearchString($searchString: String!) {
    findMaterialsBySearchString(searchString: $searchString) {
      id
      name
      isLoan
      personId
      serialNumber
      createdAt
      updatedAt
    }
  }
`
