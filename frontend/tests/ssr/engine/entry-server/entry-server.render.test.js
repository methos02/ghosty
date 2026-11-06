import { describe, it, expect, vi, afterEach } from 'vitest'
import { render } from '@/ssr/engine/entry-server.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

describe('entry-server', () => {
  describe('render', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('sends the browser the state of the stores preloaded for the page', async () => {
      const novelApi = novelSeeder.getNovelApi()
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(
        controllerSuccess({ data: novelApi }),
      )

      const rendered = await render(`/novels/${novelApi.slug}`)

      expect(rendered.state.novel.selectedNovel).toEqual(NovelDto.fromShow(novelApi))
    })

    it('answers with the status code of the prepared page', async () => {
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerError(STATUS.NOT_FOUND))

      const rendered = await render(`/novels/${novelSeeder.getNovelApi().slug}`)

      expect(rendered.statusCode).toBe(STATUS.NOT_FOUND)
    })

    it('does not leak the novel of a previous visitor into the next render', async () => {
      const novelApi = novelSeeder.getNovelApi()
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(
        controllerSuccess({ data: novelApi }),
      )
      await render(`/novels/${novelApi.slug}`)

      const rendered = await render('/')

      expect(rendered.state.novel.selectedNovel).toBeUndefined()
    })
  })
})
