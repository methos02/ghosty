import { describe, it, expect } from 'vitest'
import { imageFileHelper } from '@/core/helpers/image-file-helper.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('image-file-helper', () => {
  describe('decode', () => {
    it('reads the dimensions of an image', async () => {
      const image = await imageFileHelper.decode(
        coverSeeder.getImageFile({ width: 1200, height: 800 }),
      )

      expect({ width: image.width, height: image.height }).toEqual({ width: 1200, height: 800 })
      expect(image.bitmap.width).toBe(1200)
    })

    it('gives an empty image for a file that is not an image', async () => {
      expect(await imageFileHelper.decode(coverSeeder.getUnreadableFile())).toEqual({
        width: 0,
        height: 0,
      })
    })
  })
})
