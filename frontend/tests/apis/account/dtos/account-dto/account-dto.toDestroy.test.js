import { describe, it, expect } from 'vitest'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-dto', () => {
  describe('toDestroy', () => {
    it('sends the current password', () => {
      const formData = accountSeeder.getDeletionForm()

      expect(AccountDto.toDestroy(formData)).toEqual({
        current_password: formData.currentPassword,
      })
    })
  })
})
