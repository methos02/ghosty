import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DraftsPage from '@/views/chapters/DraftsPage.vue'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('DraftsPage.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  beforeEach(() => {
    useAuthStore().setUser(userSeeder.getUser())
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
  })

  it('opens on the novel drafts, the writing entry point of the page', async () => {
    const novelDraftApi = chapterSeeder.getChapterApi({ id: 12, is_draft: true, is_root: true })
    const chapterDraftApi = chapterSeeder.getChapterApi({
      id: 30,
      is_draft: true,
      is_root: false,
      title: 'La route inverse',
    })
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({
        data: chapterSeeder.getListApi({ chapters: [novelDraftApi, chapterDraftApi] }),
      }),
    )
    wrapper = mount(DraftsPage)
    await flushPromises()

    const items = wrapper.findAll('.drafts-page__item')
    expect(items).toHaveLength(1)
    expect(items[0].text()).toContain(novelDraftApi.title)
  })

  it('switches to the chapter drafts without asking the api again', async () => {
    const novelDraftApi = chapterSeeder.getChapterApi({ id: 12, is_draft: true, is_root: true })
    const chapterDraftApi = chapterSeeder.getChapterApi({
      id: 30,
      is_draft: true,
      is_root: false,
      title: 'La route inverse',
    })
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({
        data: chapterSeeder.getListApi({ chapters: [novelDraftApi, chapterDraftApi] }),
      }),
    )
    wrapper = mount(DraftsPage)
    await flushPromises()

    await wrapper.findAll('.drafts-page__body button')[0].trigger('click')

    expect(wrapper.findAll('.drafts-page__item')[0].text()).toContain(chapterDraftApi.title)
    expect(ChapterRepository.drafts).toHaveBeenCalledTimes(1)
  })

  it('resumes a novel draft through the novel form, a chapter draft through its own', async () => {
    const novelDraftApi = chapterSeeder.getChapterApi({ id: 12, is_draft: true, is_root: true })
    const chapterDraftApi = chapterSeeder.getChapterApi({
      id: 30,
      is_draft: true,
      is_root: false,
      title: 'La route inverse',
    })
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({
        data: chapterSeeder.getListApi({ chapters: [novelDraftApi, chapterDraftApi] }),
      }),
    )
    wrapper = mount(DraftsPage)
    await flushPromises()

    expect(wrapper.findComponent('.drafts-page__resume').props('to')).toEqual({
      name: 'novel-edit',
      params: { id: novelDraftApi.id },
    })

    await wrapper.findAll('.drafts-page__body button')[0].trigger('click')

    expect(wrapper.findComponent('.drafts-page__resume').props('to')).toEqual({
      name: 'chapter-edit',
      params: { id: chapterDraftApi.id },
    })
  })

  it('invites the author to start a novel when nothing is in progress', async () => {
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getListApi({ chapters: [] }) }),
    )
    wrapper = mount(DraftsPage)
    await flushPromises()

    expect(wrapper.find('.drafts-page__empty').exists()).toBe(true)
    expect(wrapper.find('.drafts-page__create').exists()).toBe(true)
  })

  it('reloads the list once a draft is discarded', async () => {
    const novelDraftApi = chapterSeeder.getChapterApi({ id: 12, is_draft: true, is_root: true })
    vi.spyOn(ChapterRepository, 'drafts').mockResolvedValue(
      controllerSuccess({ data: chapterSeeder.getListApi({ chapters: [novelDraftApi] }) }),
    )
    wrapper = mount(DraftsPage)
    await flushPromises()
    vi.spyOn(ChapterRepository, 'destroy').mockResolvedValue(controllerSuccess())

    await wrapper.find('.drafts-page__discard').trigger('click')
    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(ChapterRepository.destroy).toHaveBeenCalledWith({
      params: ChapterDto.toChapterParams(novelDraftApi.id),
    })
    expect(ChapterRepository.drafts).toHaveBeenCalledTimes(2)
  })
})
