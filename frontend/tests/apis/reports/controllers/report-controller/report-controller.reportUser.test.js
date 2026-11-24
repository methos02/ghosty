import { describe, it, expect, vi, afterEach } from 'vitest'
import { ReportController } from '@/apis/reports/controllers/report-controller.js'
import { ReportRepository } from '@/apis/reports/repositories/report-repository.js'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { controllerError } from '&/utils/helpers/controller-response.js'
import { reportSeeder } from '&/utils/seeders/report-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('report-controller', () => {
  afterEach(() => {
    form.clearErrors()
    vi.clearAllMocks()
  })

  describe('reportUser', () => {
    it('sends the motive and the details to the reported account', async () => {
      const profile = userSeeder.getProfile()
      const datas = reportSeeder.getReportData()
      vi.spyOn(ReportRepository, 'reportUser').mockResolvedValue({ status: STATUS.CREATED })

      await ReportController.reportUser(profile, datas)

      expect(ReportRepository.reportUser).toHaveBeenCalledWith({
        params: ReportDto.toUserParams(profile),
        body: ReportDto.toCreate(datas),
        form: 'report',
      })
    })

    it('reports the report as sent once the api accepted it', async () => {
      vi.spyOn(ReportRepository, 'reportUser').mockResolvedValue({ status: STATUS.CREATED })

      const result = await ReportController.reportUser(
        userSeeder.getProfile(),
        reportSeeder.getReportData(),
      )

      expect(result).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes a second report on the same account through untouched', async () => {
      const conflict = controllerError(STATUS.CONFLICT)
      vi.spyOn(ReportRepository, 'reportUser').mockResolvedValue(conflict)

      const result = await ReportController.reportUser(
        userSeeder.getProfile(),
        reportSeeder.getReportData(),
      )

      expect(result).toBe(conflict)
    })
  })
})
