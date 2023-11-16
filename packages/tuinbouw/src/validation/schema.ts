import * as yup from 'yup'

export const absenceValidationSchema = yup.object({
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  type: yup.string().required(),
  description: yup.string().optional(),
})

export const userUpdateValidationSchema = yup.object({
  email: yup.string().required().email(),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  telephone: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10)
    .max(10)
    .optional()
    .nullable(),
  invoiceOption: yup.string().optional().nullable(),
  company: yup.boolean().optional().nullable(),
  btwNumber: yup
    .string()
    .matches(/^[A-Za-z\d]{5,15}$/, 'Not a valid VAT Number')
    .optional()
    .nullable(),
})

export const locationValidationSchema = yup.object({
  searchAdressInput: yup.string().required().trim(),
  selectedAddress: yup.object().required(),
})

export const forgotPasswordValidationSchema = yup.object({
  email: yup.string().required().email(),
})
