import { describe, it, expect } from 'vitest'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('user-dto', () => {
  describe('toListParams', () => {
    it('targets the user by its slug in the url and asks the page in the query', () => {
      const profile = userSeeder.getProfile()

      expect(UserDto.toListParams(profile.slug, 3)).toEqual({
        slug: profile.slug,
        page: 3,
      })
    })
  })
})
