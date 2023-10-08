import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'

export const filterStaffs = (
  filters: Array<string>,
): { [key: string]: string | boolean } => {
  //   console.log(filters)

  filters = filters?.map(filter => filter.toUpperCase())

  // where object for query
  const whereQuery: { [key: string]: string | boolean } = {}
  const filtersList = ['A', 'E']

  // check if filters are valid
  if (filters) {
    // check if all filters are valid (A, E)
    if (!filters?.every(filter => filtersList.includes(filter))) {
      throw new GraphQLError(
        `Invalid filter in filters = [${filters}]! Supported filters are: A = Admin, E = Employee`,
      )
    }

    // set whereQuery depending on filters
    if (filters?.includes('A')) {
      whereQuery.isAdmin = true
    } else if (filters?.includes('E')) {
      whereQuery.isAdmin = false
    }
  }

  return whereQuery
}

export const orderStaffs = (
  order: OrderByInput,
): { [key: string]: string } => {
  //   console.log(order)

  order.direction = order.direction.toUpperCase()

  // order object for query
  const { field, direction } = order || {
    field: 'createdAt',
    direction: 'ASC',
  }
  const orderQuery = { [field]: direction }
  const orderFieldsList = [
    'firstname',
    'lastname',
    'fullname',
    'createdAt',
    'updatedAt',
    'availability',
    'absentCount',
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
