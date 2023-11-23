import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'

// dropdown options of absence types
export const ABSENCE_TYPES = [
  { name: 'sick' },
  { name: 'vacation' },
  { name: 'other' },
]

export const APPOINTMENT_TYPES = [
  { name: 'maintenance' },
  { name: 'repair' },
  { name: 'other' },
]

export const ORDER_DIRECTION = {
  ASC: 'ASC',
  DESC: 'DESC',
}

export const INVOICE_OPTIONS = [{ name: 'post' }, { name: 'email' }]

export const SUPPORTED_LOCALES_TYPES = () => {
  return Object.entries(SUPPORTED_LOCALES).map(([value, name]) => {
    return { name, value }
  })
}

export const SORT_OPTIONS_MATERIALS = [
  {
    label: 'Date Created',
    value: 'createdAt',
  },
  {
    label: 'Name',
    value: 'name',
  },
]

export const FILTER_OPTIONS_MATERIALS = [
  {
    title: 'Availability',
    name: 'availability',
    type: 'radio',
    options: [
      { label: 'All', value: '' },
      { label: 'Available', value: 'A' },
      { label: 'Not Available', value: 'NA' },
    ],
  },
  {
    title: 'Loanable',
    name: 'loanable',
    type: 'radio',
    options: [
      { label: 'All', value: '' },
      { label: 'Loanable', value: 'L' },
      { label: 'Not Loanable', value: 'NL' },
    ],
  },
]
