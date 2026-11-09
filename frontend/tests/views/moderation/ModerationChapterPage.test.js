import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ModerationChapterPage from '@/views/moderation/ModerationChapterPage.vue'
import { ModerationRepository } from '@/apis/moderation/repositories/moderation-repository.js'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { CHAPTER_STATUSES } from '@/constants/chapter-constants.js'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('ModerationChapterPage.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  beforeEach(() => {
    useAuthStore().setUser(userSeeder.getUser({ roles: ['moderator'] }))
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
  })

  it('loads the case file of the chapter of the route', async () => {
    const moderationCaseApi = moderationSeeder.getChapterCaseApi()
    vi.spyOn(ModerationRepository, 'showChapter').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-chapter', params: { id: moderationCaseApi.chapter.id } })

    wrapper = mount(ModerationChapterPage)
    await flushPromises()

    expect(ModerationRepository.showChapter).toHaveBeenCalledWith({
      params: ModerationDto.toChapterParams(moderationCaseApi.chapter.id),
    })
    expect(wrapper.find('.moderation-chapter-page__title').text()).toBe(moderationCaseApi.chapter.title)
    expect(wrapper.find('.moderation-chapter-page__content').text()).toBe(
      moderationCaseApi.chapter.content,
    )
  })

  it('offers every resolution on a chapter that can be removed', async () => {
    const moderationCaseApi = moderationSeeder.getChapterCaseApi()
    vi.spyOn(ModerationRepository, 'showChapter').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-chapter', params: { id: moderationCaseApi.chapter.id } })

    wrapper = mount(ModerationChapterPage)
    await flushPromises()

    expect(wrapper.findAll('input[type="radio"]').map(radio => radio.element.value)).toEqual(
      Object.values(RESOLUTIONS),
    )
  })

  it('turns the chapter text into the passage removal editor once a passage removal is chosen', async () => {
    const moderationCaseApi = moderationSeeder.getChapterCaseApi()
    vi.spyOn(ModerationRepository, 'showChapter').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-chapter', params: { id: moderationCaseApi.chapter.id } })
    wrapper = mount(ModerationChapterPage)
    await flushPromises()

    await wrapper.find(`input[value="${RESOLUTIONS.PASSAGE_REMOVED}"]`).setValue(true)

    expect(wrapper.find('.moderation-chapter-page__content').exists()).toBe(false)
    expect(wrapper.find('.passage-removal-editor__source').text()).toBe(moderationCaseApi.chapter.content)
  })

  it('only allows a passage removal on a chapter that has continuations', async () => {
    const moderationCaseApi = moderationSeeder.getChapterCaseApi({ is_removable: false })
    vi.spyOn(ModerationRepository, 'showChapter').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-chapter', params: { id: moderationCaseApi.chapter.id } })

    wrapper = mount(ModerationChapterPage)
    await flushPromises()

    expect(wrapper.find('.moderation-chapter-page__continued').text()).toBe(
      t('moderation_chapter_page.continued'),
    )
    expect(wrapper.findAll('input[type="radio"]').map(radio => radio.element.value)).toEqual([
      RESOLUTIONS.DISMISSED,
      RESOLUTIONS.PASSAGE_REMOVED,
    ])
  })

  it('offers to restore an archived chapter instead of a new decision', async () => {
    const moderationCaseApi = moderationSeeder.getChapterCaseApi({
      chapter: moderationSeeder.getModeratedChapterApi({ status: CHAPTER_STATUSES.ARCHIVED }),
    })
    vi.spyOn(ModerationRepository, 'showChapter').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-chapter', params: { id: moderationCaseApi.chapter.id } })

    wrapper = mount(ModerationChapterPage)
    await flushPromises()

    expect(wrapper.find('.moderation-restore-button').exists()).toBe(true)
    expect(wrapper.find('.moderation-decision').exists()).toBe(false)
  })

  it('offers no decision once every report has been processed', async () => {
    const moderationCaseApi = moderationSeeder.getChapterCaseApi({
      reports: [moderationSeeder.getProcessedReportApi()],
    })
    vi.spyOn(ModerationRepository, 'showChapter').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-chapter', params: { id: moderationCaseApi.chapter.id } })

    wrapper = mount(ModerationChapterPage)
    await flushPromises()

    expect(wrapper.find('.moderation-decision').exists()).toBe(false)
  })
})
