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

  describe('showComment', () => {
    it('asks for the case file of the comment', async () => {
      const moderationCaseApi = moderationSeeder.getCommentCaseApi()
      vi.spyOn(ModerationRepository, 'showComment').mockResolvedValue(
        controllerSuccess({ data: moderationCaseApi }),
      )

      await ModerationController.showComment(moderationCaseApi.comment.id)

      expect(ModerationRepository.showComment).toHaveBeenCalledWith({
        params: ModerationDto.toCommentParams(moderationCaseApi.comment.id),
      })
    })

    it('returns the comment with its reports and the sanctions of its author', async () => {
      const moderationCaseApi = moderationSeeder.getCommentCaseApi()
      vi.spyOn(ModerationRepository, 'showComment').mockResolvedValue(
        controllerSuccess({ data: moderationCaseApi }),
      )

      expect(await ModerationController.showComment(moderationCaseApi.comment.id)).toEqual({
        status: STATUS.SUCCESS,
        moderationCase: ModerationDto.fromCommentCase(moderationCaseApi),
      })
    })

    it('passes the refusal through untouched', async () => {
      const refusal = controllerError(STATUS.NOT_FOUND)
      vi.spyOn(ModerationRepository, 'showComment').mockResolvedValue(refusal)

      expect(
        await ModerationController.showComment(moderationSeeder.getModeratedCommentApi().id),
      ).toBe(refusal)
    })
  })
})
