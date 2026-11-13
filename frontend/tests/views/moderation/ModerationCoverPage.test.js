import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ModerationCoverPage from '@/views/moderation/ModerationCoverPage.vue'
import { ModerationRepository } from '@/apis/moderation/repositories/moderation-repository.js'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('ModerationCoverPage.vue', () => {
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

  it('loads the cover of the route with the novel it was proposed for', async () => {
    const moderationCaseApi = moderationSeeder.getCoverCaseApi()
    vi.spyOn(ModerationRepository, 'showCover').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-cover', params: { id: moderationCaseApi.cover.id } })

    wrapper = mount(ModerationCoverPage)
    await flushPromises()

    expect(ModerationRepository.showCover).toHaveBeenCalledWith({
      params: ModerationDto.toCoverParams(moderationCaseApi.cover.id),
    })
    expect(wrapper.find('.moderation-cover-page__image').attributes('src')).toBe(
      moderationCaseApi.cover.image_url,
    )
    expect(wrapper.find('.moderation-cover-page__target').text()).toBe(
      t('moderation_cover_page.on_novel', { novel: moderationCaseApi.cover.novel.title }),
    )
  })

  it('offers to dismiss the reports or to hide the cover', async () => {
    const moderationCaseApi = moderationSeeder.getCoverCaseApi()
    vi.spyOn(ModerationRepository, 'showCover').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-cover', params: { id: moderationCaseApi.cover.id } })

    wrapper = mount(ModerationCoverPage)
    await flushPromises()

    expect(wrapper.findAll('input[type="radio"]').map(radio => radio.element.value)).toEqual([
      RESOLUTIONS.DISMISSED,
      RESOLUTIONS.HIDDEN,
    ])
  })

  it('offers to restore a hidden cover instead of a new decision', async () => {
    const moderationCaseApi = moderationSeeder.getCoverCaseApi({
      cover: moderationSeeder.getModeratedCoverApi({ is_hidden: true }),
    })
    vi.spyOn(ModerationRepository, 'showCover').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-cover', params: { id: moderationCaseApi.cover.id } })

    wrapper = mount(ModerationCoverPage)
    await flushPromises()

    expect(wrapper.find('.moderation-restore-button').exists()).toBe(true)
    expect(wrapper.find('.moderation-decision').exists()).toBe(false)
  })

  it('offers no decision once every report of the cover is processed', async () => {
    const moderationCaseApi = moderationSeeder.getCoverCaseApi({
      reports: [moderationSeeder.getProcessedReportApi()],
    })
    vi.spyOn(ModerationRepository, 'showCover').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-cover', params: { id: moderationCaseApi.cover.id } })

    wrapper = mount(ModerationCoverPage)
    await flushPromises()

    expect(wrapper.find('.moderation-decision').exists()).toBe(false)
  })
})
