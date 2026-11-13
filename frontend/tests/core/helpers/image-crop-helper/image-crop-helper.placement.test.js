import { describe, it, expect } from 'vitest'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'

describe('image-crop-helper', () => {
  describe('placement', () => {
    it('places the image so that the crop fills the frame', () => {
      expect(
        imageCropHelper.placement(
          { x: 400, y: 225, width: 800, height: 450 },
          { width: 1600, height: 900 },
        ),
      ).toEqual({ width: 200, left: -50, top: -50 })
    })
  })
})
