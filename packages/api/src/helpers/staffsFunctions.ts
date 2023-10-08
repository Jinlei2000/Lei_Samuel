import { GraphQLError } from 'graphql'
import { OrderByInput } from 'src/interfaces/order.input'
import { Staff } from 'src/staffs/entities/staff.entity'

export const filterStaffs = (
  filters: Array<string>,
): { [key: string]: string | boolean } => {
  //   console.log(filters)

  if (!filters) {
    return {}
  }

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

export const orderStaffs = (order: OrderByInput): { [key: string]: string } => {
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

// send a mail to staff to make a account
export const sendMailToStaff = async (staff: Staff): Promise<void> => {
  console.log('sending mail to new staff')
}
