import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'

export const filterMaterials = (
  filters: Array<string>,
): { [key: string]: string | boolean } => {
  //   console.log(filters)

  if (!filters) {
    return {}
  }

  filters = filters?.map(filter => filter.toUpperCase())

  // where object for query
  const whereQuery: { [key: string]: string | boolean } = {}
  const filtersList = ['A', 'NA', 'D', 'ND']
  // TODO: add isLoan, has userId,

  // check if filters are valid
  if (filters) {
    // check if all filters are valid (A, NA, D, ND)
    if (!filters?.every(filter => filtersList.includes(filter))) {
      throw new GraphQLError(
        `Invalid filter in filters = [${filters}]! Supported filters are: A = Available, NA = Not Available, D = Defect, ND = Not Defect`,
      )
    }

    // available and not available cannot be used at the same time
    if (filters?.includes('A') && filters?.includes('NA')) {
      throw new GraphQLError(
        'Cannot filter for A and NA at the same time! A = Available, NA = Not Available',
      )
    }

    // defect and not defect cannot be used at the same time
    if (filters?.includes('D') && filters?.includes('ND')) {
      throw new GraphQLError(
        'Cannot filter for D and ND at the same time! D = Defect, ND = Not Defect',
      )
    }

    // set whereQuery depending on filters
    if (filters?.includes('A')) {
      whereQuery.isAvailable = true
    } else if (filters?.includes('NA')) {
      whereQuery.isAvailable = false
    }
    if (filters?.includes('D')) {
      whereQuery.isDefect = true
    } else if (filters?.includes('ND')) {
      whereQuery.isDefect = false
    }
  }

  return whereQuery
}

export const orderMaterials = (
  order: OrderByInput,
): { [key: string]: string } => {
  // console.log(order)
  if (!order) {
    return { createdAt: 'ASC' }
  }

  order.direction = order.direction.toUpperCase()

  // order object for query
  const { field, direction } = order
  const orderQuery = { [field]: direction }
  const orderFieldsList = ['name', 'createdAt', 'updatedAt']
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
