import { describe, it, expect } from 'vitest'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-dto', () => {
  describe('fromSummary', () => {
    it('maps the cover summary carried by a notification', () => {
      const coverApi = coverSeeder.getCoverApi()

      expect(CoverDto.fromSummary(coverApi)).toEqual({
        id: coverApi.id,
        imageUrl: coverApi.image_url,
      })
    })

    it('returns undefined when the notification carries no cover', () => {
      expect(CoverDto.fromSummary(null)).toBeUndefined()
    })
  })
})
