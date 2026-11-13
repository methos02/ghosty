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

  describe('unlike', () => {
    it('withdraws the like of the cover', async () => {
      const cover = coverSeeder.getCover()
      vi.spyOn(CoverRepository, 'unlike').mockResolvedValue(
        controllerSuccess({ data: coverSeeder.getUnlikeApi() }),
      )

      await CoverController.unlike(cover.id)

      expect(CoverRepository.unlike).toHaveBeenCalledWith({
        params: CoverDto.toCoverParams(cover.id),
      })
    })

    it('returns the withdrawn like as the api counted it', async () => {
      const unlikeApi = coverSeeder.getUnlikeApi()
      vi.spyOn(CoverRepository, 'unlike').mockResolvedValue(controllerSuccess({ data: unlikeApi }))

      const result = await CoverController.unlike(coverSeeder.getCover().id)

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        like: CoverDto.fromLike(unlikeApi),
      })
    })
  })
})
