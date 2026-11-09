import { describe, it, expect } from 'vitest'
import { ModerationPayloadDto } from '@/apis/notifications/dtos/types/moderation-payload-dto.js'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { SanctionDto } from '@/apis/sanctions/dtos/sanction-dto.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('moderation-payload-dto', () => {
  describe('fromNotification', () => {
    it('maps the moderated content type and the decision, without sanction', () => {
      const notificationApi = notificationSeeder.getModerationNotificationApi(
        NOTIFICATION_TYPES.REPORT_PROCESSED,
      )

      expect(ModerationPayloadDto.fromNotification(notificationApi)).toEqual({
        contentType: notificationApi.content_type,
        resolution: notificationApi.resolution,
        sanction: undefined,
      })
    })

    it('maps the sanction given to the author', () => {
      const sanctionApi = notificationSeeder.getSanctionApi()
      const notificationApi = notificationSeeder.getModerationNotificationApi(
        NOTIFICATION_TYPES.CONTENT_MODERATED,
        { sanction: sanctionApi },
      )

      expect(ModerationPayloadDto.fromNotification(notificationApi).sanction).toEqual(
        SanctionDto.fromSummary(sanctionApi),
      )
    })
  })
})
