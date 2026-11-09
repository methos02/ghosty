import { describe, it, expect, vi, afterEach } from 'vitest'
import { ReportController } from '@/apis/reports/controllers/report-controller.js'
import { ReportRepository } from '@/apis/reports/repositories/report-repository.js'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'
import { reportSeeder } from '&/utils/seeders/report-seeder.js'

describe('report-controller', () => {
  afterEach(() => {
    form.clearErrors()
    vi.clearAllMocks()
  })

  describe('reportComment', () => {
    it('sends the motive and the details to the reported comment', async () => {
      const comment = commentSeeder.getComment()
      const datas = reportSeeder.getReportData()
      vi.spyOn(ReportRepository, 'reportComment').mockResolvedValue({ status: STATUS.CREATED })

      await ReportController.reportComment(comment.id, datas)

      expect(ReportRepository.reportComment).toHaveBeenCalledWith({
        params: ReportDto.toCommentParams(comment.id),
        body: ReportDto.toCreate(datas),
        form: 'report',
      })
    })

    it('reports the report as sent once the api accepted it', async () => {
      vi.spyOn(ReportRepository, 'reportComment').mockResolvedValue({ status: STATUS.CREATED })

      const result = await ReportController.reportComment(
        commentSeeder.getComment().id,
        reportSeeder.getReportData(),
      )

      expect(result).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes the refusal of an own comment through untouched', async () => {
      const refusal = {
        status: STATUS.FORBIDDEN,
        data: reportSeeder.getRefusalApi(),
      }
      vi.spyOn(ReportRepository, 'reportComment').mockResolvedValue(refusal)

      const result = await ReportController.reportComment(
        commentSeeder.getComment().id,
        reportSeeder.getReportData(),
      )

      expect(result).toBe(refusal)
    })
  })
})
