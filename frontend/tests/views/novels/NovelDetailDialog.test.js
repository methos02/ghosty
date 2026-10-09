import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import NovelDetailDialog from '@/views/novels/NovelDetailDialog.vue'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { createChapterStore, CHAPTER_STORE_KEY } from '@/apis/chapters/stores/chapter-store.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
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
    const chapterApi = chapterSeeder.getChapterApi()
    vi.spyOn(ChapterRepository, 'mainBranch').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getListApi({ chapters: [chapterApi] }) }),
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

    expect(ChapterRepository.mainBranch).toHaveBeenCalledWith({
      params: ChapterDto.toMainBranchParams(novel.slug),
    })
    expect(wrapper.find('.dialog-header h2').text()).toBe(novel.title)
    expect(wrapper.text()).toContain(t('novel.chapter_summary', { chapter: chapterApi.title }))
    expect(wrapper.find('.novel-detail-dialog__summary').text()).toBe(chapterApi.summary)
  })

  it('fetches the novel by slug when it is not already in the store (direct access)', async () => {
    const novelApi = novelSeeder.getNovelApi()
    vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerSuccess({ data: novelApi }))
    vi.spyOn(ChapterRepository, 'mainBranch').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getListApi() }),
    )

    const novelStore = createNovelStore()
    await router.push({ name: 'novel-detail', params: { slug: novelApi.slug } })
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

    expect(NovelRepository.getBySlug).toHaveBeenCalledWith({
      params: NovelDto.toShowParams(novelApi.slug),
    })
    expect(ChapterRepository.mainBranch).toHaveBeenCalledWith({
      params: ChapterDto.toMainBranchParams(novelApi.slug),
    })
    expect(wrapper.find('.dialog-header h2').text()).toBe(novelApi.title)
  })

  it('opens on the first chapter of the novel, whatever the branch holds after it', async () => {
    const listApi = chapterSeeder.getListApi({ chapters: chapterSeeder.getMainBranchApi(2) })
    const [firstChapterApi] = listApi.chapters
    vi.spyOn(ChapterRepository, 'mainBranch').mockResolvedValue(
      controllerSuccess({ data: listApi }),
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

    expect(wrapper.text()).toContain(t('novel.chapter_summary', { chapter: firstChapterApi.title }))
    expect(wrapper.find('.novel-detail-dialog__summary').text()).toBe(firstChapterApi.summary)
  })

  it('shows the error message when the branch fails to load', async () => {
    const failure = controllerError()
    vi.spyOn(ChapterRepository, 'mainBranch').mockResolvedValue(failure)

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

    expect(wrapper.text()).toContain(failure.error)
  })

  it('opens the multiverse on the displayed chapter, not on the popular branch', async () => {
    const chapterApi = chapterSeeder.getChapterApi()
    vi.spyOn(ChapterRepository, 'mainBranch').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getListApi({ chapters: [chapterApi] }) }),
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
    expect(router.currentRoute.value.query).toEqual({ from: String(chapterApi.id) })
  })
})
