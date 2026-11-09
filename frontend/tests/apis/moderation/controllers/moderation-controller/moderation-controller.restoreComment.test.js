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

  describe('restoreComment', () => {
    it('restores the comment and reports the success', async () => {
      const commentApi = moderationSeeder.getModeratedCommentApi()
      vi.spyOn(ModerationRepository, 'restoreComment').mockResolvedValue(controllerSuccess())

      const response = await ModerationController.restoreComment(commentApi.id)

      expect(ModerationRepository.restoreComment).toHaveBeenCalledWith({
        params: ModerationDto.toCommentParams(commentApi.id),
      })
      expect(response).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes the refusal through untouched', async () => {
      const refusal = controllerError(STATUS.FORBIDDEN)
      vi.spyOn(ModerationRepository, 'restoreComment').mockResolvedValue(refusal)

      expect(
        await ModerationController.restoreComment(moderationSeeder.getModeratedCommentApi().id),
      ).toBe(refusal)
    })
  })
})
