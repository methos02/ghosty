import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { COMMENT_TARGETS } from '@/constants/comment-constants.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

const getCommentApi = (overrides = {}) => ({
  id: 7,
  parent_id: null,
  author: {
    id: 42,
    username: 'GhostWriter',
  },
  content: 'Le phare qui s’éteint au dernier paragraphe, quelle image.',
  is_spoiler: false,
  is_deleted: false,
  is_hidden: false,
  is_reported: false,
  reply_count: 0,
  replies: [],
  created_at: '2026-10-30T20:15:00+00:00',
  ...overrides,
})

const getReplyApi = (overrides = {}) =>
  getCommentApi({
    id: 70,
    parent_id: 7,
    author: {
      id: 51,
      username: 'Lectrice',
    },
    content: 'Et le gardien qui ne remonte jamais, on en reparle ?',
    ...overrides,
  })

const getDeletedCommentApi = (overrides = {}) =>
  getCommentApi({
    author: null,
    content: null,
    is_deleted: true,
    reply_count: 1,
    replies: [getReplyApi()],
    ...overrides,
  })

const getHiddenCommentApi = (overrides = {}) =>
  getCommentApi({
    author: null,
    content: null,
    is_hidden: true,
    reply_count: 1,
    replies: [getReplyApi()],
    ...overrides,
  })

const getCommentWithReplyApi = (overrides = {}) =>
  getCommentApi({
    reply_count: 1,
    replies: [getReplyApi()],
    ...overrides,
  })

const getCommentsApi = (count = 2) =>
  Array.from({ length: count }, (_, index) =>
    getCommentApi({
      id: 7 + index,
      content: `Commentaire ${index + 1}`,
    }),
  )

const getThreadApi = (overrides = {}) => ({
  comments: getCommentsApi(2),
  meta: paginationSeeder.getMetaApi({
    total: 2,
    last_page: 1,
  }),
  ...overrides,
})

const getEmptyThreadApi = () =>
  getThreadApi({
    comments: [],
    meta: paginationSeeder.getMetaApi({
      total: 0,
      last_page: 1,
    }),
  })

const getCreatedApi = (commentApi = getCommentApi(), overrides = {}) => ({
  comment: commentApi,
  comment_count: 3,
  ...overrides,
})

const getDeletedApi = (overrides = {}) => ({
  comment_count: 2,
  ...overrides,
})

const getChapterTarget = (overrides = {}) => ({
  type: COMMENT_TARGETS.CHAPTER,
  chapterId: 12,
  ...overrides,
})

const getCoverTarget = (overrides = {}) => ({
  type: COMMENT_TARGETS.COVER,
  coverId: 5,
  ...overrides,
})

const getNovelTarget = (overrides = {}) => ({
  type: COMMENT_TARGETS.NOVEL,
  novelSlug: 'la-maree-noire',
  ...overrides,
})

const getValidationErrorsApi = (overrides = {}) => ({
  errors: {
    content: ['Le commentaire ne doit pas dépasser 2000 caractères.'],
  },
  ...overrides,
})

const getCreateForm = (overrides = {}) => ({
  content: 'Une réaction sincère.',
  isSpoiler: false,
  ...overrides,
})

const getComment = (overrides = {}) => ({ ...CommentDto.fromShow(getCommentApi()), ...overrides })

const getCommentWithReply = () => CommentDto.fromShow(getCommentWithReplyApi())

const getDeletedComment = () => CommentDto.fromShow(getDeletedCommentApi())

const getHiddenComment = () => CommentDto.fromShow(getHiddenCommentApi())

const getComments = (count = 2) => CommentDto.fromList(getCommentsApi(count))

const getReply = (overrides = {}) => ({ ...CommentDto.fromShow(getReplyApi()), ...overrides })

export const commentSeeder = {
  getChapterTarget,
  getCoverTarget,
  getComment,
  getCommentApi,
  getCommentWithReply,
  getCommentWithReplyApi,
  getComments,
  getCommentsApi,
  getCreateForm,
  getCreatedApi,
  getDeletedComment,
  getDeletedApi,
  getDeletedCommentApi,
  getEmptyThreadApi,
  getHiddenComment,
  getHiddenCommentApi,
  getNovelTarget,
  getReply,
  getReplyApi,
  getThreadApi,
  getValidationErrorsApi,
}
