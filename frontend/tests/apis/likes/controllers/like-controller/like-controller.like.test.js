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

  describe('like', () => {
    it('addresses the support to the chapter being read', async () => {
      vi.spyOn(LikeRepository, 'like').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: likeSeeder.getLikeApi(),
      })

      await LikeController.like(11)

      expect(LikeRepository.like).toHaveBeenCalledWith({ params: LikeDto.toChapterParams(11) })
    })

    it('returns the support state the api recorded, not the one the reader clicked', async () => {
      vi.spyOn(LikeRepository, 'like').mockResolvedValue({
        status: STATUS.SUCCESS,
        data: likeSeeder.getLikeApi({ like_count: 43 }),
      })

      const result = await LikeController.like(11)

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        like: likeSeeder.getLike({ likeCount: 43 }),
      })
    })

    it('passes the guard refusal through untouched', async () => {
      const refusal = { status: STATUS.FORBIDDEN, data: { message: 'Compte trop récent' } }
      vi.spyOn(LikeRepository, 'like').mockResolvedValue(refusal)

      expect(await LikeController.like(11)).toBe(refusal)
    })
  })
})
