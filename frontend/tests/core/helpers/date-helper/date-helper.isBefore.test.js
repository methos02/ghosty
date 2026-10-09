import { describe, it, expect } from 'vitest'
import { dateHelper } from '@/core/helpers/date-helper.js'

describe('date-helper', () => {
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
})
