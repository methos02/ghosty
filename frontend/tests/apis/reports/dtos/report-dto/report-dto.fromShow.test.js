import { describe, it, expect } from 'vitest'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('report-dto', () => {
  describe('fromShow', () => {
    it('maps a pending report with its reporter', () => {
      const reportApi = moderationSeeder.getReportApi()

      expect(ReportDto.fromShow(reportApi)).toEqual({
        id: reportApi.id,
        reason: reportApi.reason,
        description: reportApi.description,
        isPending: true,
        reporter: {
          id: reportApi.reporter.id,
          username: reportApi.reporter.username,
        },
        resolution: undefined,
        createdAtFormat: dateHelper.formatDateLocal(reportApi.created_at, 'DD/MM/YYYY HH:mm'),
      })
    })

    it('keeps the resolution of a processed report', () => {
      const reportApi = moderationSeeder.getProcessedReportApi()

      const report = ReportDto.fromShow(reportApi)

      expect(report.isPending).toBe(false)
      expect(report.resolution).toBe(reportApi.resolution)
    })

    it('reads a report sent without details as an empty description', () => {
      expect(
        ReportDto.fromShow(moderationSeeder.getReportApi({ description: null })).description,
      ).toBe('')
    })
  })
})
