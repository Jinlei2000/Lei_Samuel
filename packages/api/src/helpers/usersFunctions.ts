import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'

export const filterUsers = (filters: Array<string>): { [key: string]: any } => {
  //   console.log(filters)

  if (!filters) return {}

  filters = filters?.map(filter => filter.toUpperCase())

  // where object for query
  const whereQuery: { [key: string]: any } = {}
  const filtersList = ['A', 'E', 'C', 'AV', 'UID', 'NAV', 'NUID']

  // check if filters are valid
  if (filters) {
    // check if all filters are valid (A, E, C, AV, UID, NAV, NUID)
    if (!filters?.every(filter => filtersList.includes(filter))) {
      throw new GraphQLError(
        `Invalid filter in filters = [${filters}]! Supported filters are: A = Admin, E = Employee, C = Client, AV = Available, UID = User with uid, NAV = Not available, NUID = User without uid`,
      )
    }

    // availability and not availability cannot be used at the same time
    if (filters?.includes('AV') && filters?.includes('NAV')) {
      throw new GraphQLError(
        'Cannot filter for AV and NAV at the same time! A = Availability, NA = Not Availability',
      )
    }

    // user with uid and user without uid cannot be used at the same time
    if (filters?.includes('UID') && filters?.includes('NUID')) {
      throw new GraphQLError(
        'Cannot filter for UID and NUID at the same time! UID = User with uid, NUID = User without uid',
      )
    }

    // role filter
    let selectRoles = []
    if (filters?.includes('A')) selectRoles.push('ADMIN')
    if (filters?.includes('E')) selectRoles.push('EMPLOYEE')
    if (filters?.includes('C')) selectRoles.push('CLIENT')
    if (selectRoles.length > 0) whereQuery.role = { $in: selectRoles }

    // availability filter
    if (filters?.includes('AV')) whereQuery.availability = true
    if (filters?.includes('NAV')) whereQuery.availability = false

    // uid filter
    if (filters?.includes('UID')) whereQuery.uid = { $ne: null }
    if (filters?.includes('NUID')) whereQuery.uid = null
  }

  return whereQuery
}

export const orderUsers = (order: OrderByInput): { [key: string]: string } => {
  //   console.log(order)

  if (!order) {
    return { createdAt: 'ASC' }
  }

  order.direction = order.direction.toUpperCase()

  // order object for query
  const { field, direction } = order
  const orderQuery = { [field]: direction }
  const orderFieldsList = [
    'firstname',
    'lastname',
    'fullname',
    'email',
    'telephone',
    'absentCount',
    'role',
    'createdAt',
    'updatedAt',
  ]
  const orderDirectionsList = ['ASC', 'DESC']

  // check if order is valid
  if (order) {
    // check field
    if (!orderFieldsList.includes(field)) {
      throw new GraphQLError(
        `Invalid field in order = ${field}! Supported fields are: ${orderFieldsList}`,
      )
    }
    // check direction
    if (!orderDirectionsList.includes(direction)) {
      throw new GraphQLError(
        `Invalid direction in order = ${direction}! Supported directions are: ${orderDirectionsList}`,
      )
    }
  }

  return orderQuery
}


