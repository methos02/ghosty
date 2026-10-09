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

describe('use-novel-search', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('loadMore', () => {
    it('asks for the next page and appends the result', async () => {
      const list = vi.spyOn(NovelController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        novels: novelSeeder.getNovels(2),
        pagination: paginationSeeder.getPagination({ nextPage: 2, lastPage: 3 }),
      })
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
            provide: { [NOVEL_STORE_KEY]: novelStore, [NOVEL_FILTER_STORE_KEY]: filterStore },
          },
        },
      )
      await composable.novelSearch.search('')

      await composable.novelSearch.loadMore()

      expect(list).toHaveBeenLastCalledWith({ page: 2, search: '', genreId: undefined })
      expect(novelStore.novels.value).toHaveLength(4)
    })

    it('does not call the api once the last page is loaded', async () => {
      const list = vi.spyOn(NovelController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        novels: novelSeeder.getNovels(2),
        pagination: paginationSeeder.getPagination({ nextPage: 4, lastPage: 3 }),
      })
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
            provide: { [NOVEL_STORE_KEY]: novelStore, [NOVEL_FILTER_STORE_KEY]: filterStore },
          },
        },
      )
      await composable.novelSearch.search('')

      const result = await composable.novelSearch.loadMore()

      expect(list).toHaveBeenCalledTimes(1)
      expect(result.status).toBe(STATUS.SUCCESS)
    })
  })
})
