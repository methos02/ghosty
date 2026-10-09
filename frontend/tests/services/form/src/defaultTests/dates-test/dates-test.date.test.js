import { describe, it, expect } from 'vitest'
import { dateTests } from '@/services/form/src/defaultTests/dates-test.js'

const FORMAT = 'dd/mm/yyyy'

describe('dates-test', () => {
  describe('date', () => {
    it('returns an empty string for a valid date', () => {
      expect(dateTests.date('01/06/2024', FORMAT)).toBe('')
    })

    it('returns "date_invalid" for an invalid date', () => {
      expect(dateTests.date('99/99/9999', FORMAT)).toBe('date_invalid')
    })
  })
})
