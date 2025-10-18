import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(customParseFormat)
dayjs.extend(utc) 

const parseDate = (date_string, format = 'DD/MM/YYYY') => {
    return dayjs.utc(date_string, format).toISOString()
}

const formatDate = (date_string, format = 'DD/MM/YYYY') => {
    return dayjs(date_string).format(format)
}

const isBefore = (date1, date2) => {
    date1 = new Date(date1)
    date2 = date2 ? new Date(date2) : new Date()
    return date1 < date2
}

const isAfter = (date1, date2) => {
    const dateObject1 = new Date(date1)
    const dateObject2 = date2 ? new Date(date2) : new Date()  
    return dateObject1 > dateObject2
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

export const dateHelper = {
    parseDate,
    formatDate,
    isBefore,
    isAfter,
    currentDatetime,
    currentDate,
    isValidDate
}
