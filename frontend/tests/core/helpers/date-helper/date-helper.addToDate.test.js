import { describe, it, expect } from 'vitest'
import { dateHelper } from '@/core/helpers/date-helper.js'

describe('date-helper', () => {
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
})
