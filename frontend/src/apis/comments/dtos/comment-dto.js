import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { COMMENT_TARGETS } from '@/constants/comment-constants.js'
import { DATETIME_FORMAT } from '@/constants/utils-constants.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

const fromCommentCount = commentable => {
  return commentable.comment_count
}

const fromList = comments => {
  return comments.map(comment => CommentDto.fromShow(comment))
}

const fromShow = comment => {
  return {
    id: comment.id,
    parentId: comment.parent_id,
    author: comment.author === null ? undefined : AuthorDto.fromShow(comment.author),
    mentionedUser: comment.mentioned_user ? AuthorDto.fromShow(comment.mentioned_user) : undefined,
    content: comment.content ?? '',
    isSpoiler: comment.is_spoiler,
    isDeleted: comment.is_deleted,
    isHidden: comment.is_hidden,
    isReported: comment.is_reported,
    replies: CommentDto.fromList(comment.replies ?? []),
    createdAtFormat: dateHelper.formatDateLocal(comment.created_at, DATETIME_FORMAT),
  }
}

const toCommentParams = commentId => {
  return { comment: commentId }
}

const toCreate = formData => {
  return {
    content: formData.content,
    is_spoiler: formData.isSpoiler,
  }
}

const toCreateReply = formData => {
  return {
    ...CommentDto.toCreate(formData),
    mentioned_user_id: formData.mentionedUser?.id,
  }
}

const toTargetParams = target => {
  if (target.type === COMMENT_TARGETS.CHAPTER) {
    return { chapter: target.chapterId }
  }

  if (target.type === COMMENT_TARGETS.COVER) {
    return { cover: target.coverId }
  }

  return { slug: target.novelSlug }
}

const toThreadParams = (target, page) => {
  return {
    ...CommentDto.toTargetParams(target),
    page,
  }
}

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
