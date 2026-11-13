import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { REPORT_STATUSES } from '@/constants/moderation-constants.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

const fromList = reports => {
  return reports.map(report => ReportDto.fromShow(report))
}

const fromShow = report => {
  return {
    id: report.id,
    reason: report.reason,
    description: report.description ?? '',
    isPending: report.status === REPORT_STATUSES.PENDING,
    reporter: AuthorDto.fromShow(report.reporter),
    resolution: report.resolution ?? undefined,
    createdAtFormat: dateHelper.formatDateLocal(report.created_at, 'DD/MM/YYYY HH:mm'),
  }
}

const toChapterParams = chapterId => {
  return { chapter: chapterId }
}

const toCommentParams = commentId => {
  return { comment: commentId }
}

const toCoverParams = coverId => {
  return { cover: coverId }
}

const toCreate = formData => {
  return {
    reason: formData.reason,
    description: formData.description,
  }
}

export const ReportDto = {
  fromList,
  fromShow,
  toChapterParams,
  toCommentParams,
  toCoverParams,
  toCreate,
}
