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

  describe('drafts', () => {
    it('narrows the search to one parent instead of loading them all', async () => {
      vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { chapters: [chapterSeeder.getChapterApi({ id: 44 })] },
      })

      const result = await ChapterController.drafts({ parentId: 10 })

      expect(ChapterRepository.drafts).toHaveBeenCalledWith({
        params: ChapterDto.toDraftFilters({ parentId: 10 }),
      })
      expect(result.chapters[0].id).toBe(44)
    })

    it('asks the api for the root drafts only', async () => {
      vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { chapters: [] },
      })

      await ChapterController.drafts({ isRoot: true })

      expect(ChapterRepository.drafts).toHaveBeenCalledWith({
        params: { parent_id: undefined, is_root: true },
      })
    })

    it('forwards a failing response untouched', async () => {
      const failure = { status: STATUS.ERROR, error: 'boom' }
      vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(failure)

      expect(await ChapterController.drafts()).toBe(failure)
    })
  })
})
