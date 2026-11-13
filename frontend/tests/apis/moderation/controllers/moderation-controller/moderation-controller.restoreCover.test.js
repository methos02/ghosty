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

  describe('restoreCover', () => {
    it('restores the cover and reports the success', async () => {
      const coverApi = moderationSeeder.getModeratedCoverApi()
      vi.spyOn(ModerationRepository, 'restoreCover').mockResolvedValue(controllerSuccess())

      const response = await ModerationController.restoreCover(coverApi.id)

      expect(ModerationRepository.restoreCover).toHaveBeenCalledWith({
        params: ModerationDto.toCoverParams(coverApi.id),
      })
      expect(response).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes the refusal through untouched', async () => {
      const refusal = controllerError(STATUS.FORBIDDEN)
      vi.spyOn(ModerationRepository, 'restoreCover').mockResolvedValue(refusal)

      expect(
        await ModerationController.restoreCover(moderationSeeder.getModeratedCoverApi().id),
      ).toBe(refusal)
    })
  })
})
