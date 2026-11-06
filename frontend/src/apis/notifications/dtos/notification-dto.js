import { dateHelper } from '@/core/helpers/date-helper.js'
import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { ChapterContinuedDto } from '@/apis/notifications/dtos/types/chapter-continued-dto.js'
import { ChaptersPayloadDto } from '@/apis/notifications/dtos/types/chapters-payload-dto.js'
import { CommentPayloadDto } from '@/apis/notifications/dtos/types/comment-payload-dto.js'
import { LikeReceivedDto } from '@/apis/notifications/dtos/types/like-received-dto.js'

const fromList = data => ({
  notifications: NotificationDto.fromNotifications(data.notifications ?? []),
  unreadCount: data.unread_count,
})

const fromNotification = notification => ({
  id: notification.id,
  type: notification.type,
  isRead: notification.is_read,
  chapter: NotificationDtoInternal.mapChapter(notification),
  novel: {
    slug: notification.novel.slug,
    title: notification.novel.title,
  },
  payload: NotificationDtoInternal.mapPayload(notification),
  updatedAtFormat: dateHelper.formatDateLocal(notification.updated_at, 'DD/MM/YYYY HH:mm'),
})

const fromNotifications = notifications =>
  notifications.map(notification => NotificationDto.fromNotification(notification))

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

const COMMENT_PAYLOAD_TYPES = new Set([
  NOTIFICATION_TYPES.COMMENT_RECEIVED,
  NOTIFICATION_TYPES.COMMENT_REPLIED,
])

const isKnownType = notification => Object.values(NOTIFICATION_TYPES).includes(notification.type)

const mapChapter = notification =>
  notification.chapter === null
    ? undefined
    : {
        id: notification.chapter.id,
        title: notification.chapter.title,
      }

const mapPayload = notification => {
  if (!NotificationDtoInternal.isKnownType(notification)) {
    throw new Error(`[NotificationDto] Unknown notification type "${notification.type}"`)
  }

  if (notification.type === NOTIFICATION_TYPES.CHAPTER_CONTINUED) {
    return ChapterContinuedDto.fromNotification(notification)
  }

  if (notification.type === NOTIFICATION_TYPES.LIKE_RECEIVED) {
    return LikeReceivedDto.fromNotification(notification)
  }

  if (CHAPTERS_PAYLOAD_TYPES.has(notification.type)) {
    return ChaptersPayloadDto.fromNotification(notification)
  }

  if (COMMENT_PAYLOAD_TYPES.has(notification.type)) {
    return CommentPayloadDto.fromNotification(notification)
  }

  return {}
}

export const NotificationDtoInternal = {
  isKnownType,
  mapChapter,
  mapPayload,
}
