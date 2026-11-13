import { describe, it, expect } from 'vitest'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-dto', () => {
  describe('fromLike', () => {
    it('maps the liked cover and the cover the like was moved from', () => {
      const likeApi = coverSeeder.getLikeApi()

      expect(CoverDto.fromLike(likeApi)).toEqual({
        covers: [CoverDto.fromCover(likeApi.cover), CoverDto.fromCover(likeApi.moved_from)],
        officialCoverId: likeApi.official_cover_id,
      })
    })

    it('maps the cover alone when the like was withdrawn', () => {
      const unlikeApi = coverSeeder.getUnlikeApi()

      expect(CoverDto.fromLike(unlikeApi)).toEqual({
        covers: [CoverDto.fromCover(unlikeApi.cover)],
        officialCoverId: unlikeApi.official_cover_id,
      })
    })
  })
})
