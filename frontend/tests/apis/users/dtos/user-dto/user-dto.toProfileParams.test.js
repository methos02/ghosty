import { describe, it, expect } from 'vitest'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('user-dto', () => {
  describe('toProfileParams', () => {
    it('targets the user by its slug in the url', () => {
      const profile = userSeeder.getProfile()

      expect(UserDto.toProfileParams(profile.slug)).toEqual({ slug: profile.slug })
    })
  })
})
