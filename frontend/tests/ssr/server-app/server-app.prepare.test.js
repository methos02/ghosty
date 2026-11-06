import { describe, it, expect, vi, afterEach } from 'vitest'
import { serverApp } from '@/ssr/server-app.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

describe('server-app', () => {
  describe('prepare', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('preloads the novel of the page into the stores', async () => {
      const novelApi = novelSeeder.getNovelApi()
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(
        controllerSuccess({ data: novelApi }),
      )

      const prepared = await serverApp.prepare(`/novels/${novelApi.slug}`)

      expect(prepared.statusCode).toBe(STATUS.SUCCESS)
      expect(prepared.stores.novel.selectedNovel.value).toEqual(NovelDto.fromShow(novelApi))
    })

    it('answers 404 for an unknown novel', async () => {
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerError(STATUS.NOT_FOUND))

      const prepared = await serverApp.prepare(`/novels/${novelSeeder.getNovelApi().slug}`)

      expect(prepared.statusCode).toBe(STATUS.NOT_FOUND)
    })

    it('answers 404 for an unknown address', async () => {
      const prepared = await serverApp.prepare('/unknown-address')

      expect(prepared.statusCode).toBe(STATUS.NOT_FOUND)
    })

    it('keeps the page up with a 200 when the api fails while preloading', async () => {
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerError(STATUS.ERROR_SERVER))

      const prepared = await serverApp.prepare(`/novels/${novelSeeder.getNovelApi().slug}`)

      expect(prepared.statusCode).toBe(STATUS.SUCCESS)
    })
  })
})
