import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DraftsPage from '@/views/chapters/DraftsPage.vue'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('DraftsPage.vue', () => {
  let wrapper

  const novelDraft = () =>
    chapterSeeder.getChapter({
      id: 12,
      isDraft: true,
      isRoot: true,
      title: 'Le virage',
      novel: novelSeeder.getNovel({ title: 'Nuit virage' }),
    })

  const chapterDraft = () =>
    chapterSeeder.getChapter({
      id: 30,
      isDraft: true,
      isRoot: false,
      title: 'La route inverse',
    })

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    await router.push('/')
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    useAuthStore().setUser(userSeeder.getUser())
  })

  const mountWith = async chapters => {
    vi.spyOn(ChapterController, 'drafts').mockResolvedValue({
      status: STATUS.SUCCESS,
      chapters,
    })
    wrapper = mount(DraftsPage)
    await flushPromises()
    return wrapper
  }

  it('opens on the novel drafts, the writing entry point of the page', async () => {
    await mountWith([novelDraft(), chapterDraft()])

    const items = wrapper.findAll('.drafts-page__item')
    expect(items).toHaveLength(1)
    expect(items[0].text()).toContain('Le virage')
  })

  it('switches to the chapter drafts without asking the api again', async () => {
    await mountWith([novelDraft(), chapterDraft()])

    await wrapper.findAll('.drafts-page__body button')[0].trigger('click')

    expect(wrapper.findAll('.drafts-page__item')[0].text()).toContain('La route inverse')
    expect(ChapterController.drafts).toHaveBeenCalledTimes(1)
  })

  it('resumes a novel draft through the novel form, a chapter draft through its own', async () => {
    await mountWith([novelDraft(), chapterDraft()])

    expect(wrapper.findComponent('.drafts-page__resume').props('to')).toEqual({
      name: 'novel-edit',
      params: { id: 12 },
    })

    await wrapper.findAll('.drafts-page__body button')[0].trigger('click')

    expect(wrapper.findComponent('.drafts-page__resume').props('to')).toEqual({
      name: 'chapter-edit',
      params: { id: 30 },
    })
  })

  it('invites the author to start a novel when nothing is in progress', async () => {
    await mountWith([])

    expect(wrapper.find('.drafts-page__empty').exists()).toBe(true)
    expect(wrapper.find('.drafts-page__create').exists()).toBe(true)
  })

  it('reloads the list once a draft is discarded', async () => {
    await mountWith([novelDraft()])
    const destroy = vi
      .spyOn(ChapterController, 'destroy')
      .mockResolvedValue({ status: STATUS.SUCCESS })

    await wrapper.find('.drafts-page__discard').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(destroy).toHaveBeenCalledWith(12)
    expect(ChapterController.drafts).toHaveBeenCalledTimes(2)
  })
})
