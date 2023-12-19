import * as yup from 'yup'

export const absenceValidationSchema = yup.object({
  startDate: yup.string().required('invalid.start.date.required'),
  endDate: yup.string().required('invalid.end.date.required'),
  type: yup.string().required('invalid.type.required'),
  description: yup.string().optional(),
})

export const userUpdateValidationSchema = yup.object({
  firstname: yup.string().required('invalid.firstname.required'),
  lastname: yup.string().required('invalid.lastname.required'),
  telephone: yup
    .string()
    .matches(/^[0-9]+$/, 'invalid.telephone.match')
    .optional()
    .nullable(),
  invoiceOption: yup.string().optional().nullable(),
  company: yup.boolean().optional().nullable(),
  btwNumber: yup
    .string()
    .matches(/^[A-Za-z\d]{5,15}$/, 'invalid.btw.match')
    .nullable()
    .when('company', (company, schema) => {
      if (company[0] === true) {
        return schema.required()
      }
      return schema.optional()
    }),
})

export const locationValidationSchema = yup.object({
  locationTitle: yup.string().required('invalid.location.title.required'),
  searchAdressInput: yup
    .string()
    .required('invalid.location.search.address.required')
    .trim(),
  selectedAddress: yup.object().required('invalid.location.address.required'),
})

export const forgotPasswordValidationSchema = yup.object({
  email: yup.string().required('invalid.email.required').email('invalid.email'),
})

export const loginValidationSchema = yup.object({
  email: yup.string().required('invalid.email.required').email('invalid.email'),
  password: yup
    .string()
    .required('invalid.password.required')
    .min(6, 'invalid.password.min'),
})

export const registerValidationSchema = yup.object({
  email: yup.string().required('invalid.email.required').email('invalid.email'),
  password: yup
    .string()
    .required('invalid.password.required')
    .min(6, 'invalid.password.min'),
  firstName: yup.string().required('invalid.firstname.required'),
  lastName: yup.string().required('invalid.lastname.required'),
})

export const userUpdateAdminValidationSchema = yup.object({
  email: yup.string().required('invalid.email.required').email('invalid.email'),
  firstname: yup.string().required('invalid.firstname.required'),
  lastname: yup.string().required('invalid.lastname.required'),
  telephone: yup
    .string()
    .matches(/^[0-9]+$/, 'invalid.telephone.match')
    .optional()
    .nullable(),
})

export const userCreateEmployeeValidationSchema = yup.object({
  email: yup.string().required('invalid.email.required').email('invalid.email'),
  firstname: yup.string().required('invalid.firstname.required'),
  lastname: yup.string().required('invalid.lastname.required'),
  telephone: yup
    .string()
    .matches(/^[0-9]+$/, 'invalid.telephone.match')
    .optional()
    .nullable(),
  locale: yup.string().required('invalid.locale.required'),
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

export const materialValidationSchema = yup.object({
  name: yup.string().required(),
  serialNumber: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, 'Must be only digits'),
  isLoan: yup.boolean().required(),
  userId: yup
    .string()
    .nullable()
    .when('isLoan', (isLoan, schema) => {
      if (isLoan[0] === false) {
        return schema.required()
      }
      return schema.optional()
    }),
})

export const appointmentCreateValidationSchema = yup.object({
  startProposedDate: yup.date().required('invalid.start.date.required'),
  endProposedDate: yup.date().required('invalid.start.date.required'),
  description: yup.string(),
  type: yup.string().required('invalid.type.required'),
})

export const appointmentEditAdminValidationSchema = yup.object({
  priority: yup.boolean().required(),
})
