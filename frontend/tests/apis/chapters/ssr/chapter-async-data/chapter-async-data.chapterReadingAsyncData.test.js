import { describe, it, expect, vi, afterEach } from 'vitest'
import { chapterReadingAsyncData } from '@/apis/chapters/ssr/chapter-async-data.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { createReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { createNovelStore } from '@/apis/novels/stores/novel-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'

describe('chapter-async-data', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('chapterReadingAsyncData', () => {
    it('carries the cookie of the reader so the server renders their own support', async () => {
      vi.spyOn(ChapterController, 'reading').mockResolvedValue(
        controllerSuccess(chapterSeeder.getReading()),
      )

      await chapterReadingAsyncData({
        stores: { reading: createReadingStore(), novel: createNovelStore() },
        route: { params: { slug: 'nuit-virage', id: 11 } },
        cookie: 'ghosty_session=1; ghosty_token=42|secret',
      })

      expect(ChapterController.reading).toHaveBeenCalledWith('nuit-virage', 11, {
        headers: { Cookie: 'ghosty_session=1; ghosty_token=42|secret' },
      })
    })

    it('asks for the chapter as a visitor when no cookie comes with the request', async () => {
      vi.spyOn(ChapterController, 'reading').mockResolvedValue(
        controllerSuccess(chapterSeeder.getReading()),
      )

      await chapterReadingAsyncData({
        stores: { reading: createReadingStore(), novel: createNovelStore() },
        route: { params: { slug: 'nuit-virage', id: 11 } },
        cookie: undefined,
      })

      expect(ChapterController.reading).toHaveBeenCalledWith('nuit-virage', 11, {})
    })

    it('hands the chapter it fetched to the stores the page will render', async () => {
      const reading = chapterSeeder.getReading()
      vi.spyOn(ChapterController, 'reading').mockResolvedValue(controllerSuccess(reading))
      const context = {
        stores: { reading: createReadingStore(), novel: createNovelStore() },
        route: { params: { slug: 'nuit-virage', id: 11 } },
        cookie: 'ghosty_token=42|secret',
      }

      await chapterReadingAsyncData(context)

      expect(context.stores.reading.chapter.value.id).toBe(reading.chapter.id)
    })
  })
})
