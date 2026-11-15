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

  describe('showUser', () => {
    it('asks for the case file of the account', async () => {
      const moderationCaseApi = moderationSeeder.getUserCaseApi()
      vi.spyOn(ModerationRepository, 'showUser').mockResolvedValue(
        controllerSuccess({ data: moderationCaseApi }),
      )

      await ModerationController.showUser(moderationCaseApi.user.id)

      expect(ModerationRepository.showUser).toHaveBeenCalledWith({
        params: ModerationDto.toUserParams(moderationCaseApi.user.id),
      })
    })

    it('returns the profile with its reports and its sanctions', async () => {
      const moderationCaseApi = moderationSeeder.getUserCaseApi()
      vi.spyOn(ModerationRepository, 'showUser').mockResolvedValue(
        controllerSuccess({ data: moderationCaseApi }),
      )

      expect(await ModerationController.showUser(moderationCaseApi.user.id)).toEqual({
        status: STATUS.SUCCESS,
        moderationCase: ModerationDto.fromUserCase(moderationCaseApi),
      })
    })

    it('passes the refusal through untouched', async () => {
      const refusal = controllerError(STATUS.NOT_FOUND)
      vi.spyOn(ModerationRepository, 'showUser').mockResolvedValue(refusal)

      expect(await ModerationController.showUser(moderationSeeder.getUserCaseApi().user.id)).toBe(
        refusal,
      )
    })
  })
})
