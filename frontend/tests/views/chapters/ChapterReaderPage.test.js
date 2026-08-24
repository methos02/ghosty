import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import ChapterReaderPage from '@/views/chapters/ChapterReaderPage.vue'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { createReadingStore, READING_STORE_KEY } from '@/apis/chapters/stores/reading-store.js'
import {
  createReadingSettingsStore,
  READING_SETTINGS_STORE_KEY,
} from '@/apis/chapters/stores/reading-settings-store.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

const router = routerPlugin.getRouter()

const readerProvide = () => ({
  [READING_STORE_KEY]: createReadingStore(),
  [READING_SETTINGS_STORE_KEY]: createReadingSettingsStore(),
  [NOVEL_STORE_KEY]: createNovelStore(),
})

describe('ChapterReaderPage.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    localStorage.clear()
    await router.push('/')
    vi.restoreAllMocks()
  })

  it('renders the chapter already prefetched by the server without asking again', async () => {
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    const load = vi.spyOn(ChapterController, 'reading')
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()

    expect(load).not.toHaveBeenCalled()
    expect(wrapper.find('h1').text()).toBe(reading.chapter.title)
    expect(wrapper.text()).toContain(reading.chapter.author.username)
  })

  it('fetches the chapter when it is opened directly, store empty', async () => {
    const reading = chapterSeeder.getReading()
    vi.spyOn(ChapterController, 'reading').mockResolvedValue(controllerSuccess(reading))
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide: readerProvide() },
    })
    await flushPromises()

    expect(ChapterController.reading).toHaveBeenCalledWith('nuit-virage', reading.chapter.id)
    expect(wrapper.find('h1').text()).toBe(reading.chapter.title)
  })

  it('shows why nothing can be read when the chapter cannot be loaded', async () => {
    vi.spyOn(ChapterController, 'reading').mockResolvedValue(controllerError(404, 'introuvable'))
    await router.push({ name: 'chapter-read', params: { slug: 'nuit-virage', id: 999 } })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide: readerProvide() },
    })
    await flushPromises()

    expect(wrapper.find('.chapter-reader-page__error').text()).toBe('introuvable')
  })

  it('situates the chapter in the reading chain that runs through it', async () => {
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()

    expect(wrapper.find('.chapter-reader-page__number').text()).toBe('Chapitre 2')
    expect(wrapper.find('.paginator-chapter').exists()).toBe(true)
  })

  it('names the branch the paginator walks, and says when it left the popular one', async () => {
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()

    expect(wrapper.find('.reading-toolbar__branch-label').text()).toBe(
      'Voie la plus populaire du roman',
    )

    provide[READING_STORE_KEY].setReading({ ...reading, isCurrentBranch: false })
    await flushPromises()

    expect(wrapper.find('.reading-toolbar__branch-label').text()).toBe(
      'Voie la plus populaire depuis ce chapitre',
    )
  })

  it('hides the paginator when the chapter is the whole reading chain', async () => {
    const reading = chapterSeeder.getReading({ branchChapterIds: [11], nextChapterId: undefined })
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()

    expect(wrapper.find('.paginator-chapter').exists()).toBe(false)
  })

  it('loads the next chapter when the reader navigates to it', async () => {
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    vi.spyOn(ChapterController, 'reading').mockResolvedValue(controllerSuccess(reading))
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, { global: { plugins: [router, createHead()], provide } })
    await flushPromises()
    await router.push({ name: 'chapter-read', params: { slug: 'nuit-virage', id: 12 } })
    await flushPromises()

    expect(ChapterController.reading).toHaveBeenCalledWith('nuit-virage', 12)
  })

  it('keeps the reading surface free of everything that is not the text', async () => {
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()

    const article = wrapper.find('.chapter-reader-page__chapter')
    expect(article.find('.children-switcher').exists()).toBe(false)
    expect(article.find('.chapter-end__actions').exists()).toBe(false)
    expect(wrapper.find('.chapter-end__continue').exists()).toBe(true)
  })

  it('renders one paragraph per block of text', async () => {
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading({
      ...reading,
      chapter: ChapterDto.fromShow(
        chapterSeeder.getChapterApi({
          id: reading.chapter.id,
          content: 'Premier bloc.\r\n\r\nDeuxième bloc.\n\n\nTroisième.',
        }),
      ),
    })
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()

    const rendered = wrapper.findAll('.chapter-reader-page__paragraph')
    expect(rendered.map(paragraph => paragraph.text())).toEqual([
      'Premier bloc.',
      'Deuxième bloc.',
      'Troisième.',
    ])
  })

  it('opens the correction only to the author of the chapter', async () => {
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    useAuthStore().setUser(userSeeder.getUser({ id: reading.chapter.author.id }))
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()

    expect(wrapper.find('.chapter-end__correct').exists()).toBe(true)
  })

  it('hides the correction from a reader who did not write the chapter', async () => {
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    useAuthStore().setUser(userSeeder.getUser({ id: reading.chapter.author.id + 1 }))
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()

    expect(wrapper.find('.chapter-end__correct').exists()).toBe(false)
  })

  it('switches the reading surface to night mode and remembers it', async () => {
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()
    await wrapper.find('.reading-toolbar__night').trigger('click')

    expect(wrapper.find('.chapter-reader-page').classes()).toContain('reading-night')
    expect(JSON.parse(localStorage.getItem('reading-settings')).nightMode).toBe(true)
  })

  it('applies the font the reader picked to the text alone', async () => {
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()
    await wrapper.find('.reading-toolbar__settings').trigger('click')
    await wrapper.find('.reading-settings__font-family select').setValue('open-dyslexic')

    const article = wrapper.find('.chapter-reader-page__chapter')
    expect(article.classes()).toContain('reading-font-open-dyslexic')
    expect(article.classes()).toContain('reading-text')
    expect(article.find('.chapter-reader-page__paragraph').exists()).toBe(true)
    expect(JSON.parse(localStorage.getItem('reading-settings')).fontFamily).toBe('open-dyslexic')
  })

  it('writes each font choice in the font it stands for', async () => {
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()
    await wrapper.find('.reading-toolbar__settings').trigger('click')

    const choices = wrapper
      .findAll('.reading-settings__font-family option')
      .filter(option => option.element.value !== '')

    expect(choices.map(option => option.classes())).toEqual(
      ConfigLoader.get('reading.fontFamily.available').map(font => [
        readingSettingsHelper.fontFamilyClass(font.value),
      ]),
    )
    expect(wrapper.find('.reading-settings__font-family').classes()).toContain(
      'reading-font-system',
    )
  })

  it('restores the reading comfort chosen on a previous visit', async () => {
    localStorage.setItem(
      'reading-settings',
      JSON.stringify({ width: 60, fontSize: 24, fontFamily: 'lato', nightMode: true }),
    )
    const reading = chapterSeeder.getReading()
    const provide = readerProvide()
    provide[READING_STORE_KEY].setReading(reading)
    provide[NOVEL_STORE_KEY].setSelectedNovel(novelSeeder.getNovel())
    await router.push({
      name: 'chapter-read',
      params: { slug: 'nuit-virage', id: reading.chapter.id },
    })

    wrapper = mount(ChapterReaderPage, {
      global: { plugins: [router, createHead()], provide },
    })
    await flushPromises()

    const article = wrapper.find('.chapter-reader-page__chapter')
    expect(article.classes()).toContain('reading-font-lato')
    expect(article.attributes('style')).toContain('font-size: 24px')
    expect(article.attributes('style')).toContain('max-width: max(60vw, 320px)')
  })
})
