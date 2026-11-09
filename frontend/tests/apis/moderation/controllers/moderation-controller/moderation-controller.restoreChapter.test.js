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

  describe('restoreChapter', () => {
    it('restores the chapter and reports the success', async () => {
      const chapterApi = moderationSeeder.getModeratedChapterApi()
      vi.spyOn(ModerationRepository, 'restoreChapter').mockResolvedValue(controllerSuccess())

      const response = await ModerationController.restoreChapter(chapterApi.id)

      expect(ModerationRepository.restoreChapter).toHaveBeenCalledWith({
        params: ModerationDto.toChapterParams(chapterApi.id),
      })
      expect(response).toEqual({ status: STATUS.SUCCESS })
    })

    it('passes the refusal through untouched', async () => {
      const refusal = controllerError(STATUS.FORBIDDEN)
      vi.spyOn(ModerationRepository, 'restoreChapter').mockResolvedValue(refusal)

      expect(
        await ModerationController.restoreChapter(moderationSeeder.getModeratedChapterApi().id),
      ).toBe(refusal)
    })
  })
})
