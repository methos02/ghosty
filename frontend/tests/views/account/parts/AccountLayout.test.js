import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AccountLayout from '@/views/account/parts/AccountLayout.vue'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { ACCOUNT_TABS } from '@/constants/account-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('AccountLayout.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  it('highlights the tab of the current page', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    await router.push({ name: ACCOUNT_TABS.SECURITY })

    wrapper = mount(AccountLayout)

    expect(wrapper.find('[aria-current="page"]').text()).toBe(
      t(`account_layout.tabs.${ACCOUNT_TABS.SECURITY}`),
    )
  })

  it('leads to the public profile of the connected user', () => {
    const user = userSeeder.getUser()
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    useAuthStore().setUser(user)

    wrapper = mount(AccountLayout)

    expect(wrapper.findComponent('.account-layout__public').props('to')).toEqual({
      name: 'profile',
      params: { profileSlug: user.profileSlug },
    })
  })
})
