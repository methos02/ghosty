import { describe, it, expect, vi } from 'vitest'
import { dateHelper } from '@brugmann/vuemann/src/helpers/date-helper.js'

describe('dateHelper', () => {
  describe('parseDate', () => {
    it('should parse a date string with a given format and output in ISO format', () => {
      const inputDate = '27/04/2025'
      const inputFormat = 'DD/MM/YYYY'
      const expected = '2025-04-27T00:00:00.000Z'
      expect(dateHelper.parseDate(inputDate, inputFormat)).toBe(expected)
    })
  })

  describe('formatDate', () => {
    it('should format a date string to the given format', () => {
      const inputDate = '2025-04-27'
      const format = 'DD/MM/YYYY'
      const expected = '27/04/2025'
      expect(dateHelper.formatDate(inputDate, format)).toBe(expected)
    })

    it('should format a date string to default format if no format is provided', () => {
      const inputDate = '2025-04-27'
      const expected = '27/04/2025'
      expect(dateHelper.formatDate(inputDate)).toBe(expected)
    })
  })

  describe('isBefore', () => {
    it('should return true if first date is before second date', () => {
      const date1 = '2025-04-26'
      const date2 = '2025-04-27'
      expect(dateHelper.isBefore(date1, date2)).toBe(true)
    })

    it('should return false if first date is after or equal to second date', () => {
      const date1 = '2025-04-28'
      const date2 = '2025-04-27'
      expect(dateHelper.isBefore(date1, date2)).toBe(false)
    })
  })

  describe('isAfter', () => {
    it('should return true if first date is after second date', () => {
      const date1 = '2025-04-28'
      const date2 = '2025-04-27'
      expect(dateHelper.isAfter(date1, date2)).toBe(true)
    })

    it('should return false if first date is before or equal to second date', () => {
      const date1 = '2025-04-26'
      const date2 = '2025-04-27'
      expect(dateHelper.isAfter(date1, date2)).toBe(false)
    })
  })

  describe('currentDatetime', () => {
    it('should return the current datetime in DD/MM/YYYY HH:mm:ss format', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2025-04-27T12:34:56'))
        
        const expected = '27/04/2025 12:34:56'
        expect(dateHelper.currentDatetime()).toBe(expected)

        vi.useRealTimers()
    })
  })
})
