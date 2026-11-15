import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'

const fromChapterList = list => {
  return {
    chapters: ChapterDto.fromProfileChapters(list.chapters),
    pagination: PaginationDto.fromMeta(list.meta),
  }
}

const fromCoverList = list => {
  return {
    covers: CoverDto.fromProfileCovers(list.covers),
    pagination: PaginationDto.fromMeta(list.meta),
  }
}

const fromNovelList = list => {
  return {
    novels: NovelDto.fromList(list.novels),
    pagination: PaginationDto.fromMeta(list.meta),
  }
}

const fromProfile = user => {
  return {
    ...UserDto.fromSummary(user),
    isReported: user.is_reported === true,
    statistics: UserDto.fromStatistics(user.statistics),
  }
}

const fromStatistics = statistics => {
  return {
    readCount: statistics.read_count,
    likeCount: statistics.like_count,
    receivedContinuationCount: statistics.received_continuation_count,
    novelCount: statistics.novel_count,
    chapterCount: statistics.chapter_count,
    coverCount: statistics.cover_count,
    officialCoverCount: statistics.official_cover_count,
  }
}

const fromSummary = user => {
  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar ?? undefined,
    roles: user.roles,
    createdAtFormat: dateHelper.formatDateLocal(user.created_at, 'DD/MM/YYYY'),
  }
}

const toListParams = (username, page) => {
  return {
    username,
    page,
  }
}

const toProfileParams = username => {
  return { username }
}

export const UserDto = {
  fromChapterList,
  fromCoverList,
  fromNovelList,
  fromProfile,
  fromStatistics,
  fromSummary,
  toListParams,
  toProfileParams,
}
