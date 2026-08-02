import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('mainContinuity', () => {
    beforeEach(() => {
      vi.spyOn(ChapterRepository, 'mainContinuity').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { chapters: chapterSeeder.getMainContinuityApi(3) },
      })
    })

    it('forwards the novel slug to the repository', async () => {
      await ChapterController.mainContinuity('nuit-virage')

      expect(ChapterRepository.mainContinuity).toHaveBeenCalledWith({
        params: ChapterDto.toMainContinuityParams('nuit-virage'),
      })
    })

    it('returns the mapped continuity on success', async () => {
      const result = await ChapterController.mainContinuity('nuit-virage')

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.chapters).toEqual(chapterSeeder.getMainContinuity(3))
    })

    it('passes the repository error through untouched', async () => {
      vi.spyOn(ChapterRepository, 'mainContinuity').mockResolvedValue({
        status: STATUS.ERROR_SERVER,
        error: 'boom',
      })

      const result = await ChapterController.mainContinuity('nuit-virage')

      expect(result).toEqual({ status: STATUS.ERROR_SERVER, error: 'boom' })
    })
  })

  describe('getById', () => {
    beforeEach(() => {
      vi.spyOn(ChapterRepository, 'getById').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getChapterApi(),
      })
    })

    it('forwards the chapter id to the repository', async () => {
      await ChapterController.getById(10)

      expect(ChapterRepository.getById).toHaveBeenCalledWith({
        params: ChapterDto.toShowParams(10),
      })
    })

    it('returns the mapped chapter on success', async () => {
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

  describe('children', () => {
    it('returns the proposed continuations of a chapter', async () => {
      vi.spyOn(ChapterRepository, 'children').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { chapters: chapterSeeder.getMainContinuityApi(2) },
      })

      const result = await ChapterController.children(10)

      expect(ChapterRepository.children).toHaveBeenCalledWith({
        params: ChapterDto.toShowParams(10),
      })
      expect(result.chapters).toEqual(chapterSeeder.getMainContinuity(2))
    })
  })
})
