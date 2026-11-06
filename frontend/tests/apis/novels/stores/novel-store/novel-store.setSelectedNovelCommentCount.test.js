import { describe, it, expect } from 'vitest'
import { createNovelStore } from '@/apis/novels/stores/novel-store.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'

describe('novel-store', () => {
  describe('setSelectedNovelCommentCount', () => {
    it('updates the total of comments of the opened novel', () => {
      const store = createNovelStore()
      const novel = novelSeeder.getNovel()
      store.setSelectedNovel(novel)

      store.setSelectedNovelCommentCount(novel.commentCount + 1)

      expect(store.selectedNovel.value).toEqual({ ...novel, commentCount: novel.commentCount + 1 })
    })

    it('ignores the total when no novel is opened', () => {
      const store = createNovelStore()

      store.setSelectedNovelCommentCount(novelSeeder.getNovel().commentCount)

      expect(store.selectedNovel.value).toBeUndefined()
    })
  })
})
