import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const list = async (page = 1) => {
  const response = await NotificationRepository.list({
    params: NotificationDto.toListParams(page),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    inbox: NotificationDto.fromList(data),
    pagination: PaginationDto.fromMeta(data.meta),
  }))
}

const markAllAsRead = async () => {
  const response = await NotificationRepository.markAllAsRead({})

  return controllerResponseHelper.buildResponse(response, data => ({
    unreadCount: NotificationDto.fromUnreadCount(data),
  }))
}

const markAsRead = async notificationId => {
  const response = await NotificationRepository.markAsRead({
    params: NotificationDto.toReadParams(notificationId),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    unreadCount: NotificationDto.fromUnreadCount(data),
  }))
}

export const NotificationController = {
  list,
  markAllAsRead,
  markAsRead,
}
