import { describe, it, expect, vi, afterEach } from 'vitest'
import { ChapterReadController } from '@/apis/chapter-reads/controllers/chapter-read-controller.js'
import { ChapterReadRepository } from '@/apis/chapter-reads/repositories/chapter-read-repository.js'
import { ChapterReadDto } from '@/apis/chapter-reads/dtos/chapter-read-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterReadSeeder } from '&/utils/seeders/chapter-read-seeder.js'

describe('chapter-read-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('asks for the requested page of the reading history', async () => {
      vi.spyOn(ChapterReadRepository, 'list').mockResolvedValue(
        controllerSuccess({ data: chapterReadSeeder.getListApi() }),
      )

      await ChapterReadController.list(3)

      expect(ChapterReadRepository.list).toHaveBeenCalledWith({
        params: ChapterReadDto.toListParams(3),
      })
    })

    it('returns the chapters read and their pagination', async () => {
      const listApi = chapterReadSeeder.getListApi()
      vi.spyOn(ChapterReadRepository, 'list').mockResolvedValue(
        controllerSuccess({ data: listApi }),
      )

      const result = await ChapterReadController.list()

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        reads: ChapterReadDto.fromList(listApi.reads),
        pagination: PaginationDto.fromMeta(listApi.meta),
      })
    })

    it('passes the failure through untouched', async () => {
      const failure = controllerError()
      vi.spyOn(ChapterReadRepository, 'list').mockResolvedValue(failure)

      expect(await ChapterReadController.list()).toBe(failure)
    })
  })
})
