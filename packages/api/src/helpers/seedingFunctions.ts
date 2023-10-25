import { Appointment } from 'src/appointments/entities/appointment.entity'
import { resetTime } from './genericFunctions'
import { User } from 'src/users/entities/user.entity'

// get days that are not weekend days from now until amountDays (saturday and sunday) and do something with it
export const generateNonWeekendDates = async (amountDays: number) => {
  let currentDate = resetTime(new Date(Date.now()))
  let i = 0
  let dates: Date[] = []

  while (i < amountDays) {
    // if first day and not weekend
    if (i === 0 && ![0, 6].includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate())
    } else {
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // check if date is not weekend
    if (![0, 6].includes(currentDate.getDay())) {
      dates.push(resetTime(currentDate))
      i++
    }
  }

  return dates
}

// choose random items from array and return chosen items and remaining items
export const chooseRandomItems = <T>(
  arrayItems: T[],
  maxAmount: number,
): {
  chosenItems: T[]
  remainingItems: T[]
} => {
  let randomAmount = Math.floor(Math.random() * maxAmount) + 1
  if (randomAmount > arrayItems.length) {
    randomAmount = arrayItems.length
  }
  const chosenItems = arrayItems.slice(0, randomAmount)
  arrayItems = arrayItems.filter(item => !chosenItems.includes(item))

  return { chosenItems, remainingItems: arrayItems }
}
