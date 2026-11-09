import { describe, it, expect } from 'vitest'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('moderation-dto', () => {
  describe('fromComment', () => {
    it('maps a comment posted on a chapter with its context', () => {
      const commentApi = moderationSeeder.getModeratedCommentApi()

      expect(ModerationDto.fromComment(commentApi)).toEqual({
        ...CommentDto.fromShow(commentApi),
        chapter: ChapterDto.fromSummary(commentApi.chapter),
        novel: NovelDto.fromSummary(commentApi.novel),
      })
    })

    it('leaves the chapter out of a comment posted on the novel', () => {
      expect(
        ModerationDto.fromComment(moderationSeeder.getModeratedCommentApi({ chapter: null }))
          .chapter,
      ).toBeUndefined()
    })

    it('reads the erased content of a deleted comment as an empty text', () => {
      expect(
        ModerationDto.fromComment(
          moderationSeeder.getModeratedCommentApi({ content: null, is_deleted: true }),
        ).content,
      ).toBe('')
    })
  })
})
