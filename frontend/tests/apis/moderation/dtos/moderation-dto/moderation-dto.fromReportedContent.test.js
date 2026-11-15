import { describe, it, expect } from 'vitest'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { UserDto } from '@/apis/users/dtos/user-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('moderation-dto', () => {
  describe('fromReportedContent', () => {
    it('maps a reported chapter with the count and reasons of its reports', () => {
      const reportedApi = moderationSeeder.getReportedChapterApi()

      expect(ModerationDto.fromReportedContent(reportedApi)).toEqual({
        type: reportedApi.type,
        id: reportedApi.id,
        reportCount: reportedApi.report_count,
        reasons: reportedApi.reasons,
        firstReportedAtFormat: dateHelper.formatDateLocal(
          reportedApi.first_reported_at,
          'DD/MM/YYYY HH:mm',
        ),
        chapter: ChapterDto.fromShow(reportedApi.chapter),
        comment: undefined,
      })
    })

    it('maps a reported comment without a chapter', () => {
      const reportedApi = moderationSeeder.getReportedCommentApi()

      const reportedContent = ModerationDto.fromReportedContent(reportedApi)

      expect(reportedContent.chapter).toBeUndefined()
      expect(reportedContent.comment).toEqual(ModerationDto.fromComment(reportedApi.comment))
    })

    it('maps a reported cover without a chapter nor a comment', () => {
      const reportedApi = moderationSeeder.getReportedCoverApi()

      const reportedContent = ModerationDto.fromReportedContent(reportedApi)

      expect(reportedContent.chapter).toBeUndefined()
      expect(reportedContent.comment).toBeUndefined()
      expect(reportedContent.cover).toEqual(ModerationDto.fromCover(reportedApi.cover))
    })

    it('maps a reported account with its summary and without any content', () => {
      const reportedApi = moderationSeeder.getReportedUserApi()

      const reportedContent = ModerationDto.fromReportedContent(reportedApi)

      expect(reportedContent.chapter).toBeUndefined()
      expect(reportedContent.cover).toBeUndefined()
      expect(reportedContent.user).toEqual(UserDto.fromSummary(reportedApi.user))
    })
  })
})
