import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const list = async (page = 1) => {
  const params = NotificationDto.toListParams(page)
  const response = await NotificationRepository.list({ params })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    inbox: NotificationDto.fromList(response.data),
    pagination: PaginationDto.fromMeta(response.data.meta),
  }
}

const markAllAsRead = async () => {
  const response = await NotificationRepository.markAllAsRead({})
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    unreadCount: NotificationDto.fromUnreadCount(response.data),
  }
}

const markAsRead = async notificationId => {
  const params = NotificationDto.toReadParams(notificationId)
  const response = await NotificationRepository.markAsRead({ params })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    unreadCount: NotificationDto.fromUnreadCount(response.data),
  }
}

export const NotificationController = {
  list,
  markAllAsRead,
  markAsRead,
}
