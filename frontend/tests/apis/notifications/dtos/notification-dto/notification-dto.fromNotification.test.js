import { describe, it, expect } from 'vitest'
import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'
import { LikeReceivedDto } from '@/apis/notifications/dtos/types/like-received-dto.js'
import { CommentPayloadDto } from '@/apis/notifications/dtos/types/comment-payload-dto.js'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('notification-dto', () => {
  describe('fromNotification', () => {
    it('maps the chapter and the novel every notification is about', () => {
      const notificationApi = notificationSeeder.getChaptersPayloadApi('main_branch_gained', 1)

      const notification = NotificationDto.fromNotification(notificationApi)

      expect(notification.chapter).toEqual({
        id: notificationApi.chapter.id,
        title: notificationApi.chapter.title,
      })
      expect(notification.novel).toEqual({
        slug: notificationApi.novel.slug,
        title: notificationApi.novel.title,
      })
    })

    it('leaves the chapter undefined for a notification about a novel itself', () => {
      const notificationApi = notificationSeeder.getNovelCommentNotificationApi(
        NOTIFICATION_TYPES.COMMENT_RECEIVED,
        1,
      )

      expect(NotificationDto.fromNotification(notificationApi).chapter).toBeUndefined()
    })

    it('gathers the fields the dto of its type maps under the payload', () => {
      const notificationApi = notificationSeeder.getLikeReceivedApi(3)

      const notification = NotificationDto.fromNotification(notificationApi)

      expect(notification.payload).toEqual(LikeReceivedDto.fromNotification(notificationApi))
    })

    it.each([NOTIFICATION_TYPES.COMMENT_RECEIVED, NOTIFICATION_TYPES.COMMENT_REPLIED])(
      'maps the payload of a %s notification through the comment payload dto',
      type => {
        const notificationApi = notificationSeeder.getCommentNotificationApi(type, 3)

        expect(NotificationDto.fromNotification(notificationApi).payload).toEqual(
          CommentPayloadDto.fromNotification(notificationApi),
        )
      },
    )

    it('maps the read state and the last activity', () => {
      const notificationApi = notificationSeeder.getNotificationApi({ is_read: true })

      const notification = NotificationDto.fromNotification(notificationApi)

      expect(notification.isRead).toBe(notificationApi.is_read)
      expect(notification.updatedAtFormat).toBe(
        dateHelper.formatDateLocal(notificationApi.updated_at, 'DD/MM/YYYY HH:mm'),
      )
    })
  })
})
