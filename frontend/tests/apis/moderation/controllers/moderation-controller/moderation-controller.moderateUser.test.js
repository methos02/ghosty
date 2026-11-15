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

  describe('moderateUser', () => {
    it('sends the decision on the account', async () => {
      const userId = moderationSeeder.getUserCaseApi().user.id
      const formData = moderationSeeder.getDecisionForm({ resolution: RESOLUTIONS.SANCTIONED })
      vi.spyOn(ModerationRepository, 'moderateUser').mockResolvedValue(controllerSuccess())

      await ModerationController.moderateUser(userId, formData)

      expect(ModerationRepository.moderateUser).toHaveBeenCalledWith({
        params: ModerationDto.toUserParams(userId),
        body: ModerationDto.toDecision(formData),
        form: 'moderation',
      })
    })

    it('reports the success of the decision', async () => {
      vi.spyOn(ModerationRepository, 'moderateUser').mockResolvedValue(controllerSuccess())

      expect(
        await ModerationController.moderateUser(
          moderationSeeder.getUserCaseApi().user.id,
          moderationSeeder.getDecisionForm(),
        ),
      ).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes a decision already taken by another moderator through untouched', async () => {
      const refusal = controllerError(STATUS.CONFLICT)
      vi.spyOn(ModerationRepository, 'moderateUser').mockResolvedValue(refusal)

      expect(
        await ModerationController.moderateUser(
          moderationSeeder.getUserCaseApi().user.id,
          moderationSeeder.getDecisionForm(),
        ),
      ).toBe(refusal)
    })
  })
})
