import { describe, it, expect, vi, afterEach } from 'vitest'
import { profileAsyncData } from '@/ssr/async-data/user-async-data.js'
import { createProfileStore } from '@/core-vue/stores/users/profile-store.js'
import { UserRepository } from '@/apis/users/repositories/user-repository.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { PROFILE_TABS } from '@/constants/user-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('user-async-data', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('profileAsyncData', () => {
    it('hands the profile it fetched to the store the page will render', async () => {
      const profileApi = userSeeder.getProfileApi()
      vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
      const stores = { profile: createProfileStore() }

      const result = await profileAsyncData({
        stores,
        route: { params: { profileSlug: profileApi.profile_slug }, query: {} },
      })

      expect(result).toEqual({ statusCode: STATUS.SUCCESS })
      expect(stores.profile.profile.value).toEqual(UserDto.fromProfile(profileApi))
    })

    it('redirects permanently an outdated profile slug to the current one', async () => {
      const profileApi = userSeeder.getProfileApi()
      vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))

      const result = await profileAsyncData({
        stores: { profile: createProfileStore() },
        route: {
          name: PROFILE_TABS.COVERS,
          params: { profileSlug: `${profileApi.slug}-ancien` },
          query: {},
        },
      })

      expect(result).toEqual({
        redirect: {
          name: PROFILE_TABS.COVERS,
          params: { profileSlug: profileApi.profile_slug },
          query: { renamed: '1' },
        },
        statusCode: STATUS.MOVED_PERMANENTLY,
      })
    })

    it('answers with the status of the api when the account is unknown or deleted', async () => {
      vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerError(STATUS.NOT_FOUND))

      const result = await profileAsyncData({
        stores: { profile: createProfileStore() },
        route: { params: { profileSlug: userSeeder.getProfileApi().profile_slug }, query: {} },
      })

      expect(result).toEqual({ statusCode: STATUS.NOT_FOUND })
    })
  })
})
