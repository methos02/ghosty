import { describe, it, expect, vi, afterEach } from 'vitest'
import { CommentController } from '@/apis/comments/controllers/comment-controller.js'
import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('asks the thread of a chapter for the requested page', async () => {
      const target = commentSeeder.getChapterTarget()
      vi.spyOn(CommentRepository, 'listForChapter').mockResolvedValue(
        controllerSuccess({ data: commentSeeder.getThreadApi() }),
      )

      await CommentController.list(target, 2)

      expect(CommentRepository.listForChapter).toHaveBeenCalledWith({
        params: CommentDto.toThreadParams(target, 2),
      })
    })

    it('asks the first page of the thread of a novel when no page is given', async () => {
      const target = commentSeeder.getNovelTarget()
      vi.spyOn(CommentRepository, 'listForNovel').mockResolvedValue(
        controllerSuccess({ data: commentSeeder.getThreadApi() }),
      )

      await CommentController.list(target)

      expect(CommentRepository.listForNovel).toHaveBeenCalledWith({
        params: CommentDto.toThreadParams(target, 1),
      })
    })

    it('asks the thread of a cover', async () => {
      const target = commentSeeder.getCoverTarget()
      vi.spyOn(CommentRepository, 'listForCover').mockResolvedValue(
        controllerSuccess({ data: commentSeeder.getThreadApi() }),
      )

      await CommentController.list(target)

      expect(CommentRepository.listForCover).toHaveBeenCalledWith({
        params: CommentDto.toThreadParams(target, 1),
      })
    })

    it('returns the comments of the thread and their pagination', async () => {
      const threadApi = commentSeeder.getThreadApi()
      vi.spyOn(CommentRepository, 'listForChapter').mockResolvedValue(
        controllerSuccess({ data: threadApi }),
      )

      const result = await CommentController.list(commentSeeder.getChapterTarget())

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        comments: CommentDto.fromList(threadApi.comments),
        pagination: PaginationDto.fromMeta(threadApi.meta),
      })
    })

    it('passes the failure through untouched', async () => {
      const failure = controllerError()
      vi.spyOn(CommentRepository, 'listForChapter').mockResolvedValue(failure)

      expect(await CommentController.list(commentSeeder.getChapterTarget())).toBe(failure)
    })
  })
})
