import { describe, it, expect } from 'vitest'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('user-dto', () => {
  describe('toProfileParams', () => {
    it('targets the user in the url', () => {
      const profile = userSeeder.getProfile()

      expect(UserDto.toProfileParams(profile.username)).toEqual({ username: profile.username })
    })
  })
})
