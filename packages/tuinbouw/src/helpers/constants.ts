import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'

// dropdown options of absence types
export const ABSENCE_TYPES = [
  { name: 'sick', value: 'sick' },
  { name: 'vacation', value: 'vacation' },
  { name: 'other', value: 'other' },
]

export const APPOINTMENT_TYPES = [
  { name: 'maintenance', value: 'maintenance' },
  { name: 'repair', value: 'repair' },
  { name: 'other', value: 'other' },
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
    label: 'material.sort.date.created',
    value: 'createdAt',
  },
  {
    label: 'material.sort.name',
    value: 'name',
  },
]

export const FILTER_OPTIONS_MATERIALS = [
  {
    title: 'material.filter.availability',
    name: 'availability',
    type: 'radio',
    options: [
      { label: 'material.filter.availability.option.all', value: '' },
      { label: 'material.filter.availability.option.availability', value: 'A' },
      {
        label: 'material.filter.availability.option.not.availability',
        value: 'NA',
      },
    ],
  },
  {
    title: 'material.filter.loanable',
    name: 'loanable',
    type: 'radio',
    options: [
      { label: 'material.filter.loanable.option.all', value: '' },
      { label: 'material.filter.loanable.option.loanable', value: 'L' },
      { label: 'material.filter.loanable.option.not.loanable', value: 'NL' },
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
    label: 'appointment.sort.date.created',
    value: 'createdAt',
  },
  {
    label: 'appointment.sort.price',
    value: 'price',
  },
  {
    label: 'appointment.sort.type',
    value: 'type',
  },
  {
    label: 'appointment.sort.start.date',
    value: 'startProposedDate',
  },
  {
    label: 'appointment.sort.end.date',
    value: 'endProposedDate',
  },
  {
    label: 'appointment.sort.final.date',
    value: 'finalDate',
  },
]

export const FILTER_OPTIONS_APPOINTMENTS = [
  {
    title: 'appointment.filter.scheduled',
    name: 'scheduled',
    type: 'radio',
    options: [
      { label: 'appointment.filter.scheduled.option.all', value: '' },
      { label: 'appointment.filter.scheduled.option.scheduled', value: 'S' },
      {
        label: 'appointment.filter.scheduled.option.not.scheduled',
        value: 'NS',
      },
    ],
  },
  {
    title: 'appointment.filter.type',
    name: 'type',
    type: 'checkbox',
    options: [
      { label: 'appointment.filter.type.option.repair', value: 'R' },
      { label: 'appointment.filter.type.option.maintenance', value: 'M' },
      { label: 'appointment.filter.type.option.other', value: 'O' },
    ],
  },
  {
    title: 'appointment.filter.status',
    name: 'status',
    type: 'radio',
    options: [
      { label: 'appointment.filter.status.option.all', value: '' },
      { label: 'appointment.filter.status.option.done', value: 'D' },
      { label: 'appointment.filter.status.option.not.done', value: 'ND' },
    ],
  },
  {
    title: 'appointment.filter.priority',
    name: 'priority',
    type: 'radio',
    options: [
      { label: 'appointment.filter.priority.option.all', value: '' },
      { label: 'appointment.filter.priority.option.priority', value: 'P' },
      { label: 'appointment.filter.priority.option.not.priority', value: 'NP' },
    ],
  },
]

export const SORT_OPTIONS_SCHEDULES = [
  {
    label: 'Date Created',
    value: 'createdAt',
  },
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
    title: 'absences.filter.type',
    name: 'type',
    type: 'checkbox',
    options: [
      { label: 'absences.filter.type.option.sick', value: 'S' },
      { label: 'absences.filter.type.option.vacation', value: 'V' },
      { label: 'absences.filter.type.option.other', value: 'O' },
    ],
  },
]

export const SORT_OPTIONS_ABSENCES = [
  {
    label: 'absences.sort.date.created',
    value: 'createdAt',
  },
  {
    label: 'absences.sort.start.date',
    value: 'startDate',
  },
  {
    label: 'absences.sort.end.date',
    value: 'endDate',
  },
  {
    label: 'absences.sort.total.days',
    value: 'totalDays',
  },
  {
    label: 'absences.sort.type',
    value: 'type',
  },
]
