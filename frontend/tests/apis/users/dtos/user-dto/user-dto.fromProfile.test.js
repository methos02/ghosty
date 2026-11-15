import { describe, it, expect } from 'vitest'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('user-dto', () => {
  describe('fromProfile', () => {
    it('maps the identity, the report flag and the statistics of the profile', () => {
      const profileApi = userSeeder.getProfileApi({ is_reported: true })

      expect(UserDto.fromProfile(profileApi)).toEqual({
        ...UserDto.fromSummary(profileApi),
        isReported: profileApi.is_reported,
        statistics: UserDto.fromStatistics(profileApi.statistics),
      })
    })
  })
})
