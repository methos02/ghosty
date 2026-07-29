import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import NovelDetailDialog from '@/views/novels/NovelDetailDialog.vue'
import { WorkController } from '@/apis/works/controllers/work-controller.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { getRouter } from '@/services/router/src/router-plugin.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

const router = getRouter()

const mountDialogFor = async (novel, { presetNovel = true } = {}) => {
  const store = createNovelStore()
  if (presetNovel) {
    store.setSelectedNovel(novel)
  }

  await router.push({ name: 'novel-detail', params: { slug: novel.slug } })
  await router.isReady()

  const wrapper = mount(NovelDetailDialog, {
    global: {
      plugins: [router, createHead()],
      provide: { [NOVEL_STORE_KEY]: store },
    },
  })
  return { wrapper, store }
}

describe('NovelDetailDialog.vue', () => {
  afterEach(async () => {
    await router.push('/')
    vi.clearAllMocks()
  })

  it('loads and displays the first chapter for the novel in the route', async () => {
    vi.spyOn(WorkController, 'getChapterByOrder').mockResolvedValue(
      controllerSuccess({ work: { id: 10, title: 'Le Réveil', content: 'Il était une fois...' } }),
    )

    const novel = novelSeeder.getNovel()
    const { wrapper } = await mountDialogFor(novel)
    await flushPromises()

    expect(WorkController.getChapterByOrder).toHaveBeenCalledWith(novel.slug, 1)
    expect(wrapper.find('.dialog-header h2').text()).toBe(novel.title)
    expect(wrapper.text()).toContain('Résumé - 1. Le Réveil')
    expect(wrapper.find('.novel-detail-dialog__summary').text()).toBe('Il était une fois...')
  })

  it('fetches the novel by slug when it is not already in the store (direct access)', async () => {
    const novel = novelSeeder.getNovel()
    vi.spyOn(NovelController, 'getBySlug').mockResolvedValue(controllerSuccess({ novel }))
    vi.spyOn(WorkController, 'getChapterByOrder').mockResolvedValue(
      controllerSuccess({ work: { id: 10, title: 'Ch', content: '...' } }),
    )

    const { wrapper } = await mountDialogFor(novel, { presetNovel: false })
    await flushPromises()

    expect(NovelController.getBySlug).toHaveBeenCalledWith(novel.slug)
    expect(WorkController.getChapterByOrder).toHaveBeenCalledWith(novel.slug, 1)
    expect(wrapper.find('.dialog-header h2').text()).toBe(novel.title)
  })

  it('loads another chapter when the chapter paginator emits p-chapter', async () => {
    const getChapter = vi.spyOn(WorkController, 'getChapterByOrder').mockResolvedValue(
      controllerSuccess({ work: { id: 10, title: 'Ch', content: '...' } }),
    )

    const novel = novelSeeder.getNovel()
    const { wrapper } = await mountDialogFor(novel)
    await flushPromises()

    wrapper.findComponent({ name: 'PaginatorChapterComponent' }).vm.$emit('p-chapter', {
      chapter: 2,
    })
    await flushPromises()

    expect(getChapter).toHaveBeenLastCalledWith(novel.slug, 2)
  })

  it('shows the error message when the chapter fails to load', async () => {
    vi.spyOn(WorkController, 'getChapterByOrder').mockResolvedValue(
      controllerError(undefined, 'Chargement impossible'),
    )

    const novel = novelSeeder.getNovel()
    const { wrapper } = await mountDialogFor(novel)
    await flushPromises()

    expect(wrapper.text()).toContain('Chargement impossible')
  })
})
