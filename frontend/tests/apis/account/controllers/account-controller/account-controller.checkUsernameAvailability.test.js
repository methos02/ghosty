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

  describe('checkUsernameAvailability', () => {
    it('asks the api whether the username is free', async () => {
      const username = accountSeeder.getProfileForm().username
      vi.spyOn(AccountRepository, 'checkUsernameAvailability').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: accountSeeder.getUsernameAvailabilityApi(),
      })

      await AccountController.checkUsernameAvailability(username)

      expect(AccountRepository.checkUsernameAvailability).toHaveBeenCalledWith({
        params: AccountDto.toUsernameAvailabilityParams(username),
      })
    })

    it('tells the username is taken when the api says so', async () => {
      const availabilityApi = accountSeeder.getUsernameAvailabilityApi({ available: false })
      vi.spyOn(AccountRepository, 'checkUsernameAvailability').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: availabilityApi,
      })

      const result = await AccountController.checkUsernameAvailability(
        accountSeeder.getProfileForm().username,
      )

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        isAvailable: AccountDto.fromUsernameAvailability(availabilityApi),
      })
    })
  })
})
