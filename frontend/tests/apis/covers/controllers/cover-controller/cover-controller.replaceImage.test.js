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

  describe('replaceImage', () => {
    it('uploads the new image to the cover on the cover form', async () => {
      const cover = coverSeeder.getCover()
      const formData = coverSeeder.getCreateForm()
      vi.spyOn(CoverRepository, 'replaceImage').mockResolvedValue(
        controllerSuccess({ data: coverSeeder.getStoredCoverApi() }),
      )

      await CoverController.replaceImage(cover.id, formData)

      const [options] = CoverRepository.replaceImage.mock.calls[0]
      expect(options.params).toEqual(CoverDto.toCoverParams(cover.id))
      expect(options.form).toBe('cover')
      expect(options.body.get('image')).toBe(formData.image)
    })

    it('returns the cover as the api stored it, without its likes, and the official cover', async () => {
      const storedCoverApi = coverSeeder.getStoredCoverApi({
        cover: coverSeeder.getCoverApi({ like_count: 0 }),
      })
      vi.spyOn(CoverRepository, 'replaceImage').mockResolvedValue(
        controllerSuccess({ data: storedCoverApi }),
      )

      const result = await CoverController.replaceImage(
        storedCoverApi.cover.id,
        coverSeeder.getCreateForm(),
      )

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        cover: CoverDto.fromCover(storedCoverApi.cover),
        officialCoverId: CoverDto.fromOfficialCoverId(storedCoverApi),
      })
    })
  })
})
