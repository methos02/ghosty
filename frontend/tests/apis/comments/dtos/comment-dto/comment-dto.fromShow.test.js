import { describe, it, expect } from 'vitest'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-dto', () => {
  describe('fromShow', () => {
    it('maps the comment, its author, its spoiler flag and its replies', () => {
      const api = commentSeeder.getCommentWithReplyApi({ is_spoiler: true })
      const [replyApi] = api.replies

      expect(CommentDto.fromShow(api)).toEqual({
        id: api.id,
        parentId: api.parent_id,
        author: AuthorDto.fromShow(api.author),
        content: api.content,
        isSpoiler: api.is_spoiler,
        isDeleted: api.is_deleted,
        replies: [
          {
            id: replyApi.id,
            parentId: replyApi.parent_id,
            author: AuthorDto.fromShow(replyApi.author),
            content: replyApi.content,
            isSpoiler: replyApi.is_spoiler,
            isDeleted: replyApi.is_deleted,
            replies: [],
            createdAtFormat: dateHelper.formatDateLocal(replyApi.created_at, 'DD/MM/YYYY HH:mm'),
          },
        ],
        createdAtFormat: dateHelper.formatDateLocal(api.created_at, 'DD/MM/YYYY HH:mm'),
      })
    })

    it('leaves no author and an empty text to a deleted comment the api stripped', () => {
      const comment = CommentDto.fromShow(commentSeeder.getDeletedCommentApi())

      expect(comment.author).toBeUndefined()
      expect(comment.content).toBe('')
      expect(comment.isDeleted).toBe(true)
    })
  })
})
