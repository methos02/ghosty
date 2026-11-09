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

  describe('moderateChapter', () => {
    it('sends the decision on the chapter', async () => {
      const chapterApi = moderationSeeder.getModeratedChapterApi()
      const formData = moderationSeeder.getDecisionForm({
        resolution: RESOLUTIONS.PASSAGE_REMOVED,
        content: moderationSeeder.getContentAfterRemoval(),
      })
      vi.spyOn(ModerationRepository, 'moderateChapter').mockResolvedValue(controllerSuccess())

      await ModerationController.moderateChapter(chapterApi.id, formData)

      expect(ModerationRepository.moderateChapter).toHaveBeenCalledWith({
        params: ModerationDto.toChapterParams(chapterApi.id),
        body: ModerationDto.toDecision(formData),
        form: 'moderation',
      })
    })

    it('reports the success of the decision', async () => {
      vi.spyOn(ModerationRepository, 'moderateChapter').mockResolvedValue(controllerSuccess())

      expect(
        await ModerationController.moderateChapter(
          moderationSeeder.getModeratedChapterApi().id,
          moderationSeeder.getDecisionForm(),
        ),
      ).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes a decision already taken by another moderator through untouched', async () => {
      const refusal = controllerError(STATUS.CONFLICT)
      vi.spyOn(ModerationRepository, 'moderateChapter').mockResolvedValue(refusal)

      expect(
        await ModerationController.moderateChapter(
          moderationSeeder.getModeratedChapterApi().id,
          moderationSeeder.getDecisionForm(),
        ),
      ).toBe(refusal)
    })
  })
})
