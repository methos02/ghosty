import { describe, it, expect, vi, afterEach } from 'vitest'
import { dateHelperInternal } from '@/core/helpers/date-helper.js'

describe('date-helper', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('toDate', () => {
    it('should return current date when date is falsy', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-04-27T00:00:00'))

      expect(dateHelperInternal.toDate(null).toISOString()).toBe(
        new Date('2025-04-27T00:00:00').toISOString(),
      )
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
