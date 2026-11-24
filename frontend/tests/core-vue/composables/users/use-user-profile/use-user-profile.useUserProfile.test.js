import { describe, it, expect, vi, afterEach } from 'vitest'
import { useUserProfile } from '@/core-vue/composables/users/use-user-profile.js'
import { createProfileStore } from '@/core-vue/stores/users/profile-store.js'
import { UserRepository } from '@/apis/users/repositories/user-repository.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('use-user-profile', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('useUserProfile', () => {
    it('loads the profile by the slug part of the profile slug into the store it receives', async () => {
      const profileApi = userSeeder.getProfileApi()
      vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))
      const profileStore = createProfileStore()
      const { userProfile } = useUserProfile({ profileStore })

      await userProfile.load(`${profileApi.slug}-ancien-pseudo`)

      expect(UserRepository.show).toHaveBeenCalledWith({
        params: UserDto.toProfileParams(profileApi.slug),
      })
      expect(profileStore.profile.value).toEqual(UserDto.fromProfile(profileApi))
    })

    it('does not fetch again the profile already in the store', async () => {
      const profile = userSeeder.getProfile()
      vi.spyOn(UserRepository, 'show')
      const profileStore = createProfileStore()
      profileStore.setProfile(profile)
      const { userProfile } = useUserProfile({ profileStore })

      const response = await userProfile.load(profile.profileSlug)

      expect(UserRepository.show).not.toHaveBeenCalled()
      expect(response.status).toBe(STATUS.SUCCESS)
    })

    it('forgets the previous profile when the slug is unknown', async () => {
      const notFound = controllerError(STATUS.NOT_FOUND)
      vi.spyOn(UserRepository, 'show').mockResolvedValue(notFound)
      const profileStore = createProfileStore()
      profileStore.setProfile(userSeeder.getProfile())
      const { userProfile } = useUserProfile({ profileStore })

      const response = await userProfile.load('zzzzzz-inconnu')

      expect(response).toBe(notFound)
      expect(profileStore.profile.value).toBeUndefined()
    })
  })
})
