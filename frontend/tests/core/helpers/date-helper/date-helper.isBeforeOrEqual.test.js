import { describe, it, expect } from 'vitest'
import { dateHelper } from '@/core/helpers/date-helper.js'

describe('date-helper', () => {
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
})
