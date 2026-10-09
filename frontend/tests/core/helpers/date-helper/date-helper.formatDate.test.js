import { describe, it, expect } from 'vitest'
import { dateHelper } from '@/core/helpers/date-helper.js'

describe('date-helper', () => {
  describe('formatDate', () => {
    it('should format a date string to the given format', () => {
      expect(dateHelper.formatDate('2025-04-27', 'DD/MM/YYYY')).toBe('27/04/2025')
    })

    it('should format a date string to default format if no format is provided', () => {
      expect(dateHelper.formatDate('2025-04-27')).toBe('27/04/2025')
    })
  })
})
