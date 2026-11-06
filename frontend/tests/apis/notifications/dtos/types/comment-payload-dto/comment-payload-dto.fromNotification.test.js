import { describe, it, expect } from 'vitest'
import { CommentPayloadDto } from '@/apis/notifications/dtos/types/comment-payload-dto.js'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('comment-payload-dto', () => {
  describe('fromNotification', () => {
    it('maps the last commenter and the gathered comments', () => {
      const notificationApi = notificationSeeder.getCommentNotificationApi(
        NOTIFICATION_TYPES.COMMENT_RECEIVED,
        5,
      )

      expect(CommentPayloadDto.fromNotification(notificationApi)).toEqual({
        lastActorUsername: notificationApi.last_actor_username,
        count: notificationApi.count,
      })
    })
  })
})
