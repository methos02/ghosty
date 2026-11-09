import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ReportController } from '@/apis/reports/controllers/report-controller.js'
import { ReportRepository } from '@/apis/reports/repositories/report-repository.js'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { reportSeeder } from '&/utils/seeders/report-seeder.js'

describe('report-controller', () => {
  beforeEach(() => {
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('reportChapter', () => {
    it('sends the motive and the details to the reported chapter', async () => {
      const datas = reportSeeder.getReportData()
      vi.spyOn(ReportRepository, 'reportChapter').mockResolvedValue({ status: STATUS.CREATED })

      await ReportController.reportChapter(11, datas)

      expect(ReportRepository.reportChapter).toHaveBeenCalledWith({
        params: ReportDto.toChapterParams(11),
        body: ReportDto.toCreate(datas),
        form: 'report',
      })
    })

    it('reports the report as sent once the api accepted it', async () => {
      vi.spyOn(ReportRepository, 'reportChapter').mockResolvedValue({ status: STATUS.CREATED })

      const result = await ReportController.reportChapter(11, reportSeeder.getReportData())

      expect(result).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes the refusal of an already reported chapter through untouched', async () => {
      const refusal = { status: STATUS.CONFLICT, data: { message: 'Vous avez déjà signalé' } }
      vi.spyOn(ReportRepository, 'reportChapter').mockResolvedValue(refusal)

      expect(await ReportController.reportChapter(11, reportSeeder.getReportData())).toBe(refusal)
    })
  })
})
