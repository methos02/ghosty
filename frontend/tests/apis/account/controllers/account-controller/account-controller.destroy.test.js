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

  describe('destroy', () => {
    it('sends the current password to the deletion form', async () => {
      const formData = accountSeeder.getDeletionForm()
      vi.spyOn(AccountRepository, 'destroy').mockResolvedValue({ status: STATUS.NO_CONTENT })

      const result = await AccountController.destroy(formData)

      expect(AccountRepository.destroy).toHaveBeenCalledWith({
        body: AccountDto.toDestroy(formData),
        form: 'accountDeletion',
      })
      expect(result).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes a wrong current password through untouched', async () => {
      const refusal = controllerError(STATUS.UNPROCESSABLE_ENTITY)
      vi.spyOn(AccountRepository, 'destroy').mockResolvedValue(refusal)

      expect(await AccountController.destroy(accountSeeder.getDeletionForm())).toBe(refusal)
    })
  })
})
