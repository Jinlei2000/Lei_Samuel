import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'
import { resetTime } from './genericFunctions'

export const filterSchedules = (
  filters: Array<string>,
): { [key: string]: any } => {
  //   console.log(filters)

  if (!filters) return {}

  filters = filters?.map(filter => filter.toUpperCase())

  // where object for query
  const whereQuery: { [key: string]: any } = {}
  const filtersList = ['FD', 'NFD', 'P', 'F', 'T']

  // check if filters are valid
  if (filters) {
    // check if all filters are valid (FD, NFD, P, F, T)
    if (!filters?.every(filter => filtersList.includes(filter))) {
      throw new GraphQLError(
        `Invalid filter in filters = [${filters}]! Supported filters are: FD = FinalDate, NFD = No FinalDate, P = Past, F = Future, T = Today`,
      )
    }

    // finalDate and no finalDate cannot be used at the same time
    if (filters?.includes('FD') && filters?.includes('NFD')) {
      throw new GraphQLError(
        'Cannot filter for FinalDate and No FinalDate at the same time! F = FinalDate, NT = No FinalDate',
      )
    }

    // past, future and today cannot be used at the same time
    if (
      (filters?.includes('P') && filters?.includes('F')) ||
      (filters?.includes('P') && filters?.includes('T')) ||
      (filters?.includes('F') && filters?.includes('T'))
    ) {
      throw new GraphQLError(
        'Cannot filter for Past, Future and Today at the same time! P = Past, F = Future, T = Today',
      )
    }

    // filter final date
    if (filters?.includes('FD')) whereQuery.finalDate = { $ne: null }
    if (filters?.includes('NFD')) whereQuery.finalDate = null

    // filter past and future
    const date = resetTime(new Date()) // reset time to 00:00:00
    if (filters?.includes('P')) whereQuery.finalDate = { $lt: date }
    if (filters?.includes('F')) whereQuery.finalDate = { $gt: date }
    if (filters?.includes('T')) whereQuery.finalDate = date
  }

  return whereQuery
}

export const orderSchedules = (
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
  const orderFieldsList = ['finalDate', 'createdBy', 'createdAt', 'updatedAt']
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
