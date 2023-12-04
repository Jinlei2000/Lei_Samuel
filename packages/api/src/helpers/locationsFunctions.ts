import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'

export const orderLocations = (
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
  const orderFieldsList = ['address', 'createdAt', 'updatedAt']
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
