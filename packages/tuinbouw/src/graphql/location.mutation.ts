import gql from 'graphql-tag'

export const CREATE_LOCATION = gql`
  mutation createLocation($createLocationInput: CreateLocationInput!) {
    createLocationInput(createLocationInput: $createLocationInput) {
      id
      userId
      address
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_LOCATION = gql`
  mutation updateLocation($updateLocationInput: UpdateLocationInput!) {
    updateLocationInput(updateLocationInput: $updateLocationInput) {
      id
      userId
      address
      createdAt
      updatedAt
    }
  }
`

export const DELETE_LOCATION = gql`
  mutation removeLocation($id: String!) {
    removeLocation(id: $id)
  }
`
