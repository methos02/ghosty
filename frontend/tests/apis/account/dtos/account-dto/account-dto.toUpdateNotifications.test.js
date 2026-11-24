import { describe, it, expect } from 'vitest'
import { AccountDto } from '@/apis/account/dtos/account-dto.js'
import {
  NOTIFICATION_TYPES,
  OPTIONAL_NOTIFICATION_TYPES,
} from '@/constants/notification-constants.js'
import { accountSeeder } from '&/utils/seeders/account-seeder.js'

describe('account-dto', () => {
  describe('toUpdateNotifications', () => {
    it('keeps notifications on and lists the switched off types', () => {
      expect(AccountDto.toUpdateNotifications(accountSeeder.getNotificationsForm())).toEqual({
        notifications_enabled: true,
        disabled_notification_types: [
          NOTIFICATION_TYPES.LIKE_RECEIVED,
          NOTIFICATION_TYPES.COMMENT_REPLIED,
        ],
      })
    })

    it('turns notifications off when every type is switched off', () => {
      const formData = accountSeeder.getNotificationsForm({
        types: Object.fromEntries(OPTIONAL_NOTIFICATION_TYPES.map(type => [type, false])),
      })

      expect(AccountDto.toUpdateNotifications(formData)).toEqual({
        notifications_enabled: false,
        disabled_notification_types: OPTIONAL_NOTIFICATION_TYPES,
      })
    })
  })
})
