import { describe, it, expect } from 'vitest'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-dto', () => {
  describe('toUsernameAvailabilityParams', () => {
    it('asks the username in the query', () => {
      const username = accountSeeder.getProfileForm().username

      expect(AccountDto.toUsernameAvailabilityParams(username)).toEqual({ username })
    })
  })
})
