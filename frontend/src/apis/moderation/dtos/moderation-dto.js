import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { SanctionDto } from '@/apis/sanctions/dtos/sanction-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

const fromChapterCase = moderationCase => ({
  chapter: ChapterDto.fromShow(moderationCase.chapter),
  isRemovable: moderationCase.is_removable,
  reports: ReportDto.fromList(moderationCase.reports),
  authorSanctions: SanctionDto.fromList(moderationCase.author_sanctions),
})

const fromComment = comment => ({
  ...CommentDto.fromShow(comment),
  chapter: comment.chapter === null ? undefined : ChapterDto.fromSummary(comment.chapter),
  novel: NovelDto.fromSummary(comment.novel),
})

const fromCommentCase = moderationCase => ({
  comment: ModerationDto.fromComment(moderationCase.comment),
  reports: ReportDto.fromList(moderationCase.reports),
  authorSanctions: SanctionDto.fromList(moderationCase.author_sanctions),
})

const fromList = list => ({
  reportedContents: ModerationDto.fromReportedContents(list.reported_contents),
  pagination: PaginationDto.fromMeta(list.meta),
})

const fromReportedContent = reportedContent => ({
  type: reportedContent.type,
  id: reportedContent.id,
  reportCount: reportedContent.report_count,
  reasons: reportedContent.reasons,
  firstReportedAtFormat: dateHelper.formatDateLocal(
    reportedContent.first_reported_at,
    'DD/MM/YYYY HH:mm',
  ),
  chapter:
    reportedContent.chapter === null ? undefined : ChapterDto.fromShow(reportedContent.chapter),
  comment:
    reportedContent.comment === null
      ? undefined
      : ModerationDto.fromComment(reportedContent.comment),
})

const fromReportedContents = reportedContents =>
  reportedContents.map(reportedContent => ModerationDto.fromReportedContent(reportedContent))

const toChapterParams = chapterId => ({ chapter: chapterId })

const toCommentParams = commentId => ({ comment: commentId })

const toDecision = formData => ({
  resolution: formData.resolution,
  content: formData.resolution === RESOLUTIONS.PASSAGE_REMOVED ? formData.content : undefined,
  sanction: SanctionDto.toCreate(formData.sanction),
})

const toListParams = (filters, page) => ({
  status: filters.status,
  reason: filters.reason,
  page,
})

export const ModerationDto = {
  fromChapterCase,
  fromComment,
  fromCommentCase,
  fromList,
  fromReportedContent,
  fromReportedContents,
  toChapterParams,
  toCommentParams,
  toDecision,
  toListParams,
}
