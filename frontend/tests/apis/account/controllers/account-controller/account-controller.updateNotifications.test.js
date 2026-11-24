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

  describe('updateNotifications', () => {
    it('sends the preferences to the notifications form and returns the updated user', async () => {
      const formData = accountSeeder.getNotificationsForm()
      const userApi = accountSeeder.getUpdatedUserApi()
      vi.spyOn(AccountRepository, 'updateNotifications').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: userApi,
      })

      const result = await AccountController.updateNotifications(formData)

      expect(AccountRepository.updateNotifications).toHaveBeenCalledWith({
        body: AccountDto.toUpdateNotifications(formData),
        form: 'accountNotifications',
      })
      expect(result).toEqual({
        status: STATUS.SUCCESS,
        user: AuthDto.fromUser(userApi),
      })
    })

    it('passes a refused preference through untouched', async () => {
      const refusal = controllerError(STATUS.UNPROCESSABLE_ENTITY)
      vi.spyOn(AccountRepository, 'updateNotifications').mockResolvedValue(refusal)

      expect(
        await AccountController.updateNotifications(accountSeeder.getNotificationsForm()),
      ).toBe(refusal)
    })
  })
})
