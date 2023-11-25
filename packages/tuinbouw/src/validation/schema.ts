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
  title: yup.string().required(),
  searchAdressInput: yup.string().required().trim(),
  selectedAddress: yup.object().required(),
})

export const forgotPasswordValidationSchema = yup.object({
  email: yup.string().required().email(),
})

export const loginValidationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
})

export const registerValidationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
})

export const userUpdateAdminValidationSchema = yup.object({
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
})

export const userCreateEmployeeValidationSchema = yup.object({
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
  locale: yup.string().required(),
})

export const schedulesValidationSchema = yup.object({
  finalDate: yup.string().required(),
  appointmentsIds: yup.array().required().min(1),
  employeesIds: yup.array().required().min(1),
  materialsIds: yup.array().required(),
})

export const appointmentUpdateValidationSchema = yup.object({
  locationId: yup.string().required(),
  type: yup.string().required(),
  startProposedDate: yup.string().required(),
  endProposedDate: yup.string().required(),
  description: yup.string().optional(),
})
