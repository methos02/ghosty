import { describe, it, expect, vi, afterEach } from 'vitest'
import { ReportController } from '@/apis/reports/controllers/report-controller.js'
import { ReportRepository } from '@/apis/reports/repositories/report-repository.js'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'
import { reportSeeder } from '&/utils/seeders/report-seeder.js'

describe('report-controller', () => {
  afterEach(() => {
    form.clearErrors()
    vi.clearAllMocks()
  })

  describe('reportCover', () => {
    it('sends the motive and the details to the reported cover', async () => {
      const cover = coverSeeder.getCover()
      const datas = reportSeeder.getReportData()
      vi.spyOn(ReportRepository, 'reportCover').mockResolvedValue({ status: STATUS.CREATED })

      await ReportController.reportCover(cover.id, datas)

      expect(ReportRepository.reportCover).toHaveBeenCalledWith({
        params: ReportDto.toCoverParams(cover.id),
        body: ReportDto.toCreate(datas),
        form: 'report',
      })
    })

    it('reports the report as sent once the api accepted it', async () => {
      vi.spyOn(ReportRepository, 'reportCover').mockResolvedValue({ status: STATUS.CREATED })

      const result = await ReportController.reportCover(
        coverSeeder.getCover().id,
        reportSeeder.getReportData(),
      )

      expect(result).toEqual({ status: STATUS.SUCCESS })
    })
  })
})
