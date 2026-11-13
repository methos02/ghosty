import { describe, it, expect, vi, afterEach } from 'vitest'
import { CoverController } from '@/apis/covers/controllers/cover-controller.js'
import { CoverRepository } from '@/apis/covers/repositories/cover-repository.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('cover-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('uploads the image to the novel on the cover form', async () => {
      const novel = novelSeeder.getNovel()
      const formData = coverSeeder.getCreateForm()
      vi.spyOn(CoverRepository, 'create').mockResolvedValue({
        status: STATUS.CREATED,
        data: coverSeeder.getStoredCoverApi(),
      })

      await CoverController.create(novel.slug, formData)

      const [options] = CoverRepository.create.mock.calls[0]
      expect(options.params).toEqual(CoverDto.toNovelParams(novel.slug))
      expect(options.form).toBe('cover')
      expect(options.body.get('image')).toBe(formData.image)
    })

    it('returns the created cover and the official cover once the api answers 201', async () => {
      const storedCoverApi = coverSeeder.getStoredCoverApi()
      vi.spyOn(CoverRepository, 'create').mockResolvedValue({
        status: STATUS.CREATED,
        data: storedCoverApi,
      })

      const result = await CoverController.create(
        novelSeeder.getNovel().slug,
        coverSeeder.getCreateForm(),
      )

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        cover: CoverDto.fromCover(storedCoverApi.cover),
        officialCoverId: CoverDto.fromOfficialCoverId(storedCoverApi),
      })
    })

    it('passes the refusal of a second proposal through untouched', async () => {
      const refusal = {
        status: STATUS.CONFLICT,
        data: coverSeeder.getRefusalApi(),
      }
      vi.spyOn(CoverRepository, 'create').mockResolvedValue(refusal)

      const result = await CoverController.create(
        novelSeeder.getNovel().slug,
        coverSeeder.getCreateForm(),
      )

      expect(result).toBe(refusal)
    })
  })
})
