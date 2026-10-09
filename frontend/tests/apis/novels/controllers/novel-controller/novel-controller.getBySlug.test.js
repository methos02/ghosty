import { describe, it, expect, vi, afterEach } from 'vitest'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('novel-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getBySlug', () => {
    it('forwards the slug param and returns the mapped novel on success', async () => {
      const novelApi = novelSeeder.getNovelApi({ slug: 'mon-roman' })
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: novelApi,
      })

      const result = await NovelController.getBySlug('mon-roman')

      expect(NovelRepository.getBySlug).toHaveBeenCalledWith({
        params: NovelDto.toShowParams('mon-roman'),
      })
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
