import { describe, it, expect } from 'vitest'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
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
  })
})
