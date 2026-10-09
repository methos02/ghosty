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

  describe('mainBranch', () => {
    it('forwards the novel slug to the repository', async () => {
      vi.spyOn(ChapterRepository, 'mainBranch').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { chapters: chapterSeeder.getMainBranchApi(3) },
      })

      await ChapterController.mainBranch('nuit-virage')

      expect(ChapterRepository.mainBranch).toHaveBeenCalledWith({
        params: ChapterDto.toMainBranchParams('nuit-virage'),
      })
    })

    it('returns the mapped branch on success', async () => {
      vi.spyOn(ChapterRepository, 'mainBranch').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { chapters: chapterSeeder.getMainBranchApi(3) },
      })

      const result = await ChapterController.mainBranch('nuit-virage')

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.chapters).toEqual(chapterSeeder.getMainBranch(3))
    })

    it('passes the repository error through untouched', async () => {
      vi.spyOn(ChapterRepository, 'mainBranch').mockResolvedValue({
        status: STATUS.ERROR_SERVER,
        error: 'boom',
      })

      const result = await ChapterController.mainBranch('nuit-virage')

      expect(result).toEqual({ status: STATUS.ERROR_SERVER, error: 'boom' })
    })
  })
})
