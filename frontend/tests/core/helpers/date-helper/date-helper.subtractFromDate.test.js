import { describe, it, expect } from 'vitest'
import { dateHelper } from '@/core/helpers/date-helper.js'

describe('date-helper', () => {
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
