import { describe, it, expect, vi, afterEach } from 'vitest'
import { ReadingProgressController } from '@/apis/reading-progress/controllers/reading-progress-controller.js'
import { ReadingProgressRepository } from '@/apis/reading-progress/repositories/reading-progress-repository.js'
import { ReadingProgressDto } from '@/apis/reading-progress/dtos/reading-progress-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { readingProgressSeeder } from '&/utils/seeders/reading-progress-seeder.js'

describe('reading-progress-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('returns the chapter to resume in each novel', async () => {
      const listApi = readingProgressSeeder.getListApi()
      vi.spyOn(ReadingProgressRepository, 'list').mockResolvedValue(
        controllerSuccess({ data: listApi }),
      )

      const result = await ReadingProgressController.list()

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        progresses: ReadingProgressDto.fromList(listApi.progresses),
      })
    })

    it('passes the failure through untouched', async () => {
      const failure = controllerError()
      vi.spyOn(ReadingProgressRepository, 'list').mockResolvedValue(failure)

      expect(await ReadingProgressController.list()).toBe(failure)
    })
  })
})
