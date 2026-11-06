import { describe, it, expect, vi, afterEach } from 'vitest'
import { CommentController } from '@/apis/comments/controllers/comment-controller.js'
import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('destroy', () => {
    it('deletes the comment by its id', async () => {
      const comment = commentSeeder.getComment()
      vi.spyOn(CommentRepository, 'destroy').mockResolvedValue(
        controllerSuccess({ data: commentSeeder.getDeletedApi() }),
      )

      await CommentController.destroy(comment)

      expect(CommentRepository.destroy).toHaveBeenCalledWith({
        params: CommentDto.toCommentParams(comment.id),
      })
    })

    it('reports the deletion with the new total of the content', async () => {
      const deletedApi = commentSeeder.getDeletedApi()
      vi.spyOn(CommentRepository, 'destroy').mockResolvedValue(
        controllerSuccess({ data: deletedApi }),
      )

      expect(await CommentController.destroy(commentSeeder.getComment())).toEqual({
        status: STATUS.SUCCESS,
        commentCount: CommentDto.fromCommentCount(deletedApi),
      })
    })

    it('passes the refusal through untouched', async () => {
      const refusal = controllerError(STATUS.FORBIDDEN)
      vi.spyOn(CommentRepository, 'destroy').mockResolvedValue(refusal)

      expect(await CommentController.destroy(commentSeeder.getComment())).toBe(refusal)
    })
  })
})
