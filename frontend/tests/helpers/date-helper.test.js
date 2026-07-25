import { describe, it, expect, vi } from 'vitest'
import { dateHelper, dateHelperInternal } from '@/helpers/date-helper.js'

describe('dateHelper', () => {
  describe('parseDate', () => {
    it('should parse a date string with a given format and output in ISO format', () => {
      expect(dateHelper.parseDate('27/04/2025', 'DD/MM/YYYY')).toBe('2025-04-27T00:00:00.000Z')
    })
  })

  describe('formatDate', () => {
    it('should format a date string to the given format', () => {
      expect(dateHelper.formatDate('2025-04-27', 'DD/MM/YYYY')).toBe('27/04/2025')
    })

    it('should format a date string to default format if no format is provided', () => {
      expect(dateHelper.formatDate('2025-04-27')).toBe('27/04/2025')
    })
  })

  describe('isBefore', () => {
    it('should return true if first date is before second date', () => {
      expect(dateHelper.isBefore('2025-04-26', '2025-04-27')).toBe(true)
    })

    it('should return false if first date is after or equal to second date', () => {
      expect(dateHelper.isBefore('2025-04-28', '2025-04-27')).toBe(false)
    })

    it('should auto-detect DD/MM/YYYY format without explicit format', () => {
      expect(dateHelper.isBefore('26/04/2025', '27/04/2025')).toBe(true)
      expect(dateHelper.isBefore('28/04/2025', '27/04/2025')).toBe(false)
    })

    it('should compare dates with custom format', () => {
      expect(dateHelper.isBefore('26/04/2025', '27/04/2025', 'DD/MM/YYYY')).toBe(true)
      expect(dateHelper.isBefore('28/04/2025', '27/04/2025', 'DD/MM/YYYY')).toBe(false)
    })
  })

  describe('isBeforeOrEqual', () => {
    it('should return true if first date is before second date', () => {
      expect(dateHelper.isBeforeOrEqual('2025-04-26', '2025-04-27')).toBe(true)
    })

    it('should return true if dates are equal', () => {
      expect(dateHelper.isBeforeOrEqual('2025-04-27', '2025-04-27')).toBe(true)
    })

    it('should return false if first date is after second date', () => {
      expect(dateHelper.isBeforeOrEqual('2025-04-28', '2025-04-27')).toBe(false)
    })

    it('should compare dates with custom format', () => {
      expect(dateHelper.isBeforeOrEqual('26/04/2025', '27/04/2025', 'DD/MM/YYYY')).toBe(true)
      expect(dateHelper.isBeforeOrEqual('27/04/2025', '27/04/2025', 'DD/MM/YYYY')).toBe(true)
      expect(dateHelper.isBeforeOrEqual('28/04/2025', '27/04/2025', 'DD/MM/YYYY')).toBe(false)
    })
  })

  describe('isAfter', () => {
    it('should return true if first date is after second date', () => {
      expect(dateHelper.isAfter('2025-04-28', '2025-04-27')).toBe(true)
    })

    it('should return false if first date is before or equal to second date', () => {
      expect(dateHelper.isAfter('2025-04-26', '2025-04-27')).toBe(false)
    })

    it('should compare dates with custom format', () => {
      expect(dateHelper.isAfter('28/04/2025', '27/04/2025', 'DD/MM/YYYY')).toBe(true)
      expect(dateHelper.isAfter('26/04/2025', '27/04/2025', 'DD/MM/YYYY')).toBe(false)
    })
  })

  describe('isAfterOrEqual', () => {
    it('should return true if first date is after second date', () => {
      expect(dateHelper.isAfterOrEqual('2025-04-28', '2025-04-27')).toBe(true)
    })

    it('should return true if dates are equal', () => {
      expect(dateHelper.isAfterOrEqual('2025-04-27', '2025-04-27')).toBe(true)
    })

    it('should return false if first date is before second date', () => {
      expect(dateHelper.isAfterOrEqual('2025-04-26', '2025-04-27')).toBe(false)
    })

    it('should compare dates with custom format', () => {
      expect(dateHelper.isAfterOrEqual('28/04/2025', '27/04/2025', 'DD/MM/YYYY')).toBe(true)
      expect(dateHelper.isAfterOrEqual('27/04/2025', '27/04/2025', 'DD/MM/YYYY')).toBe(true)
      expect(dateHelper.isAfterOrEqual('26/04/2025', '27/04/2025', 'DD/MM/YYYY')).toBe(false)
    })
  })

  describe('currentDatetime', () => {
    it('should return the current datetime in DD/MM/YYYY HH:mm:ss format', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-04-27T12:34:56'))

      expect(dateHelper.currentDatetime()).toBe('27/04/2025 12:34:56')

      vi.useRealTimers()
    })
  })

  describe('addToDate', () => {
    it('should add days to a date', () => {
      expect(dateHelper.addToDate('2025-04-27', 1, 'day')).toBe('2025-04-28')
    })

    it('should add months to a date', () => {
      expect(dateHelper.addToDate('2025-04-27', 2, 'month')).toBe('2025-06-27')
    })

    it('should format with a custom format', () => {
      expect(dateHelper.addToDate('2025-04-27', 1, 'day', 'DD/MM/YYYY')).toBe('28/04/2025')
    })
  })

  describe('subtractFromDate', () => {
    it('should subtract days from a date', () => {
      expect(dateHelper.subtractFromDate('2025-04-27', 1, 'day')).toBe('2025-04-26')
    })

    it('should subtract hours from a date', () => {
      expect(
        dateHelper.subtractFromDate('2025-04-27T12:00:00', 3, 'hour', 'YYYY-MM-DD HH:mm:ss'),
      ).toBe('2025-04-27 09:00:00')
    })

    it('should format with a custom format', () => {
      expect(dateHelper.subtractFromDate('2025-04-27', 1, 'day', 'DD/MM/YYYY')).toBe('26/04/2025')
    })
  })
})

describe('dateHelperInternal', () => {
  describe('toDate', () => {
    it('should return current date when date is falsy', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-04-27T00:00:00'))

      expect(dateHelperInternal.toDate(null).toISOString()).toBe(
        new Date('2025-04-27T00:00:00').toISOString(),
      )

      vi.useRealTimers()
    })

    it('should parse with native Date when no format is provided', () => {
      expect(dateHelperInternal.toDate('2025-04-27')).toEqual(new Date('2025-04-27'))
    })

    it('should auto-detect DD/MM/YYYY format without explicit format', () => {
      const result = dateHelperInternal.toDate('27/04/2025')

      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(3)
      expect(result.getDate()).toBe(27)
    })

    it('should parse with dayjs when format is provided', () => {
      const result = dateHelperInternal.toDate('27/04/2025', 'DD/MM/YYYY')

      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(3)
      expect(result.getDate()).toBe(27)
    })
  })
})
