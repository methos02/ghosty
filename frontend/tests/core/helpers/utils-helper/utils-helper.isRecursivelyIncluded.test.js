import { describe, it, expect } from 'vitest'
import { utilsH } from '@/core/helpers/utils-helper.js'

describe('utils-helper', () => {
  describe('isRecursivelyIncluded', () => {
    it('is true when the subset is contained in the object', () => {
      expect(
        utilsH.isRecursivelyIncluded({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2, d: 3 }, e: 4 }),
      ).toBe(true)
    })

    it('is false when a value differs', () => {
      expect(utilsH.isRecursivelyIncluded({ a: 1 }, { a: 2 })).toBe(false)
    })

    it('is false when a key is missing', () => {
      expect(utilsH.isRecursivelyIncluded({ a: 1, z: 9 }, { a: 1 })).toBe(false)
    })
  })
})
