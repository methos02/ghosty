import { describe, it, expect, vi, afterEach } from 'vitest'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('sends the novel slug in the url and the child in the body', async () => {
      vi.spyOn(ChapterRepository, 'create').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getChapterApi(),
      })
      const formData = chapterSeeder.getWriteForm()

      await ChapterController.create('nuit-virage', formData)

      expect(ChapterRepository.create).toHaveBeenCalledWith({
        params: ChapterDto.toCreateParams('nuit-virage'),
        body: ChapterDto.toCreate(formData),
      })
    })

    it('treats the 201 of a creation as a success', async () => {
      vi.spyOn(ChapterRepository, 'create').mockResolvedValue({
        status: STATUS.CREATED,
        data: chapterSeeder.getChapterApi(),
      })

      const result = await ChapterController.create('nuit-virage', chapterSeeder.getWriteForm())

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.chapter).toEqual(chapterSeeder.getChapter())
    })

    it('returns the published chapter read back from the response', async () => {
      vi.spyOn(ChapterRepository, 'create').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getChapterApi(),
      })

      const result = await ChapterController.create('nuit-virage', chapterSeeder.getWriteForm())

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.chapter).toEqual(chapterSeeder.getChapter())
    })

    it('registers validation errors on 422 and returns an error status', async () => {
      vi.spyOn(ChapterRepository, 'create').mockResolvedValue({
        status: STATUS.UNPROCESSABLE_ENTITY,
        data: { errors: { parent_id: ['introuvable'] } },
      })
      const addValidationErrors = vi.spyOn(form, 'addValidationErrors').mockImplementation(() => {})

      const result = await ChapterController.create('nuit-virage', chapterSeeder.getWriteForm())

      expect(addValidationErrors).toHaveBeenCalledWith({ parent_id: ['introuvable'] }, 'chapter')
      expect(result.status).toBe(STATUS.UNPROCESSABLE_ENTITY)
    })

    it('passes the repository error through untouched', async () => {
      const failure = { status: STATUS.ERROR_FORBIDDEN, error: 'interdit' }
      vi.spyOn(ChapterRepository, 'create').mockResolvedValue(failure)

      expect(await ChapterController.create('nuit-virage', chapterSeeder.getWriteForm())).toBe(
        failure,
      )
    })
  })
})
