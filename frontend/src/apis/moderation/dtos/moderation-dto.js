import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { SanctionDto } from '@/apis/sanctions/dtos/sanction-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

const fromChapterCase = moderationCase => {
  return {
    chapter: ChapterDto.fromShow(moderationCase.chapter),
    isRemovable: moderationCase.is_removable,
    reports: ReportDto.fromList(moderationCase.reports),
    authorSanctions: SanctionDto.fromList(moderationCase.author_sanctions),
  }
}

const fromComment = comment => {
  return {
    ...CommentDto.fromShow(comment),
    chapter: ChapterDto.fromSummary(comment.chapter),
    novel: NovelDto.fromSummary(comment.novel),
  }
}

const fromCommentCase = moderationCase => {
  return {
    comment: ModerationDto.fromComment(moderationCase.comment),
    reports: ReportDto.fromList(moderationCase.reports),
    authorSanctions: SanctionDto.fromList(moderationCase.author_sanctions),
  }
}

const fromCover = cover => {
  return {
    ...CoverDto.fromSummary(cover),
    isHidden: cover.is_hidden,
    likeCount: cover.like_count,
    author: AuthorDto.fromShow(cover.author),
    novel: NovelDto.fromSummary(cover.novel),
  }
}

const fromCoverCase = moderationCase => {
  return {
    cover: ModerationDto.fromCover(moderationCase.cover),
    reports: ReportDto.fromList(moderationCase.reports),
    authorSanctions: SanctionDto.fromList(moderationCase.author_sanctions),
  }
}

const fromList = list => {
  return {
    reportedContents: ModerationDto.fromReportedContents(list.reported_contents),
    pagination: PaginationDto.fromMeta(list.meta),
  }
}

const fromReportedContent = reportedContent => {
  return {
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
    cover: reportedContent.cover ? ModerationDto.fromCover(reportedContent.cover) : undefined,
  }
}

const fromReportedContents = reportedContents => {
  return reportedContents.map(reportedContent => ModerationDto.fromReportedContent(reportedContent))
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

const toDecision = formData => {
  return {
    resolution: formData.resolution,
    content: formData.resolution === RESOLUTIONS.PASSAGE_REMOVED ? formData.content : undefined,
    sanction: SanctionDto.toCreate(formData.sanction),
  }
}

const toListParams = (filters, page) => {
  return {
    status: filters.status,
    reason: filters.reason,
    page,
  }
}

export const ModerationDto = {
  fromChapterCase,
  fromComment,
  fromCommentCase,
  fromCover,
  fromCoverCase,
  fromList,
  fromReportedContent,
  fromReportedContents,
  toChapterParams,
  toCommentParams,
  toCoverParams,
  toDecision,
  toListParams,
}
