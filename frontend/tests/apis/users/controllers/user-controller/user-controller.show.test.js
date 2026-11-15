import { describe, it, expect, vi, afterEach } from 'vitest'
import { UserController } from '@/apis/users/controllers/user-controller.js'
import { UserRepository } from '@/apis/users/repositories/user-repository.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('user-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('show', () => {
    it('asks the profile of the username', async () => {
      const profileApi = userSeeder.getProfileApi()
      vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))

      await UserController.show(profileApi.username)

      expect(UserRepository.show).toHaveBeenCalledWith({
        params: UserDto.toProfileParams(profileApi.username),
      })
    })

    it('returns the profile mapped by the dto', async () => {
      const profileApi = userSeeder.getProfileApi()
      vi.spyOn(UserRepository, 'show').mockResolvedValue(controllerSuccess({ data: profileApi }))

      expect(await UserController.show(profileApi.username)).toEqual({
        status: STATUS.SUCCESS,
        profile: UserDto.fromProfile(profileApi),
      })
    })

    it('passes an unknown username through as not found', async () => {
      const notFound = controllerError(STATUS.NOT_FOUND)
      vi.spyOn(UserRepository, 'show').mockResolvedValue(notFound)

      expect(await UserController.show(userSeeder.getProfileApi().username)).toBe(notFound)
    })
  })
})
