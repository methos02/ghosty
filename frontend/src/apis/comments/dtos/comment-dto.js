import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { COMMENT_TARGETS } from '@/constants/comment-constants.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

const fromCommentCount = commentable => commentable.comment_count

const fromList = datas => datas.map(data => CommentDto.fromShow(data))

const fromShow = data => ({
  id: data.id,
  parentId: data.parent_id,
  author: data.author === null ? undefined : AuthorDto.fromShow(data.author),
  content: data.content ?? '',
  isSpoiler: data.is_spoiler,
  isDeleted: data.is_deleted,
  replies: CommentDto.fromList(data.replies ?? []),
  createdAtFormat: dateHelper.formatDateLocal(data.created_at, 'DD/MM/YYYY HH:mm'),
})

const toCommentParams = commentId => ({ comment: commentId })

const toCreate = formData => ({
  content: formData.content,
  is_spoiler: formData.isSpoiler,
})

const toCreateReply = (formData, mentionedAuthor) => ({
  ...CommentDto.toCreate(formData),
  mentioned_user_id: mentionedAuthor.id,
})

const toTargetParams = target => {
  if (target.type === COMMENT_TARGETS.CHAPTER) {
    return { chapter: target.chapterId }
  }

  return { slug: target.novelSlug }
}

const toThreadParams = (target, page) => ({
  ...CommentDto.toTargetParams(target),
  page,
})

export const CommentDto = {
  fromCommentCount,
  fromList,
  fromShow,
  toCommentParams,
  toCreate,
  toCreateReply,
  toTargetParams,
  toThreadParams,
}
