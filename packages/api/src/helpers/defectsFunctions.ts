import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'

export const filterDefects = (
  filters: Array<string>,
): { [key: string]: string | boolean } => {
  //   console.log(filters)

  if (!filters) {
    return {}
  }

  filters = filters?.map(filter => filter.toUpperCase())

  // where object for query
  const whereQuery: { [key: string]: string | boolean } = {}
  // Defect - Repaired - Discarded
  const filtersList = ['D', 'R', 'D']

  // check if filters are valid
  if (filters) {
    // check if all filters are valid (A, NA, D, ND)
    if (!filters?.every(filter => filtersList.includes(filter))) {
      throw new GraphQLError(
        `Invalid filter in filters = [${filters}]! Supported filters are: A = Defect, R = Repaired, D = Discarded`,
      )
    }

    // available and not available cannot be used at the same time
    // check if more then 1 filter is applied
    if (filters?.length > 1) {
      throw new GraphQLError(
        'Only 1 filter allowed! D = Defect, R = Repaired, D = Discarded',
      )
    }

    // set whereQuery depending on filters
    if (filters?.includes('D')) {
      whereQuery.status = 'defect'
    } else if (filters?.includes('R')) {
      whereQuery.status = 'repaired'
    } else if (filters?.includes('D')) {
      whereQuery.status = 'discarded'
    }
  }

  return whereQuery
}

// TODO - order by material name

// export const orderDefects = (
//   order: OrderByInput,
// ): { [key: string]: string } => {
//   // console.log(order)
//   if (!order) {
//     return { createdAt: 'ASC' }
//   }

//   order.direction = order.direction.toUpperCase()

//   // order object for query
//   const { field, direction } = order
//   const orderQuery = { [field]: direction }
//   const orderFieldsList = ['name', 'createdAt', 'updatedAt']
//   const orderDirectionsList = ['ASC', 'DESC']

//   // check if order is valid
//   if (order) {
//     // check field
//     if (!orderFieldsList.includes(field)) {
//       throw new GraphQLError(
//         `Invalid field in order = ${field}! Supported fields are: ${orderFieldsList}`,
//       )
//     }
//     // check direction
//     if (!orderDirectionsList.includes(direction)) {
//       throw new GraphQLError(
//         `Invalid direction in order = ${direction}! Supported directions are: ${orderDirectionsList}`,
//       )
//     }
//   }

//   return orderQuery
// }
