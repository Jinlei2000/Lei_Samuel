import type { Appointment } from '@/interfaces/appointment.user.interface'

export default () => {
  // format date to yyyy-mm-dd
  const formatDateTime = (date: string) => {
    const d = new Date(date)
    console.log('d', `${d.toISOString().split('T')[0]}`)
    return `${d.toISOString().split('T')[0]}`
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

    if (!appointment.isScheduled && endProposedDate && endProposedDate < today)
      return true

    return false
  }

  return {
    formatDateTime,
    isOverToday,
  }
}
