import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

const parseDate = (date_string, format = 'DD/MM/YYYY') => {
    return dayjs.utc(date_string, format).toISOString()
}

const formatDate = (date_string, format = 'DD/MM/YYYY') => {
    return dayjs.utc(date_string).format(format)
}

const parseDateLocal = (date_string, format = 'DD/MM/YYYY') => {
    return dayjs(date_string, format).toISOString()
}

const formatDateLocal = (date_string, format = 'DD/MM/YYYY') => {
    return dayjs(date_string).format(format)
}

const DD_MM_YYYY_REGEX = /^\d{2}\/\d{2}\/\d{4}$/
const toDate = (date, format) => {
    if (!date) { return new Date() }
    if (format) { return dayjs(date, format).toDate() }
    if (DD_MM_YYYY_REGEX.test(date)) { return dayjs(date, 'DD/MM/YYYY').toDate() }
    return new Date(date)
}

const isBefore = (date1, date2, format) => {
    return toDate(date1, format) < toDate(date2, format)
}

const isBeforeOrEqual = (date1, date2, format) => {
    return toDate(date1, format) <= toDate(date2, format)
}

const isAfter = (date1, date2, format) => {
    return toDate(date1, format) > toDate(date2, format)
}

const isAfterOrEqual = (date1, date2, format) => {
    return toDate(date1, format) >= toDate(date2, format)
}

const currentDatetime = () => {
    return dayjs().format('DD/MM/YYYY HH:mm:ss')
}

const currentDate = (format = 'DD/MM/YYYY') => {
    return dayjs().format(format)
}

const isValidDate = (dateString, format) => {
    if (!dateString || !format) { return false }

    try {
        const parsedDate = dateHelper.parseDate(dateString, format)
        const reparsedDate = dateHelper.formatDate(parsedDate, format)
        return reparsedDate === dateString
    } catch {
        return false
    }
}

// eslint-disable-next-line max-params
const addToDate = (dateString, amount, unit, format = 'YYYY-MM-DD') => {
    return dayjs.utc(dateString).add(amount, unit).format(format)
}

// eslint-disable-next-line max-params
const subtractFromDate = (dateString, amount, unit, format = 'YYYY-MM-DD') => {
    return dayjs.utc(dateString).subtract(amount, unit).format(format)
}

export const dateHelper = {
    parseDate,
    formatDate,
    parseDateLocal,
    formatDateLocal,
    isBefore,
    isBeforeOrEqual,
    isAfter,
    isAfterOrEqual,
    currentDatetime,
    currentDate,
    isValidDate,
    addToDate,
    subtractFromDate
}

export const dateHelperInternal = { toDate }
