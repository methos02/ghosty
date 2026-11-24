import { describe, it, expect } from 'vitest'
import { AuthDto } from '@/apis/ghosty/dtos/auth-dto.js'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-dto', () => {
  describe('fromUser', () => {
    it('maps API user fields to the camelCase view model', () => {
      const userApi = userSeeder.getUserWithAvatarApi({
        disabled_notification_types: [
          NOTIFICATION_TYPES.LIKE_RECEIVED,
          NOTIFICATION_TYPES.COMMENT_REPLIED,
        ],
      })

      expect(AuthDto.fromUser(userApi)).toStrictEqual({
        id: userApi.id,
        username: userApi.username,
        slug: userApi.slug,
        profileSlug: userApi.profile_slug,
        email: userApi.email,
        roles: userApi.roles,
        avatarUrl: userApi.avatar_url,
        notificationPreferences: accountSeeder.getNotificationsForm().types,
        newMessagesCount: userApi.new_messages_count,
        emailVerifiedAt: userApi.email_verified_at,
        createdAt: userApi.created_at,
      })
    })

    it('leaves the avatar undefined when the api sends null', () => {
      expect(AuthDto.fromUser(userSeeder.getUserApi()).avatarUrl).toBeUndefined()
    })

    it('switches on every type the user did not disable', () => {
      const user = AuthDto.fromUser(
        userSeeder.getUserApi({
          disabled_notification_types: [
            NOTIFICATION_TYPES.LIKE_RECEIVED,
            NOTIFICATION_TYPES.COMMENT_REPLIED,
          ],
        }),
      )

      expect(user.notificationPreferences).toEqual(accountSeeder.getNotificationsForm().types)
    })

    it('switches every type off when the user turned all notifications off', () => {
      const user = AuthDto.fromUser(userSeeder.getUserApi({ notifications_enabled: false }))

      expect(Object.values(user.notificationPreferences)).not.toContain(true)
    })

    it('reads a missing list of disabled notifications as all switched on', () => {
      const user = AuthDto.fromUser(userSeeder.getUserApi({ disabled_notification_types: null }))

      expect(Object.values(user.notificationPreferences)).not.toContain(false)
    })

    it('never offers the moderation notice, which cannot be disabled', () => {
      const user = AuthDto.fromUser(userSeeder.getUserApi())

      expect(Object.keys(user.notificationPreferences)).not.toContain(
        NOTIFICATION_TYPES.CONTENT_MODERATED,
      )
    })
  })
})
