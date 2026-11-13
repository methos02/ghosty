import { describe, it, expect } from 'vitest'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('chapter-dto', () => {
  describe('fromSummary', () => {
    it('maps the chapter summary carried by a comment', () => {
      const chapterApi = moderationSeeder.getModeratedCommentApi().chapter

      expect(ChapterDto.fromSummary(chapterApi)).toEqual({
        id: chapterApi.id,
        title: chapterApi.title,
      })
    })

    it('returns undefined when the comment targets the novel itself', () => {
      expect(ChapterDto.fromSummary(null)).toBeUndefined()
    })
  })
})
