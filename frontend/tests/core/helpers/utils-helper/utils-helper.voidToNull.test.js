import { describe, it, expect } from 'vitest'
import { utilsH } from '@/core/helpers/utils-helper.js'

describe('utils-helper', () => {
  describe('voidToNull', () => {
    it('maps undefined and null to null', () => {
      expect(utilsH.voidToNull(undefined)).toBeNull()
      expect(utilsH.voidToNull(null)).toBeNull()
    })

    it('keeps a defined value', () => {
      expect(utilsH.voidToNull(0)).toBe(0)
      expect(utilsH.voidToNull('x')).toBe('x')
    })
  })
})
