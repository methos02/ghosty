import { describe, it, expect } from 'vitest'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-dto', () => {
  describe('toTargetParams', () => {
    it('addresses a chapter by its id', () => {
      const target = commentSeeder.getChapterTarget()

      expect(CommentDto.toTargetParams(target)).toEqual({ chapter: target.chapterId })
    })

    it('addresses a cover by its id', () => {
      const target = commentSeeder.getCoverTarget()

      expect(CommentDto.toTargetParams(target)).toEqual({ cover: target.coverId })
    })

    it('addresses a novel by its slug', () => {
      const target = commentSeeder.getNovelTarget()

      expect(CommentDto.toTargetParams(target)).toEqual({ slug: target.novelSlug })
    })
  })
})
