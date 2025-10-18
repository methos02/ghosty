/* eslint-disable no-magic-numbers */
import { dateHelper } from '@brugmann/vuemann/src/helpers/date-helper.js'

const isDateDisabled = (date, minDate, maxDate) => {
    if(maxDate) { return dateHelper.isAfter(date, maxDate) && dateHelper.formatDate(date, 'YYYY-MM-DD') !== maxDate }
    
    return dateHelper.isBefore(date, minDate) && dateHelper.formatDate(date, 'YYYY-MM-DD') !== minDate
}

const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    const endDate = new Date(lastDay)
    
    const dayOfWeek = firstDay.getDay()
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startDate.setDate(startDate.getDate() - mondayOffset)
    
    const days = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate || days.length < 42) {
        days.push({
            date: new Date(currentDate),
            isCurrentMonth: currentDate.getMonth() === month,
            isToday: dateHelper.formatDate(currentDate, 'YYYY-MM-DD') === dateHelper.currentDate('YYYY-MM-DD')
        })
        currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
}

const getMonthName = (month) => {
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ]
    return months[month]
}

const formatInputValue = (value) => {
    if (!value) {
        return ''
    }
    
    const numbers = value.replaceAll(/[^\d]/g, '')
    if (numbers.length === 0) {
        return ''
    }
    if (numbers.length <= 2) {
        return numbers
    }
    if (numbers.length <= 4) {
        return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
    }
    
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
}

export const InputDate = {
    isDateDisabled,
    generateCalendarDays,
    getMonthName,
    formatInputValue,
}
