import { describe, it, expect, vi, afterEach } from 'vitest'
import { ModerationController } from '@/apis/moderation/controllers/moderation-controller.js'
import { ModerationRepository } from '@/apis/moderation/repositories/moderation-repository.js'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { REPORT_STATUSES } from '@/constants/moderation-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('moderation-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('listReportedContents', () => {
    it('asks for the requested page of the filtered queue', async () => {
      const filters = {
        status: REPORT_STATUSES.PENDING,
        reason: 'insult',
      }
      vi.spyOn(ModerationRepository, 'listReportedContents').mockResolvedValue(
        controllerSuccess({ data: moderationSeeder.getListApi() }),
      )

      await ModerationController.listReportedContents(filters, 2)

      expect(ModerationRepository.listReportedContents).toHaveBeenCalledWith({
        params: ModerationDto.toListParams(filters, 2),
      })
    })

    it('returns the reported contents and the pagination', async () => {
      const listApi = moderationSeeder.getListApi()
      vi.spyOn(ModerationRepository, 'listReportedContents').mockResolvedValue(
        controllerSuccess({ data: listApi }),
      )

      expect(
        await ModerationController.listReportedContents({ status: REPORT_STATUSES.PENDING }),
      ).toEqual({
        status: STATUS.SUCCESS,
        reportedContents: ModerationDto.fromReportedContents(listApi.reported_contents),
        pagination: PaginationDto.fromMeta(listApi.meta),
      })
    })

    it('passes the refusal through untouched', async () => {
      const refusal = controllerError(STATUS.FORBIDDEN)
      vi.spyOn(ModerationRepository, 'listReportedContents').mockResolvedValue(refusal)

      expect(
        await ModerationController.listReportedContents({ status: REPORT_STATUSES.PENDING }),
      ).toBe(refusal)
    })
  })
})
