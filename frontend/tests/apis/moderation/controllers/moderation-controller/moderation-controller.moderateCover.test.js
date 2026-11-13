import { describe, it, expect, vi, afterEach } from 'vitest'
import { ModerationController } from '@/apis/moderation/controllers/moderation-controller.js'
import { ModerationRepository } from '@/apis/moderation/repositories/moderation-repository.js'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { RESOLUTIONS } from '@/constants/moderation-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('moderation-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('moderateCover', () => {
    it('sends the decision on the cover', async () => {
      const coverApi = moderationSeeder.getModeratedCoverApi()
      const formData = moderationSeeder.getDecisionForm({ resolution: RESOLUTIONS.HIDDEN })
      vi.spyOn(ModerationRepository, 'moderateCover').mockResolvedValue(controllerSuccess())

      await ModerationController.moderateCover(coverApi.id, formData)

      expect(ModerationRepository.moderateCover).toHaveBeenCalledWith({
        params: ModerationDto.toCoverParams(coverApi.id),
        body: ModerationDto.toDecision(formData),
        form: 'moderation',
      })
    })

    it('reports the success of the decision', async () => {
      vi.spyOn(ModerationRepository, 'moderateCover').mockResolvedValue(controllerSuccess())

      expect(
        await ModerationController.moderateCover(
          moderationSeeder.getModeratedCoverApi().id,
          moderationSeeder.getDecisionForm(),
        ),
      ).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes a decision already taken by another moderator through untouched', async () => {
      const refusal = controllerError(STATUS.CONFLICT)
      vi.spyOn(ModerationRepository, 'moderateCover').mockResolvedValue(refusal)

      expect(
        await ModerationController.moderateCover(
          moderationSeeder.getModeratedCoverApi().id,
          moderationSeeder.getDecisionForm(),
        ),
      ).toBe(refusal)
    })
  })
})
