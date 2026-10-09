import { describe, it, expect, vi, afterEach } from 'vitest'
import { LikeController } from '@/apis/likes/controllers/like-controller.js'
import { LikeRepository } from '@/apis/likes/repositories/like-repository.js'
import { LikeDto } from '@/apis/likes/dtos/like-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { likeSeeder } from '&/utils/seeders/like-seeder.js'

describe('like-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('unlike', () => {
    it('addresses the withdrawal to the chapter being read', async () => {
      vi.spyOn(LikeRepository, 'unlike').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: likeSeeder.getLikeApi({ is_liked: false, like_count: 41 }),
      })

      await LikeController.unlike(11)

      expect(LikeRepository.unlike).toHaveBeenCalledWith({ params: LikeDto.toChapterParams(11) })
    })

    it('returns the count left once the support is withdrawn', async () => {
      vi.spyOn(LikeRepository, 'unlike').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: likeSeeder.getLikeApi({ is_liked: false, like_count: 41 }),
      })

      const result = await LikeController.unlike(11)

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        like: likeSeeder.getLike({ isLiked: false, likeCount: 41 }),
      })
    })
  })
})
