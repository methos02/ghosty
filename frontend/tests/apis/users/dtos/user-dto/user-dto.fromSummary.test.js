import { describe, it, expect } from 'vitest'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('user-dto', () => {
  describe('fromSummary', () => {
    it('maps the public identity of the user with a formatted signup date', () => {
      const profileApi = userSeeder.getProfileApi()

      expect(UserDto.fromSummary(profileApi)).toEqual({
        id: profileApi.id,
        username: profileApi.username,
        avatar: undefined,
        roles: profileApi.roles,
        createdAtFormat: dateHelper.formatDateLocal(profileApi.created_at, 'DD/MM/YYYY'),
      })
    })

    it('keeps the avatar of the user when there is one', () => {
      const profileApi = userSeeder.getProfileApi({
        avatar: userSeeder.getUserWithAvatarApi().avatar,
      })

      expect(UserDto.fromSummary(profileApi).avatar).toBe(profileApi.avatar)
    })
  })
})
