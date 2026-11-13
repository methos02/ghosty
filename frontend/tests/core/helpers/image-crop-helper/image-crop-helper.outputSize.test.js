import { describe, it, expect } from 'vitest'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'

describe('image-crop-helper', () => {
  describe('outputSize', () => {
    it('keeps the size of a crop narrower than the maximum width', () => {
      expect(imageCropHelper.outputSize({ x: 0, y: 0, width: 1600, height: 900 })).toEqual({
        width: 1600,
        height: 900,
      })
    })

    it('shrinks a large crop down to the maximum width, in 16/9', () => {
      expect(imageCropHelper.outputSize({ x: 0, y: 0, width: 4000, height: 2250 })).toEqual({
        width: 1920,
        height: 1080,
      })
    })
  })
})
