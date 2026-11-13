import { describe, it, expect } from 'vitest'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'

describe('image-crop-helper', () => {
  describe('isLargeEnough', () => {
    it('accepts an image giving exactly the minimum width in 16/9', () => {
      expect(imageCropHelper.isLargeEnough({ width: 800, height: 450 })).toBe(true)
    })

    it('refuses an image giving less than the minimum width in 16/9', () => {
      expect(imageCropHelper.isLargeEnough({ width: 1000, height: 400 })).toBe(false)
    })
  })
})
