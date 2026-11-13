import { describe, it, expect } from 'vitest'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'

describe('image-crop-helper', () => {
  describe('zoomCrop', () => {
    it('narrows the crop around its centre', () => {
      expect(
        imageCropHelper.zoomCrop(
          { x: 0, y: 0, width: 1600, height: 900 },
          { width: 1600, height: 900 },
          2,
        ),
      ).toEqual({ x: 400, y: 225, width: 800, height: 450 })
    })

    it('never zooms past the minimum output width', () => {
      expect(
        imageCropHelper.zoomCrop(
          { x: 0, y: 0, width: 1600, height: 900 },
          { width: 1600, height: 900 },
          5,
        ).width,
      ).toBe(800)
    })

    it('never zooms out past the whole image', () => {
      expect(
        imageCropHelper.zoomCrop(
          { x: 400, y: 225, width: 800, height: 450 },
          { width: 1600, height: 900 },
          0.5,
        ),
      ).toEqual({ x: 0, y: 0, width: 1600, height: 900 })
    })

    it('keeps the crop inside the image when zooming out near an edge', () => {
      expect(
        imageCropHelper.zoomCrop(
          { x: 0, y: 0, width: 800, height: 450 },
          { width: 1600, height: 900 },
          1.6,
        ),
      ).toEqual({ x: 0, y: 0, width: 1000, height: 562.5 })
    })
  })
})
