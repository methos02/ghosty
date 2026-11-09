import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FollowButton from '@/views/chapters/parts/FollowButton.vue'
import { FollowRepository } from '@/apis/follows/repositories/follow-repository.js'
import { FollowDto } from '@/apis/follows/dtos/follow-dto.js'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { createReadingStore, READING_STORE_KEY } from '@/core-vue/stores/chapters/reading-store.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { followSeeder } from '&/utils/seeders/follow-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('FollowButton.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    flash.clearFlashes()
    useAuthStore().clear()
    useAuth().closeDialogs()
    vi.clearAllMocks()
  })

  it('offers to follow the branch of a chapter the reader does not follow yet', () => {
    const readingStore = createReadingStore()
    readingStore.setReading({
      ...chapterSeeder.getReading(),
      chapter: chapterSeeder.getChapter({ isFollowed: false }),
    })

    wrapper = mount(FollowButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    expect(wrapper.find('.follow-button').attributes('title')).toBe(t('follow_button.follow'))
    expect(wrapper.find('.follow-button').attributes('aria-pressed')).toBe('false')
  })

  it('follows the branch and shows it as followed once the api recorded it', async () => {
    const chapter = chapterSeeder.getChapter({ isFollowed: false })
    vi.spyOn(FollowRepository, 'follow').mockResolvedValue(
      controllerSuccess({ data: followSeeder.getFollowStateApi() }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    const readingStore = createReadingStore()
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    wrapper = mount(FollowButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.follow-button').trigger('click')
    await flushPromises()

    expect(FollowRepository.follow).toHaveBeenCalledWith({
      params: FollowDto.toChapterParams(chapter.id),
    })
    expect(readingStore.chapter.value.isFollowed).toBe(true)
    expect(wrapper.find('.follow-button').attributes('title')).toBe(t('follow_button.unfollow'))
    expect(flash.getFlashes().at(-1).content).toBe(t('follow_button.followed'))
  })

  it('stops following a branch the reader already follows', async () => {
    const chapter = chapterSeeder.getChapter({ isFollowed: true })
    vi.spyOn(FollowRepository, 'unfollow').mockResolvedValue(
      controllerSuccess({ data: followSeeder.getFollowStateApi({ is_followed: false }) }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    const readingStore = createReadingStore()
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    wrapper = mount(FollowButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.follow-button').trigger('click')
    await flushPromises()

    expect(FollowRepository.unfollow).toHaveBeenCalledWith({
      params: FollowDto.toChapterParams(chapter.id),
    })
    expect(readingStore.chapter.value.isFollowed).toBe(false)
    expect(flash.getFlashes().at(-1).content).toBe(t('follow_button.unfollowed'))
  })

  it('keeps the follow state as it was when the api refuses', async () => {
    vi.spyOn(FollowRepository, 'follow').mockResolvedValue(controllerError())
    useAuthStore().setUser(userSeeder.getUser())
    const readingStore = createReadingStore()
    readingStore.setReading({
      ...chapterSeeder.getReading(),
      chapter: chapterSeeder.getChapter({ isFollowed: false }),
    })
    wrapper = mount(FollowButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.follow-button').trigger('click')
    await flushPromises()

    expect(readingStore.chapter.value.isFollowed).toBe(false)
  })

  it('invites a visitor to sign in rather than swallowing the click', async () => {
    vi.spyOn(FollowRepository, 'follow')
    const readingStore = createReadingStore()
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter: chapterSeeder.getChapter() })
    wrapper = mount(FollowButton, {
      global: { provide: { [READING_STORE_KEY]: readingStore } },
    })

    await wrapper.find('.follow-button').trigger('click')
    await flushPromises()

    expect(FollowRepository.follow).not.toHaveBeenCalled()
    expect(useAuth().showLoginDialog.value).toBe(true)
  })
})
