import { NotificationDto } from '@/apis/notifications/dtos/notification-dto.js'

const getNotificationApi = (overrides = {}) => ({
  id: '9b2f6a1e-3c4d-4e5f-8a9b-0c1d2e3f4a5b',
  type: 'like_received',
  chapter: {
    id: 12,
    title: 'Le phare',
  },
  novel: {
    slug: 'la-maree-noire',
    title: 'La marée noire',
  },
  last_actor_username: 'Lectrice',
  count: 1,
  is_read: false,
  created_at: '2026-09-20T08:00:00+00:00',
  updated_at: '2026-09-20T08:00:00+00:00',
  ...overrides,
})

const getLikeReceivedApi = (count, overrides = {}) =>
  getNotificationApi({
    type: 'like_received',
    last_actor_username: 'Lectrice',
    count,
    ...overrides,
  })

const getChapterContinuedApi = (count, overrides = {}) =>
  getNotificationApi({
    type: 'chapter_continued',
    continuation: {
      id: 31,
      title: 'La lanterne',
      author_username: 'Plume',
    },
    count,
    ...overrides,
  })

const getChaptersPayloadApi = (type, count, overrides = {}) =>
  getNotificationApi({
    type,
    chapters: Array.from({ length: count }, (_, index) => ({
      id: 12 + index,
      title: index === 0 ? 'Le phare' : `La lanterne ${index}`,
    })),
    count,
    ...overrides,
  })

const getCommentNotificationApi = (type, count, overrides = {}) =>
  getNotificationApi({
    type,
    last_actor_username: 'Lectrice',
    count,
    ...overrides,
  })

const getNovelCommentNotificationApi = (type, count, overrides = {}) =>
  getNotificationApi({
    type,
    chapter: null,
    last_actor_username: 'Lectrice',
    count,
    ...overrides,
  })

const getCoverNotificationApi = (type, count, overrides = {}) =>
  getNotificationApi({
    type,
    chapter: null,
    cover: {
      id: 7,
      image_url: 'https://api.ghosty.local/storage/covers/3/lanterne.webp',
    },
    last_actor_username: 'Lectrice',
    count,
    ...overrides,
  })

const getSanctionApi = (overrides = {}) => ({
  type: 'write_ban',
  until: '2026-12-01T10:00:00+00:00',
  reason: 'Propos insultants envers un autre auteur',
  ...overrides,
})

const getModerationNotificationApi = (type, overrides = {}) =>
  getNotificationApi({
    type,
    content_type: 'chapter',
    resolution: 'archived',
    sanction: null,
    ...overrides,
  })

const getNotification = (overrides = {}) => ({
  ...NotificationDto.fromNotification(getNotificationApi()),
  ...overrides,
})

const getLikeReceived = count => NotificationDto.fromNotification(getLikeReceivedApi(count))

const getChapterContinued = count => NotificationDto.fromNotification(getChapterContinuedApi(count))

const getChaptersPayload = (type, count) =>
  NotificationDto.fromNotification(getChaptersPayloadApi(type, count))

const getCommentNotification = (type, count) =>
  NotificationDto.fromNotification(getCommentNotificationApi(type, count))

const getNovelCommentNotification = (type, count) =>
  NotificationDto.fromNotification(getNovelCommentNotificationApi(type, count))

const getCoverNotification = (type, count, overrides = {}) =>
  NotificationDto.fromNotification(getCoverNotificationApi(type, count, overrides))

const getModerationNotification = (type, overrides = {}) =>
  NotificationDto.fromNotification(getModerationNotificationApi(type, overrides))

const getListApi = (overrides = {}) => ({
  notifications: [getNotificationApi()],
  unread_count: 1,
  meta: {
    current_page: 1,
    per_page: 20,
    total: 1,
    last_page: 1,
  },
  ...overrides,
})

const getUnreadCountApi = (overrides = {}) => ({
  unread_count: 0,
  ...overrides,
})

const getInbox = (overrides = {}) => ({ ...NotificationDto.fromList(getListApi()), ...overrides })

export const notificationSeeder = {
  getChapterContinued,
  getChapterContinuedApi,
  getChaptersPayload,
  getChaptersPayloadApi,
  getCommentNotification,
  getCommentNotificationApi,
  getCoverNotification,
  getCoverNotificationApi,
  getInbox,
  getLikeReceived,
  getLikeReceivedApi,
  getListApi,
  getModerationNotification,
  getModerationNotificationApi,
  getNotification,
  getNotificationApi,
  getNovelCommentNotification,
  getNovelCommentNotificationApi,
  getSanctionApi,
  getUnreadCountApi,
}
