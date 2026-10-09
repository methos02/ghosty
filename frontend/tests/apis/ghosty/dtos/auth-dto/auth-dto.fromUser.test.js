import { describe, it, expect } from 'vitest'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-dto', () => {
  describe('fromUser', () => {
    it('maps API user fields to the camelCase view model', () => {
      const api = userSeeder.getUserApi()

      const result = AuthDto.fromUser(api)

      expect(result).toEqual({
        id: api.id,
        username: api.username,
        email: api.email,
        roles: api.roles,
        avatar: api.avatar,
        firstname: api.firstname,
        lastname: api.lastname,
        birthDate: api.birth_date,
        notificationsEnabled: api.notifications_enabled,
        warningCount: api.warning_count,
        newMessagesCount: api.new_messages_count,
        bannedUntil: api.banned_until,
        emailVerifiedAt: api.email_verified_at,
        createdAt: api.created_at,
      })
    })
  })
})
