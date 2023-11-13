import * as yup from 'yup'

export const absenceSchema = yup.object({
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  type: yup.string().required(),
  description: yup.string().optional(),
})
