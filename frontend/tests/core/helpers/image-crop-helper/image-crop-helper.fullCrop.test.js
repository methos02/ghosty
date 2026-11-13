import { describe, it, expect } from 'vitest'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'

describe('image-crop-helper', () => {
  describe('fullCrop', () => {
    it('keeps the whole width of a tall image and centres it vertically', () => {
      expect(imageCropHelper.fullCrop({ width: 1600, height: 1200 })).toEqual({
        x: 0,
        y: 150,
        width: 1600,
        height: 900,
      })
    })

    it('keeps the whole height of a wide image and centres it horizontally', () => {
      expect(imageCropHelper.fullCrop({ width: 2000, height: 900 })).toEqual({
        x: 200,
        y: 0,
        width: 1600,
        height: 900,
      })
    })
  })
})
