import { describe, it, expect } from 'vitest'
import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'
import { LikeReceivedDto } from '@/apis/notifications/dtos/types/like-received-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('notification-dto', () => {
  describe('fromNotification', () => {
    it('maps the chapter and the novel every notification is about', () => {
      const data = notificationSeeder.getMainBranchMoveApi('main_branch_gained', 1)

      const notification = NotificationDto.fromNotification(data)

      expect(notification.chapter).toEqual({
        id: data.data.chapter.id,
        title: data.data.chapter.title,
      })
      expect(notification.novel).toEqual({
        slug: data.data.novel.slug,
        title: data.data.novel.title,
      })
    })

    it('gathers the fields the dto of its type maps under the payload', () => {
      const data = notificationSeeder.getLikeReceivedApi(3)

      const notification = NotificationDto.fromNotification(data)

      expect(notification.payload).toEqual(LikeReceivedDto.fromNotification(data))
    })

    it('maps the read state and the last activity', () => {
      const data = notificationSeeder.getNotificationApi({ is_read: true })

      const notification = NotificationDto.fromNotification(data)

      expect(notification.isRead).toBe(data.is_read)
      expect(notification.updatedAtFormat).toBe(
        dateHelper.formatDateLocal(data.updated_at, 'DD/MM/YYYY HH:mm'),
      )
    })
  })
})
