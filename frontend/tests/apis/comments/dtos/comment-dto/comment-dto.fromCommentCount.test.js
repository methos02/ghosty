import { describe, it, expect } from 'vitest'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-dto', () => {
  describe('fromCommentCount', () => {
    it('reads the total of comments the api counts on the content', () => {
      const deletedApi = commentSeeder.getDeletedApi()

      expect(CommentDto.fromCommentCount(deletedApi)).toBe(deletedApi.comment_count)
    })
  })
})
