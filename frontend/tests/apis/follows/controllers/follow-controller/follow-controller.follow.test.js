import { describe, it, expect, vi, afterEach } from 'vitest'
import { FollowController } from '@/apis/follows/controllers/follow-controller.js'
import { FollowRepository } from '@/apis/follows/repositories/follow-repository.js'
import { FollowDto } from '@/apis/follows/dtos/follow-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { followSeeder } from '&/utils/seeders/follow-seeder.js'

describe('follow-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('follow', () => {
    it('follows the chapter heading the branch and returns the state the api recorded', async () => {
      const chapterId = followSeeder.getFollow().chapter.id
      vi.spyOn(FollowRepository, 'follow').mockResolvedValue(
        controllerSuccess({ data: followSeeder.getFollowStateApi() }),
      )

      const result = await FollowController.follow(chapterId)

      expect(FollowRepository.follow).toHaveBeenCalledWith({
        params: FollowDto.toChapterParams(chapterId),
      })
      expect(result).toEqual({ status: STATUS.SUCCESS, isFollowed: true })
    })

    it('passes the refusal through untouched', async () => {
      const chapterId = followSeeder.getFollow().chapter.id
      const refusal = controllerError(STATUS.FORBIDDEN)
      vi.spyOn(FollowRepository, 'follow').mockResolvedValue(refusal)

      expect(await FollowController.follow(chapterId)).toBe(refusal)
    })
  })
})
