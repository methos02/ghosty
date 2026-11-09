import { describe, it, expect, vi, afterEach } from 'vitest'
import { useNovelDetail } from '@/core-vue/composables/novels/use-novel-detail.js'
import { createNovelStore } from '@/core-vue/stores/novels/novel-store.js'
import { NovelRepository } from '@/apis/novels/repositories/novel-repository.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'

describe('use-novel-detail', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('useNovelDetail', () => {
    it('selects the novel in the store it receives outside a component, as the server preload does', async () => {
      const novelApi = novelSeeder.getNovelApi()
      vi.spyOn(NovelRepository, 'getBySlug').mockResolvedValue(
        controllerSuccess({ data: novelApi }),
      )
      const novelStore = createNovelStore()
      const { novelDetail } = useNovelDetail({ novelStore })

      await novelDetail.selectBySlug(novelApi.slug)

      expect(novelStore.selectedNovel.value).toEqual(NovelDto.fromShow(novelApi))
    })

    it('does not fetch again the novel already selected', async () => {
      const novel = novelSeeder.getNovel()
      const getBySlug = vi.spyOn(NovelRepository, 'getBySlug')
      const novelStore = createNovelStore()
      novelStore.setSelectedNovel(novel)
      const { novelDetail } = useNovelDetail({ novelStore })

      await novelDetail.selectBySlug(novel.slug)

      expect(getBySlug).not.toHaveBeenCalled()
    })
  })
})
