import { describe, it, expect, vi, afterEach } from 'vitest'
import { STATUS } from '@/constants/ajax-constants.js'
import { createSearchNovelsStore } from '@/composables/use-search-novels.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'

const listResult = (novels, pagination) => ({ status: STATUS.SUCCESS, novels, pagination })

describe('use-search-novels', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('setSort / setGenre', () => {
    it('updates the selected sort and genre', () => {
      const { selectedSort, selectedGenre, setSort, setGenre } = createSearchNovelsStore()

      setSort('Récents')
      setGenre('Fantastique')

      expect(selectedSort.value).toBe('Récents')
      expect(selectedGenre.value).toBe('Fantastique')
    })

    it('defaults sort to "Top 10" and genre to "Tous"', () => {
      const { selectedSort, selectedGenre } = createSearchNovelsStore()

      expect(selectedSort.value).toBe('Top 10')
      expect(selectedGenre.value).toBe('Tous')
    })
  })

  describe('loadNovels', () => {
    it('appends the loaded novels and stores pagination', async () => {
      vi.spyOn(NovelController, 'list').mockResolvedValue(
        listResult([{ id: 1 }, { id: 2 }], { nextPage: 2, lastPage: 3 }),
      )
      const { loadNovels, novels, pagination } = createSearchNovelsStore()

      const response = await loadNovels()

      expect(NovelController.list).toHaveBeenCalledWith(1)
      expect(novels.value).toHaveLength(2)
      expect(pagination.value).toEqual({ nextPage: 2, lastPage: 3 })
      expect(response.status).toBe(STATUS.SUCCESS)
    })

    it('accumulates novels across successive pages', async () => {
      const { loadNovels, novels } = createSearchNovelsStore()

      vi.spyOn(NovelController, 'list').mockResolvedValueOnce(
        listResult([{ id: 1 }], { nextPage: 2, lastPage: 3 }),
      )
      await loadNovels(1)

      NovelController.list.mockResolvedValueOnce(
        listResult([{ id: 2 }], { nextPage: 3, lastPage: 3 }),
      )
      await loadNovels(2)

      expect(novels.value.map(novel => novel.id)).toEqual([1, 2])
    })

    it('returns the error response and does not append on failure', async () => {
      const failure = { status: STATUS.ERROR_SERVER, error: 'boom' }
      vi.spyOn(NovelController, 'list').mockResolvedValue(failure)
      const { loadNovels, novels } = createSearchNovelsStore()

      const response = await loadNovels()

      expect(response).toBe(failure)
      expect(novels.value).toHaveLength(0)
    })
  })

  describe('loadMore', () => {
    it('loads the next page when more pages are available', async () => {
      const { loadNovels, loadMore } = createSearchNovelsStore()

      vi.spyOn(NovelController, 'list').mockResolvedValue(
        listResult([{ id: 1 }], { nextPage: 2, lastPage: 3 }),
      )
      await loadNovels(1)

      await loadMore()

      expect(NovelController.list).toHaveBeenLastCalledWith(2)
    })

    it('does nothing and returns success when no more pages', async () => {
      const { loadNovels, loadMore } = createSearchNovelsStore()

      vi.spyOn(NovelController, 'list').mockResolvedValue(
        listResult([{ id: 1 }], { nextPage: 4, lastPage: 3 }),
      )
      await loadNovels(1)
      NovelController.list.mockClear()

      const response = await loadMore()

      expect(NovelController.list).not.toHaveBeenCalled()
      expect(response).toEqual({ status: STATUS.SUCCESS })
    })
  })

  describe('hasMore', () => {
    it('is true while nextPage is within lastPage', async () => {
      const { loadNovels, hasMore } = createSearchNovelsStore()
      vi.spyOn(NovelController, 'list').mockResolvedValue(
        listResult([{ id: 1 }], { nextPage: 2, lastPage: 3 }),
      )

      await loadNovels(1)

      expect(hasMore()).toBe(true)
    })

    it('is false once nextPage passes lastPage', async () => {
      const { loadNovels, hasMore } = createSearchNovelsStore()
      vi.spyOn(NovelController, 'list').mockResolvedValue(
        listResult([{ id: 1 }], { nextPage: 4, lastPage: 3 }),
      )

      await loadNovels(1)

      expect(hasMore()).toBe(false)
    })
  })
})
