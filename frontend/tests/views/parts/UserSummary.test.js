import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserSummary from '@/views/parts/UserSummary.vue'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
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
    vi.spyOn(ChapterController, 'drafts').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapters: chapterSeeder.getMainBranch(0),
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(UserSummary)
    await flushPromises()

    expect(wrapper.find('.user-summary__username').text()).toBe('GhostWriter')
  })

  it('falls back to an icon when the author has no avatar', async () => {
    vi.spyOn(ChapterController, 'drafts').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapters: chapterSeeder.getMainBranch(0),
    })
    useAuthStore().setUser(userSeeder.getUser({ avatar: undefined }))
    wrapper = mount(UserSummary)
    await flushPromises()

    expect(wrapper.find('.user-summary__avatar--empty').exists()).toBe(true)
    expect(wrapper.find('img.user-summary__avatar').exists()).toBe(false)
  })

  it('shows the avatar when there is one', async () => {
    vi.spyOn(ChapterController, 'drafts').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapters: chapterSeeder.getMainBranch(0),
    })
    useAuthStore().setUser(userSeeder.getUser({ avatar: 'https://example.test/me.png' }))
    wrapper = mount(UserSummary)
    await flushPromises()

    expect(wrapper.find('img.user-summary__avatar').attributes('src')).toBe(
      'https://example.test/me.png',
    )
  })

  it('links to the drafts and counts them', async () => {
    vi.spyOn(ChapterController, 'drafts').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapters: chapterSeeder.getMainBranch(3),
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(UserSummary)
    await flushPromises()

    const link = wrapper.findComponent('.user-summary__drafts')
    expect(link.text()).toBe('3 brouillons en cours')
    expect(link.props('to')).toEqual({ name: 'drafts' })
  })

  it('says it in the singular for a lone draft', async () => {
    vi.spyOn(ChapterController, 'drafts').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapters: chapterSeeder.getMainBranch(1),
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(UserSummary)
    await flushPromises()

    expect(wrapper.find('.user-summary__drafts').text()).toBe('1 brouillon en cours')
  })

  it('invites to write when there is no draft, rather than stating a void', async () => {
    vi.spyOn(ChapterController, 'drafts').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapters: chapterSeeder.getMainBranch(0),
    })
    useAuthStore().setUser(userSeeder.getUser())
    wrapper = mount(UserSummary)
    await flushPromises()

    const link = wrapper.findComponent('.user-summary__drafts')
    expect(link.text()).toBe('Rédiger un nouveau roman')
    expect(link.props('to')).toEqual({ name: 'novel-create' })
  })
})
