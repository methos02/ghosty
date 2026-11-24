import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AccountStatisticsPage from '@/views/account/AccountStatisticsPage.vue'
import { UserRepository } from '@/apis/users/repositories/user-repository.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { createProfileStore, PROFILE_STORE_KEY } from '@/core-vue/stores/users/profile-store.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('AccountStatisticsPage.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    vi.clearAllMocks()
  })

  it('loads the statistics of the connected user', async () => {
    const profileApi = userSeeder.getProfileApi()
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
    vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
    useAuthStore().setUser(userSeeder.getUser())

    wrapper = mount(AccountStatisticsPage, {
      global: { provide: { [PROFILE_STORE_KEY]: createProfileStore() } },
    })
    await flushPromises()

    expect(UserRepository.show).toHaveBeenCalledWith({
      params: UserDto.toProfileParams(profileApi.slug),
    })
    expect(wrapper.find('.profile-statistics__reads').text()).toBe(
      String(profileApi.statistics.read_count),
    )
  })
})
