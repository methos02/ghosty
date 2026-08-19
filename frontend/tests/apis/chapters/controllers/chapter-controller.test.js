import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

  describe('currentContinuity', () => {
    beforeEach(() => {
      vi.spyOn(ChapterRepository, 'currentContinuity').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { chapters: chapterSeeder.getCurrentContinuityApi(3) },
      })
    })

    it('forwards the novel slug to the repository', async () => {
      await ChapterController.currentContinuity('nuit-virage')

      expect(ChapterRepository.currentContinuity).toHaveBeenCalledWith({
        params: ChapterDto.toCurrentContinuityParams('nuit-virage'),
      })
    })

    it('returns the mapped continuity on success', async () => {
      const result = await ChapterController.currentContinuity('nuit-virage')

      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.chapters).toEqual(chapterSeeder.getCurrentContinuity(3))
    })

    it('passes the repository error through untouched', async () => {
      vi.spyOn(ChapterRepository, 'currentContinuity').mockResolvedValue({
        status: STATUS.ERROR_SERVER,
        error: 'boom',
      })

      const result = await ChapterController.currentContinuity('nuit-virage')

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
        params: ChapterDto.toChapterParams(10),
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
        data: { chapters: chapterSeeder.getCurrentContinuityApi(2) },
      })

      const result = await ChapterController.children(10)

      expect(ChapterRepository.children).toHaveBeenCalledWith({
        params: ChapterDto.toChapterParams(10),
      })
      expect(result.chapters).toEqual(chapterSeeder.getCurrentContinuity(2))
    })
  })

  describe('create', () => {
    beforeEach(() => {
      vi.spyOn(ChapterRepository, 'create').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getChapterApi(),
      })
    })

    it('sends the novel slug in the url and the continuation in the body', async () => {
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

  describe('update', () => {
    beforeEach(() => {
      vi.spyOn(ChapterRepository, 'update').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: chapterSeeder.getChapterApi(),
      })
    })

    it('sends the chapter id in the url and the corrected text in the body', async () => {
      const formData = chapterSeeder.getWriteForm()

      await ChapterController.update(10, formData)

      expect(ChapterRepository.update).toHaveBeenCalledWith({
        params: ChapterDto.toChapterParams(10),
        body: ChapterDto.toUpdate(formData),
      })
    })

    it('returns the corrected chapter read back from the response', async () => {
      const result = await ChapterController.update(10, chapterSeeder.getWriteForm())

      expect(result.chapter).toEqual(chapterSeeder.getChapter())
    })

    it('registers the refusal of a rewrite on 422 and returns an error status', async () => {
      vi.spyOn(ChapterRepository, 'update').mockResolvedValue({
        status: STATUS.UNPROCESSABLE_ENTITY,
        data: { errors: { content: ['texte réécrit'] } },
      })
      const addValidationErrors = vi.spyOn(form, 'addValidationErrors').mockImplementation(() => {})

      const result = await ChapterController.update(10, chapterSeeder.getWriteForm())

      expect(addValidationErrors).toHaveBeenCalledWith({ content: ['texte réécrit'] }, 'chapter')
      expect(result.status).toBe(STATUS.UNPROCESSABLE_ENTITY)
    })

    it('passes the repository error through untouched', async () => {
      const failure = { status: STATUS.ERROR_FORBIDDEN, error: 'interdit' }
      vi.spyOn(ChapterRepository, 'update').mockResolvedValue(failure)

      expect(await ChapterController.update(10, chapterSeeder.getWriteForm())).toBe(failure)
    })
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
