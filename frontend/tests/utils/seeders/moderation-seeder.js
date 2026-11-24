import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { ConfigLoader } from '@/config/config-loader.js'
import {
  REPORTED_CONTENT_TYPES,
  REPORT_STATUSES,
  RESOLUTIONS,
  SANCTION_TYPES,
} from '@/constants/moderation-constants.js'
import { CHAPTER_STATUSES } from '@/constants/chapter-constants.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const getReportApi = (overrides = {}) => ({
  id: 3,
  reason: 'hate_speech',
  description: 'Le chapitre s’en prend nommément à un groupe de lecteurs.',
  status: REPORT_STATUSES.PENDING,
  reporter: {
    id: 51,
    username: 'Lectrice',
    slug: 'usr051',
    profile_slug: 'usr051-lectrice',
    is_deleted: false,
  },
  resolution: null,
  processed_at: null,
  created_at: '2026-11-02T09:30:00+00:00',
  ...overrides,
})

const getProcessedReportApi = (overrides = {}) =>
  getReportApi({
    id: 4,
    status: REPORT_STATUSES.PROCESSED,
    resolution: RESOLUTIONS.DISMISSED,
    processed_at: '2026-11-03T10:00:00+00:00',
    ...overrides,
  })

const getSanctionApi = (overrides = {}) => ({
  id: 8,
  type: SANCTION_TYPES.WRITE_BAN,
  until: '2026-11-10T09:30:00+00:00',
  reason: 'Propos haineux répétés.',
  created_at: '2026-11-03T09:30:00+00:00',
  ...overrides,
})

const getModeratedChapterApi = (overrides = {}) =>
  chapterSeeder.getChapterApi({
    id: 12,
    parent_id: 10,
    is_root: false,
    status: CHAPTER_STATUSES.PUBLISHED,
    content: 'La route descendait vers le lac. Un passage injurieux ici. Puis le silence revint.',
    ...overrides,
  })

const getModeratedCommentApi = (overrides = {}) => ({
  id: 21,
  parent_id: null,
  author: {
    id: 42,
    username: 'GhostWriter',
    slug: 'usr042',
    profile_slug: 'usr042-ghostwriter',
    is_deleted: false,
  },
  mentioned_user: null,
  content: 'Ce chapitre est une insulte à tous les lecteurs.',
  is_spoiler: false,
  is_deleted: false,
  is_hidden: false,
  chapter: {
    id: 10,
    title: 'Le virage',
  },
  novel: {
    slug: 'nuit-virage',
    title: 'Nuit virage',
  },
  created_at: '2026-11-01T18:00:00+00:00',
  ...overrides,
})

const getModeratedCoverApi = (overrides = {}) => ({
  id: 7,
  novel_id: 3,
  image_url: 'https://api.ghosty.local/storage/covers/3/lanterne.webp',
  like_count: 4,
  comment_count: 1,
  is_hidden: false,
  author: {
    id: 64,
    username: 'Pinceau',
    slug: 'usr064',
    profile_slug: 'usr064-pinceau',
    is_deleted: false,
  },
  novel: {
    id: 3,
    slug: 'nuit-virage',
    title: 'Nuit virage',
  },
  created_at: '2026-11-04T08:00:00+00:00',
  ...overrides,
})

const getReportedChapterApi = (overrides = {}) => ({
  type: REPORTED_CONTENT_TYPES.CHAPTER,
  id: 12,
  report_count: 2,
  reasons: ['hate_speech', 'insult'],
  first_reported_at: '2026-11-02T09:30:00+00:00',
  chapter: getModeratedChapterApi(),
  ...overrides,
})

const getReportedCommentApi = (overrides = {}) => ({
  type: REPORTED_CONTENT_TYPES.COMMENT,
  id: 21,
  report_count: 1,
  reasons: ['insult'],
  first_reported_at: '2026-11-01T19:00:00+00:00',
  comment: getModeratedCommentApi(),
  ...overrides,
})

const getReportedCoverApi = (overrides = {}) => ({
  type: REPORTED_CONTENT_TYPES.COVER,
  id: 7,
  report_count: 3,
  reasons: ['unauthorized_illustration'],
  first_reported_at: '2026-11-05T11:00:00+00:00',
  cover: getModeratedCoverApi(),
  ...overrides,
})

const getReportedUserApi = (overrides = {}) => ({
  type: REPORTED_CONTENT_TYPES.USER,
  id: 64,
  report_count: 2,
  reasons: ['harassment'],
  first_reported_at: '2026-11-06T11:00:00+00:00',
  user: {
    id: 64,
    username: 'Importun',
    slug: 'usr064',
    profile_slug: 'usr064-importun',
    is_deleted: false,
    avatar_url: null,
    roles: ['reader'],
    created_at: '2026-01-15T08:00:00+00:00',
  },
  ...overrides,
})

const getUserCaseApi = (overrides = {}) => ({
  user: userSeeder.getProfileApi({
    id: 64,
    username: 'Importun',
  }),
  reports: [getReportApi({ reason: 'harassment' })],
  author_sanctions: [getSanctionApi()],
  ...overrides,
})

const getListApi = (overrides = {}) => ({
  reported_contents: [getReportedChapterApi(), getReportedCommentApi()],
  meta: paginationSeeder.getMetaApi(),
  ...overrides,
})

const getChapterCaseApi = (overrides = {}) => ({
  chapter: getModeratedChapterApi(),
  is_removable: true,
  reports: [getReportApi(), getProcessedReportApi()],
  author_sanctions: [getSanctionApi()],
  ...overrides,
})

const getCommentCaseApi = (overrides = {}) => ({
  comment: getModeratedCommentApi(),
  reports: [getReportApi()],
  author_sanctions: [],
  ...overrides,
})

const getReplyCaseApi = (overrides = {}) =>
  getCommentCaseApi({
    comment: getModeratedCommentApi({
      parent_id: 20,
      mentioned_user: {
        id: 51,
        username: 'Lectrice',
        slug: 'usr051',
        profile_slug: 'usr051-lectrice',
        is_deleted: false,
      },
    }),
    ...overrides,
  })

const getCoverCaseApi = (overrides = {}) => ({
  cover: getModeratedCoverApi(),
  reports: [getReportApi({ reason: 'unauthorized_illustration' })],
  author_sanctions: [],
  ...overrides,
})

const getValidationErrorsApi = (overrides = {}) => ({
  errors: {
    content: ['validation.moderation.content.altered'],
  },
  ...overrides,
})

const getList = () => ModerationDto.fromList(getListApi())

const getChapterCase = (overrides = {}) =>
  ModerationDto.fromChapterCase(getChapterCaseApi(overrides))

const getCommentCase = (overrides = {}) =>
  ModerationDto.fromCommentCase(getCommentCaseApi(overrides))

const getCoverCase = (overrides = {}) => ModerationDto.fromCoverCase(getCoverCaseApi(overrides))

const getUserCase = (overrides = {}) => ModerationDto.fromUserCase(getUserCaseApi(overrides))

const getDecisionForm = (overrides = {}) => ({
  resolution: RESOLUTIONS.DISMISSED,
  content: getModeratedChapterApi().content,
  sanction: {},
  ...overrides,
})

const getSanctionReason = () => 'Propos insultants répétés envers un autre lecteur.'

const getRemovedPassage = () => 'Un passage injurieux ici.'

const getContentAfterRemoval = () =>
  getModeratedChapterApi().content.replace(getRemovedPassage(), () =>
    ConfigLoader.get('moderation.removedPassageMarker'),
  )

export const moderationSeeder = {
  getChapterCase,
  getChapterCaseApi,
  getCommentCase,
  getCommentCaseApi,
  getCoverCase,
  getCoverCaseApi,
  getDecisionForm,
  getList,
  getListApi,
  getModeratedChapterApi,
  getModeratedCommentApi,
  getModeratedCoverApi,
  getProcessedReportApi,
  getContentAfterRemoval,
  getRemovedPassage,
  getReportApi,
  getReportedChapterApi,
  getReportedCommentApi,
  getReportedCoverApi,
  getReportedUserApi,
  getReplyCaseApi,
  getSanctionApi,
  getSanctionReason,
  getUserCase,
  getUserCaseApi,
  getValidationErrorsApi,
}
