import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'

export const filterMaterials = (
  filters: Array<string>,
): { [key: string]: any } => {
  //   console.log(filters)

  if (!filters) {
    return {}
  }

  filters = filters?.map(filter => filter.toUpperCase())

  // where object for query
  const whereQuery: { [key: string]: any } = {}
  const filtersList = ['A', 'NA', 'L', 'NL']

  // check if filters are valid
  if (filters) {
    // check if all filters are valid (A, NA, D, ND)
    if (!filters?.every(filter => filtersList.includes(filter))) {
      throw new GraphQLError(
        `Invalid filter in filters = [${filters}]! Supported filters are: A = Available, NA = Not Available, L = Loanable, NL = Not Loanable`,
      )
    }

    // available and not available cannot be used at the same time
    if (filters?.includes('A') && filters?.includes('NA')) {
      throw new GraphQLError(
        'Cannot filter for A and NA at the same time! A = Available, NA = Not Available',
      )
    }

    // loanable and not loanable cannot be used at the same time
    if (filters?.includes('L') && filters?.includes('NL')) {
      throw new GraphQLError(
        'Cannot filter for L and NL at the same time! L = Loanable, NL = Not Loanable',
      )
    }

    // filter for has userId or not
    if (filters?.includes('A')) whereQuery.userId = null
    if (filters?.includes('NA')) whereQuery.userId = { $ne: null }

    // filter for loanable
    if (filters?.includes('L')) whereQuery.isLoan = true
    if (filters?.includes('NL')) whereQuery.isLoan = false
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
