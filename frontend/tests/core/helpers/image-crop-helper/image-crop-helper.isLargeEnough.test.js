import { describe, it, expect } from 'vitest'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('image-crop-helper', () => {
  describe('isLargeEnough', () => {
    it('accepts an image giving exactly the minimum width in 16/9', () => {
      expect(
        imageCropHelper.isLargeEnough({
          size: { width: 800, height: 450 },
          format: ConfigLoader.get('cover'),
        }),
      ).toBe(true)
    })

    it('refuses an image giving less than the minimum width in 16/9', () => {
      expect(
        imageCropHelper.isLargeEnough({
          size: { width: 1000, height: 400 },
          format: ConfigLoader.get('cover'),
        }),
      ).toBe(false)
    })
  })
})
