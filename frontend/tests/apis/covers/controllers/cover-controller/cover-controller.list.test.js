import { describe, it, expect, vi, afterEach } from 'vitest'
import { CoverController } from '@/apis/covers/controllers/cover-controller.js'
import { CoverRepository } from '@/apis/covers/repositories/cover-repository.js'
import { CoverDto } from '@/apis/covers/dtos/cover-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('cover-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('asks the covers of the novel', async () => {
      const novel = novelSeeder.getNovel()
      vi.spyOn(CoverRepository, 'list').mockResolvedValue(
        controllerSuccess({ data: coverSeeder.getListApi() }),
      )

      await CoverController.list(novel.slug)

      expect(CoverRepository.list).toHaveBeenCalledWith({
        params: CoverDto.toNovelParams(novel.slug),
      })
    })

    it('returns the novel covers mapped by the dto', async () => {
      const listApi = coverSeeder.getListApi()
      vi.spyOn(CoverRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))

      const result = await CoverController.list(novelSeeder.getNovel().slug)

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        novelCovers: CoverDto.fromList(listApi),
      })
    })

    it('passes a failure through untouched', async () => {
      const failure = controllerError(STATUS.NOT_FOUND)
      vi.spyOn(CoverRepository, 'list').mockResolvedValue(failure)

      const result = await CoverController.list(novelSeeder.getNovel().slug)

      expect(result).toBe(failure)
    })
  })
})
