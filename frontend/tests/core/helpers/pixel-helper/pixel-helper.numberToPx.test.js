import { describe, it, expect } from 'vitest'
import { pixelHelper } from '@/core/helpers/pixel-helper.js'

describe('pixel-helper', () => {
  describe('numberToPx', () => {
    it('should append px to a number', () => {
      expect(pixelHelper.numberToPx(2)).toBe('2px')
      expect(pixelHelper.numberToPx(0)).toBe('0px')
    })

    it('should round-trip with pxToNumber', () => {
      expect(pixelHelper.pxToNumber(pixelHelper.numberToPx(42))).toBe(42)
    })
  })
})
