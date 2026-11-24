import { describe, it, expect } from 'vitest'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-dto', () => {
  describe('toUpdatePassword', () => {
    it('sends the current password and the confirmed new one', () => {
      const formData = accountSeeder.getPasswordForm()

      expect(AccountDto.toUpdatePassword(formData)).toEqual({
        current_password: formData.currentPassword,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      })
    })
  })
})
