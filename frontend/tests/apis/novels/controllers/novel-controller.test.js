import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

describe('novel-controller', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('list', () => {
    beforeEach(() => {
      vi.spyOn(NovelRepository, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: {
          data: novelSeeder.getNovelsApi(2),
          meta: paginationSeeder.getMetaApi(),
        },
      })
    })

    it('forwards the paginated page param to the repository', async () => {
      await NovelController.list(2)

      expect(NovelRepository.list).toHaveBeenCalledWith({ params: { page: 2 } })
    })

    it('defaults to page 1 when no page is given', async () => {
      await NovelController.list()

      expect(NovelRepository.list).toHaveBeenCalledWith({ params: { page: 1 } })
    })

    it('returns mapped novels and pagination on success', async () => {
      const result = await NovelController.list()

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.novels).toHaveLength(2)
      expect(result.novels[0].coverUrl).toBe('https://example.test/covers/1.jpg')
      expect(result.pagination).toEqual({
        page: 1,
        nextPage: 2,
        size: 15,
        total: 45,
        lastPage: 3,
      })
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
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: novelSeeder.getNovelApi({ slug: 'mon-roman' }),
      })

      const result = await NovelController.getBySlug('mon-roman')

      expect(NovelRepository.getBySlug).toHaveBeenCalledWith({ params: { slug: 'mon-roman' } })
      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.novel.slug).toBe('mon-roman')
      expect(result.novel.author.pseudo).toBe('GhostWriter')
    })

    it('passes the error response through untouched on failure', async () => {
      const errorResponse = { status: STATUS.NOT_FOUND, error: 'missing' }
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(errorResponse)

      const result = await NovelController.getBySlug('inconnu')

      expect(result).toBe(errorResponse)
    })
  })
})
