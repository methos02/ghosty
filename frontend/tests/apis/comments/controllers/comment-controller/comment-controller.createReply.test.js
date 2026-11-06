import { describe, it, expect, vi, afterEach } from 'vitest'
import { CommentController } from '@/apis/comments/controllers/comment-controller.js'
import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { controllerError } from '&/utils/helpers/controller-response.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-controller', () => {
  afterEach(() => {
    form.clearErrors()
    vi.clearAllMocks()
  })

  describe('createReply', () => {
    it('sends the reply under the answered comment', async () => {
      const parentComment = commentSeeder.getComment()
      const formData = commentSeeder.getCreateForm()
      vi.spyOn(CommentRepository, 'createReply').mockResolvedValue({
        status: STATUS.CREATED,
        data: commentSeeder.getCreatedApi(commentSeeder.getReplyApi()),
      })

      await CommentController.createReply(parentComment, formData, parentComment.author)

      expect(CommentRepository.createReply).toHaveBeenCalledWith({
        params: CommentDto.toCommentParams(parentComment.id),
        body: CommentDto.toCreateReply(formData, parentComment.author),
      })
    })

    it('returns the reply the api created and the new total', async () => {
      const createdApi = commentSeeder.getCreatedApi(commentSeeder.getReplyApi())
      vi.spyOn(CommentRepository, 'createReply').mockResolvedValue({
        status: STATUS.CREATED,
        data: createdApi,
      })

      const result = await CommentController.createReply(
        commentSeeder.getComment(),
        commentSeeder.getCreateForm(),
        commentSeeder.getComment().author,
      )

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        comment: CommentDto.fromShow(createdApi.comment),
        commentCount: CommentDto.fromCommentCount(createdApi),
      })
    })

    it('puts a text the api rejected back on the content field of the reply form', async () => {
      const errorsApi = commentSeeder.getValidationErrorsApi()
      vi.spyOn(CommentRepository, 'createReply').mockResolvedValue({
        status: STATUS.UNPROCESSABLE_ENTITY,
        data: errorsApi,
      })

      await CommentController.createReply(
        commentSeeder.getComment(),
        commentSeeder.getCreateForm(),
        commentSeeder.getComment().author,
      )

      expect(form.getError('reply.content')).toBe(errorsApi.errors.content[0])
    })

    it('passes the refusal through untouched', async () => {
      const refusal = controllerError(STATUS.NOT_FOUND)
      vi.spyOn(CommentRepository, 'createReply').mockResolvedValue(refusal)

      expect(
        await CommentController.createReply(
          commentSeeder.getComment(),
          commentSeeder.getCreateForm(),
          commentSeeder.getComment().author,
        ),
      ).toBe(refusal)
    })
  })
})
