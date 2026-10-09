import { describe, it, expect } from 'vitest'
import { correctionHelper } from '@/core/helpers/correction-helper.js'

describe('correction-helper', () => {
  describe('allowanceFor', () => {
    it('grants the floor to a short text, where a percentage would give nothing', () => {
      expect(correctionHelper.allowanceFor('le chat dort sur un toit')).toBe(5)
    })

    it('lets the percentage take over on a long text', () => {
      expect(correctionHelper.allowanceFor(Array(2000).fill('mot').join(' '))).toBe(20)
    })
  })
})
