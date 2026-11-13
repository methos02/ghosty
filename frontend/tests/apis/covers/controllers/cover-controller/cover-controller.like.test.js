import { describe, it, expect, vi, afterEach } from 'vitest'
import { CoverController } from '@/apis/covers/controllers/cover-controller.js'
import { CoverRepository } from '@/apis/covers/repositories/cover-repository.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('like', () => {
    it('likes the cover', async () => {
      const cover = coverSeeder.getCover()
      vi.spyOn(CoverRepository, 'like').mockResolvedValue(
        controllerSuccess({ data: coverSeeder.getLikeApi() }),
      )

      await CoverController.like(cover.id)

      expect(CoverRepository.like).toHaveBeenCalledWith({
        params: CoverDto.toCoverParams(cover.id),
      })
    })

    it('returns the like as the api counted it', async () => {
      const likeApi = coverSeeder.getLikeApi()
      vi.spyOn(CoverRepository, 'like').mockResolvedValue(controllerSuccess({ data: likeApi }))

      const result = await CoverController.like(coverSeeder.getCover().id)

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        like: CoverDto.fromLike(likeApi),
      })
    })
  })
})
