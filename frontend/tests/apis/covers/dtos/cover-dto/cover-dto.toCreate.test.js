import { describe, it, expect } from 'vitest'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-dto', () => {
  describe('toCreate', () => {
    it('sends the chosen image as a multipart image field', () => {
      const formData = coverSeeder.getCreateForm()

      const body = CoverDto.toCreate(formData)

      expect(body.get('image')).toBe(formData.image)
    })
  })
})
