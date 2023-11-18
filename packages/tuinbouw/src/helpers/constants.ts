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
