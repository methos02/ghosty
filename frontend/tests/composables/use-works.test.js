import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

let useWorks
let WorkController

describe('use-works', () => {
  beforeEach(async () => {
    const controllerModule = await import('@/apis/works/controllers/work-controller.js')
    const composableModule = await import('@/composables/use-works.js')
    WorkController = controllerModule.WorkController
    useWorks = composableModule.useWorks
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetModules()
  })

  describe('fetchWorks', () => {
    it('stores the fetched works on success', async () => {
      vi.spyOn(WorkController, 'list').mockResolvedValue(
        controllerSuccess({ works: [{ id: 1 }, { id: 2 }] }),
      )
      const { fetchWorks, works } = useWorks()

      await fetchWorks({ novel_id: 1 })

      expect(WorkController.list).toHaveBeenCalledWith({ novel_id: 1 })
      expect(works.value).toHaveLength(2)
    })

    it('returns the error response and leaves works untouched on failure', async () => {
      const failure = controllerError()
      vi.spyOn(WorkController, 'list').mockResolvedValue(failure)
      const { fetchWorks, works } = useWorks()

      const response = await fetchWorks()

      expect(response).toBe(failure)
      expect(works.value).toHaveLength(0)
    })
  })

  describe('fetchWork', () => {
    it('stores the current work on success', async () => {
      vi.spyOn(WorkController, 'getById').mockResolvedValue(controllerSuccess({ work: { id: 5 } }))
      const { fetchWork, currentWork } = useWorks()

      await fetchWork(5)

      expect(WorkController.getById).toHaveBeenCalledWith(5)
      expect(currentWork.value).toEqual({ id: 5 })
    })

    it('passes the error response through on failure', async () => {
      const failure = controllerError()
      vi.spyOn(WorkController, 'getById').mockResolvedValue(failure)
      const { fetchWork } = useWorks()

      expect(await fetchWork(5)).toBe(failure)
    })
  })

  describe('createWork', () => {
    it('prepends the created work to the list', async () => {
      const { fetchWorks, createWork, works } = useWorks()
      vi.spyOn(WorkController, 'list').mockResolvedValue(controllerSuccess({ works: [{ id: 1 }] }))
      await fetchWorks()

      vi.spyOn(WorkController, 'create').mockResolvedValue(controllerSuccess({ work: { id: 2 } }))
      await createWork({ title: 'T' })

      expect(works.value.map(work => work.id)).toEqual([2, 1])
    })

    it('passes the error response through on failure', async () => {
      const failure = controllerError()
      vi.spyOn(WorkController, 'create').mockResolvedValue(failure)
      const { createWork } = useWorks()

      expect(await createWork({})).toBe(failure)
    })
  })

  describe('updateWork', () => {
    it('replaces the matching work in the list', async () => {
      const { fetchWorks, updateWork, works } = useWorks()
      vi.spyOn(WorkController, 'list').mockResolvedValue(
        controllerSuccess({ works: [{ id: 1, title: 'old' }, { id: 2 }] }),
      )
      await fetchWorks()

      vi.spyOn(WorkController, 'update').mockResolvedValue(
        controllerSuccess({ work: { id: 1, title: 'new' } }),
      )
      await updateWork(1, { title: 'new' })

      expect(WorkController.update).toHaveBeenCalledWith(1, { title: 'new' })
      expect(works.value[0]).toEqual({ id: 1, title: 'new' })
    })

    it('leaves the list unchanged when the id is not found', async () => {
      const { fetchWorks, updateWork, works } = useWorks()
      vi.spyOn(WorkController, 'list').mockResolvedValue(controllerSuccess({ works: [{ id: 1 }] }))
      await fetchWorks()

      vi.spyOn(WorkController, 'update').mockResolvedValue(
        controllerSuccess({ work: { id: 99, title: 'x' } }),
      )
      await updateWork(99, { title: 'x' })

      expect(works.value).toEqual([{ id: 1 }])
    })

    it('passes the error response through on failure', async () => {
      const failure = controllerError()
      vi.spyOn(WorkController, 'update').mockResolvedValue(failure)
      const { updateWork } = useWorks()

      expect(await updateWork(1, {})).toBe(failure)
    })
  })

  describe('voteWork', () => {
    it('delegates to the controller vote', async () => {
      vi.spyOn(WorkController, 'vote').mockResolvedValue(controllerSuccess({ work: { id: 1 } }))
      const { voteWork } = useWorks()

      const result = await voteWork(1, 1)

      expect(WorkController.vote).toHaveBeenCalledWith(1, 1)
      expect(result.status).toBe(STATUS.SUCCESS)
    })
  })
})
