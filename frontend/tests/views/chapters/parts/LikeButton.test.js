import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LikeButton from '@/views/chapters/parts/LikeButton.vue'
import { LikeRepository } from '@/apis/likes/repositories/like-repository.js'
import { LikeDto } from '@/apis/likes/dtos/like-dto.js'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { createReadingStore, READING_STORE_KEY } from '@/apis/chapters/stores/reading-store.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { likeSeeder } from '&/utils/seeders/like-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('LikeButton.vue', () => {
  beforeEach(() => {
    flash.clearFlashes()
    useAuthStore().clear()
    useAuth().closeDialogs()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows how many readers already carry the chapter', () => {
    const readingStore = createReadingStore()
    readingStore.setReading({
      ...chapterSeeder.getReading(),
      chapter: chapterSeeder.getChapter({ likeCount: 41 }),
    })
    const wrapper = mount(LikeButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    expect(wrapper.find('.like-button__count').text()).toBe('41')
  })

  it('holds the width its digits need, so the toolbar never shifts on a new count', () => {
    const readingStore = createReadingStore()
    readingStore.setReading({
      ...chapterSeeder.getReading(),
      chapter: chapterSeeder.getChapter({ likeCount: 9 }),
    })
    const wrapper = mount(LikeButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    expect(wrapper.find('.like-button__count').attributes('style')).toBe('width: 1ch;')
  })

  it('records the support of a reader who has not supported the chapter yet', async () => {
    const chapter = chapterSeeder.getChapter({ isLiked: false, likeCount: 41 })
    const likeApi = likeSeeder.getLikeApi()
    vi.spyOn(LikeRepository, 'like').mockResolvedValue(controllerSuccess({ data: likeApi }))
    useAuthStore().setUser(userSeeder.getUser())
    const readingStore = createReadingStore()
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    const wrapper = mount(LikeButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.like-button').trigger('click')
    await flushPromises()

    expect(LikeRepository.like).toHaveBeenCalledWith({
      params: LikeDto.toChapterParams(chapter.id),
    })
    expect(wrapper.find('.like-button__count').text()).toBe(String(likeApi.like_count))
    expect(readingStore.chapter.value.isLiked).toBe(true)
  })

  it('withdraws the support of a chapter the reader already supports', async () => {
    const chapter = chapterSeeder.getChapter({ isLiked: true, likeCount: 41 })
    const likeApi = likeSeeder.getLikeApi({ is_liked: false, like_count: 40 })
    vi.spyOn(LikeRepository, 'unlike').mockResolvedValue(controllerSuccess({ data: likeApi }))
    useAuthStore().setUser(userSeeder.getUser())
    const readingStore = createReadingStore()
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    const wrapper = mount(LikeButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.like-button').trigger('click')
    await flushPromises()

    expect(LikeRepository.unlike).toHaveBeenCalledWith({
      params: LikeDto.toChapterParams(chapter.id),
    })
    expect(wrapper.find('.like-button__count').text()).toBe(String(likeApi.like_count))
    expect(readingStore.chapter.value.isLiked).toBe(false)
  })

  it('leaves the count untouched until the api has recorded the support', async () => {
    let recordSupport
    const chapter = chapterSeeder.getChapter({ isLiked: false, likeCount: 41 })
    const likeApi = likeSeeder.getLikeApi({ like_count: 55 })
    vi.spyOn(LikeRepository, 'like').mockReturnValue(
      new Promise(resolve => {
        recordSupport = resolve
      }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    const readingStore = createReadingStore()
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    const wrapper = mount(LikeButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.like-button').trigger('click')
    await flushPromises()

    expect(wrapper.find('.like-button__count').text()).toBe(String(chapter.likeCount))

    recordSupport(controllerSuccess({ data: likeApi }))
    await flushPromises()

    expect(wrapper.find('.like-button__count').text()).toBe(String(likeApi.like_count))
  })

  it('confirms to the reader that their support is recorded', async () => {
    vi.spyOn(LikeRepository, 'like').mockResolvedValue(
      controllerSuccess({ data: likeSeeder.getLikeApi() }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    const readingStore = createReadingStore()
    readingStore.setReading({
      ...chapterSeeder.getReading(),
      chapter: chapterSeeder.getChapter({ isLiked: false, likeCount: 41 }),
    })
    const wrapper = mount(LikeButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.like-button').trigger('click')
    await flushPromises()

    expect(flash.getFlashes().at(-1).content).toBe(t('like_button.supported'))
  })

  it('confirms to the reader that their support is withdrawn', async () => {
    vi.spyOn(LikeRepository, 'unlike').mockResolvedValue(
      controllerSuccess({ data: likeSeeder.getLikeApi({ is_liked: false, like_count: 40 }) }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    const readingStore = createReadingStore()
    readingStore.setReading({
      ...chapterSeeder.getReading(),
      chapter: chapterSeeder.getChapter({ isLiked: true, likeCount: 41 }),
    })
    const wrapper = mount(LikeButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.like-button').trigger('click')
    await flushPromises()

    expect(flash.getFlashes().at(-1).content).toBe(t('like_button.withdrawn'))
  })

  it('keeps the count as it was when the guard refuses the support, and says why', async () => {
    const chapter = chapterSeeder.getChapter({ isLiked: false, likeCount: 41 })
    const refusalApi = likeSeeder.getRefusalApi()
    vi.spyOn(LikeRepository, 'like').mockResolvedValue({
      status: STATUS.FORBIDDEN,
      data: refusalApi,
    })
    useAuthStore().setUser(userSeeder.getUser())
    const readingStore = createReadingStore()
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    const wrapper = mount(LikeButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.like-button').trigger('click')
    await flushPromises()

    expect(wrapper.find('.like-button__count').text()).toBe(String(chapter.likeCount))
    expect(flash.getFlashes().at(-1).content).toBe(refusalApi.message)
  })

  it('closes the button while the api answers, so a second click cannot count twice', async () => {
    vi.spyOn(LikeRepository, 'like').mockReturnValue(new Promise(() => {}))
    useAuthStore().setUser(userSeeder.getUser())
    const readingStore = createReadingStore()
    readingStore.setReading({
      ...chapterSeeder.getReading(),
      chapter: chapterSeeder.getChapter({ isLiked: false, likeCount: 41 }),
    })
    const wrapper = mount(LikeButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.like-button').trigger('click')
    await flushPromises()
    await wrapper.find('.like-button').trigger('click')
    await flushPromises()

    expect(LikeRepository.like).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.like-button__spinner').exists()).toBe(true)
    expect(wrapper.find('.like-button').attributes('disabled')).toBeDefined()
  })

  it('closes the button to the author of the chapter', () => {
    const chapter = chapterSeeder.getChapter()
    useAuthStore().setUser(userSeeder.getUser({ id: chapter.author.id }))

    const readingStore = createReadingStore()
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    const wrapper = mount(LikeButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    expect(wrapper.find('.like-button').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.like-button').attributes('title')).toBe(t('like_button.own_chapter'))
  })

  it('invites a visitor to sign in rather than swallowing the click', async () => {
    vi.spyOn(LikeRepository, 'like').mockResolvedValue(
      controllerSuccess({ data: likeSeeder.getLikeApi() }),
    )
    const readingStore = createReadingStore()
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter: chapterSeeder.getChapter() })
    const wrapper = mount(LikeButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.like-button').trigger('click')
    await flushPromises()

    expect(LikeRepository.like).not.toHaveBeenCalled()
    expect(useAuth().showLoginDialog.value).toBe(true)
  })
})
