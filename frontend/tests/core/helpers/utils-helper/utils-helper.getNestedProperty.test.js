import { describe, it, expect } from 'vitest'
import { utilsH } from '@/core/helpers/utils-helper.js'

describe('utils-helper', () => {
  describe('getNestedProperty', () => {
    it('reads a direct property', () => {
      expect(utilsH.getNestedProperty({ a: 1 }, 'a')).toBe(1)
    })

    it('reads a dotted nested path', () => {
      expect(utilsH.getNestedProperty({ a: { b: { c: 42 } } }, 'a.b.c')).toBe(42)
    })

    it('returns undefined when a segment of the path is missing', () => {
      expect(utilsH.getNestedProperty({ a: {} }, 'a.b.c')).toBeUndefined()
    })

    it('throws when the object is not an object', () => {
      expect(() => utilsH.getNestedProperty(undefined, 'a')).toThrow()
    })

    it('throws when the key is null or undefined', () => {
      expect(() => utilsH.getNestedProperty({ a: 1 }, null)).toThrow()
    })
  })
})
