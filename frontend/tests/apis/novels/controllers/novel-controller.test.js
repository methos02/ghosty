import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

describe('novel-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    beforeEach(() => {
      vi.spyOn(NovelRepository, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: {
          novels: novelSeeder.getNovelsApi(2),
          meta: paginationSeeder.getMetaApi(),
        },
      })
    })

    it('forwards the paginated page param to the repository', async () => {
      await NovelController.list(2)

      expect(NovelRepository.list).toHaveBeenCalledWith({ params: NovelDto.toListParams(2) })
    })

    it('defaults to page 1 when no page is given', async () => {
      await NovelController.list()

      expect(NovelRepository.list).toHaveBeenCalledWith({ params: NovelDto.toListParams(1) })
    })

    it('returns mapped novels and pagination on success', async () => {
      const result = await NovelController.list()

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.novels).toEqual(novelSeeder.getNovels(2))
      expect(result.pagination).toEqual(PaginationDto.fromMeta(paginationSeeder.getMetaApi()))
    })

    it('passes the error response through untouched on failure', async () => {
      const errorResponse = { status: STATUS.ERROR_SERVER, error: 'boom' }
      vi.spyOn(NovelRepository, 'list').mockResolvedValue(errorResponse)

      const result = await NovelController.list()

      expect(result).toBe(errorResponse)
    })
  })

  describe('getBySlug', () => {
    it('forwards the slug param and returns the mapped novel on success', async () => {
      const novelApi = novelSeeder.getNovelApi({ slug: 'mon-roman' })
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: novelApi,
      })

      const result = await NovelController.getBySlug('mon-roman')

      expect(NovelRepository.getBySlug).toHaveBeenCalledWith({ params: NovelDto.toShowParams('mon-roman') })
      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.novel).toEqual(NovelDto.fromShow(novelApi))
    })

    it('passes the error response through untouched on failure', async () => {
      const errorResponse = { status: STATUS.NOT_FOUND, error: 'missing' }
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(errorResponse)

      const result = await NovelController.getBySlug('inconnu')

      expect(result).toBe(errorResponse)
    })
  })
})
