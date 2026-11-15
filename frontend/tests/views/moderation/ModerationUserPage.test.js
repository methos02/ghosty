import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ModerationUserPage from '@/views/moderation/ModerationUserPage.vue'
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

describe('ModerationUserPage.vue', () => {
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

  it('loads the account of the route with its statistics', async () => {
    const moderationCaseApi = moderationSeeder.getUserCaseApi()
    vi.spyOn(ModerationRepository, 'showUser').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-user', params: { id: moderationCaseApi.user.id } })

    wrapper = mount(ModerationUserPage)
    await flushPromises()

    expect(ModerationRepository.showUser).toHaveBeenCalledWith({
      params: ModerationDto.toUserParams(moderationCaseApi.user.id),
    })
    expect(wrapper.find('h1').text()).toBe(
      t('moderation_user_page.title', { username: moderationCaseApi.user.username }),
    )
    expect(wrapper.find('.profile-statistics').exists()).toBe(true)
  })

  it('offers to dismiss the reports or to sanction the account', async () => {
    const moderationCaseApi = moderationSeeder.getUserCaseApi()
    vi.spyOn(ModerationRepository, 'showUser').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-user', params: { id: moderationCaseApi.user.id } })

    wrapper = mount(ModerationUserPage)
    await flushPromises()

    expect(wrapper.findAll('input[type="radio"]').map(radio => radio.element.value)).toEqual([
      RESOLUTIONS.DISMISSED,
      RESOLUTIONS.SANCTIONED,
    ])
  })

  it('offers no decision once every report on the account is processed', async () => {
    const moderationCaseApi = moderationSeeder.getUserCaseApi({
      reports: [moderationSeeder.getProcessedReportApi()],
    })
    vi.spyOn(ModerationRepository, 'showUser').mockResolvedValue(
      controllerSuccess({ data: moderationCaseApi }),
    )
    await router.push({ name: 'moderation-user', params: { id: moderationCaseApi.user.id } })

    wrapper = mount(ModerationUserPage)
    await flushPromises()

    expect(wrapper.find('.moderation-decision').exists()).toBe(false)
  })
})
