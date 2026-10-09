import { describe, it, expect, vi, afterEach } from 'vitest'
import { dateHelper } from '@/core/helpers/date-helper.js'

describe('date-helper', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('currentDatetime', () => {
    it('should return the current datetime in DD/MM/YYYY HH:mm:ss format', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-04-27T12:34:56'))

      expect(dateHelper.currentDatetime()).toBe('27/04/2025 12:34:56')
    })
  })
})
