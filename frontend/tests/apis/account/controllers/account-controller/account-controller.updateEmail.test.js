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

  describe('updateEmail', () => {
    it('sends the address with the current password and returns the updated user', async () => {
      const formData = accountSeeder.getEmailForm()
      const userApi = accountSeeder.getUpdatedUserApi({ email: formData.email })
      vi.spyOn(AccountRepository, 'updateEmail').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: userApi,
      })

      const result = await AccountController.updateEmail(formData)

      expect(AccountRepository.updateEmail).toHaveBeenCalledWith({
        body: AccountDto.toUpdateEmail(formData),
        form: 'accountEmail',
      })
      expect(result).toEqual({
        status: STATUS.SUCCESS,
        user: AuthDto.fromUser(userApi),
      })
    })

    it('passes a wrong current password through untouched', async () => {
      const refusal = controllerError(STATUS.UNPROCESSABLE_ENTITY)
      vi.spyOn(AccountRepository, 'updateEmail').mockResolvedValue(refusal)

      expect(await AccountController.updateEmail(accountSeeder.getEmailForm())).toBe(refusal)
    })
  })
})
