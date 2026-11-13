import { ReportRepository } from '@/apis/reports/repositories/report-repository.js'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const reportChapter = async (chapterId, formData) => {
  const response = await ReportRepository.reportChapter({
    params: ReportDto.toChapterParams(chapterId),
    body: ReportDto.toCreate(formData),
    form: 'report',
  })

  return controllerResponseHelper.buildResponse(response)
}

const reportComment = async (commentId, formData) => {
  const response = await ReportRepository.reportComment({
    params: ReportDto.toCommentParams(commentId),
    body: ReportDto.toCreate(formData),
    form: 'report',
  })

  return controllerResponseHelper.buildResponse(response)
}

const reportCover = async (coverId, formData) => {
  const response = await ReportRepository.reportCover({
    params: ReportDto.toCoverParams(coverId),
    body: ReportDto.toCreate(formData),
    form: 'report',
  })

  return controllerResponseHelper.buildResponse(response)
}

export const ReportController = {
  reportChapter,
  reportComment,
  reportCover,
}
