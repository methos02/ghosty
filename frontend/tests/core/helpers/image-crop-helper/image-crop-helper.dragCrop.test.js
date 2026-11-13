import { describe, it, expect } from 'vitest'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'

describe('image-crop-helper', () => {
  describe('dragCrop', () => {
    it('moves the crop opposite to the drag, scaled from the frame to the image', () => {
      expect(
        imageCropHelper.dragCrop(
          { x: 400, y: 225, width: 800, height: 450 },
          { width: 1600, height: 900 },
          { x: 100, y: 50, frameWidth: 400 },
        ),
      ).toEqual({ x: 200, y: 125, width: 800, height: 450 })
    })

    it('stops the crop at the edges of the image', () => {
      expect(
        imageCropHelper.dragCrop(
          { x: 400, y: 225, width: 800, height: 450 },
          { width: 1600, height: 900 },
          { x: -1000, y: 1000, frameWidth: 400 },
        ),
      ).toEqual({ x: 800, y: 0, width: 800, height: 450 })
    })
  })
})
