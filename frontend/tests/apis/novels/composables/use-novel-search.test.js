import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useNovelSearch } from '@/apis/novels/composables/use-novel-search.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import {
  createNovelFilterStore,
  NOVEL_FILTER_STORE_KEY,
} from '@/apis/novels/stores/novel-filter-store.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

const mockList = (count = 2, pagination = paginationSeeder.getPagination()) =>
  vi.spyOn(NovelController, 'list').mockResolvedValue({
    status: STATUS.SUCCESS,
    novels: novelSeeder.getNovels(count),
    pagination,
  })

const withNovelSearch = () => {
  const novelStore = createNovelStore()
  const filterStore = createNovelFilterStore()
  let composable

  mount(
    {
      template: '<div />',
      setup() {
        composable = useNovelSearch()
        return {}
      },
    },
    {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [NOVEL_FILTER_STORE_KEY]: filterStore,
        },
      },
    },
  )

  return { novelSearch: composable.novelSearch, novelStore, filterStore }
}

describe('use-novel-search', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('search', () => {
    it('sends the term and the selected genre to the api', async () => {
      const list = mockList()
      const { novelSearch, filterStore } = withNovelSearch()
      filterStore.setGenreId(3)

      await novelSearch.search('virage')

      expect(list).toHaveBeenCalledWith({ page: 1, search: 'virage', genreId: 3 })
    })

    it('replaces the grid instead of appending to it', async () => {
      mockList()
      const { novelSearch, novelStore } = withNovelSearch()
      await novelSearch.search('virage')

      await novelSearch.search('nuit')

      expect(novelStore.novels.value).toHaveLength(2)
    })
  })

  describe('filterByGenre', () => {
    it('keeps the current term and restarts on the first page', async () => {
      const list = mockList()
      const { novelSearch, filterStore } = withNovelSearch()
      filterStore.setSearch('virage')

      await novelSearch.filterByGenre(7)

      expect(list).toHaveBeenCalledWith({ page: 1, search: 'virage', genreId: 7 })
      expect(filterStore.genreId.value).toBe(7)
    })
  })

  describe('loadMore', () => {
    it('asks for the next page and appends the result', async () => {
      const list = mockList(2, paginationSeeder.getPagination({ nextPage: 2, lastPage: 3 }))
      const { novelSearch, novelStore } = withNovelSearch()
      await novelSearch.search('')

      await novelSearch.loadMore()

      expect(list).toHaveBeenLastCalledWith({ page: 2, search: '', genreId: undefined })
      expect(novelStore.novels.value).toHaveLength(4)
    })

    it('does not call the api once the last page is loaded', async () => {
      const list = mockList(2, paginationSeeder.getPagination({ nextPage: 4, lastPage: 3 }))
      const { novelSearch } = withNovelSearch()
      await novelSearch.search('')

      const result = await novelSearch.loadMore()

      expect(list).toHaveBeenCalledTimes(1)
      expect(result.status).toBe(STATUS.SUCCESS)
    })
  })

  it('leaves the grid untouched when the api fails', async () => {
    vi.spyOn(NovelController, 'list').mockResolvedValue({
      status: STATUS.ERROR_SERVER,
      error: 'boom',
    })
    const { novelSearch, novelStore } = withNovelSearch()

    const result = await novelSearch.search('virage')

    expect(novelStore.novels.value).toEqual([])
    expect(result.status).toBe(STATUS.ERROR_SERVER)
  })
})
