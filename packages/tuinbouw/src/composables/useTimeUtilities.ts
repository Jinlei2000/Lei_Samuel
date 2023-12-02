import type { Appointment } from '@/interfaces/appointment.user.interface'

export default () => {
  // format date to yyyy-mm-dd
  const formatDateTime = (date: string) => {
    const d = new Date(date)
    let DD = String(d.getDate()).padStart(2, '0')
    let MM = String(d.getMonth() + 1).padStart(2, '0') //January is 0!
    let YYYY = d.getFullYear()
    return `${YYYY}-${MM}-${DD}`
  }

  // check if finalDate is over today and not done
  // also check if isScheduled is false and endProposedDate is over today
  const isOverToday = (appointment: Appointment) => {
    if (appointment.isDone) return false

    const today = formatDateTime(new Date().toString())
    const finalDate =
      appointment.finalDate && formatDateTime(appointment.finalDate.toString())
    const endProposedDate =
      appointment.endProposedDate &&
      formatDateTime(appointment.endProposedDate.toString())

    if (finalDate && finalDate < today && !appointment.isDone) return true

    if (!appointment.isDone && endProposedDate && endProposedDate < today)
      return true

    return false
  }

  // check if finalDate is not over today or in the past
  const isNotInPastOrToday = (finalDate: string) => {
    const today = formatDateTime(new Date().toString())
    const finalDateFormatted = formatDateTime(finalDate)
    if (finalDateFormatted <= today) return false
    return true
  }

  return {
    formatDateTime,
    isOverToday,
    isNotInPastOrToday,
  }
}
