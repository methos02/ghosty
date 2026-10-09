import { describe, it, expect } from 'vitest'
import { dateTests } from '@/services/form/src/defaultTests/dates-test.js'

const FORMAT = 'dd/mm/yyyy'

describe('dates-test', () => {
  describe('dateFutur', () => {
    it('accepts a clearly future date', () => {
      expect(dateTests.dateFutur('01/01/2099', FORMAT)).toBe('')
    })

    it('rejects a clearly past date', () => {
      expect(dateTests.dateFutur('01/01/2000', FORMAT)).toBe('date_not_futur')
    })
  })
})
