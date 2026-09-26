import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ChapterFooter from '@/views/chapters/parts/ChapterFooter.vue'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { createReadingStore, READING_STORE_KEY } from '@/apis/chapters/stores/reading-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

const footerProvide = (reading = chapterSeeder.getReading()) => {
  const novelStore = createNovelStore()
  const readingStore = createReadingStore()
  novelStore.setSelectedNovel(novelSeeder.getNovel())
  readingStore.setReading(reading)

  return { [NOVEL_STORE_KEY]: novelStore, [READING_STORE_KEY]: readingStore }
}

const mountFooter = (chapter, provide = footerProvide()) => {
  return mount(ChapterFooter, {
    props: { novelSlug: novelSeeder.getNovel().slug, chapter },
    global: { provide },
  })
}

describe('ChapterFooter.vue', () => {
  beforeEach(() => {
    useAuthStore().clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('lets the reader support the chapter that just ended', () => {
    const chapter = chapterSeeder.getChapter({ likeCount: 41 })

    const wrapper = mountFooter(chapter)

    expect(wrapper.find('.like-button__count').text()).toBe('41')
  })

  it('offers an alternative branch when nothing continues the chapter', () => {
    const wrapper = mountFooter(chapterSeeder.getChapter())

    expect(wrapper.find('.chapter-footer__fork').text()).toBe('Branche alternative')
  })

  it('shows the suites of that fork in place, without leaving the chapter', async () => {
    const forkSuites = chapterSeeder.getCurrentBranch(2)
    vi.spyOn(ChapterController, 'children').mockResolvedValue(
      controllerSuccess({ chapters: forkSuites }),
    )

    const wrapper = mountFooter(chapterSeeder.getChapter())
    await wrapper.find('.chapter-footer__fork').trigger('click')
    await flushPromises()

    expect(ChapterController.children).toHaveBeenCalledWith(10)
    expect(wrapper.findAll('.children-switcher__item').length).toBe(forkSuites.length)
    expect(wrapper.find('.chapter-footer__fork').classes()).toContain('active')
  })

  it('keeps quiet when the branch the reader followed never forked', () => {
    const reading = chapterSeeder.getReading()
    const provide = footerProvide({
      ...reading,
      ancestors: [chapterSeeder.getChapter({ id: 10, childrenCount: 1 })],
    })

    const wrapper = mountFooter(chapterSeeder.getChapter(), provide)

    expect(wrapper.find('.chapter-footer__fork').exists()).toBe(false)
  })

  it('suggests three other novels in place, without leaving the chapter', async () => {
    vi.spyOn(NovelController, 'list').mockResolvedValue(
      controllerSuccess({ novels: novelSeeder.getNovels(5) }),
    )

    const wrapper = mountFooter(chapterSeeder.getChapter())
    await wrapper.find('.chapter-footer__suggest').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('.novel-card').length).toBe(3)
    expect(wrapper.find('.chapter-footer__suggest').classes()).toContain('active')
  })

  it('never suggests the novel the reader is already reading', async () => {
    const novels = novelSeeder.getNovels(4)
    vi.spyOn(NovelController, 'list').mockResolvedValue(controllerSuccess({ novels }))

    const wrapper = mountFooter(chapterSeeder.getChapter())
    await wrapper.find('.chapter-footer__suggest').trigger('click')
    await flushPromises()

    const titles = wrapper.findAll('.novel-card__title').map(card => card.text())
    expect(titles).toEqual(['Roman 2', 'Roman 3', 'Roman 4'])
  })

  it('shows one panel at a time, the other choices staying within reach', async () => {
    vi.spyOn(ChapterController, 'children').mockResolvedValue(
      controllerSuccess({ chapters: chapterSeeder.getCurrentBranch(2) }),
    )
    vi.spyOn(NovelController, 'list').mockResolvedValue(
      controllerSuccess({ novels: novelSeeder.getNovels(5) }),
    )

    const wrapper = mountFooter(chapterSeeder.getChapter())
    await wrapper.find('.chapter-footer__fork').trigger('click')
    await flushPromises()
    await wrapper.find('.chapter-footer__suggest').trigger('click')
    await flushPromises()

    expect(wrapper.find('.children-switcher').exists()).toBe(false)
    expect(wrapper.findAll('.novel-card').length).toBe(3)
    expect(wrapper.find('.chapter-footer__fork').exists()).toBe(true)
  })

  it('closes the panel of the choice the reader clicks again', async () => {
    vi.spyOn(NovelController, 'list').mockResolvedValue(
      controllerSuccess({ novels: novelSeeder.getNovels(5) }),
    )

    const wrapper = mountFooter(chapterSeeder.getChapter())
    await wrapper.find('.chapter-footer__suggest').trigger('click')
    await flushPromises()
    await wrapper.find('.chapter-footer__suggest').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('.novel-card').length).toBe(0)
    expect(NovelController.list).toHaveBeenCalledTimes(1)
  })
})
