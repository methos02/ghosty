import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { COMMENT_TARGETS } from '@/constants/comment-constants.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { form } from '@/services/shortcuts/services-shortcut.js'

const create = async (target, formData) => {
  const response = await CommentControllerInternal.sendCreate(target, {
    params: CommentDto.toTargetParams(target),
    body: CommentDto.toCreate(formData),
  })

  return CommentControllerInternal.createdComment(response, 'comment')
}

const createReply = async (parentComment, formData, mentionedAuthor) => {
  const response = await CommentRepository.createReply({
    params: CommentDto.toCommentParams(parentComment.id),
    body: CommentDto.toCreateReply(formData, mentionedAuthor),
  })

  return CommentControllerInternal.createdComment(response, 'reply')
}

const destroy = async comment => {
  const response = await CommentRepository.destroy({
    params: CommentDto.toCommentParams(comment.id),
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    commentCount: CommentDto.fromCommentCount(response.data),
  }
}

const list = async (target, page = 1) => {
  const response = await CommentControllerInternal.requestThread(target, {
    params: CommentDto.toThreadParams(target, page),
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    comments: CommentDto.fromList(response.data.comments),
    pagination: PaginationDto.fromMeta(response.data.meta),
  }
}

export const CommentController = {
  create,
  createReply,
  destroy,
  list,
}

const createdComment = (response, formName) => {
  if (response.status === STATUS.UNPROCESSABLE_ENTITY) {
    form.addValidationErrors(response.data.errors, formName)
  }

  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }

  return {
    status: STATUS.SUCCESS,
    comment: CommentDto.fromShow(response.data.comment),
    commentCount: CommentDto.fromCommentCount(response.data),
  }
}

const requestThread = async (target, options) => {
  if (target.type === COMMENT_TARGETS.CHAPTER) {
    return await CommentRepository.listForChapter(options)
  }

  return await CommentRepository.listForNovel(options)
}

const sendCreate = async (target, options) => {
  if (target.type === COMMENT_TARGETS.CHAPTER) {
    return await CommentRepository.createOnChapter(options)
  }

  return await CommentRepository.createOnNovel(options)
}

export const CommentControllerInternal = {
  createdComment,
  requestThread,
  sendCreate,
}
