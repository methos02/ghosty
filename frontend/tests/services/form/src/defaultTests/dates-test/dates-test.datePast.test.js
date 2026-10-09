import { describe, it, expect } from 'vitest'
import { dateTests } from '@/services/form/src/defaultTests/dates-test.js'

const FORMAT = 'dd/mm/yyyy'

describe('dates-test', () => {
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
})
