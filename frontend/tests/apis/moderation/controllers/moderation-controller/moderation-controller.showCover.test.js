import { describe, it, expect, vi, afterEach } from 'vitest'
import { ModerationController } from '@/apis/moderation/controllers/moderation-controller.js'
import { ModerationRepository } from '@/apis/moderation/repositories/moderation-repository.js'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('moderation-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('showCover', () => {
    it('asks for the case file of the cover', async () => {
      const moderationCaseApi = moderationSeeder.getCoverCaseApi()
      vi.spyOn(ModerationRepository, 'showCover').mockResolvedValue(
        controllerSuccess({ data: moderationCaseApi }),
      )

      await ModerationController.showCover(moderationCaseApi.cover.id)

      expect(ModerationRepository.showCover).toHaveBeenCalledWith({
        params: ModerationDto.toCoverParams(moderationCaseApi.cover.id),
      })
    })

    it('returns the cover with its reports and the sanctions of its author', async () => {
      const moderationCaseApi = moderationSeeder.getCoverCaseApi()
      vi.spyOn(ModerationRepository, 'showCover').mockResolvedValue(
        controllerSuccess({ data: moderationCaseApi }),
      )

      expect(await ModerationController.showCover(moderationCaseApi.cover.id)).toEqual({
        status: STATUS.SUCCESS,
        moderationCase: ModerationDto.fromCoverCase(moderationCaseApi),
      })
    })

    it('passes the refusal through untouched', async () => {
      const refusal = controllerError(STATUS.NOT_FOUND)
      vi.spyOn(ModerationRepository, 'showCover').mockResolvedValue(refusal)

      expect(await ModerationController.showCover(moderationSeeder.getModeratedCoverApi().id)).toBe(
        refusal,
      )
    })
  })
})
