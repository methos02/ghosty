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

  describe('unfollow', () => {
    it('withdraws the follow of the chapter heading the branch', async () => {
      const chapterId = followSeeder.getFollow().chapter.id
      vi.spyOn(FollowRepository, 'unfollow').mockResolvedValue(
        controllerSuccess({ data: followSeeder.getFollowStateApi({ is_followed: false }) }),
      )

      const result = await FollowController.unfollow(chapterId)

      expect(FollowRepository.unfollow).toHaveBeenCalledWith({
        params: FollowDto.toChapterParams(chapterId),
      })
      expect(result).toEqual({ status: STATUS.SUCCESS, isFollowed: false })
    })

    it('passes the failure through untouched', async () => {
      const chapterId = followSeeder.getFollow().chapter.id
      const failure = controllerError()
      vi.spyOn(FollowRepository, 'unfollow').mockResolvedValue(failure)

      expect(await FollowController.unfollow(chapterId)).toBe(failure)
    })
  })
})
