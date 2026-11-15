import { describe, it, expect } from 'vitest'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-dto', () => {
  describe('fromProfileCover', () => {
    it('adds the official mark and the novel to the cover', () => {
      const coverApi = coverSeeder.getProfileCoverApi()

      expect(CoverDto.fromProfileCover(coverApi)).toEqual({
        ...CoverDto.fromCover(coverApi),
        isOfficial: coverApi.is_official,
        novel: NovelDto.fromSummary(coverApi.novel),
      })
    })
  })
})
