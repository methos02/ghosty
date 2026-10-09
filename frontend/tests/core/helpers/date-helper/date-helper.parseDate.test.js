import { describe, it, expect } from 'vitest'
import { dateHelper } from '@/core/helpers/date-helper.js'

describe('date-helper', () => {
  describe('parseDate', () => {
    it('should parse a date string with a given format and output in ISO format', () => {
      expect(dateHelper.parseDate('27/04/2025', 'DD/MM/YYYY')).toBe('2025-04-27T00:00:00.000Z')
    })
  })
})
