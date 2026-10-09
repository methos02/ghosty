import { describe, it, expect } from 'vitest'
import { pixelHelper } from '@/core/helpers/pixel-helper.js'

describe('pixel-helper', () => {
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
})
