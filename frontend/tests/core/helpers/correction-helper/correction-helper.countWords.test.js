import { describe, it, expect } from 'vitest'
import { correctionHelper } from '@/core/helpers/correction-helper.js'

describe('correction-helper', () => {
  describe('countWords', () => {
    it('ignores repeated spaces and edge whitespace', () => {
      expect(correctionHelper.countWords('  le   chat \n dort  ')).toBe(3)
    })

    it('counts nothing in an empty text', () => {
      expect(correctionHelper.countWords('   ')).toBe(0)
    })
  })
})
