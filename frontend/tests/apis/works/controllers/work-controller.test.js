import { describe, it, expect, vi, afterEach } from 'vitest'
import { WorkController } from '@/apis/works/controllers/work-controller.js'
import { WorkRepository } from '@/apis/works/repositories/work-repository.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { workSeeder } from '&/utils/seeders/work-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

const success = data => ({ status: STATUS.SUCCESS, data })
const failure = { status: STATUS.ERROR_SERVER, error: 'boom' }

describe('work-controller', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('list', () => {
    it('forwards filters as params and returns mapped works + pagination', async () => {
      vi.spyOn(WorkRepository, 'list').mockResolvedValue(
        success({ works: workSeeder.getWorksApi(2), meta: paginationSeeder.getMetaApi() }),
      )

      const result = await WorkController.list({ novel_id: 1 })

      expect(WorkRepository.list).toHaveBeenCalledWith({ params: { novel_id: 1 } })
      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.works).toHaveLength(2)
      expect(result.works[0].type).toBe('chapter')
      expect(result.pagination.lastPage).toBe(3)
    })

    it('defaults filters to an empty object', async () => {
      vi.spyOn(WorkRepository, 'list').mockResolvedValue(
        success({ works: [], meta: paginationSeeder.getMetaApi({ total: 0 }) }),
      )

      await WorkController.list()

      expect(WorkRepository.list).toHaveBeenCalledWith({ params: {} })
    })

    it('passes the error response through on failure', async () => {
      vi.spyOn(WorkRepository, 'list').mockResolvedValue(failure)

      expect(await WorkController.list()).toBe(failure)
    })
  })

  describe('getById', () => {
    it('returns the mapped work on success', async () => {
      vi.spyOn(WorkRepository, 'getById').mockResolvedValue(success(workSeeder.getWorkApi()))

      const result = await WorkController.getById(10)

      expect(WorkRepository.getById).toHaveBeenCalledWith({ params: { id: 10 } })
      expect(result.work.id).toBe(10)
    })

    it('passes the error response through on failure', async () => {
      vi.spyOn(WorkRepository, 'getById').mockResolvedValue(failure)

      expect(await WorkController.getById(10)).toBe(failure)
    })
  })

  describe('getChapterByOrder', () => {
    it('queries the list endpoint with chapter filters and returns the first result', async () => {
      vi.spyOn(WorkRepository, 'list').mockResolvedValue(
        success({ works: [workSeeder.getWorkApi({ order: 2 })] }),
      )

      const result = await WorkController.getChapterByOrder('mon-roman', 2)

      expect(WorkRepository.list).toHaveBeenCalledWith({
        params: { novel_slug: 'mon-roman', order: 2, type: 1 },
      })
      expect(result.work.order).toBe(2)
    })
  })

  describe('getFirstChapter', () => {
    it('delegates to getChapterByOrder with order 1', async () => {
      vi.spyOn(WorkRepository, 'list').mockResolvedValue(
        success({ works: [workSeeder.getWorkApi({ order: 1 })] }),
      )

      const result = await WorkController.getFirstChapter('mon-roman')

      expect(WorkRepository.list).toHaveBeenCalledWith({
        params: { novel_slug: 'mon-roman', order: 1, type: 1 },
      })
      expect(result.work.order).toBe(1)
    })
  })

  describe('create', () => {
    it('sends the create payload as body and returns the mapped work', async () => {
      vi.spyOn(WorkRepository, 'create').mockResolvedValue(success(workSeeder.getWorkApi()))

      const result = await WorkController.create({ title: 'T', content: 'C', novelId: 1 })

      expect(WorkRepository.create).toHaveBeenCalledWith({
        body: { title: 'T', content: 'C', novel_id: 1 },
      })
      expect(result.work.id).toBe(10)
    })

    it('passes the error response through on failure', async () => {
      vi.spyOn(WorkRepository, 'create').mockResolvedValue(failure)

      expect(await WorkController.create({})).toBe(failure)
    })
  })

  describe('update', () => {
    it('sends id as param and editable fields as body', async () => {
      vi.spyOn(WorkRepository, 'update').mockResolvedValue(success(workSeeder.getWorkApi()))

      const result = await WorkController.update(10, { title: 'T', content: 'C', novelId: 1 })

      expect(WorkRepository.update).toHaveBeenCalledWith({
        params: { id: 10 },
        body: { title: 'T', content: 'C' },
      })
      expect(result.work.id).toBe(10)
    })
  })

  describe('vote', () => {
    it('sends id as param and the vote value as body', async () => {
      vi.spyOn(WorkRepository, 'vote').mockResolvedValue(success(workSeeder.getWorkApi()))

      const result = await WorkController.vote(10, -1)

      expect(WorkRepository.vote).toHaveBeenCalledWith({
        params: { id: 10 },
        body: { value: -1 },
      })
      expect(result.status).toBe(STATUS.SUCCESS)
    })

    it('passes the error response through on failure', async () => {
      vi.spyOn(WorkRepository, 'vote').mockResolvedValue(failure)

      expect(await WorkController.vote(10, 1)).toBe(failure)
    })
  })
})
