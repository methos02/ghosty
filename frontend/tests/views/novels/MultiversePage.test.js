import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import MultiversePage from '@/views/novels/MultiversePage.vue'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { createTreeStore, TREE_STORE_KEY } from '@/apis/chapters/stores/tree-store.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { useChapterSummary } from '@/apis/chapters/composables/use-chapter-summary.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

const router = routerPlugin.getRouter()

describe('MultiversePage.vue', () => {
  afterEach(async () => {
    useChapterSummary().closeChapterSummary()
    await router.push('/')
    vi.restoreAllMocks()
  })

  it('opens on the most supported branch of the novel it had to load', async () => {
    const novel = novelSeeder.getNovel()
    vi.spyOn(NovelController, 'getBySlug').mockResolvedValue(controllerSuccess({ novel }))
    vi.spyOn(ChapterController, 'tree').mockResolvedValue(
      controllerSuccess(chapterSeeder.getForkedTree()),
    )
    await router.push({ name: 'multiverse', params: { slug: novel.slug } })

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

    expect(ChapterController.tree).toHaveBeenCalledWith(novel.slug, undefined)
    expect(
      wrapper.findAll('.multiverse-page__branch .chapter-card__name').map(card => card.text()),
    ).toEqual(['Le virage', 'Ce que le ravin gardait', 'Le registre des disparus'])
  })

  it('opens on the branch of the chapter the reader comes from, not on the popular one', async () => {
    const novel = novelSeeder.getNovel()
    vi.spyOn(NovelController, 'getBySlug').mockResolvedValue(controllerSuccess({ novel }))
    vi.spyOn(ChapterController, 'tree').mockResolvedValue(
      controllerSuccess(chapterSeeder.getForkedTree()),
    )
    await router.push({ name: 'multiverse', params: { slug: novel.slug }, query: { from: 12 } })

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

    expect(ChapterController.tree).toHaveBeenCalledWith(novel.slug, 12)
    expect(
      wrapper.findAll('.multiverse-page__branch .chapter-card__name').map(card => card.text()),
    ).toEqual(['Le virage', 'Le passager'])
  })

  it('asks for the branch again when the chapter to open on is not in the loaded tree', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    treeStore.setTree(chapterSeeder.getForkedTree())
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    vi.spyOn(ChapterController, 'tree').mockResolvedValue(
      controllerSuccess(chapterSeeder.getForkedTree()),
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

    expect(ChapterController.tree).toHaveBeenCalledWith(novelStore.selectedNovel.value.slug, 99)
  })

  it('renders the branch prefetched by the server without asking again', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    treeStore.setTree(chapterSeeder.getForkedTree())
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    const load = vi.spyOn(ChapterController, 'tree')
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

    expect(load).not.toHaveBeenCalled()
    expect(wrapper.findAll('.multiverse-page__branch .chapter-card')).toHaveLength(3)
  })

  it('offers the suites of the fork the reader comes back to', async () => {
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
    await wrapper.find('.multiverse-page__branch .chapter-card').trigger('click')

    expect(
      wrapper.findAll('.multiverse-page__choices .chapter-card__name').map(card => card.text()),
    ).toEqual(['Ce que le ravin gardait', 'Le passager'])
    expect(wrapper.find('.multiverse-page__choices .chapter-card__popular').exists()).toBe(true)
  })

  it('opens the fork a chapter belongs to when its versions are asked for', async () => {
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
    await wrapper.find('.multiverse-page__branch .chapter-card__alternatives').trigger('click')
    await flushPromises()

    expect(
      wrapper.findAll('.multiverse-page__branch .chapter-card__name').map(card => card.text()),
    ).toEqual(['Le virage'])
    expect(
      wrapper.findAll('.multiverse-page__choices .chapter-card__name').map(card => card.text()),
    ).toEqual(['Ce que le ravin gardait', 'Le passager'])
  })

  it('replaces the alternatives with the suites of the chapter just chosen', async () => {
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
    await wrapper.find('.multiverse-page__branch .chapter-card').trigger('click')
    await wrapper.findAll('.multiverse-page__choices .chapter-card')[1].trigger('click')
    await flushPromises()

    expect(
      wrapper.findAll('.multiverse-page__branch .chapter-card__name').map(card => card.text()),
    ).toEqual(['Le virage', 'Le passager'])
    expect(wrapper.findAll('.multiverse-page__choices .chapter-card')).toHaveLength(0)
  })

  it('loads the suites left out by the displayed depth before offering them', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    treeStore.setTree({
      chapters: [chapterSeeder.getChapter({ id: 10, childrenCount: 1 })],
      currentBranchIds: [10],
    })
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    vi.spyOn(ChapterController, 'tree').mockResolvedValue(
      controllerSuccess({ chapters: [chapterSeeder.getChapter({ id: 11, parentId: 10 })] }),
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

    expect(ChapterController.tree).toHaveBeenCalledWith(novelStore.selectedNovel.value.slug, 10)
    expect(wrapper.findAll('.multiverse-page__choices .chapter-card')).toHaveLength(1)
  })

  it('keeps the summaries out of the branch until the reader asks for one', async () => {
    const treeStore = createTreeStore()
    const novelStore = createNovelStore()
    treeStore.setTree(chapterSeeder.getForkedTree())
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

    expect(wrapper.find('.multiverse-page__branch').text()).not.toContain(
      'Une route de montagne, un virage manqué.',
    )

    await wrapper.find('.multiverse-page__branch .chapter-card__summary').trigger('click')

    expect(wrapper.find('.chapter-summary-dialog__text').element.closest('dialog').open).toBe(true)
    expect(wrapper.find('.chapter-summary-dialog__text').text()).toBe(
      'Une route de montagne, un virage manqué.',
    )
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
        currentBranchIds: [10],
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
    await wrapper.find('.multiverse-page__branch .chapter-card__alternatives').trigger('click')
    await flushPromises()

    expect(wrapper.find('.multiverse-page__choices-title').text()).toBe(
      'Les suites possibles du chapitre 1',
    )
    expect(wrapper.find('.multiverse-page__write').text()).toBe('Écrire une suite au chapitre 1')
  })

  it('shows why the branch is missing when the tree cannot be loaded', async () => {
    const novel = novelSeeder.getNovel()
    vi.spyOn(NovelController, 'getBySlug').mockResolvedValue(controllerSuccess({ novel }))
    vi.spyOn(ChapterController, 'tree').mockResolvedValue(controllerError(500, 'boom'))
    await router.push({ name: 'multiverse', params: { slug: novel.slug } })

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

    expect(wrapper.find('.multiverse-page__error').text()).toBe('boom')
  })
})
