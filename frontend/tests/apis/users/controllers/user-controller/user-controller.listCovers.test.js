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

  describe('listCovers', () => {
    it('asks the requested page of the covers of the user', async () => {
      const profile = userSeeder.getProfile()
      vi.spyOn(UserRepository, 'listCovers').mockResolvedValue(
        controllerSuccess({ data: userSeeder.getProfileCoversApi() }),
      )

      await UserController.listCovers(profile.username, 2)

      expect(UserRepository.listCovers).toHaveBeenCalledWith({
        params: UserDto.toListParams(profile.username, 2),
      })
    })

    it('returns the covers mapped by the dto', async () => {
      const listApi = userSeeder.getProfileCoversApi()
      vi.spyOn(UserRepository, 'listCovers').mockResolvedValue(controllerSuccess({ data: listApi }))

      const result = await UserController.listCovers(userSeeder.getProfile().username)

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        ...UserDto.fromCoverList(listApi),
      })
    })

    it('passes a failure through untouched', async () => {
      const failure = controllerError(STATUS.NOT_FOUND)
      vi.spyOn(UserRepository, 'listCovers').mockResolvedValue(failure)

      const result = await UserController.listCovers(userSeeder.getProfile().username)

      expect(result).toBe(failure)
    })
  })
})
