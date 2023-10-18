import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'

export const filterAppointments = (
  filters: Array<string>,
): { [key: string]: any } => {
  //   console.log(filters)

  if (!filters) return {}

  filters = filters?.map(filter => filter.toUpperCase())

  // where object for query
  const whereQuery: { [key: string]: any } = {}
  const filtersList = ['M', 'R', 'D', 'ND', 'S', 'NS']

  // check if filters are valid
  if (filters) {
    // check if all filters are valid (M, R, D, ND, S, NS)
    if (!filters?.every(filter => filtersList.includes(filter))) {
      throw new GraphQLError(
        `Invalid filter in filters = [${filters}]! Supported filters are: M = Maintenance, R = Repair, D = Done, ND = Not Done, S = Scheduled, NS = Not Scheduled`,
      )
    }

    // done and not done cannot be used at the same time
    if (filters?.includes('D') && filters?.includes('ND')) {
      throw new GraphQLError(
        'Cannot filter for D and ND at the same time! D = Done, ND = Not Done',
      )
    }

    // scheduled and not scheduled cannot be used at the same time
    if (filters?.includes('S') && filters?.includes('NS')) {
      throw new GraphQLError(
        'Cannot filter for S and NS at the same time! S = Scheduled, NS = Not Scheduled',
      )
    }

    // type filter
    let selectTypes: Array<string> = []
    if (filters?.includes('M')) selectTypes.push('MAINTENANCE')
    if (filters?.includes('R')) selectTypes.push('REPAIR')
    if (selectTypes.length > 0) whereQuery.role = { $in: selectTypes }

    // done filter
    if (filters?.includes('D')) whereQuery.isDone = true
    if (filters?.includes('ND')) whereQuery.isDone = false

    // scheduled filter
    if (filters?.includes('S')) whereQuery.isScheduled = true
    if (filters?.includes('NS')) whereQuery.isScheduled = false
  }

  return whereQuery
}

export const orderAppointments = (
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
    'price',
    'type',
    'startProposedDate',
    'endProposedDate',
    'finalDate',
    'isScheduled',
    'isDone',
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