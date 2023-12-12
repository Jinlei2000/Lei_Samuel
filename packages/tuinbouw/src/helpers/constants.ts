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

export const SORT_OPTIONS_USERS = [
  {
    label: 'Date Created',
    value: 'createdAt',
  },
  {
    label: 'Name',
    value: 'fullname',
  },
]

export const FILTER_OPTIONS_USERS = [
  {
    title: 'Role',
    name: 'role',
    type: 'checkbox',
    options: [
      { label: 'Admin', value: 'A' },
      { label: 'Employee', value: 'E' },
      { label: 'Client', value: 'C' },
    ],
  },
]

export const SORT_OPTIONS_APPOINTMENTS = [
  {
    label: 'Date Created',
    value: 'createdAt',
  },
  {
    label: 'Price',
    value: 'price',
  },
  {
    label: 'Type',
    value: 'type',
  },
  {
    label: 'Start Date',
    value: 'startProposedDate',
  },
  {
    label: 'End Date',
    value: 'endProposedDate',
  },
  {
    label: 'Final Date',
    value: 'finalDate',
  },
]

export const FILTER_OPTIONS_APPOINTMENTS = [
  {
    title: 'Scheduled',
    name: 'scheduled',
    type: 'radio',
    options: [
      { label: 'All', value: '' },
      { label: 'Scheduled', value: 'S' },
      { label: 'Not Scheduled', value: 'NS' },
    ],
  },
  {
    title: 'Type',
    name: 'type',
    type: 'checkbox',
    options: [
      { label: 'Repair', value: 'R' },
      { label: 'Maintenance', value: 'M' },
      { label: 'Other', value: 'O' },
    ],
  },
  {
    title: 'Status',
    name: 'status',
    type: 'radio',
    options: [
      { label: 'All', value: '' },
      { label: 'Done', value: 'D' },
      { label: 'Not Done', value: 'ND' },
    ],
  },
  {
    title: 'Priority',
    name: 'priority',
    type: 'radio',
    options: [
      { label: 'All', value: '' },
      { label: 'Priority', value: 'P' },
      { label: 'Not Priority', value: 'NP' },
    ],
  },
]

export const SORT_OPTIONS_SCHEDULES = [
  {
    label: 'Date',
    value: 'finalDate',
  },
]

export const FILTER_OPTIONS_SCHEDULES = [
  {
    title: 'Final Date',
    name: 'finalDate',
    type: 'radio',
    options: [
      { label: 'All', value: '' },
      { label: 'Today', value: 'T' },
      { label: 'Future', value: 'F' },
      { label: 'Past', value: 'P' },
    ],
  },
]

export const FILTER_OPTIONS_ABSENCES = [
  {
    title: 'Type',
    name: 'type',
    type: 'checkbox',
    options: [
      { label: 'Sick', value: 'S' },
      { label: 'Vacation', value: 'V' },
      { label: 'Other', value: 'O' },
    ],
  },
]

export const SORT_OPTIONS_ABSENCES = [
  {
    label: 'Date Created',
    value: 'createdAt',
  },
  {
    label: 'Start Date',
    value: 'startDate',
  },
  {
    label: 'End Date',
    value: 'endDate',
  },
  {
    label: 'Total Days',
    value: 'totalDays',
  },
  {
    label: 'Type',
    value: 'type',
  },
]
