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

  describe('filterByGenre', () => {
    it('keeps the current term and restarts on the first page', async () => {
      const list = vi.spyOn(NovelController, 'list').mockResolvedValue({
        status: STATUS.SUCCESS,
        novels: novelSeeder.getNovels(2),
        pagination: paginationSeeder.getPagination(),
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
      filterStore.setSearch('virage')

      await composable.novelSearch.filterByGenre(7)

      expect(list).toHaveBeenCalledWith({ page: 1, search: 'virage', genreId: 7 })
      expect(filterStore.genreId.value).toBe(7)
    })
  })
})
