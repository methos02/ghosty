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
})
