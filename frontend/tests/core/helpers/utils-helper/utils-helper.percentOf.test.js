import { describe, it, expect } from 'vitest'
import { utilsH } from '@/core/helpers/utils-helper.js'

describe('utils-helper', () => {
  describe('percentOf', () => {
    it('computes the percentage of a part over a total', () => {
      expect(utilsH.percentOf(25, 200)).toBe(12.5)
      expect(utilsH.percentOf(1, 4)).toBe(25)
    })
  })
})
