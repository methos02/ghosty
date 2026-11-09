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

  describe('update', () => {
    it('sends the chapter id in the url and the corrected text in the body', async () => {
      vi.spyOn(ChapterRepository, 'update').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getChapterApi(),
      })
      const formData = chapterSeeder.getWriteForm()

      await ChapterController.update(10, formData)

      expect(ChapterRepository.update).toHaveBeenCalledWith({
        params: ChapterDto.toChapterParams(10),
        body: ChapterDto.toUpdate(formData),
        form: 'chapter',
      })
    })

    it('returns the corrected chapter read back from the response', async () => {
      vi.spyOn(ChapterRepository, 'update').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getChapterApi(),
      })

      const result = await ChapterController.update(10, chapterSeeder.getWriteForm())

      expect(result.chapter).toEqual(chapterSeeder.getChapter())
    })

    it('passes the repository error through untouched', async () => {
      const failure = { status: STATUS.ERROR_FORBIDDEN, error: 'interdit' }
      vi.spyOn(ChapterRepository, 'update').mockResolvedValue(failure)

      expect(await ChapterController.update(10, chapterSeeder.getWriteForm())).toBe(failure)
    })
  })
})
