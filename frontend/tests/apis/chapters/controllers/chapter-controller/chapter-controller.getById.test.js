import { describe, it, expect, vi, afterEach } from 'vitest'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getById', () => {
    it('forwards the chapter id to the repository', async () => {
      vi.spyOn(ChapterRepository, 'getById').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getChapterApi(),
      })

      await ChapterController.getById(10)

      expect(ChapterRepository.getById).toHaveBeenCalledWith({
        params: ChapterDto.toChapterParams(10),
      })
    })

    it('returns the mapped chapter on success', async () => {
      vi.spyOn(ChapterRepository, 'getById').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getChapterApi(),
      })

      const result = await ChapterController.getById(10)

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.chapter).toEqual(chapterSeeder.getChapter())
    })

    it('passes the repository error through untouched', async () => {
      vi.spyOn(ChapterRepository, 'getById').mockResolvedValue({
        status: STATUS.ERROR_NOT_FOUND,
        error: 'introuvable',
      })

      const result = await ChapterController.getById(999)

      expect(result).toEqual({ status: STATUS.ERROR_NOT_FOUND, error: 'introuvable' })
    })
  })
})
