import { describe, it, expect, vi, afterEach } from 'vitest'
import { NotificationController } from '@/apis/notifications/controllers/notification-controller.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('notification-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('returns the inbox and its pagination shaped by the dtos', async () => {
      const listApi = notificationSeeder.getListApi()
      vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
        controllerSuccess({ data: listApi }),
      )

      expect(await NotificationController.list()).toEqual(
        controllerSuccess({
          inbox: NotificationDto.fromList(listApi),
          pagination: PaginationDto.fromMeta(listApi.meta),
        }),
      )
    })

    it('asks the api for the requested page', async () => {
      vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
        controllerSuccess({ data: notificationSeeder.getListApi() }),
      )

      await NotificationController.list(3)

      expect(NotificationRepository.list).toHaveBeenCalledWith({
        params: NotificationDto.toListParams(3),
      })
    })

    it('passes a failed poll through untouched', async () => {
      const failure = { status: STATUS.ERROR_SERVER, data: {} }
      vi.spyOn(NotificationRepository, 'list').mockResolvedValue(failure)

      expect(await NotificationController.list()).toBe(failure)
    })
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

  describe('markAllAsRead', () => {
    it('returns the unread count the api left', async () => {
      vi.spyOn(NotificationRepository, 'markAllAsRead').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: { unread_count: 0 },
      })

      expect(await NotificationController.markAllAsRead()).toEqual({
        status: STATUS.SUCCESS,
        unreadCount: 0,
      })
    })
  })
})
