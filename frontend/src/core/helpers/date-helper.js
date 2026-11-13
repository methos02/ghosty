import dayjsBase from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import utc from 'dayjs/plugin/utc.js'

const dayjs = dayjsBase.extend(customParseFormat).extend(utc)

const DD_MM_YYYY_REGEX = /^\d{2}\/\d{2}\/\d{4}$/

// eslint-disable-next-line max-params
const addToDate = (dateString, amount, unit, format = 'YYYY-MM-DD') => {
  return dayjs.utc(dateString).add(amount, unit).format(format)
}

const currentDate = (format = 'DD/MM/YYYY') => {
  return dayjs().format(format)
}

const currentDatetime = () => {
  return dayjs().format('DD/MM/YYYY HH:mm:ss')
}

const formatDate = (date_string, format = 'DD/MM/YYYY') => {
  return dayjs.utc(date_string).format(format)
}

const formatDateLocal = (date_string, format = 'DD/MM/YYYY') => {
  return dayjs(date_string).format(format)
}

const isAfter = (date1, date2, format) => {
  return internals.toDate(date1, format) > internals.toDate(date2, format)
}

const isAfterOrEqual = (date1, date2, format) => {
  return internals.toDate(date1, format) >= internals.toDate(date2, format)
}

const isBefore = (date1, date2, format) => {
  return internals.toDate(date1, format) < internals.toDate(date2, format)
}

const isBeforeOrEqual = (date1, date2, format) => {
  return internals.toDate(date1, format) <= internals.toDate(date2, format)
}

const isValidDate = (dateString, format) => {
  if (!dateString || !format) {
    return false
  }

  try {
    const parsedDate = dateHelper.parseDate(dateString, format)
    const reparsedDate = dateHelper.formatDate(parsedDate, format)
    return reparsedDate === dateString
  } catch {
    return false
  }
}

const parseDate = (date_string, format = 'DD/MM/YYYY') => {
  return dayjs.utc(date_string, format).toISOString()
}

const parseDateLocal = (date_string, format = 'DD/MM/YYYY') => {
  return dayjs(date_string, format).toISOString()
}

// eslint-disable-next-line max-params
const subtractFromDate = (dateString, amount, unit, format = 'YYYY-MM-DD') => {
  return dayjs.utc(dateString).subtract(amount, unit).format(format)
}

export const dateHelper = {
  addToDate,
  currentDate,
  currentDatetime,
  formatDate,
  formatDateLocal,
  isAfter,
  isAfterOrEqual,
  isBefore,
  isBeforeOrEqual,
  isValidDate,
  parseDate,
  parseDateLocal,
  subtractFromDate,
}

const toDate = (date, format) => {
  if (!date) {
    return new Date()
  }
  if (format) {
    return dayjs(date, format).toDate()
  }
  if (DD_MM_YYYY_REGEX.test(date)) {
    return dayjs(date, 'DD/MM/YYYY').toDate()
  }
  return new Date(date)
}

export const internals = { toDate }
