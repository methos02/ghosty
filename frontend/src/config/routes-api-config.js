import { novelRoutesApi } from '@/config/routes-api/novel-routes-api.js'
import { genreRoutesApi } from '@/config/routes-api/genre-routes-api.js'
import { chapterRoutesApi } from '@/config/routes-api/chapter-routes-api.js'
import { followRoutesApi } from '@/config/routes-api/follow-routes-api.js'
import { readingProgressRoutesApi } from '@/config/routes-api/reading-progress-routes-api.js'
import { chapterReadRoutesApi } from '@/config/routes-api/chapter-read-routes-api.js'
import { commentRoutesApi } from '@/config/routes-api/comment-routes-api.js'
import { moderationRoutesApi } from '@/config/routes-api/moderation-routes-api.js'
import { coverRoutesApi } from '@/config/routes-api/cover-routes-api.js'
import { userRoutesApi } from '@/config/routes-api/user-routes-api.js'
import { notificationRoutesApi } from '@/config/routes-api/notification-routes-api.js'
import { authRoutesApi } from '@/config/routes-api/auth-routes-api.js'
import { accountRoutesApi } from '@/config/routes-api/account-routes-api.js'
import { metricsRoutesApi } from '@/config/routes-api/metrics-routes-api.js'

export const routesApi = {
  ...novelRoutesApi,
  ...genreRoutesApi,
  ...chapterRoutesApi,
  ...followRoutesApi,
  ...readingProgressRoutesApi,
  ...chapterReadRoutesApi,
  ...commentRoutesApi,
  ...moderationRoutesApi,
  ...coverRoutesApi,
  ...userRoutesApi,
  ...notificationRoutesApi,
  ...authRoutesApi,
  ...accountRoutesApi,
  ...metricsRoutesApi,
}
