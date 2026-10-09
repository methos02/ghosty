import { describe, it, expect, vi, afterEach } from 'vitest'
import { NotificationController } from '@/apis/notifications/controllers/notification-controller.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('notification-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('markAsRead', () => {
    it('addresses the notification that was opened', async () => {
      const notificationId = notificationSeeder.getNotification().id
      vi.spyOn(NotificationRepository, 'markAsRead').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { unread_count: 0 },
      })

      await NotificationController.markAsRead(notificationId)

      expect(NotificationRepository.markAsRead).toHaveBeenCalledWith({
        params: NotificationDto.toReadParams(notificationId),
      })
    })

    it('returns the unread count the api recomputed', async () => {
      vi.spyOn(NotificationRepository, 'markAsRead').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { unread_count: 4 },
      })

      expect(
        await NotificationController.markAsRead(notificationSeeder.getNotification().id),
      ).toEqual({
        status: STATUS.SUCCESS,
        unreadCount: 4,
      })
    })

    it('passes a refusal through untouched', async () => {
      const refusal = { status: STATUS.NOT_FOUND, data: {} }
      vi.spyOn(NotificationRepository, 'markAsRead').mockResolvedValue(refusal)

      expect(await NotificationController.markAsRead(notificationSeeder.getNotification().id)).toBe(
        refusal,
      )
    })
  })
})
