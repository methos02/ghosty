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

  describe('listBranches', () => {
    it('asks the requested page of the continued chapters of the user', async () => {
      const profile = userSeeder.getProfile()
      vi.spyOn(UserRepository, 'listBranches').mockResolvedValue(
        controllerSuccess({ data: userSeeder.getProfileChaptersApi() }),
      )

      await UserController.listBranches(profile.username, 2)

      expect(UserRepository.listBranches).toHaveBeenCalledWith({
        params: UserDto.toListParams(profile.username, 2),
      })
    })

    it('returns the continued chapters mapped by the dto', async () => {
      const listApi = userSeeder.getProfileChaptersApi()
      vi.spyOn(UserRepository, 'listBranches').mockResolvedValue(
        controllerSuccess({ data: listApi }),
      )

      const result = await UserController.listBranches(userSeeder.getProfile().username)

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        ...UserDto.fromChapterList(listApi),
      })
    })

    it('passes a failure through untouched', async () => {
      const failure = controllerError(STATUS.NOT_FOUND)
      vi.spyOn(UserRepository, 'listBranches').mockResolvedValue(failure)

      const result = await UserController.listBranches(userSeeder.getProfile().username)

      expect(result).toBe(failure)
    })
  })
})
