import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserSummary from '@/views/parts/UserSummary.vue'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('UserSummary.vue', () => {
  let wrapper

  const mockDrafts = count =>
    vi.spyOn(ChapterController, 'drafts').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapters: chapterSeeder.getCurrentContinuity(count),
    })

  const mountFor = async user => {
    useAuthStore().setUser(user)
    wrapper = mount(UserSummary)
    await flushPromises()
    return wrapper
  }

  beforeEach(() => {
    mockDrafts(0)
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    vi.restoreAllMocks()
  })

  it('shows the username of the connected author', async () => {
    await mountFor(userSeeder.getUser())

    expect(wrapper.find('.user-summary__username').text()).toBe('GhostWriter')
  })

  it('falls back to an icon when the author has no avatar', async () => {
    await mountFor(userSeeder.getUser({ avatar: undefined }))

    expect(wrapper.find('.user-summary__avatar--empty').exists()).toBe(true)
    expect(wrapper.find('img.user-summary__avatar').exists()).toBe(false)
  })

  it('shows the avatar when there is one', async () => {
    await mountFor(userSeeder.getUser({ avatar: 'https://example.test/me.png' }))

    expect(wrapper.find('img.user-summary__avatar').attributes('src')).toBe(
      'https://example.test/me.png',
    )
  })

  it('links to the drafts and counts them', async () => {
    mockDrafts(3)
    await mountFor(userSeeder.getUser())

    const link = wrapper.findComponent('.user-summary__drafts')
    expect(link.text()).toBe('3 brouillons en cours')
    expect(link.props('to')).toEqual({ name: 'drafts' })
  })

  it('says it in the singular for a lone draft', async () => {
    mockDrafts(1)
    await mountFor(userSeeder.getUser())

    expect(wrapper.find('.user-summary__drafts').text()).toBe('1 brouillon en cours')
  })

  it('invites to write when there is no draft, rather than stating a void', async () => {
    await mountFor(userSeeder.getUser())

    const link = wrapper.findComponent('.user-summary__drafts')
    expect(link.text()).toBe('Rédiger un nouveau roman')
    expect(link.props('to')).toEqual({ name: 'novel-create' })
  })

  it('announces the pending notifications', async () => {
    await mountFor(userSeeder.getUser())

    expect(wrapper.find('.user-summary__notifications').text()).toBe('2 nouvelles notifications')
  })
})
