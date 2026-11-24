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
        slug: profileApi.slug,
        profileSlug: profileApi.profile_slug,
        isDeleted: profileApi.is_deleted,
        avatarUrl: undefined,
        roles: profileApi.roles,
        createdAtFormat: dateHelper.formatDateLocal(profileApi.created_at, 'DD/MM/YYYY'),
      })
    })

    it('keeps the avatar url of the user when there is one', () => {
      const profileApi = userSeeder.getProfileApi({
        avatar_url: userSeeder.getUserWithAvatarApi().avatar_url,
      })

      expect(UserDto.fromSummary(profileApi).avatarUrl).toBe(profileApi.avatar_url)
    })
  })
})
