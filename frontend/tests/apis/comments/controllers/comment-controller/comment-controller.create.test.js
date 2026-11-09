import { describe, it, expect, vi, afterEach } from 'vitest'
import { CommentController } from '@/apis/comments/controllers/comment-controller.js'
import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError } from '&/utils/helpers/controller-response.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-controller', () => {
  afterEach(() => {
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
        form: 'comment',
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
        form: 'comment',
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
