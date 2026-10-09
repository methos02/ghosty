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

  describe('search', () => {
    it('sends the term and the selected genre to the api', async () => {
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
      filterStore.setGenreId(3)

      await composable.novelSearch.search('virage')

      expect(list).toHaveBeenCalledWith({ page: 1, search: 'virage', genreId: 3 })
    })

    it('replaces the grid instead of appending to it', async () => {
      vi.spyOn(NovelController, 'list').mockResolvedValue({
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
      await composable.novelSearch.search('virage')

      await composable.novelSearch.search('nuit')

      expect(novelStore.novels.value).toHaveLength(2)
    })

    it('leaves the grid untouched when the api fails', async () => {
      vi.spyOn(NovelController, 'list').mockResolvedValue({
        status: STATUS.ERROR_SERVER,
        error: 'boom',
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

      const result = await composable.novelSearch.search('virage')

      expect(novelStore.novels.value).toEqual([])
      expect(result.status).toBe(STATUS.ERROR_SERVER)
    })
  })
})
