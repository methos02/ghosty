import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import HomePage from '@/views/HomePage.vue'
import { GenreController } from '@/apis/genres/controllers/genre-controller.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import {
  createNovelFilterStore,
  NOVEL_FILTER_STORE_KEY,
} from '@/apis/novels/stores/novel-filter-store.js'
import { createChapterStore, CHAPTER_STORE_KEY } from '@/apis/chapters/stores/chapter-store.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { genreSeeder } from '&/utils/seeders/genre-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('HomePage.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.spyOn(GenreController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      genres: genreSeeder.getGenres(3),
    })
    vi.spyOn(NovelController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      novels: novelSeeder.getNovels(2),
      pagination: paginationSeeder.getPagination(),
    })
    vi.spyOn(ChapterController, 'drafts').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapters: [],
    })
  })

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    await router.push('/')
    vi.restoreAllMocks()
  })

  const mountAt = async target => {
    await router.push(target)
    wrapper = mount(HomePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [NOVEL_STORE_KEY]: createNovelStore(),
          [NOVEL_FILTER_STORE_KEY]: createNovelFilterStore(),
          [CHAPTER_STORE_KEY]: createChapterStore(),
        },
      },
    })
    await flushPromises()
    return wrapper
  }

  it('reads the novels on the home route, the writing form stays away', async () => {
    await mountAt('/')

    expect(wrapper.find('.novels-grid').exists()).toBe(true)
    expect(wrapper.find('.novel-manage__form').exists()).toBe(false)
  })

  it('opens the writing form on the creation route, without leaving the page', async () => {
    useAuthStore().setUser(userSeeder.getUser())

    await mountAt({ name: 'novel-create' })

    expect(wrapper.find('.novel-manage__form').exists()).toBe(true)
    expect(wrapper.find('.novels-grid').exists()).toBe(false)
  })

  it('derives the mode from the url, so a reload lands on the same screen', async () => {
    useAuthStore().setUser(userSeeder.getUser())
    await mountAt('/')
    expect(wrapper.find('.novel-manage__form').exists()).toBe(false)

    await router.push({ name: 'novel-create' })
    await flushPromises()

    expect(wrapper.find('.novel-manage__form').exists()).toBe(true)
  })

  it('sends the reader to the creation route when picking the writing tab', async () => {
    useAuthStore().setUser(userSeeder.getUser())
    await mountAt('/')

    await wrapper.findAll('.toolbar__mode')[0].trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('novel-create')
  })

  it('greets a visitor with the pitch, and an author with their summary', async () => {
    await mountAt('/')
    expect(wrapper.find('.top-title').exists()).toBe(true)
    expect(wrapper.find('.user-summary').exists()).toBe(false)

    useAuthStore().setUser(userSeeder.getUser())
    await flushPromises()

    expect(wrapper.find('.top-title').exists()).toBe(false)
    expect(wrapper.find('.user-summary').exists()).toBe(true)
  })
})
