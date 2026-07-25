import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NovelDetailDialog from '@/views/novels/NovelDetailDialog.vue'
import { WorkController } from '@/apis/works/controllers/work-controller.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

describe('NovelDetailDialog.vue', () => {
  afterEach(() => {
    useNovelStore().clearSelectedNovel()
    vi.clearAllMocks()
  })

  it('loads and displays the first chapter when a novel is selected', async () => {
    vi.spyOn(WorkController, 'getChapterByOrder').mockResolvedValue(
      controllerSuccess({ work: { id: 10, title: 'Le Réveil', content: 'Il était une fois...' } }),
    )

    const novel = novelSeeder.getNovel()
    const wrapper = mount(NovelDetailDialog)
    useNovelStore().setSelectedNovel(novel)
    await flushPromises()

    expect(WorkController.getChapterByOrder).toHaveBeenCalledWith(novel.slug, 1)
    expect(wrapper.find('.dialog-header h2').text()).toBe(novel.title)
    expect(wrapper.text()).toContain('Résumé - 1. Le Réveil')
    expect(wrapper.find('.novel-detail-dialog__summary').text()).toBe('Il était une fois...')
  })

  it('loads another chapter when the chapter paginator emits p-chapter', async () => {
    const getChapter = vi.spyOn(WorkController, 'getChapterByOrder').mockResolvedValue(
      controllerSuccess({ work: { id: 10, title: 'Ch', content: '...' } }),
    )

    const novel = novelSeeder.getNovel()
    const wrapper = mount(NovelDetailDialog)
    useNovelStore().setSelectedNovel(novel)
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
    const wrapper = mount(NovelDetailDialog)
    useNovelStore().setSelectedNovel(novel)
    await flushPromises()

    expect(wrapper.text()).toContain('Chargement impossible')
  })
})
