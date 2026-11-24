import { describe, it, expect } from 'vitest'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-dto', () => {
  describe('fromUsernameAvailability', () => {
    it('reads whether the username is free', () => {
      const availabilityApi = accountSeeder.getUsernameAvailabilityApi({ available: false })

      expect(AccountDto.fromUsernameAvailability(availabilityApi)).toBe(availabilityApi.available)
    })
  })
})
