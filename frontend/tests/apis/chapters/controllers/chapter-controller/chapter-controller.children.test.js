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

  describe('children', () => {
    it('returns the proposed children of a chapter', async () => {
      vi.spyOn(ChapterRepository, 'children').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { chapters: chapterSeeder.getMainBranchApi(2) },
      })

      const result = await ChapterController.children(10)

      expect(ChapterRepository.children).toHaveBeenCalledWith({
        params: ChapterDto.toChapterParams(10),
      })
      expect(result.chapters).toEqual(chapterSeeder.getMainBranch(2))
    })
  })
})
