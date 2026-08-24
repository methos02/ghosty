import { describe, it, expect, vi, afterEach } from 'vitest'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-controller', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('reading', () => {
    it('forwards the novel slug and the chapter id to the repository', async () => {
      vi.spyOn(ChapterRepository, 'reading').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getReadingApi(),
      })

      await ChapterController.reading('nuit-virage', 11)

      expect(ChapterRepository.reading).toHaveBeenCalledWith({
        params: ChapterDto.toReadingParams('nuit-virage', 11),
      })
    })

    it('returns the chapter, its ancestors and its children mapped', async () => {
      vi.spyOn(ChapterRepository, 'reading').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getReadingApi(),
      })

      const result = await ChapterController.reading('nuit-virage', 11)

      expect(result).toEqual({ status: STATUS.SUCCESS, ...chapterSeeder.getReading() })
    })

    it('names the child that prolongs the current branch', async () => {
      vi.spyOn(ChapterRepository, 'reading').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getReadingApi({ next_chapter_id: 13 }),
      })

      const result = await ChapterController.reading('nuit-virage', 11)

      expect(result.nextChapterId).toBe(13)
    })

    it('passes the repository error through untouched', async () => {
      const failure = { status: STATUS.NOT_FOUND, error: 'introuvable' }
      vi.spyOn(ChapterRepository, 'reading').mockResolvedValue(failure)

      const result = await ChapterController.reading('nuit-virage', 999)

      expect(result).toBe(failure)
    })
  })
})
