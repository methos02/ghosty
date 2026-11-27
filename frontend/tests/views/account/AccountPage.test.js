import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { RouterView } from 'vue-router'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { ACCOUNT_TABS } from '@/constants/account-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('AccountPage.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  it('opens the profile tab from the bare account address', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    useAuthStore().setUser(userSeeder.getUser())

    await router.push('/me/account')

    expect(router.currentRoute.value.name).toBe(ACCOUNT_TABS.PROFILE)
  })

  it('shows the sections of the tab in the address and highlights it', async () => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    useAuthStore().setUser(userSeeder.getUser())
    await router.push({ name: ACCOUNT_TABS.SECURITY })

    wrapper = mount(RouterView, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.find('.account-password-section').exists()).toBe(true)
    expect(wrapper.find('.account-profile-section').exists()).toBe(false)
    expect(wrapper.find('.tabs-layout__menu [aria-current="page"]').text()).toBe(
      t(`account_page.tabs.${ACCOUNT_TABS.SECURITY}`),
    )
  })

  it('leads to the public profile of the connected user', async () => {
    const user = userSeeder.getUser()
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    useAuthStore().setUser(user)
    await router.push({ name: ACCOUNT_TABS.SECURITY })

    wrapper = mount(RouterView, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.findComponent('.account-page__public').props('to')).toEqual({
      name: 'profile',
      params: { profileSlug: user.profileSlug },
    })
  })
})
