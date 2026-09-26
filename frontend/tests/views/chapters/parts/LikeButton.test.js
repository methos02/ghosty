import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LikeButton from '@/views/chapters/parts/LikeButton.vue'
import { LikeController } from '@/apis/likes/controllers/like-controller.js'
import { flash } from '@/services/shortcuts/services-shortcut.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { createReadingStore, READING_STORE_KEY } from '@/apis/chapters/stores/reading-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { likeSeeder } from '&/utils/seeders/like-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const mountButton = chapter => {
  const readingStore = createReadingStore()
  readingStore.setReading({ ...chapterSeeder.getReading(), chapter })

  const wrapper = mount(LikeButton, {
    global: { provide: { [READING_STORE_KEY]: readingStore } },
  })

  return { wrapper, readingStore }
}

const support = async wrapper => {
  await wrapper.find('.like-button').trigger('click')
  await flushPromises()
}

describe('LikeButton.vue', () => {
  beforeEach(() => {
    flash.clearFlashes()
    useAuthStore().clear()
    useAuth().closeDialogs()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows how many readers already carry the chapter', () => {
    const { wrapper } = mountButton(chapterSeeder.getChapter({ likeCount: 41 }))

    expect(wrapper.find('.like-button__count').text()).toBe('41')
  })

  it('holds the width its digits need, so the toolbar never shifts on a new count', () => {
    const { wrapper } = mountButton(chapterSeeder.getChapter({ likeCount: 9 }))

    expect(wrapper.find('.like-button__count').attributes('style')).toBe('width: 1ch;')
  })

  it('records the support of a reader who has not supported the chapter yet', async () => {
    const chapter = chapterSeeder.getChapter({ isLiked: false, likeCount: 41 })
    vi.spyOn(LikeController, 'like').mockResolvedValue({
      status: STATUS.SUCCESS,
      like: likeSeeder.getLike({ likeCount: 42 }),
    })
    useAuthStore().setUser(userSeeder.getUser())
    const { wrapper, readingStore } = mountButton(chapter)

    await support(wrapper)

    expect(LikeController.like).toHaveBeenCalledWith(chapter.id)
    expect(wrapper.find('.like-button__count').text()).toBe('42')
    expect(readingStore.chapter.value.isLiked).toBe(true)
  })

  it('withdraws the support of a chapter the reader already supports', async () => {
    const chapter = chapterSeeder.getChapter({ isLiked: true, likeCount: 41 })
    vi.spyOn(LikeController, 'unlike').mockResolvedValue({
      status: STATUS.SUCCESS,
      like: likeSeeder.getLike({ isLiked: false, likeCount: 40 }),
    })
    useAuthStore().setUser(userSeeder.getUser())
    const { wrapper, readingStore } = mountButton(chapter)

    await support(wrapper)

    expect(LikeController.unlike).toHaveBeenCalledWith(chapter.id)
    expect(wrapper.find('.like-button__count').text()).toBe('40')
    expect(readingStore.chapter.value.isLiked).toBe(false)
  })

  it('leaves the count untouched until the api has recorded the support', async () => {
    let recordSupport
    vi.spyOn(LikeController, 'like').mockReturnValue(
      new Promise(resolve => {
        recordSupport = resolve
      }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    const { wrapper } = mountButton(chapterSeeder.getChapter({ isLiked: false, likeCount: 41 }))

    await support(wrapper)

    expect(wrapper.find('.like-button__count').text()).toBe('41')

    recordSupport({ status: STATUS.SUCCESS, like: likeSeeder.getLike({ likeCount: 55 }) })
    await flushPromises()

    expect(wrapper.find('.like-button__count').text()).toBe('55')
  })

  it('confirms to the reader that their support is recorded', async () => {
    vi.spyOn(LikeController, 'like').mockResolvedValue({
      status: STATUS.SUCCESS,
      like: likeSeeder.getLike({ likeCount: 42 }),
    })
    useAuthStore().setUser(userSeeder.getUser())
    const { wrapper } = mountButton(chapterSeeder.getChapter({ isLiked: false, likeCount: 41 }))

    await support(wrapper)

    expect(flash.getFlashes().at(-1).content).toBe('Votre soutien est enregistré')
  })

  it('confirms to the reader that their support is withdrawn', async () => {
    vi.spyOn(LikeController, 'unlike').mockResolvedValue({
      status: STATUS.SUCCESS,
      like: likeSeeder.getLike({ isLiked: false, likeCount: 40 }),
    })
    useAuthStore().setUser(userSeeder.getUser())
    const { wrapper } = mountButton(chapterSeeder.getChapter({ isLiked: true, likeCount: 41 }))

    await support(wrapper)

    expect(flash.getFlashes().at(-1).content).toBe('Votre soutien a été retiré')
  })

  it('keeps the count as it was when the guard refuses the support, and says why', async () => {
    vi.spyOn(LikeController, 'like').mockResolvedValue({
      status: STATUS.FORBIDDEN,
      data: { message: 'Votre compte est trop récent pour soutenir un chapitre' },
    })
    useAuthStore().setUser(userSeeder.getUser())
    const { wrapper } = mountButton(chapterSeeder.getChapter({ isLiked: false, likeCount: 41 }))

    await support(wrapper)

    expect(wrapper.find('.like-button__count').text()).toBe('41')
    expect(flash.getFlashes().at(-1).content).toBe(
      'Votre compte est trop récent pour soutenir un chapitre',
    )
  })

  it('closes the button while the api answers, so a second click cannot count twice', async () => {
    vi.spyOn(LikeController, 'like').mockReturnValue(new Promise(() => {}))
    useAuthStore().setUser(userSeeder.getUser())
    const { wrapper } = mountButton(chapterSeeder.getChapter({ isLiked: false, likeCount: 41 }))

    await support(wrapper)
    await support(wrapper)

    expect(LikeController.like).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.like-button__spinner').exists()).toBe(true)
    expect(wrapper.find('.like-button').attributes('disabled')).toBeDefined()
  })

  it('closes the button to the author of the chapter', () => {
    const chapter = chapterSeeder.getChapter()
    useAuthStore().setUser(userSeeder.getUser({ id: chapter.author.id }))

    const { wrapper } = mountButton(chapter)

    expect(wrapper.find('.like-button').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.like-button').attributes('title')).toBe(
      'On ne soutient pas son propre chapitre',
    )
  })

  it('invites a visitor to sign in rather than swallowing the click', async () => {
    vi.spyOn(LikeController, 'like').mockResolvedValue({ status: STATUS.SUCCESS })
    const { wrapper } = mountButton(chapterSeeder.getChapter())

    await support(wrapper)

    expect(LikeController.like).not.toHaveBeenCalled()
    expect(useAuth().showLoginDialog.value).toBe(true)
  })
})
