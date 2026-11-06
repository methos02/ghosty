import { describe, it, expect } from 'vitest'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-dto', () => {
  describe('toThreadParams', () => {
    it('adds the requested page to the address of the commented target', () => {
      const target = commentSeeder.getChapterTarget()

      expect(CommentDto.toThreadParams(target, 2)).toEqual({
        chapter: target.chapterId,
        page: 2,
      })
    })
  })
})
