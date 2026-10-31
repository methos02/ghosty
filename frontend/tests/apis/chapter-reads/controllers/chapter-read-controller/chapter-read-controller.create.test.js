import { describe, it, expect, vi, afterEach } from 'vitest'
import { ChapterReadController } from '@/apis/chapter-reads/controllers/chapter-read-controller.js'
import { ChapterReadRepository } from '@/apis/chapter-reads/repositories/chapter-read-repository.js'
import { ChapterReadDto } from '@/apis/chapter-reads/dtos/chapter-read-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { chapterReadSeeder } from '&/utils/seeders/chapter-read-seeder.js'

describe('chapter-read-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('records the read under the reading session and propagates the empty answer', async () => {
      const chapter = chapterSeeder.getChapter()
      vi.spyOn(ChapterReadRepository, 'create').mockResolvedValue({ status: STATUS.NO_CONTENT })

      const result = await ChapterReadController.create(chapter, chapterReadSeeder.getSessionKey())

      expect(ChapterReadRepository.create).toHaveBeenCalledWith({
        params: ChapterReadDto.toChapterParams(chapter.id),
        body: ChapterReadDto.toCreate(chapterReadSeeder.getSessionKey()),
      })
      expect(result).toEqual({ status: STATUS.NO_CONTENT })
    })

    it('passes the throttle refusal through untouched', async () => {
      const refusal = controllerError(STATUS.TOO_MANY_REQUESTS)
      vi.spyOn(ChapterReadRepository, 'create').mockResolvedValue(refusal)

      const result = await ChapterReadController.create(
        chapterSeeder.getChapter(),
        chapterReadSeeder.getSessionKey(),
      )

      expect(result).toBe(refusal)
    })
  })
})
