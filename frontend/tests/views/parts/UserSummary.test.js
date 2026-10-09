import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserSummary from '@/views/parts/UserSummary.vue'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('UserSummary.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    vi.clearAllMocks()
  })

  it('shows the username of the connected author', async () => {
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({
        data: chapterSeeder.getListApi({ chapters: chapterSeeder.getMainBranchApi(0) }),
      }),
    )
    const user = userSeeder.getUser()
    useAuthStore().setUser(user)
    wrapper = mount(UserSummary)
    await flushPromises()

    expect(wrapper.find('.user-summary__username').text()).toBe(user.username)
  })

  it('falls back to an icon when the author has no avatar', async () => {
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({
        data: chapterSeeder.getListApi({ chapters: chapterSeeder.getMainBranchApi(0) }),
      }),
    )
    useAuthStore().setUser(userSeeder.getUser({ avatar: undefined }))
    wrapper = mount(UserSummary)
    await flushPromises()

    expect(wrapper.find('.user-summary__avatar--empty').exists()).toBe(true)
    expect(wrapper.find('img.user-summary__avatar').exists()).toBe(false)
  })

  it('shows the avatar when there is one', async () => {
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({
        data: chapterSeeder.getListApi({ chapters: chapterSeeder.getMainBranchApi(0) }),
      }),
    )
    const user = userSeeder.getUserWithAvatar()
    useAuthStore().setUser(user)
    wrapper = mount(UserSummary)
    await flushPromises()

    expect(wrapper.find('img.user-summary__avatar').attributes('src')).toBe(user.avatar)
  })

  it('links to the drafts and counts them', async () => {
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({
        data: chapterSeeder.getListApi({ chapters: chapterSeeder.getMainBranchApi(3) }),
      }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(UserSummary)
    await flushPromises()

    const link = wrapper.findComponent('.user-summary__drafts')
    expect(link.text()).toBe(t('user_summary.drafts', 3))
    expect(link.props('to')).toEqual({ name: 'drafts' })
  })

  it('says it in the singular for a lone draft', async () => {
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({
        data: chapterSeeder.getListApi({ chapters: chapterSeeder.getMainBranchApi(1) }),
      }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(UserSummary)
    await flushPromises()

    expect(wrapper.find('.user-summary__drafts').text()).toBe(t('user_summary.drafts', 1))
  })

  it('invites to write when there is no draft, rather than stating a void', async () => {
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({
        data: chapterSeeder.getListApi({ chapters: chapterSeeder.getMainBranchApi(0) }),
      }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(UserSummary)
    await flushPromises()

    const link = wrapper.findComponent('.user-summary__drafts')
    expect(link.text()).toBe(t('user_summary.drafts', 0))
    expect(link.props('to')).toEqual({ name: 'novel-create' })
  })
})
