import { describe, it, expect } from 'vitest'
import { dateTests, createDate } from '@/services/form/src/defaultTests/dates-test.js'

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

  describe('date', () => {
    it('returns an empty string for a valid date', () => {
      expect(dateTests.date('01/06/2024', FORMAT)).toBe('')
    })

    it('returns "date_invalid" for an invalid date', () => {
      expect(dateTests.date('99/99/9999', FORMAT)).toBe('date_invalid')
    })
  })

  describe('datePast', () => {
    it('accepts a clearly past date', () => {
      expect(dateTests.datePast('01/01/2000', FORMAT)).toBe('')
    })

    it('rejects a clearly future date', () => {
      expect(dateTests.datePast('01/01/2099', FORMAT)).toBe('date_not_past')
    })

    it('propagates invalidity from createDate', () => {
      expect(dateTests.datePast('99/99/9999', FORMAT)).toBe('date_invalid')
    })
  })

  describe('dateFutur', () => {
    it('accepts a clearly future date', () => {
      expect(dateTests.dateFutur('01/01/2099', FORMAT)).toBe('')
    })

    it('rejects a clearly past date', () => {
      expect(dateTests.dateFutur('01/01/2000', FORMAT)).toBe('date_not_futur')
    })
  })
})
