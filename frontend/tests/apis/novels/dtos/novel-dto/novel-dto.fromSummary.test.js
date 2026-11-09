import { describe, it, expect } from 'vitest'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('novel-dto', () => {
  describe('fromSummary', () => {
    it('maps the novel summary carried by a chapter', () => {
      const novelApi = chapterSeeder.getChapterApi().novel

      expect(NovelDto.fromSummary(novelApi)).toEqual({
        id: novelApi.id,
        slug: novelApi.slug,
        title: novelApi.title,
        genreId: novelApi.genre_id,
      })
    })

    it('leaves every field empty when the chapter does not carry its novel', () => {
      expect(NovelDto.fromSummary(undefined)).toEqual({
        id: undefined,
        slug: undefined,
        title: undefined,
        genreId: undefined,
      })
    })
  })
})
