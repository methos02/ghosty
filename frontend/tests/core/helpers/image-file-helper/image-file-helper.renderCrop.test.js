import { describe, it, expect } from 'vitest'
import { imageFileHelper } from '@/core/helpers/image-file-helper.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('image-file-helper', () => {
  describe('renderCrop', () => {
    it('produces a JPEG of the crop, shrunk to the maximum width', async () => {
      const { bitmap } = await imageFileHelper.decode(
        coverSeeder.getImageFile({ width: 4000, height: 3000 }),
      )

      const image = await imageFileHelper.renderCrop(bitmap, {
        x: 0,
        y: 375,
        width: 4000,
        height: 2250,
      })

      expect(image.name).toBe('illustration.jpg')
      expect(image.type).toBe('image/jpeg')
      expect(JSON.parse(await image.text())).toEqual({ width: 1920, height: 1080 })
    })
  })
})
