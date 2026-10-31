import { dateHelper } from '@/core/helpers/date-helper.js'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { ChapterContinuedDto } from '@/apis/notifications/dtos/types/chapter-continued-dto.js'
import { ChaptersPayloadDto } from '@/apis/notifications/dtos/types/chapters-payload-dto.js'
import { LikeReceivedDto } from '@/apis/notifications/dtos/types/like-received-dto.js'

const fromList = data => ({
  notifications: NotificationDto.fromNotifications(data.notifications ?? []),
  unreadCount: data.unread_count,
})

const fromNotification = data => ({
  id: data.id,
  type: data.type,
  isRead: data.is_read,
  chapter: {
    id: data.data.chapter.id,
    title: data.data.chapter.title,
  },
  novel: {
    slug: data.data.novel.slug,
    title: data.data.novel.title,
  },
  payload: NotificationDtoInternal.mapPayload(data),
  updatedAtFormat: dateHelper.formatDateLocal(data.updated_at, 'DD/MM/YYYY HH:mm'),
})

const fromNotifications = datas => datas.map(data => NotificationDto.fromNotification(data))

const fromUnreadCount = data => data.unread_count

const toListParams = page => ({ page })

const toReadParams = notificationId => ({ notification: notificationId })

export const NotificationDto = {
  fromList,
  fromNotification,
  fromNotifications,
  fromUnreadCount,
  toListParams,
  toReadParams,
}

const CHAPTERS_PAYLOAD_TYPES = new Set([
  NOTIFICATION_TYPES.MAIN_BRANCH_GAINED,
  NOTIFICATION_TYPES.MAIN_BRANCH_LOST,
  NOTIFICATION_TYPES.FOLLOWED_BRANCH_EXTENDED,
])

const isKnownType = data => Object.values(NOTIFICATION_TYPES).includes(data.type)

const mapPayload = data => {
  if (!NotificationDtoInternal.isKnownType(data)) {
    throw new Error(`[NotificationDto] Unknown notification type "${data.type}"`)
  }

  if (data.type === NOTIFICATION_TYPES.CHAPTER_CONTINUED) {
    return ChapterContinuedDto.fromNotification(data)
  }

  if (data.type === NOTIFICATION_TYPES.LIKE_RECEIVED) {
    return LikeReceivedDto.fromNotification(data)
  }

  if (CHAPTERS_PAYLOAD_TYPES.has(data.type)) {
    return ChaptersPayloadDto.fromNotification(data)
  }

  return {}
}

export const NotificationDtoInternal = {
  isKnownType,
  mapPayload,
}
