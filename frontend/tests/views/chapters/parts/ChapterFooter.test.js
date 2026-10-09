import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { mount, flushPromises } from '@vue/test-utils'
import ChapterFooter from '@/views/chapters/parts/ChapterFooter.vue'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { createReadingStore, READING_STORE_KEY } from '@/apis/chapters/stores/reading-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('ChapterFooter.vue', () => {
  beforeEach(() => {
    useAuthStore().clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('lets the reader support the chapter that just ended', () => {
    const chapter = chapterSeeder.getChapter({ likeCount: 41 })

    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading(chapterSeeder.getReading())
    const wrapper = mount(ChapterFooter, {
      props: { novelSlug: novelSeeder.getNovel().slug, chapter },
      global: { provide: { [NOVEL_STORE_KEY]: novelStore, [READING_STORE_KEY]: readingStore } },
    })

    expect(wrapper.find('.like-button__count').text()).toBe('41')
  })

  it('offers an alternative branch when nothing continues the chapter', () => {
    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading(chapterSeeder.getReading())
    const wrapper = mount(ChapterFooter, {
      props: { novelSlug: novelSeeder.getNovel().slug, chapter: chapterSeeder.getChapter() },
      global: { provide: { [NOVEL_STORE_KEY]: novelStore, [READING_STORE_KEY]: readingStore } },
    })

    expect(wrapper.find('.chapter-footer__fork').text()).toBe(t('chapter_read.alternative_branch'))
  })

  it('shows the suites of that fork in place, without leaving the chapter', async () => {
    const chapter = chapterSeeder.getChapter()
    const childrenApi = chapterSeeder.getListApi({ chapters: chapterSeeder.getMainBranchApi(2) })
    vi.spyOn(ChapterRepository, 'children').mockResolvedValue(
      controllerSuccess({ data: childrenApi }),
    )

    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading(chapterSeeder.getReading())
    const wrapper = mount(ChapterFooter, {
      props: { novelSlug: novelSeeder.getNovel().slug, chapter },
      global: { provide: { [NOVEL_STORE_KEY]: novelStore, [READING_STORE_KEY]: readingStore } },
    })
    await wrapper.find('.chapter-footer__fork').trigger('click')
    await flushPromises()

    expect(ChapterRepository.children).toHaveBeenCalledWith({
      params: ChapterDto.toChapterParams(chapter.id),
    })
    expect(wrapper.findAll('.children-switcher__item').length).toBe(childrenApi.chapters.length)
    expect(wrapper.find('.chapter-footer__fork').classes()).toContain('active')
  })

  it('keeps quiet when the branch the reader followed never forked', () => {
    const reading = chapterSeeder.getReading()
    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading({
      ...reading,
      ancestors: [chapterSeeder.getChapter({ id: 10, childrenCount: 1 })],
    })

    const wrapper = mount(ChapterFooter, {
      props: { novelSlug: novelSeeder.getNovel().slug, chapter: chapterSeeder.getChapter() },
      global: { provide: { [NOVEL_STORE_KEY]: novelStore, [READING_STORE_KEY]: readingStore } },
    })

    expect(wrapper.find('.chapter-footer__fork').exists()).toBe(false)
  })

  it('suggests three other novels in place, without leaving the chapter', async () => {
    vi.spyOn(NovelRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: novelSeeder.getListApi(5) }),
    )

    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading(chapterSeeder.getReading())
    const wrapper = mount(ChapterFooter, {
      props: { novelSlug: novelSeeder.getNovel().slug, chapter: chapterSeeder.getChapter() },
      global: { provide: { [NOVEL_STORE_KEY]: novelStore, [READING_STORE_KEY]: readingStore } },
    })
    await wrapper.find('.chapter-footer__suggest').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('.novel-card').length).toBe(3)
    expect(wrapper.find('.chapter-footer__suggest').classes()).toContain('active')
  })

  it('never suggests the novel the reader is already reading', async () => {
    const listApi = novelSeeder.getListApi(4)
    const readNovel = novelSeeder.getNovel()
    vi.spyOn(NovelRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))

    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading(chapterSeeder.getReading())
    const wrapper = mount(ChapterFooter, {
      props: { novelSlug: novelSeeder.getNovel().slug, chapter: chapterSeeder.getChapter() },
      global: { provide: { [NOVEL_STORE_KEY]: novelStore, [READING_STORE_KEY]: readingStore } },
    })
    await wrapper.find('.chapter-footer__suggest').trigger('click')
    await flushPromises()

    const titles = wrapper.findAll('.novel-card__title').map(card => card.text())
    expect(titles).toEqual(
      NovelDto.fromList(listApi.novels)
        .filter(novel => novel.id !== readNovel.id)
        .map(novel => novel.title),
    )
  })

  it('shows one panel at a time, the other choices staying within reach', async () => {
    vi.spyOn(ChapterRepository, 'children').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getListApi() }),
    )
    vi.spyOn(NovelRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: novelSeeder.getListApi(5) }),
    )

    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading(chapterSeeder.getReading())
    const wrapper = mount(ChapterFooter, {
      props: { novelSlug: novelSeeder.getNovel().slug, chapter: chapterSeeder.getChapter() },
      global: { provide: { [NOVEL_STORE_KEY]: novelStore, [READING_STORE_KEY]: readingStore } },
    })
    await wrapper.find('.chapter-footer__fork').trigger('click')
    await flushPromises()
    await wrapper.find('.chapter-footer__suggest').trigger('click')
    await flushPromises()

    expect(wrapper.find('.children-switcher').exists()).toBe(false)
    expect(wrapper.findAll('.novel-card').length).toBe(3)
    expect(wrapper.find('.chapter-footer__fork').exists()).toBe(true)
  })

  it('closes the panel of the choice the reader clicks again', async () => {
    vi.spyOn(NovelRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: novelSeeder.getListApi(5) }),
    )

    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading(chapterSeeder.getReading())
    const wrapper = mount(ChapterFooter, {
      props: { novelSlug: novelSeeder.getNovel().slug, chapter: chapterSeeder.getChapter() },
      global: { provide: { [NOVEL_STORE_KEY]: novelStore, [READING_STORE_KEY]: readingStore } },
    })
    await wrapper.find('.chapter-footer__suggest').trigger('click')
    await flushPromises()
    await wrapper.find('.chapter-footer__suggest').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('.novel-card').length).toBe(0)
    expect(NovelRepository.list).toHaveBeenCalledTimes(1)
  })
})
