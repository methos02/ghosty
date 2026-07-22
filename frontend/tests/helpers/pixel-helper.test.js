import { describe, it, expect } from 'vitest'
import { pixelHelper } from '@/helpers/pixel-helper.js'

describe('pixelHelper', () => {
  describe('pxToNumber', () => {
    it('should extract the numeric part of a px string', () => {
      expect(pixelHelper.pxToNumber('2px')).toBe(2)
      expect(pixelHelper.pxToNumber('2.5px')).toBe(2.5)
      expect(pixelHelper.pxToNumber('0px')).toBe(0)
    })

    it('should throw when the value is not numeric', () => {
      expect(() => pixelHelper.pxToNumber('auto')).toThrow()
      expect(() => pixelHelper.pxToNumber('10%')).toThrow()
    })
  })

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
