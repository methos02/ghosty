import { describe, it, expect } from 'vitest'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-dto', () => {
  describe('toCreateReply', () => {
    it('sends the reply with the id of the mentioned author', () => {
      const formData = commentSeeder.getCreateForm()
      const mentionedAuthor = commentSeeder.getReply().author

      expect(CommentDto.toCreateReply(formData, mentionedAuthor)).toEqual({
        ...CommentDto.toCreate(formData),
        mentioned_user_id: mentionedAuthor.id,
      })
    })
  })
})
