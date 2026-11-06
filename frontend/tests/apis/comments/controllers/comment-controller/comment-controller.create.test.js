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

  describe('create', () => {
    it('sends the comment to the commented chapter', async () => {
      const target = commentSeeder.getChapterTarget()
      const formData = commentSeeder.getCreateForm()
      vi.spyOn(CommentRepository, 'createOnChapter').mockResolvedValue({
        status: STATUS.CREATED,
        data: commentSeeder.getCreatedApi(),
      })

      await CommentController.create(target, formData)

      expect(CommentRepository.createOnChapter).toHaveBeenCalledWith({
        params: CommentDto.toTargetParams(target),
        body: CommentDto.toCreate(formData),
      })
    })

    it('sends the comment to the commented novel', async () => {
      const target = commentSeeder.getNovelTarget()
      const formData = commentSeeder.getCreateForm()
      vi.spyOn(CommentRepository, 'createOnNovel').mockResolvedValue({
        status: STATUS.CREATED,
        data: commentSeeder.getCreatedApi(),
      })

      await CommentController.create(target, formData)

      expect(CommentRepository.createOnNovel).toHaveBeenCalledWith({
        params: CommentDto.toTargetParams(target),
        body: CommentDto.toCreate(formData),
      })
    })

    it('returns the comment the api created and the new total', async () => {
      const createdApi = commentSeeder.getCreatedApi()
      vi.spyOn(CommentRepository, 'createOnChapter').mockResolvedValue({
        status: STATUS.CREATED,
        data: createdApi,
      })

      const result = await CommentController.create(
        commentSeeder.getChapterTarget(),
        commentSeeder.getCreateForm(),
      )

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        comment: CommentDto.fromShow(createdApi.comment),
        commentCount: CommentDto.fromCommentCount(createdApi),
      })
    })

    it('puts a text the api rejected back on the content field of the comment form', async () => {
      const errorsApi = commentSeeder.getValidationErrorsApi()
      vi.spyOn(CommentRepository, 'createOnChapter').mockResolvedValue({
        status: STATUS.UNPROCESSABLE_ENTITY,
        data: errorsApi,
      })

      await CommentController.create(
        commentSeeder.getChapterTarget(),
        commentSeeder.getCreateForm(),
      )

      expect(form.getError('comment.content')).toBe(errorsApi.errors.content[0])
    })

    it('passes the refusal through untouched', async () => {
      const refusal = controllerError(STATUS.FORBIDDEN)
      vi.spyOn(CommentRepository, 'createOnChapter').mockResolvedValue(refusal)

      expect(
        await CommentController.create(
          commentSeeder.getChapterTarget(),
          commentSeeder.getCreateForm(),
        ),
      ).toBe(refusal)
    })
  })
})
