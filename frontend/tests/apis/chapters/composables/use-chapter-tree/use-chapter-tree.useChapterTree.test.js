import { describe, it, expect, vi, afterEach } from 'vitest'
import { useChapterTree } from '@/apis/chapters/composables/use-chapter-tree.js'
import { createTreeStore } from '@/apis/chapters/stores/tree-store.js'
import { ChapterRepository } from '@/apis/chapters/repositories/chapter-repository.js'
import { ChapterDto } from '@/apis/chapters/dtos/chapter-dto.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'

describe('use-chapter-tree', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('useChapterTree', () => {
    it('feeds the tree store it receives outside a component, as the server preload does', async () => {
      const treeApi = chapterSeeder.getTreeApi()
      vi.spyOn(ChapterRepository, 'tree').mockResolvedValue(controllerSuccess({ data: treeApi }))
      const treeStore = createTreeStore()
      const { chapterTree } = useChapterTree({ treeStore })

      await chapterTree.load('nuit-virage', 11, { headers: { Cookie: 'ghosty_token=42|secret' } })

      expect(ChapterRepository.tree).toHaveBeenCalledWith({
        params: ChapterDto.toTreeParams('nuit-virage', 11),
        headers: { Cookie: 'ghosty_token=42|secret' },
      })
      expect(treeStore.chapters.value).toEqual(ChapterDto.fromTree(treeApi).chapters)
    })
  })
})
