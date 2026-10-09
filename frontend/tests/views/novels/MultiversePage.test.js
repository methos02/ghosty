import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import MultiversePage from '@/views/novels/MultiversePage.vue'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { createTreeStore, TREE_STORE_KEY } from '@/apis/chapters/stores/tree-store.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { useChapterSummary } from '@/apis/chapters/composables/use-chapter-summary.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

const router = routerPlugin.getRouter()

describe('MultiversePage.vue', () => {
  beforeEach(() => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
  })

  afterEach(async () => {
    useChapterSummary().closeChapterSummary()
    await router.push('/')
    vi.clearAllMocks()
  })

  it('opens on the most supported branch of the novel it had to load', async () => {
    const novelApi = novelSeeder.getNovelApi()
    const treeApi = chapterSeeder.getForkedTreeApi()
    vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerSuccess({ data: novelApi }))
    vi.spyOn(ChapterRepository, 'tree').mockResolvedValue(controllerSuccess({ data: treeApi }))
    await router.push({ name: 'multiverse', params: { slug: novelApi.slug } })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: createTreeStore(),
          [NOVEL_STORE_KEY]: createNovelStore(),
        },
      },
    })
    await flushPromises()

    expect(ChapterRepository.tree).toHaveBeenCalledWith({
      params: ChapterDto.toTreeParams(novelApi.slug, undefined),
    })
    expect(
      wrapper.findAll('.multiverse-page__branch .chapter-card__name').map(card => card.text()),
    ).toEqual(
      treeApi.main_branch_ids.map(id => treeApi.chapters.find(chapter => chapter.id === id).title),
    )
  })

  it('opens on the branch of the chapter the reader comes from, not on the popular one', async () => {
    const novelApi = novelSeeder.getNovelApi()
    const treeApi = chapterSeeder.getForkedTreeApi()
    const [rootApi, , passengerApi] = treeApi.chapters
    vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerSuccess({ data: novelApi }))
    vi.spyOn(ChapterRepository, 'tree').mockResolvedValue(controllerSuccess({ data: treeApi }))
    await router.push({
      name: 'multiverse',
      params: { slug: novelApi.slug },
      query: { from: passengerApi.id },
    })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: createTreeStore(),
          [NOVEL_STORE_KEY]: createNovelStore(),
        },
      },
    })
    await flushPromises()

    expect(ChapterRepository.tree).toHaveBeenCalledWith({
      params: ChapterDto.toTreeParams(novelApi.slug, passengerApi.id),
    })
    expect(
      wrapper.findAll('.multiverse-page__branch .chapter-card__name').map(card => card.text()),
    ).toEqual([rootApi.title, passengerApi.title])
  })

  it('asks for the branch again when the chapter to open on is not in the loaded tree', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    treeStore.setTree(chapterSeeder.getForkedTree())
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    vi.spyOn(ChapterRepository, 'tree').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getForkedTreeApi() }),
    )
    await router.push({
      name: 'multiverse',
      params: { slug: novelStore.selectedNovel.value.slug },
      query: { from: 99 },
    })

    mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: treeStore,
          [NOVEL_STORE_KEY]: novelStore,
        },
      },
    })
    await flushPromises()

    expect(ChapterRepository.tree).toHaveBeenCalledWith({
      params: ChapterDto.toTreeParams(novelStore.selectedNovel.value.slug, 99),
    })
  })

  it('renders the branch prefetched by the server without asking again', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    treeStore.setTree(chapterSeeder.getForkedTree())
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    vi.spyOn(ChapterRepository, 'tree')
    await router.push({ name: 'multiverse', params: { slug: novelStore.selectedNovel.value.slug } })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: treeStore,
          [NOVEL_STORE_KEY]: novelStore,
        },
      },
    })
    await flushPromises()

    expect(ChapterRepository.tree).not.toHaveBeenCalled()
    expect(wrapper.findAll('.multiverse-page__branch .chapter-card')).toHaveLength(3)
  })

  it('offers the suites of the fork the reader comes back to', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    const tree = chapterSeeder.getForkedTree()
    const [, ravine, passenger] = tree.chapters
    treeStore.setTree(tree)
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    await router.push({ name: 'multiverse', params: { slug: novelStore.selectedNovel.value.slug } })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: treeStore,
          [NOVEL_STORE_KEY]: novelStore,
        },
      },
    })
    await flushPromises()
    await wrapper.find('.multiverse-page__branch .chapter-card').trigger('click')

    expect(
      wrapper.findAll('.multiverse-page__choices .chapter-card__name').map(card => card.text()),
    ).toEqual([ravine.title, passenger.title])
    expect(wrapper.find('.multiverse-page__choices .chapter-card__popular').exists()).toBe(true)
  })

  it('opens the fork a chapter belongs to when its versions are asked for', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    const tree = chapterSeeder.getForkedTree()
    const [root, ravine, passenger] = tree.chapters
    treeStore.setTree(tree)
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    await router.push({ name: 'multiverse', params: { slug: novelStore.selectedNovel.value.slug } })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: treeStore,
          [NOVEL_STORE_KEY]: novelStore,
        },
      },
    })
    await flushPromises()
    await wrapper.find('.multiverse-page__branch .chapter-card__alternatives').trigger('click')
    await flushPromises()

    expect(
      wrapper.findAll('.multiverse-page__branch .chapter-card__name').map(card => card.text()),
    ).toEqual([root.title])
    expect(
      wrapper.findAll('.multiverse-page__choices .chapter-card__name').map(card => card.text()),
    ).toEqual([ravine.title, passenger.title])
  })

  it('replaces the alternatives with the suites of the chapter just chosen', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    const tree = chapterSeeder.getForkedTree()
    const [root, , passenger] = tree.chapters
    treeStore.setTree(tree)
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    await router.push({ name: 'multiverse', params: { slug: novelStore.selectedNovel.value.slug } })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: treeStore,
          [NOVEL_STORE_KEY]: novelStore,
        },
      },
    })
    await flushPromises()
    await wrapper.find('.multiverse-page__branch .chapter-card').trigger('click')
    await wrapper.findAll('.multiverse-page__choices .chapter-card')[1].trigger('click')
    await flushPromises()

    expect(
      wrapper.findAll('.multiverse-page__branch .chapter-card__name').map(card => card.text()),
    ).toEqual([root.title, passenger.title])
    expect(wrapper.findAll('.multiverse-page__choices .chapter-card')).toHaveLength(0)
  })

  it('loads the suites left out by the displayed depth before offering them', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    const lastChapter = chapterSeeder.getChapter({ id: 10, childrenCount: 1 })
    treeStore.setTree({
      chapters: [lastChapter],
      mainBranchIds: [lastChapter.id],
    })
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    vi.spyOn(ChapterRepository, 'tree').mockResolvedValue(
      controllerSuccess({
        data: chapterSeeder.getTreeApi({
          chapters: [chapterSeeder.getChapterApi({ id: 11, parent_id: lastChapter.id })],
        }),
      }),
    )
    await router.push({ name: 'multiverse', params: { slug: novelStore.selectedNovel.value.slug } })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: treeStore,
          [NOVEL_STORE_KEY]: novelStore,
        },
      },
    })
    await flushPromises()

    expect(ChapterRepository.tree).toHaveBeenCalledWith({
      params: ChapterDto.toTreeParams(novelStore.selectedNovel.value.slug, lastChapter.id),
    })
    expect(wrapper.findAll('.multiverse-page__choices .chapter-card')).toHaveLength(1)
  })

  it('keeps the summaries out of the branch until the reader asks for one', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    const tree = chapterSeeder.getForkedTree()
    const [root] = tree.chapters
    treeStore.setTree(tree)
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    await router.push({ name: 'multiverse', params: { slug: novelStore.selectedNovel.value.slug } })

    const wrapper = mount(MultiversePage, {
      attachTo: document.body,
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: treeStore,
          [NOVEL_STORE_KEY]: novelStore,
        },
      },
    })
    await flushPromises()

    expect(wrapper.find('.multiverse-page__branch').text()).not.toContain(root.summary)

    await wrapper.find('.multiverse-page__branch .chapter-card__summary').trigger('click')

    expect(wrapper.find('.chapter-summary-dialog__text').element.closest('dialog').open).toBe(true)
    expect(wrapper.find('.chapter-summary-dialog__text').text()).toBe(root.summary)
  })

  it('numbers each chapter by its rank in the branch', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    treeStore.setTree(chapterSeeder.getForkedTree())
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    await router.push({ name: 'multiverse', params: { slug: novelStore.selectedNovel.value.slug } })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: treeStore,
          [NOVEL_STORE_KEY]: novelStore,
        },
      },
    })
    await flushPromises()

    expect(
      wrapper.findAll('.multiverse-page__branch .chapter-card__number').map(step => step.text()),
    ).toEqual(['ch. 1 -', 'ch. 2 -', 'ch. 3 -'])
  })

  it('offers the correction to the author of a chapter, and to no one else', async () => {
    const author = userSeeder.getUser()
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    treeStore.setTree(
      chapterSeeder.getForkedTree({
        chapters: [
          chapterSeeder.getChapter({ id: 10, isCorrectable: true, author: { id: author.id } }),
        ],
        mainBranchIds: [10],
      }),
    )
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    await router.push({ name: 'multiverse', params: { slug: novelStore.selectedNovel.value.slug } })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: treeStore,
          [NOVEL_STORE_KEY]: novelStore,
        },
      },
    })
    await flushPromises()

    expect(wrapper.find('.chapter-card__correct').exists()).toBe(false)

    useAuthStore().setUser(author)
    await flushPromises()

    await wrapper.find('.chapter-card__correct').trigger('click')

    await vi.waitFor(() => {
      expect(router.currentRoute.value.name).toBe('chapter-edit')
    })
    expect(router.currentRoute.value.params).toEqual({ id: '10' })

    useAuthStore().clear()
  })

  it('names the chapter the suites continue, so the reader knows what is being written', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    const tree = chapterSeeder.getForkedTree()
    const [root] = tree.chapters
    treeStore.setTree(tree)
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    await router.push({ name: 'multiverse', params: { slug: novelStore.selectedNovel.value.slug } })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: treeStore,
          [NOVEL_STORE_KEY]: novelStore,
        },
      },
    })
    await flushPromises()
    await wrapper.find('.multiverse-page__branch .chapter-card__alternatives').trigger('click')
    await flushPromises()

    expect(wrapper.find('.multiverse-page__choices-title').text()).toBe(
      t('multiverse.choices', { number: root.depth + 1 }),
    )
    expect(wrapper.find('.multiverse-page__write').text()).toBe(
      t('multiverse.write', { number: root.depth + 1 }),
    )
  })

  it('shows why the branch is missing when the tree cannot be loaded', async () => {
    const novelApi = novelSeeder.getNovelApi()
    const failure = controllerError()
    vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerSuccess({ data: novelApi }))
    vi.spyOn(ChapterRepository, 'tree').mockResolvedValue(failure)
    await router.push({ name: 'multiverse', params: { slug: novelApi.slug } })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: createTreeStore(),
          [NOVEL_STORE_KEY]: createNovelStore(),
        },
      },
    })
    await flushPromises()

    expect(wrapper.find('.multiverse-page__error').text()).toBe(failure.error)
  })

  it('opens a chapter of the tree in a new tab, leaving the exploration in place', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    treeStore.setTree(chapterSeeder.getForkedTree())
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    await router.push({ name: 'multiverse', params: { slug: novelStore.selectedNovel.value.slug } })

    const wrapper = mount(MultiversePage, {
      global: {
        plugins: [router, createHead()],
        provide: {
          [TREE_STORE_KEY]: treeStore,
          [NOVEL_STORE_KEY]: novelStore,
        },
      },
    })
    await flushPromises()

    expect(wrapper.find('.chapter-card__read').attributes('target')).toBe('_blank')
  })
})
