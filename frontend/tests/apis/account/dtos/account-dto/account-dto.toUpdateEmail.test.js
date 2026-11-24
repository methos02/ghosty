import { describe, it, expect } from 'vitest'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-dto', () => {
  describe('toUpdateEmail', () => {
    it('sends the address with the current password', () => {
      const formData = accountSeeder.getEmailForm()

      expect(AccountDto.toUpdateEmail(formData)).toEqual({
        email: formData.email,
        current_password: formData.currentPassword,
      })
    })
  })
})
