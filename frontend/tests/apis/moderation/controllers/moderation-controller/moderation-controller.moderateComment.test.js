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

  describe('moderateComment', () => {
    it('sends the decision on the comment', async () => {
      const commentApi = moderationSeeder.getModeratedCommentApi()
      const formData = moderationSeeder.getDecisionForm({ resolution: RESOLUTIONS.HIDDEN })
      vi.spyOn(ModerationRepository, 'moderateComment').mockResolvedValue(controllerSuccess())

      await ModerationController.moderateComment(commentApi.id, formData)

      expect(ModerationRepository.moderateComment).toHaveBeenCalledWith({
        params: ModerationDto.toCommentParams(commentApi.id),
        body: ModerationDto.toDecision(formData),
        form: 'moderation',
      })
    })

    it('reports the success of the decision', async () => {
      vi.spyOn(ModerationRepository, 'moderateComment').mockResolvedValue(controllerSuccess())

      expect(
        await ModerationController.moderateComment(
          moderationSeeder.getModeratedCommentApi().id,
          moderationSeeder.getDecisionForm(),
        ),
      ).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes a decision already taken by another moderator through untouched', async () => {
      const refusal = controllerError(STATUS.CONFLICT)
      vi.spyOn(ModerationRepository, 'moderateComment').mockResolvedValue(refusal)

      expect(
        await ModerationController.moderateComment(
          moderationSeeder.getModeratedCommentApi().id,
          moderationSeeder.getDecisionForm(),
        ),
      ).toBe(refusal)
    })
  })
})
