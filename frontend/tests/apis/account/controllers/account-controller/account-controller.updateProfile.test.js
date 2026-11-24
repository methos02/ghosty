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

  describe('updateProfile', () => {
    it('sends the profile to the profile form and returns the updated user', async () => {
      const formData = accountSeeder.getProfileForm()
      const userApi = accountSeeder.getUpdatedUserApi()
      vi.spyOn(AccountRepository, 'updateProfile').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: userApi,
      })

      const result = await AccountController.updateProfile(formData)

      const { body, form } = AccountRepository.updateProfile.mock.calls[0][0]
      expect(Object.fromEntries(body)).toEqual(
        Object.fromEntries(AccountDto.toUpdateProfile(formData)),
      )
      expect(form).toBe('accountProfile')
      expect(result).toEqual({
        status: STATUS.SUCCESS,
        user: AuthDto.fromUser(userApi),
      })
    })

    it('passes a refused username through untouched', async () => {
      const refusal = controllerError(STATUS.UNPROCESSABLE_ENTITY)
      vi.spyOn(AccountRepository, 'updateProfile').mockResolvedValue(refusal)

      expect(await AccountController.updateProfile(accountSeeder.getProfileForm())).toBe(refusal)
    })
  })
})
