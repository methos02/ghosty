import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import NovelDetailDialog from '@/views/novels/NovelDetailDialog.vue'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { createChapterStore, CHAPTER_STORE_KEY } from '@/apis/chapters/stores/chapter-store.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

const router = routerPlugin.getRouter()

describe('NovelDetailDialog.vue', () => {
  afterEach(async () => {
    await router.push('/')
    vi.clearAllMocks()
  })

  it('loads the main branch and displays its first chapter', async () => {
    vi.spyOn(ChapterController, 'mainBranch').mockResolvedValue(
      controllerSuccess({
        chapters: [
          chapterSeeder.getChapter({ id: 10, title: 'Le Réveil', summary: 'Il était une fois...' }),
        ],
      }),
    )

    const novel = novelSeeder.getNovel()
    const novelStore = createNovelStore()
    novelStore.setSelectedNovel(novel)
    await router.push({ name: 'novel-detail', params: { slug: novel.slug } })
    await router.isReady()
    const wrapper = mount(NovelDetailDialog, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [CHAPTER_STORE_KEY]: createChapterStore(),
        },
      },
    })
    await flushPromises()

    expect(ChapterController.mainBranch).toHaveBeenCalledWith(novel.slug)
    expect(wrapper.find('.dialog-header h2').text()).toBe(novel.title)
    expect(wrapper.text()).toContain('Résumé — Le Réveil')
    expect(wrapper.find('.novel-detail-dialog__summary').text()).toBe('Il était une fois...')
  })

  it('fetches the novel by slug when it is not already in the store (direct access)', async () => {
    const novel = novelSeeder.getNovel()
    vi.spyOn(NovelController, 'getBySlug').mockResolvedValue(controllerSuccess({ novel }))
    vi.spyOn(ChapterController, 'mainBranch').mockResolvedValue(
      controllerSuccess({
        chapters: [chapterSeeder.getChapter({ id: 10, title: 'Ch', summary: '...' })],
      }),
    )

    const novelStore = createNovelStore()
    await router.push({ name: 'novel-detail', params: { slug: novel.slug } })
    await router.isReady()
    const wrapper = mount(NovelDetailDialog, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [CHAPTER_STORE_KEY]: createChapterStore(),
        },
      },
    })
    await flushPromises()

    expect(NovelController.getBySlug).toHaveBeenCalledWith(novel.slug)
    expect(ChapterController.mainBranch).toHaveBeenCalledWith(novel.slug)
    expect(wrapper.find('.dialog-header h2').text()).toBe(novel.title)
  })

  it('opens on the first chapter of the novel, whatever the branch holds after it', async () => {
    vi.spyOn(ChapterController, 'mainBranch').mockResolvedValue(
      controllerSuccess({
        chapters: [
          chapterSeeder.getChapter({ id: 10, title: 'Premier', summary: 'Début' }),
          chapterSeeder.getChapter({ id: 11, title: 'Second', summary: 'Suite' }),
        ],
      }),
    )

    const novel = novelSeeder.getNovel()
    const novelStore = createNovelStore()
    novelStore.setSelectedNovel(novel)
    await router.push({ name: 'novel-detail', params: { slug: novel.slug } })
    await router.isReady()
    const wrapper = mount(NovelDetailDialog, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [CHAPTER_STORE_KEY]: createChapterStore(),
        },
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Résumé — Premier')
    expect(wrapper.find('.novel-detail-dialog__summary').text()).toBe('Début')
  })

  it('shows the error message when the branch fails to load', async () => {
    vi.spyOn(ChapterController, 'mainBranch').mockResolvedValue(
      controllerError(undefined, 'Chargement impossible'),
    )

    const novel = novelSeeder.getNovel()
    const novelStore = createNovelStore()
    novelStore.setSelectedNovel(novel)
    await router.push({ name: 'novel-detail', params: { slug: novel.slug } })
    await router.isReady()
    const wrapper = mount(NovelDetailDialog, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [CHAPTER_STORE_KEY]: createChapterStore(),
        },
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Chargement impossible')
  })

  it('opens the multiverse on the displayed chapter, not on the popular branch', async () => {
    vi.spyOn(ChapterController, 'mainBranch').mockResolvedValue(
      controllerSuccess({
        chapters: [
          chapterSeeder.getChapter({ id: 10, title: 'Le Réveil', summary: 'Il était une fois...' }),
        ],
      }),
    )
    const novel = novelSeeder.getNovel()
    const novelStore = createNovelStore()
    novelStore.setSelectedNovel(novel)
    await router.push({ name: 'novel-detail', params: { slug: novel.slug } })
    await router.isReady()
    const wrapper = mount(NovelDetailDialog, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [CHAPTER_STORE_KEY]: createChapterStore(),
        },
      },
    })
    await flushPromises()

    await wrapper.find('.novel-detail-dialog__explore').trigger('click')

    await vi.waitFor(() => {
      expect(router.currentRoute.value.name).toBe('multiverse')
    })
    expect(router.currentRoute.value.params).toEqual({ slug: novel.slug })
    expect(router.currentRoute.value.query).toEqual({ from: '10' })
  })
})
