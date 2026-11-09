import { describe, it, expect, vi, afterEach } from 'vitest'
import { novelDetailAsyncData } from '@/ssr/async-data/novel-async-data.js'
import { createNovelStore } from '@/core-vue/stores/novels/novel-store.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

describe('novel-async-data', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('novelDetailAsyncData', () => {
    it('hands the novel it fetched to the store the page will render', async () => {
      const novelApi = novelSeeder.getNovelApi()
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(
        controllerSuccess({ data: novelApi }),
      )
      const stores = { novel: createNovelStore() }

      const result = await novelDetailAsyncData({
        stores,
        route: { params: { slug: novelApi.slug } },
      })

      expect(result).toEqual({ statusCode: STATUS.SUCCESS })
      expect(stores.novel.selectedNovel.value).toEqual(NovelDto.fromShow(novelApi))
    })

    it('answers with the status of the api when the novel is unknown', async () => {
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerError(STATUS.NOT_FOUND))

      const result = await novelDetailAsyncData({
        stores: { novel: createNovelStore() },
        route: { params: { slug: novelSeeder.getNovelApi().slug } },
      })

      expect(result).toEqual({ statusCode: STATUS.NOT_FOUND })
    })
  })
})
