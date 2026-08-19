import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NovelSearch from '@/views/parts/NovelSearch.vue'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import {
  createNovelFilterStore,
  NOVEL_FILTER_STORE_KEY,
} from '@/apis/novels/stores/novel-filter-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

const mountSearch = () => {
  const filterStore = createNovelFilterStore()
  const novelStore = createNovelStore()
  const wrapper = mount(NovelSearch, {
    global: {
      provide: {
        [NOVEL_FILTER_STORE_KEY]: filterStore,
        [NOVEL_STORE_KEY]: novelStore,
      },
    },
  })
  return { wrapper, store: filterStore, novelStore }
}

describe('NovelSearch.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const mockList = () =>
    vi.spyOn(NovelController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      novels: novelSeeder.getNovels(1),
      pagination: paginationSeeder.getPagination(),
    })

  it('sends the typed term to the api', async () => {
    const list = mockList()
    const { wrapper } = mountSearch()

    await wrapper.find('input[name="search"]').setValue('virage')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(list).toHaveBeenCalledWith({ page: 1, search: 'virage' })
  })

  it('replaces the grid instead of appending to it', async () => {
    mockList()
    const { wrapper, store, novelStore } = mountSearch()
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(novelStore.novels.value).toHaveLength(1)

    await wrapper.find('input[name="search"]').setValue('virage')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(novelStore.novels.value).toHaveLength(1)
    expect(store.search.value).toBe('virage')
  })

  it('clears the search and reloads every novel', async () => {
    const list = mockList()
    const { wrapper, store } = mountSearch()
    await wrapper.find('input[name="search"]').setValue('virage')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await wrapper.find('.novel-search__clear').trigger('click')
    await flushPromises()

    expect(list).toHaveBeenLastCalledWith({ page: 1, search: '' })
    expect(store.search.value).toBe('')
  })

  it('offers no way to clear an empty search', () => {
    const { wrapper } = mountSearch()

    expect(wrapper.find('.novel-search__clear').exists()).toBe(false)
  })
})
