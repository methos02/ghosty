import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
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
      await NovelController.list({ page: 2 })

      expect(NovelRepository.list).toHaveBeenCalledWith({
        params: NovelDto.toListParams({ page: 2 }),
      })
    })

    it('defaults to page 1 when no page is given', async () => {
      await NovelController.list()

      expect(NovelRepository.list).toHaveBeenCalledWith({
        params: NovelDto.toListParams({ page: 1 }),
      })
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

  describe('create', () => {
    beforeEach(() => {
      vi.spyOn(NovelRepository, 'create').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: novelSeeder.getNovelApi(),
      })
    })

    it('sends the novel and its root chapter in a single payload', async () => {
      const formData = novelSeeder.getCreateForm()

      await NovelController.create(formData)

      expect(NovelRepository.create).toHaveBeenCalledWith({ body: NovelDto.toCreate(formData) })
    })

    it('treats the 201 of a creation as a success', async () => {
      vi.spyOn(NovelRepository, 'create').mockResolvedValue({
        status: STATUS.CREATED,
        data: novelSeeder.getNovelApi(),
      })

      const result = await NovelController.create(novelSeeder.getCreateForm())

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.novel).toEqual(novelSeeder.getNovel())
    })

    it('returns the created novel read back from the response', async () => {
      const result = await NovelController.create(novelSeeder.getCreateForm())

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.novel).toEqual(novelSeeder.getNovel())
    })

    it('registers validation errors on 422 and returns an error status', async () => {
      vi.spyOn(NovelRepository, 'create').mockResolvedValue({
        status: STATUS.UNPROCESSABLE_ENTITY,
        data: { errors: { genre_id: ['invalide'] } },
      })
      const addValidationErrors = vi.spyOn(form, 'addValidationErrors').mockImplementation(() => {})

      const result = await NovelController.create(novelSeeder.getCreateForm())

      expect(addValidationErrors).toHaveBeenCalledWith({ genre_id: ['invalide'] }, 'novel')
      expect(result.status).toBe(STATUS.UNPROCESSABLE_ENTITY)
    })

    it('passes the error response through untouched on failure', async () => {
      const errorResponse = { status: STATUS.ERROR_FORBIDDEN, error: 'interdit' }
      vi.spyOn(NovelRepository, 'create').mockResolvedValue(errorResponse)

      expect(await NovelController.create(novelSeeder.getCreateForm())).toBe(errorResponse)
    })
  })
})
