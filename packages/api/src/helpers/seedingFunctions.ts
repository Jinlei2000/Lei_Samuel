import { resetTime } from './genericFunctions'

// get days that are not weekend days from now until amountDays (saturday and sunday) and do something with it
// export const generateNonWeekendDates = async (
//   amountDays: number,
//   callbackActions: (date: Date) => void,
// ) => {
//   let currentDate = resetTime(new Date(Date.now()))
//   let i = 0

//   while (i < amountDays) {
//     // if first day and not weekend
//     if (i === 0 && ![0, 6].includes(currentDate.getDay())) {
//       currentDate.setDate(currentDate.getDate())
//     } else {
//       currentDate.setDate(currentDate.getDate() + 1)
//     }

//     // check if date is not weekend
//     if (![0, 6].includes(currentDate.getDay())) {
//       currentDate = resetTime(currentDate)

//       if (callbackActions) {
//         await callbackActions(currentDate)
//       }

//       i++
//     }
//   }
// }

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
