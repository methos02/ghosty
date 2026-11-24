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

  describe('updatePassword', () => {
    it('sends the passwords to the password form', async () => {
      const formData = accountSeeder.getPasswordForm()
      vi.spyOn(AccountRepository, 'updatePassword').mockResolvedValue({ status: STATUS.NO_CONTENT })

      const result = await AccountController.updatePassword(formData)

      expect(AccountRepository.updatePassword).toHaveBeenCalledWith({
        body: AccountDto.toUpdatePassword(formData),
        form: 'accountPassword',
      })
      expect(result).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes a wrong current password through untouched', async () => {
      const refusal = controllerError(STATUS.UNPROCESSABLE_ENTITY)
      vi.spyOn(AccountRepository, 'updatePassword').mockResolvedValue(refusal)

      expect(await AccountController.updatePassword(accountSeeder.getPasswordForm())).toBe(refusal)
    })
  })
})
