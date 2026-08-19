import { describe, it, expect } from 'vitest'
import { utilsH } from '@/core/helpers/utils-helper.js'

describe('utils-helper', () => {
  describe('copyObject', () => {
    it('deep-clones nested plain objects', () => {
      const source = { a: 1, nested: { b: 2 } }

      const clone = utilsH.copyObject(source)
      clone.nested.b = 99

      expect(clone).toEqual({ a: 1, nested: { b: 99 } })
      expect(source.nested.b).toBe(2)
    })

    it('copies null and undefined values as-is', () => {
      const clone = utilsH.copyObject({ a: null, b: undefined, c: 3 })

      expect(clone).toEqual({ a: null, b: undefined, c: 3 })
    })

    it('keeps arrays by reference (not treated as plain objects)', () => {
      const arr = [1, 2]
      const clone = utilsH.copyObject({ list: arr })

      expect(clone.list).toBe(arr)
    })
  })

  describe('getGenreIconClass', () => {
    it('returns the venus icon for "f"', () => {
      expect(utilsH.getGenreIconClass('F')).toBe('fa-solid fa-venus')
      expect(utilsH.getGenreIconClass('f')).toBe('fa-solid fa-venus')
    })

    it('returns the mars icon for "m"', () => {
      expect(utilsH.getGenreIconClass('M')).toBe('fa-solid fa-mars')
    })

    it('returns the neuter icon for anything else', () => {
      expect(utilsH.getGenreIconClass('x')).toBe('fa-solid fa-neuter')
    })

    it('returns an empty string for a falsy value', () => {
      expect(utilsH.getGenreIconClass('')).toBe('')
      expect(utilsH.getGenreIconClass(undefined)).toBe('')
    })
  })

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

  describe('percentOf', () => {
    it('computes the percentage of a part over a total', () => {
      expect(utilsH.percentOf(25, 200)).toBe(12.5)
      expect(utilsH.percentOf(1, 4)).toBe(25)
    })
  })

  describe('voidToEmpty', () => {
    it('replaces null and undefined with empty strings', () => {
      expect(utilsH.voidToEmpty({ a: null, b: undefined, c: 'x', d: 0 })).toEqual({
        a: '',
        b: '',
        c: 'x',
        d: 0,
      })
    })

    it('keeps excluded keys untouched', () => {
      expect(utilsH.voidToEmpty({ a: null, b: null }, ['b'])).toEqual({ a: '', b: null })
    })
  })

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
