import { describe, it, expect } from 'vitest'
import { utilsH } from '@/core/helpers/utils-helper.js'

describe('utils-helper', () => {
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
})
