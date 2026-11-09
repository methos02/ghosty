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

  describe('create', () => {
    it('sends the novel and its root chapter in a single payload', async () => {
      vi.spyOn(NovelRepository, 'create').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: novelSeeder.getNovelApi(),
      })
      const formData = novelSeeder.getCreateForm()

      await NovelController.create(formData)

      expect(NovelRepository.create).toHaveBeenCalledWith({
        body: NovelDto.toCreate(formData),
        form: 'novel',
      })
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
      vi.spyOn(NovelRepository, 'create').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: novelSeeder.getNovelApi(),
      })

      const result = await NovelController.create(novelSeeder.getCreateForm())

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.novel).toEqual(novelSeeder.getNovel())
    })

    it('passes the error response through untouched on failure', async () => {
      const errorResponse = { status: STATUS.ERROR_FORBIDDEN, error: 'interdit' }
      vi.spyOn(NovelRepository, 'create').mockResolvedValue(errorResponse)

      expect(await NovelController.create(novelSeeder.getCreateForm())).toBe(errorResponse)
    })
  })
})
