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

  describe('showChapter', () => {
    it('asks for the case file of the chapter', async () => {
      const moderationCaseApi = moderationSeeder.getChapterCaseApi()
      vi.spyOn(ModerationRepository, 'showChapter').mockResolvedValue(
        controllerSuccess({ data: moderationCaseApi }),
      )

      await ModerationController.showChapter(moderationCaseApi.chapter.id)

      expect(ModerationRepository.showChapter).toHaveBeenCalledWith({
        params: ModerationDto.toChapterParams(moderationCaseApi.chapter.id),
      })
    })

    it('returns the chapter with its reports and the sanctions of its author', async () => {
      const moderationCaseApi = moderationSeeder.getChapterCaseApi()
      vi.spyOn(ModerationRepository, 'showChapter').mockResolvedValue(
        controllerSuccess({ data: moderationCaseApi }),
      )

      expect(await ModerationController.showChapter(moderationCaseApi.chapter.id)).toEqual({
        status: STATUS.SUCCESS,
        moderationCase: ModerationDto.fromChapterCase(moderationCaseApi),
      })
    })

    it('passes the refusal through untouched', async () => {
      const refusal = controllerError(STATUS.NOT_FOUND)
      vi.spyOn(ModerationRepository, 'showChapter').mockResolvedValue(refusal)

      expect(
        await ModerationController.showChapter(moderationSeeder.getModeratedChapterApi().id),
      ).toBe(refusal)
    })
  })
})
