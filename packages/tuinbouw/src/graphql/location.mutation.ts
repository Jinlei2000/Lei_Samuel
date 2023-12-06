import gql from 'graphql-tag'

export const CREATE_LOCATION = gql`
  mutation createLocation($createLocationInput: CreateLocationInput!) {
    createLocation(createLocationInput: $createLocationInput) {
      id
      title
      userId
      address
      lat
      lng
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_LOCATION = gql`
  mutation updateLocation($updateLocationInput: UpdateLocationInput!) {
    updateLocation(updateLocationInput: $updateLocationInput) {
      id
      title
      userId
      address
      lat
      lng
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
