import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { COMMENT_TARGETS } from '@/constants/comment-constants.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

const fromCommentCount = commentable => {
  return commentable.comment_count
}

const fromList = datas => {
  return datas.map(data => CommentDto.fromShow(data))
}

const fromShow = data => {
  return {
    id: data.id,
    parentId: data.parent_id,
    author: data.author === null ? undefined : AuthorDto.fromShow(data.author),
    content: data.content ?? '',
    isSpoiler: data.is_spoiler,
    isDeleted: data.is_deleted,
    isHidden: data.is_hidden,
    isReported: data.is_reported,
    replies: CommentDto.fromList(data.replies ?? []),
    createdAtFormat: dateHelper.formatDateLocal(data.created_at, 'DD/MM/YYYY HH:mm'),
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

const toCreateReply = (formData, mentionedAuthor) => {
  return {
    ...CommentDto.toCreate(formData),
    mentioned_user_id: mentionedAuthor.id,
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
