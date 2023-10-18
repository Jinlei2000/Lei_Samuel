import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'

export const filterAbsences = (
  filters: Array<string>,
): { [key: string]: any } => {
  //   console.log(filters)

  if (!filters) return {}

  filters = filters?.map(filter => filter.toUpperCase())

  // where object for query
  const whereQuery: { [key: string]: any } = {}
  const filtersList = ['S', 'V', 'O']

  // check if filters are valid
  if (filters) {
    // check if all filters are valid (S, V, O)
    if (!filters?.every(filter => filtersList.includes(filter))) {
      throw new GraphQLError(
        `Invalid filter in filters = [${filters}]! Supported filters are: S = Sick, V = Vacation, O = Other`,
      )
    }

    // type filter
    let selectTypes = []
    if (filters?.includes('S')) selectTypes.push('SICK')
    if (filters?.includes('V')) selectTypes.push('VACATION')
    if (filters?.includes('O')) selectTypes.push('OTHER')
    if (selectTypes.length > 0) whereQuery.type = { $in: selectTypes }
  }

  return whereQuery
}

export const orderAbsences = (
  order: OrderByInput,
): { [key: string]: string } => {
  //   console.log(order)

  if (!order) {
    return { createdAt: 'ASC' }
  }

  order.direction = order.direction.toUpperCase()

  // order object for query
  const { field, direction } = order
  const orderQuery = { [field]: direction }
  const orderFieldsList = [
    'type',
    'startDate',
    'endDate',
    'totalDays',
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

export const calculateTotalDays = (startDate: Date, endDate: Date): number => {
  //   console.log(startDate, endDate)

  // check if startDate is before endDate
  if (startDate > endDate) {
    throw new GraphQLError(
      `Invalid dates! startDate = ${startDate} is after endDate = ${endDate}`,
    )
  }

  // calculate total days
  const totalDays = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
  ) + 1

  return totalDays
}
