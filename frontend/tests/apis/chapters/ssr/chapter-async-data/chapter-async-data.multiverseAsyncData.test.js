import { describe, it, expect, vi, afterEach } from 'vitest'
import { multiverseAsyncData } from '@/apis/chapters/ssr/chapter-async-data.js'
import { createNovelStore } from '@/apis/novels/stores/novel-store.js'
import { createTreeStore } from '@/apis/chapters/stores/tree-store.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

describe('chapter-async-data', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('multiverseAsyncData', () => {
    it('loads the tree of the novel with the cookie of the reader', async () => {
      const novelApi = novelSeeder.getNovelApi()
      const treeApi = chapterSeeder.getTreeApi()
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(
        controllerSuccess({ data: novelApi }),
      )
      vi.spyOn(ChapterRepository, 'tree').mockResolvedValue(controllerSuccess({ data: treeApi }))
      const stores = { novel: createNovelStore(), tree: createTreeStore() }

      await multiverseAsyncData({
        stores,
        route: { params: { slug: novelApi.slug }, query: { from: 11 } },
        cookie: 'ghosty_token=42|secret',
      })

      expect(ChapterRepository.tree).toHaveBeenCalledWith({
        params: ChapterDto.toTreeParams(novelApi.slug, 11),
        headers: { Cookie: 'ghosty_token=42|secret' },
      })
      expect(stores.tree.chapters.value).toEqual(ChapterDto.fromTree(treeApi).chapters)
    })

    it('does not load the tree of an unknown novel', async () => {
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(controllerError(STATUS.NOT_FOUND))
      const tree = vi.spyOn(ChapterRepository, 'tree')

      const result = await multiverseAsyncData({
        stores: { novel: createNovelStore(), tree: createTreeStore() },
        route: { params: { slug: novelSeeder.getNovelApi().slug }, query: {} },
        cookie: undefined,
      })

      expect(result).toEqual({ statusCode: STATUS.NOT_FOUND })
      expect(tree).not.toHaveBeenCalled()
    })
  })
})
