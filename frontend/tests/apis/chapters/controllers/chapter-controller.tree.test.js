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

  describe('tree', () => {
    it('asks for the whole tree when no origin is given', async () => {
      vi.spyOn(ChapterRepository, 'tree').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getTreeApi(),
      })

      await ChapterController.tree('nuit-virage')

      expect(ChapterRepository.tree).toHaveBeenCalledWith({
        params: ChapterDto.toTreeParams('nuit-virage', undefined),
      })
    })

    it('forwards the chapter the exploration resumes from', async () => {
      vi.spyOn(ChapterRepository, 'tree').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getTreeApi(),
      })

      await ChapterController.tree('nuit-virage', 12)

      expect(ChapterRepository.tree).toHaveBeenCalledWith({
        params: ChapterDto.toTreeParams('nuit-virage', 12),
      })
    })

    it('returns the mapped chapters and the current branch', async () => {
      vi.spyOn(ChapterRepository, 'tree').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getTreeApi(),
      })

      const result = await ChapterController.tree('nuit-virage')

      expect(result).toEqual({ status: STATUS.SUCCESS, ...chapterSeeder.getTree() })
    })

    it('passes the repository error through untouched', async () => {
      const failure = { status: STATUS.ERROR_SERVER, error: 'boom' }
      vi.spyOn(ChapterRepository, 'tree').mockResolvedValue(failure)

      const result = await ChapterController.tree('nuit-virage')

      expect(result).toBe(failure)
    })
  })
})
