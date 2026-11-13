import { ModerationRepository } from '@/apis/moderation/repositories/moderation-repository.js'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const MODERATION_FORM = 'moderation'

const listReportedContents = async (filters, page = 1) => {
  const response = await ModerationRepository.listReportedContents({
    params: ModerationDto.toListParams(filters, page),
  })

  return controllerResponseHelper.buildResponse(response, data => ModerationDto.fromList(data))
}

const moderateChapter = async (chapterId, formData) => {
  const response = await ModerationRepository.moderateChapter({
    params: ModerationDto.toChapterParams(chapterId),
    body: ModerationDto.toDecision(formData),
    form: MODERATION_FORM,
  })

  return controllerResponseHelper.buildResponse(response)
}

const moderateComment = async (commentId, formData) => {
  const response = await ModerationRepository.moderateComment({
    params: ModerationDto.toCommentParams(commentId),
    body: ModerationDto.toDecision(formData),
    form: MODERATION_FORM,
  })

  return controllerResponseHelper.buildResponse(response)
}

const moderateCover = async (coverId, formData) => {
  const response = await ModerationRepository.moderateCover({
    params: ModerationDto.toCoverParams(coverId),
    body: ModerationDto.toDecision(formData),
    form: MODERATION_FORM,
  })

  return controllerResponseHelper.buildResponse(response)
}

const restoreChapter = async chapterId => {
  const response = await ModerationRepository.restoreChapter({
    params: ModerationDto.toChapterParams(chapterId),
  })

  return controllerResponseHelper.buildResponse(response)
}

const restoreComment = async commentId => {
  const response = await ModerationRepository.restoreComment({
    params: ModerationDto.toCommentParams(commentId),
  })

  return controllerResponseHelper.buildResponse(response)
}

const restoreCover = async coverId => {
  const response = await ModerationRepository.restoreCover({
    params: ModerationDto.toCoverParams(coverId),
  })

  return controllerResponseHelper.buildResponse(response)
}

const showChapter = async chapterId => {
  const response = await ModerationRepository.showChapter({
    params: ModerationDto.toChapterParams(chapterId),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    moderationCase: ModerationDto.fromChapterCase(data),
  }))
}

const showComment = async commentId => {
  const response = await ModerationRepository.showComment({
    params: ModerationDto.toCommentParams(commentId),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    moderationCase: ModerationDto.fromCommentCase(data),
  }))
}

const showCover = async coverId => {
  const response = await ModerationRepository.showCover({
    params: ModerationDto.toCoverParams(coverId),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    moderationCase: ModerationDto.fromCoverCase(data),
  }))
}

export const ModerationController = {
  listReportedContents,
  moderateChapter,
  moderateComment,
  moderateCover,
  restoreChapter,
  restoreComment,
  restoreCover,
  showChapter,
  showComment,
  showCover,
}
