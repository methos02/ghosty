import { describe, it, expect, vi, afterEach } from 'vitest'
import { AccountController } from '@/apis/account/controllers/account-controller.js'
import { AccountRepository } from '@/apis/account/repositories/account-repository.js'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError } from '&/utils/helpers/controller-response.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('deleteAvatar', () => {
    it('returns the user without avatar', async () => {
      const userApi = accountSeeder.getUpdatedUserApi()
      vi.spyOn(AccountRepository, 'deleteAvatar').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: userApi,
      })

      expect(await AccountController.deleteAvatar()).toEqual({
        status: STATUS.SUCCESS,
        user: AuthDto.fromUser(userApi),
      })
    })
  })
})
