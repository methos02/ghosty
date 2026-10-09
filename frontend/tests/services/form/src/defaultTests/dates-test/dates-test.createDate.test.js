import { describe, it, expect } from 'vitest'
import { createDate } from '@/services/form/src/defaultTests/dates-test.js'

const FORMAT = 'dd/mm/yyyy'

describe('dates-test', () => {
  describe('createDate', () => {
    it('builds a Date from a valid dd/mm/yyyy string', () => {
      const result = createDate('25/12/2024', FORMAT)

      expect(result).toBeInstanceOf(Date)
      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(11)
      expect(result.getDate()).toBe(25)
    })

    it('returns "date_invalid" when the pattern does not match', () => {
      expect(createDate('2024-12-25', FORMAT)).toBe('date_invalid')
    })

    it('returns "date_invalid" for an out-of-range day', () => {
      expect(createDate('32/12/2024', FORMAT)).toBe('date_invalid')
    })
  })
})
