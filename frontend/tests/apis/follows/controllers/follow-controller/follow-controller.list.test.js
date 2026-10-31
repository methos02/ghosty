import { describe, it, expect, vi, afterEach } from 'vitest'
import { FollowController } from '@/apis/follows/controllers/follow-controller.js'
import { FollowRepository } from '@/apis/follows/repositories/follow-repository.js'
import { FollowDto } from '@/apis/follows/dtos/follow-dto.js'
import { PaginationDto } from '@/apis/shared/dtos/pagination-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { followSeeder } from '&/utils/seeders/follow-seeder.js'

describe('follow-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('asks for the requested page of followed branches', async () => {
      vi.spyOn(FollowRepository, 'list').mockResolvedValue(
        controllerSuccess({ data: followSeeder.getListApi() }),
      )

      await FollowController.list(2)

      expect(FollowRepository.list).toHaveBeenCalledWith({ params: FollowDto.toListParams(2) })
    })

    it('returns the followed branches and their pagination', async () => {
      const listApi = followSeeder.getListApi()
      vi.spyOn(FollowRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))

      const result = await FollowController.list()

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        follows: FollowDto.fromList(listApi.follows),
        pagination: PaginationDto.fromMeta(listApi.meta),
      })
    })

    it('passes the failure through untouched', async () => {
      const failure = controllerError()
      vi.spyOn(FollowRepository, 'list').mockResolvedValue(failure)

      expect(await FollowController.list()).toBe(failure)
    })
  })
})
