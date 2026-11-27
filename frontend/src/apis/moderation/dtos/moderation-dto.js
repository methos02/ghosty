import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { CommentDto } from '@/apis/comments/dtos/comment-dto.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { SanctionDto } from '@/apis/sanctions/dtos/sanction-dto.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'
import { DATETIME_FORMAT } from '@/constants/utils-constants.js'
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

const fromReportedContent = content => {
  return {
    type: content.type,
    id: content.id,
    reportCount: content.report_count,
    reasons: content.reasons,
    firstReportedAtFormat: dateHelper.formatDateLocal(content.first_reported_at, DATETIME_FORMAT),
    chapter: content.chapter ? ChapterDto.fromShow(content.chapter) : undefined,
    comment: content.comment ? ModerationDto.fromComment(content.comment) : undefined,
    cover: content.cover ? ModerationDto.fromCover(content.cover) : undefined,
    user: content.user ? UserDto.fromSummary(content.user) : undefined,
  }
}

const fromReportedContents = reportedContents => {
  return reportedContents.map(reportedContent => ModerationDto.fromReportedContent(reportedContent))
}

const fromUserCase = moderationCase => {
  return {
    user: UserDto.fromProfile(moderationCase.user),
    reports: ReportDto.fromList(moderationCase.reports),
    authorSanctions: SanctionDto.fromList(moderationCase.author_sanctions),
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

const toUserParams = userId => {
  return { user: userId }
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
  fromUserCase,
  toChapterParams,
  toCommentParams,
  toCoverParams,
  toDecision,
  toListParams,
  toUserParams,
}
