// This function is used to reset the time of a date to 00:00:00
export const resetTime = (date: Date): Date => {
  return new Date(new Date(date).toISOString().split('T')[0])
}
