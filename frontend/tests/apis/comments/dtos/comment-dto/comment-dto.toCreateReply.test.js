import { describe, it, expect } from 'vitest'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-dto', () => {
  describe('toCreateReply', () => {
    it('sends the reply with the id of the mentioned user', () => {
      const formData = commentSeeder.getReplyForm()

      expect(CommentDto.toCreateReply(formData)).toEqual({
        ...CommentDto.toCreate(formData),
        mentioned_user_id: formData.mentionedUser.id,
      })
    })

    it('sends no mentioned user once the mention was removed', () => {
      const formData = commentSeeder.getReplyForm({ mentionedUser: undefined })

      expect(CommentDto.toCreateReply(formData)).toStrictEqual({
        ...CommentDto.toCreate(formData),
        mentioned_user_id: undefined,
      })
    })
  })
})
