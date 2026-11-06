import { describe, it, expect } from 'vitest'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-dto', () => {
  describe('toCreate', () => {
    it('sends the text and the spoiler flag under the api field names', () => {
      const formData = commentSeeder.getCreateForm({ isSpoiler: true })

      expect(CommentDto.toCreate(formData)).toEqual({
        content: formData.content,
        is_spoiler: formData.isSpoiler,
      })
    })
  })
})
