import { describe, it, expect, vi, afterEach } from 'vitest'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('published', () => {
    it('returns the published chapters of the author grouped by novel', async () => {
      vi.spyOn(ChapterRepository, 'published').mockResolvedValue(
        controllerSuccess({ data: chapterSeeder.getPublishedApi() }),
      )

      const result = await ChapterController.published()

      expect(ChapterRepository.published).toHaveBeenCalled()
      expect(result).toEqual({
        status: STATUS.SUCCESS,
        novels: chapterSeeder.getPublished(),
      })
    })

    it('forwards a failing response untouched', async () => {
      const failure = controllerError()
      vi.spyOn(ChapterRepository, 'published').mockResolvedValue(failure)

      expect(await ChapterController.published()).toBe(failure)
    })
  })
})
