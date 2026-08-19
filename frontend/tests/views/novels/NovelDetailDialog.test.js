import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import NovelDetailDialog from '@/views/novels/NovelDetailDialog.vue'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { createChapterStore, CHAPTER_STORE_KEY } from '@/apis/chapters/stores/chapter-store.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

const router = routerPlugin.getRouter()

const chapter = (id, title, summary) => ({ id, title, summary })

const mountDialogFor = async (novel, { presetNovel = true } = {}) => {
  const novelStore = createNovelStore()
  const chapterStore = createChapterStore()
  if (presetNovel) {
    novelStore.setSelectedNovel(novel)
  }

  await router.push({ name: 'novel-detail', params: { slug: novel.slug } })
  await router.isReady()

  const wrapper = mount(NovelDetailDialog, {
    global: {
      plugins: [router, createHead()],
      provide: {
        [NOVEL_STORE_KEY]: novelStore,
        [CHAPTER_STORE_KEY]: chapterStore,
      },
    },
  })
  return { wrapper, novelStore, chapterStore }
}

describe('NovelDetailDialog.vue', () => {
  afterEach(async () => {
    await router.push('/')
    vi.clearAllMocks()
  })

  it('loads the main continuity and displays its first chapter', async () => {
    vi.spyOn(ChapterController, 'currentContinuity').mockResolvedValue(
      controllerSuccess({ chapters: [chapter(10, 'Le Réveil', 'Il était une fois...')] }),
    )

    const novel = novelSeeder.getNovel()
    const { wrapper } = await mountDialogFor(novel)
    await flushPromises()

    expect(ChapterController.currentContinuity).toHaveBeenCalledWith(novel.slug)
    expect(wrapper.find('.dialog-header h2').text()).toBe(novel.title)
    expect(wrapper.text()).toContain('Résumé - 1. Le Réveil')
    expect(wrapper.find('.novel-detail-dialog__summary').text()).toBe('Il était une fois...')
  })

  it('fetches the novel by slug when it is not already in the store (direct access)', async () => {
    const novel = novelSeeder.getNovel()
    vi.spyOn(NovelController, 'getBySlug').mockResolvedValue(controllerSuccess({ novel }))
    vi.spyOn(ChapterController, 'currentContinuity').mockResolvedValue(
      controllerSuccess({ chapters: [chapter(10, 'Ch', '...')] }),
    )

    const { wrapper } = await mountDialogFor(novel, { presetNovel: false })
    await flushPromises()

    expect(NovelController.getBySlug).toHaveBeenCalledWith(novel.slug)
    expect(ChapterController.currentContinuity).toHaveBeenCalledWith(novel.slug)
    expect(wrapper.find('.dialog-header h2').text()).toBe(novel.title)
  })

  it('switches chapter from the already loaded continuity without calling the api again', async () => {
    const loadContinuity = vi.spyOn(ChapterController, 'currentContinuity').mockResolvedValue(
      controllerSuccess({
        chapters: [chapter(10, 'Premier', 'Début'), chapter(11, 'Second', 'Suite')],
      }),
    )

    const novel = novelSeeder.getNovel()
    const { wrapper } = await mountDialogFor(novel)
    await flushPromises()

    const callsAfterLoad = loadContinuity.mock.calls.length

    wrapper.findComponent({ name: 'PaginatorChapterComponent' }).vm.$emit('p-chapter', {
      chapter: 2,
    })
    await flushPromises()

    expect(loadContinuity.mock.calls.length).toBe(callsAfterLoad)
    expect(wrapper.text()).toContain('Résumé - 2. Second')
    expect(wrapper.find('.novel-detail-dialog__summary').text()).toBe('Suite')
  })

  it('shows the error message when the continuity fails to load', async () => {
    vi.spyOn(ChapterController, 'currentContinuity').mockResolvedValue(
      controllerError(undefined, 'Chargement impossible'),
    )

    const novel = novelSeeder.getNovel()
    const { wrapper } = await mountDialogFor(novel)
    await flushPromises()

    expect(wrapper.text()).toContain('Chargement impossible')
  })

  it('opens the writing page on the displayed chapter, the only way in from a novel', async () => {
    vi.spyOn(ChapterController, 'currentContinuity').mockResolvedValue(
      controllerSuccess({ chapters: [chapter(10, 'Le Réveil', 'Il était une fois...')] }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    const novel = novelSeeder.getNovel()
    const { wrapper } = await mountDialogFor(novel)
    await flushPromises()

    await wrapper.find('.novel-detail-dialog__continue').trigger('click')

    await vi.waitFor(() => {
      expect(router.currentRoute.value.name).toBe('chapter-write')
    })
    expect(router.currentRoute.value.params).toEqual({ slug: novel.slug, parentId: '10' })

    useAuthStore().clear()
  })

  it('offers the correction to the author of the displayed chapter, and to no one else', async () => {
    const author = userSeeder.getUser()
    vi.spyOn(ChapterController, 'currentContinuity').mockResolvedValue(
      controllerSuccess({
        chapters: [
          {
            id: 10,
            title: 'Le Réveil',
            summary: 'Il était une fois...',
            isCorrectable: true,
            author: { id: author.id },
          },
        ],
      }),
    )

    const novel = novelSeeder.getNovel()
    const { wrapper } = await mountDialogFor(novel)
    await flushPromises()

    expect(wrapper.find('.novel-detail-dialog__correct').exists()).toBe(false)

    useAuthStore().setUser(author)
    await flushPromises()

    expect(wrapper.find('.novel-detail-dialog__correct').exists()).toBe(true)

    await wrapper.find('.novel-detail-dialog__correct').trigger('click')
    await vi.waitFor(() => {
      expect(router.currentRoute.value.name).toBe('chapter-edit')
    })
    expect(router.currentRoute.value.params).toEqual({ id: '10' })

    useAuthStore().clear()
  })
})
