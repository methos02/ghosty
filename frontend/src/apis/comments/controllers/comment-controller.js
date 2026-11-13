import { CommentRepository } from '@/apis/comments/repositories/comment-repository.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { COMMENT_TARGETS } from '@/constants/comment-constants.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const create = async (target, formData) => {
  const response = await internals.sendCreate(target, {
    params: CommentDto.toTargetParams(target),
    body: CommentDto.toCreate(formData),
    form: 'comment',
  })

  return internals.createdComment(response)
}

const createReply = async (parentComment, formData, mentionedAuthor) => {
  const response = await CommentRepository.createReply({
    params: CommentDto.toCommentParams(parentComment.id),
    body: CommentDto.toCreateReply(formData, mentionedAuthor),
    form: 'reply',
  })

  return internals.createdComment(response)
}

const destroy = async comment => {
  const response = await CommentRepository.destroy({
    params: CommentDto.toCommentParams(comment.id),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    commentCount: CommentDto.fromCommentCount(data),
  }))
}

const list = async (target, page = 1) => {
  const response = await internals.requestThread(target, {
    params: CommentDto.toThreadParams(target, page),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    comments: CommentDto.fromList(data.comments),
    pagination: PaginationDto.fromMeta(data.meta),
  }))
}

export const CommentController = {
  create,
  createReply,
  destroy,
  list,
}

const createdComment = response => {
  return controllerResponseHelper.buildResponse(response, data => ({
    comment: CommentDto.fromShow(data.comment),
    commentCount: CommentDto.fromCommentCount(data),
  }))
}

const requestThread = async (target, options) => {
  if (target.type === COMMENT_TARGETS.CHAPTER) {
    return await CommentRepository.listForChapter(options)
  }

  if (target.type === COMMENT_TARGETS.COVER) {
    return await CommentRepository.listForCover(options)
  }

  return await CommentRepository.listForNovel(options)
}

const sendCreate = async (target, options) => {
  if (target.type === COMMENT_TARGETS.CHAPTER) {
    return await CommentRepository.createOnChapter(options)
  }

  if (target.type === COMMENT_TARGETS.COVER) {
    return await CommentRepository.createOnCover(options)
  }

  return await CommentRepository.createOnNovel(options)
}

export const internals = {
  createdComment,
  requestThread,
  sendCreate,
}
